// Server-side enrichment utilities
// Extract device info, location, and detect bots

import { headers } from 'next/headers';

export interface EnrichmentData {
  ipAddress: string | null;
  userAgent: string | null;
  country: string | null;
  city: string | null;
  deviceType: 'mobile' | 'tablet' | 'desktop' | 'bot' | 'unknown';
  browser: string | null;
  os: string | null;
  isBot: boolean;
  botScore: number;
}

// Bot detection patterns
const BOT_PATTERNS = [
  /bot/i,
  /crawler/i,
  /spider/i,
  /headless/i,
  /phantom/i,
  /slurp/i,
  /googlebot/i,
  /bingbot/i,
  /yandex/i,
  /baiduspider/i,
  /facebookexternalhit/i,
  /twitterbot/i,
  /rogerbot/i,
  /linkedinbot/i,
  /embedly/i,
  /quora/i,
  /showyoubot/i,
  /outbrain/i,
  /pinterest/i,
  /slackbot/i,
  /vkshare/i,
  /w3c_validator/i,
  /redditbot/i,
  /applebot/i,
  /whatsapp/i,
  /flipboard/i,
  /tumblr/i,
  /bitlybot/i,
  /skypeuripreview/i,
  /nuzzel/i,
  /discordbot/i,
  /qwantify/i,
  /pinterestbot/i,
  /bitrix/i,
];

// Parse user agent for device type
export function parseDeviceType(userAgent: string): EnrichmentData['deviceType'] {
  if (!userAgent) return 'unknown';

  const ua = userAgent.toLowerCase();

  // Check for bots first
  if (BOT_PATTERNS.some(pattern => pattern.test(ua))) {
    return 'bot';
  }

  // Mobile devices
  if (/mobile|android|iphone|ipod|blackberry|windows phone/i.test(ua)) {
    return 'mobile';
  }

  // Tablets
  if (/tablet|ipad|playbook|silk/i.test(ua)) {
    return 'tablet';
  }

  // Desktop
  if (/windows|macintosh|linux|x11/i.test(ua)) {
    return 'desktop';
  }

  return 'unknown';
}

// Parse browser from user agent
export function parseBrowser(userAgent: string): string | null {
  if (!userAgent) return null;

  const ua = userAgent.toLowerCase();

  if (ua.includes('edg/')) return 'Edge';
  if (ua.includes('chrome/')) return 'Chrome';
  if (ua.includes('firefox/')) return 'Firefox';
  if (ua.includes('safari/') && !ua.includes('chrome/')) return 'Safari';
  if (ua.includes('opera/') || ua.includes('opr/')) return 'Opera';
  if (ua.includes('brave/')) return 'Brave';

  return 'Unknown';
}

// Parse OS from user agent
export function parseOS(userAgent: string): string | null {
  if (!userAgent) return null;

  const ua = userAgent.toLowerCase();

  if (ua.includes('windows')) return 'Windows';
  if (ua.includes('mac os x') || ua.includes('macos')) return 'macOS';
  if (ua.includes('linux')) return 'Linux';
  if (ua.includes('android')) return 'Android';
  if (ua.includes('iphone') || ua.includes('ipad')) return 'iOS';

  return 'Unknown';
}

// Calculate bot score (0 = definitely human, 1 = definitely bot)
export function calculateBotScore(userAgent: string, ipAddress: string | null): number {
  let score = 0;

  // Check user agent patterns
  if (BOT_PATTERNS.some(pattern => pattern.test(userAgent))) {
    score += 0.8;
  }

  // Check for missing or suspicious user agent
  if (!userAgent || userAgent.length < 10) {
    score += 0.3;
  }

  // Check for headless browser indicators
  if (/headless/i.test(userAgent)) {
    score += 0.9;
  }

  // Check for common crawler IPs (simplified - in production use a database)
  if (ipAddress) {
    // Example: Google crawler IPs typically start with certain ranges
    // In production, use a proper IP range database or service
    if (ipAddress.startsWith('66.249.')) {
      score += 0.6; // Googlebot IP range
    }
  }

  return Math.min(score, 1.0);
}

// Extract IP address from request headers
export async function getIPAddress(): Promise<string | null> {
  const headersList = await headers();

  // Try various headers in order of preference
  const forwarded = headersList.get('x-forwarded-for');
  if (forwarded) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwarded.split(',')[0].trim();
  }

  const realIP = headersList.get('x-real-ip');
  if (realIP) {
    return realIP;
  }

  const cfConnectingIP = headersList.get('cf-connecting-ip'); // Cloudflare
  if (cfConnectingIP) {
    return cfConnectingIP;
  }

  const trueClientIP = headersList.get('true-client-ip'); // Akamai
  if (trueClientIP) {
    return trueClientIP;
  }

  return null;
}

// Get user agent from request headers
export async function getUserAgent(): Promise<string | null> {
  const headersList = await headers();
  return headersList.get('user-agent');
}

// Perform IP geolocation (simplified - in production use a service)
export async function geolocateIP(ipAddress: string): Promise<{
  country: string | null;
  city: string | null;
}> {
  // In production, use a service like:
  // - Vercel Geolocation (built-in on Vercel)
  // - MaxMind GeoIP2
  // - ipapi.co
  // - IP2Location

  // For now, check if we're on Vercel and use their built-in geo headers
  const headersList = await headers();
  const country = headersList.get('x-vercel-ip-country');
  const city = headersList.get('x-vercel-ip-city');

  if (country || city) {
    return {
      country: country || null,
      city: city ? decodeURIComponent(city) : null,
    };
  }

  // Fallback: no geolocation available
  return {
    country: null,
    city: null,
  };
}

// Main enrichment function
export async function enrichRequest(): Promise<EnrichmentData> {
  const ipAddress = await getIPAddress();
  const userAgent = await getUserAgent() || '';

  const { country, city } = ipAddress
    ? await geolocateIP(ipAddress)
    : { country: null, city: null };

  const deviceType = parseDeviceType(userAgent);
  const browser = parseBrowser(userAgent);
  const os = parseOS(userAgent);
  const botScore = calculateBotScore(userAgent, ipAddress);
  const isBot = botScore > 0.5;

  return {
    ipAddress,
    userAgent,
    country,
    city,
    deviceType,
    browser,
    os,
    isBot,
    botScore,
  };
}
