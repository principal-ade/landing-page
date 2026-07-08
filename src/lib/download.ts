import { trackGAEvent } from './ga';

interface DownloadMeta {
  filename: string;
  platform: string;
  assetId?: number;
}

const EVENT_CATEGORY = 'Downloads';

/**
 * Fire a GA "download" event, probe the download endpoint to determine
 * success/failure, fire a result event, then trigger the real download.
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

  try {
    const res = await fetch(downloadUrl, { redirect: 'manual' });
    const started = res.type === 'opaqueredirect' || res.ok;

    if (started) {
      trackGAEvent('download', { ...baseParams, download_status: 'completed' });
      window.location.href = downloadUrl;
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
