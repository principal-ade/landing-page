import { trackGAEvent } from './ga';

interface DownloadMeta {
  filename: string;
  platform: string;
  assetId?: number;
}

const EVENT_CATEGORY = 'Downloads';

/**
 * Fire a GA "download" event, trigger the real download, then probe the
 * download URL to determine success/failure and report the result.
 *
 * Navigation is never gated on the probe: on a static host the download URL
 * points straight at GitHub's CDN, so we hand off immediately and treat the
 * probe as best-effort telemetry.
 */
export async function trackAndStartDownload(
  downloadUrl: string,
  meta: DownloadMeta,
): Promise<void> {
  const baseParams = {
    event_category: EVENT_CATEGORY,
    event_label: `${meta.platform} - ${meta.filename}`,
    value: meta.assetId,
    filename: meta.filename,
    platform: meta.platform,
  };

  trackGAEvent('download', { ...baseParams, download_status: 'started' });

  // Start the download right away so it works even if the telemetry probe fails.
  window.location.href = downloadUrl;

  try {
    const res = await fetch(downloadUrl, { redirect: 'manual' });
    const started = res.type === 'opaqueredirect' || res.ok;

    if (started) {
      trackGAEvent('download', { ...baseParams, download_status: 'completed' });
      return;
    }

    let reason = 'unknown';
    try {
      const body = await res.json();
      reason = body?.error ?? reason;
    } catch {
      // response had no JSON body
    }

    trackGAEvent('download', {
      ...baseParams,
      download_status: 'failed',
      download_error: reason,
      download_http_status: res.status,
    });
  } catch {
    trackGAEvent('download', {
      ...baseParams,
      download_status: 'failed',
      download_error: 'network',
    });
  }
}
