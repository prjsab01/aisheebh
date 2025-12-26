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

    // Try different Google Drive URL patterns with more permissive regex
    if (url.includes('/file/d/')) {
      // Standard sharing link: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
      const fileIdMatch = url.match(/\/file\/d\/([^/?]+)/);
      if (fileIdMatch && fileIdMatch[1]) {
        fileId = fileIdMatch[1];
      }
    } else if (url.includes('id=')) {
      // Alternative format: https://drive.google.com/open?id=FILE_ID
      const idMatch = url.match(/[?&]id=([^&]+)/);
      if (idMatch && idMatch[1]) {
        fileId = idMatch[1];
      }
    } else if (url.includes('/d/')) {
      // Short format: https://drive.google.com/d/FILE_ID
      const shortMatch = url.match(/\/d\/([^/?]+)/);
      if (shortMatch && shortMatch[1]) {
        fileId = shortMatch[1];
      }
    }

    if (fileId) {
      // Try different Google Drive URL formats for better compatibility
      // Method 1: Direct view URL (most common)
      const convertedUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
      // Method 2: Thumbnail URL (sometimes works better)
      // const thumbnailUrl = `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
      // Method 3: Direct download URL (for images)
      // const downloadUrl = `https://drive.google.com/uc?id=${fileId}&export=download`;

      console.log('Converted Google Drive URL:', url, '->', convertedUrl);
      console.log('File ID extracted:', fileId);
      console.log('Try this URL manually:', `https://drive.google.com/uc?export=view&id=${fileId}`);

      return convertedUrl;
    } else {
      console.warn('Could not extract file ID from Google Drive URL:', url);
      return url;
    }
  }

  // Return original URL if not a Google Drive link or conversion failed
  return url
}

/**
 * Tests if a Google Drive URL can be converted and logs the result
 * @param url - The URL to test
 */
export function testGoogleDriveConversion(url: string): void {
  console.log('Testing Google Drive URL conversion for:', url);
  const result = convertToViewableUrl(url);
  console.log('Conversion result:', result);

  if (url !== result) {
    console.log('✅ URL was converted successfully');
  } else {
    console.log('❌ URL was not converted (might not be a Google Drive link)');
  }
}

/**
 * Creates multiple fallback URLs for Google Drive images
 * @param url - The original Google Drive URL
 * @returns Array of fallback URLs to try
 */
export function getGoogleDriveFallbackUrls(url: string): string[] {
  if (!url.includes('drive.google.com')) return [url];

  let fileId = '';

  // Extract file ID using the same logic
  if (url.includes('/file/d/')) {
    const fileIdMatch = url.match(/\/file\/d\/([^/?]+)/);
    if (fileIdMatch && fileIdMatch[1]) {
      fileId = fileIdMatch[1];
    }
  } else if (url.includes('id=')) {
    const idMatch = url.match(/[?&]id=([^&]+)/);
    if (idMatch && idMatch[1]) {
      fileId = idMatch[1];
    }
  } else if (url.includes('/d/')) {
    const shortMatch = url.match(/\/d\/([^/?]+)/);
    if (shortMatch && shortMatch[1]) {
      fileId = shortMatch[1];
    }
  }

  if (fileId) {
    return [
      `https://drive.google.com/uc?export=view&id=${fileId}`,
      `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`,
      `https://lh3.googleusercontent.com/d/${fileId}=w1000`,
      url // Original URL as last resort
    ];
  }

  return [url];
}