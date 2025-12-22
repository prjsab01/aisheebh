// Utility functions for handling media URLs

/**
 * Converts Google Drive sharing links to direct viewable URLs for images
 * @param url - The original URL (could be Google Drive sharing link or regular URL)
 * @returns The converted URL that can be used as image src
 */
export function convertToViewableUrl(url: string): string {
  if (!url) return url

  // Check if it's a Google Drive sharing link
  if (url.includes('drive.google.com')) {
    let fileId = '';

    // Try different Google Drive URL patterns
    if (url.includes('/file/d/')) {
      // Standard sharing link: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
      const fileIdMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
      if (fileIdMatch && fileIdMatch[1]) {
        fileId = fileIdMatch[1];
      }
    } else if (url.includes('id=')) {
      // Alternative format: https://drive.google.com/open?id=FILE_ID
      const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
      if (idMatch && idMatch[1]) {
        fileId = idMatch[1];
      }
    } else if (url.includes('/d/')) {
      // Short format: https://drive.google.com/d/FILE_ID
      const shortMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (shortMatch && shortMatch[1]) {
        fileId = shortMatch[1];
      }
    }

    if (fileId) {
      // Convert to direct view URL that works for images
      const convertedUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
      console.log('Converted Google Drive URL:', url, '->', convertedUrl);
      return convertedUrl;
    } else {
      console.warn('Could not extract file ID from Google Drive URL:', url);
    }
  }

  // Return original URL if not a Google Drive link or conversion failed
  return url
}

/**
 * Checks if a URL is a Google Drive sharing link
 * @param url - The URL to check
 * @returns True if it's a Google Drive sharing link
 */
export function isGoogleDriveLink(url: string): boolean {
  return url.includes('drive.google.com') && (
    url.includes('/file/d/') ||
    url.includes('id=') ||
    url.includes('/d/')
  )
}

/**
 * Creates a fallback URL for Google Drive images if the primary method fails
 * @param url - The original Google Drive URL
 * @returns A fallback URL using Google Drive's thumbnail API
 */
export function getGoogleDriveFallbackUrl(url: string): string {
  if (!url.includes('drive.google.com')) return url

  let fileId = '';

  // Extract file ID using the same logic as convertToViewableUrl
  if (url.includes('/file/d/')) {
    const fileIdMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileIdMatch && fileIdMatch[1]) {
      fileId = fileIdMatch[1];
    }
  } else if (url.includes('id=')) {
    const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (idMatch && idMatch[1]) {
      fileId = idMatch[1];
    }
  } else if (url.includes('/d/')) {
    const shortMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (shortMatch && shortMatch[1]) {
      fileId = shortMatch[1];
    }
  }

  if (fileId) {
    // Try Google Drive thumbnail API as fallback
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
  }

  return url;
}