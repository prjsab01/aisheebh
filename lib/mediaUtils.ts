// Utility functions for handling media URLs

/**
 * Converts Google Drive sharing links to direct viewable URLs for images
 * @param url - The original URL (could be Google Drive sharing link or regular URL)
 * @returns The converted URL that can be used as image src
 */
export function convertToViewableUrl(url: string): string {
  if (!url) return url

  // Check if it's a Google Drive sharing link
  if (url.includes('drive.google.com/file/d/')) {
    // Extract file ID from sharing link
    const fileIdMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)
    if (fileIdMatch && fileIdMatch[1]) {
      const fileId = fileIdMatch[1]
      // Convert to direct view URL
      return `https://drive.google.com/uc?export=view&id=${fileId}`
    }
  }

  // Return original URL if not a Google Drive link
  return url
}

/**
 * Checks if a URL is a Google Drive sharing link
 * @param url - The URL to check
 * @returns True if it's a Google Drive sharing link
 */
export function isGoogleDriveLink(url: string): boolean {
  return url.includes('drive.google.com/file/d/') && url.includes('view?usp=sharing')
}