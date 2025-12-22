import { useState, useEffect } from 'react';
import { getGoogleDriveFallbackUrls } from '@/lib/mediaUtils';

interface RobustImageProps {
  src: string;
  alt: string;
  className?: string;
  onError?: () => void;
  onLoad?: () => void;
}

/**
 * A robust image component that handles Google Drive URLs with automatic fallbacks
 */
export default function RobustImage({ src, alt, className = '', onError, onLoad }: RobustImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [fallbackUrls, setFallbackUrls] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Reset state when src changes
    setCurrentSrc(src);
    setCurrentIndex(0);
    setHasError(false);

    // Generate fallback URLs for Google Drive links
    if (src.includes('drive.google.com')) {
      const fallbacks = getGoogleDriveFallbackUrls(src);
      setFallbackUrls(fallbacks);
      setCurrentSrc(fallbacks[0]);
    } else {
      setFallbackUrls([src]);
    }
  }, [src]);

  const handleError = () => {
    setHasError(true);

    // Try next fallback URL
    if (currentIndex < fallbackUrls.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setCurrentSrc(fallbackUrls[nextIndex]);
      setHasError(false);
      console.log(`Trying fallback URL ${nextIndex + 1}/${fallbackUrls.length}:`, fallbackUrls[nextIndex]);
    } else {
      // All fallbacks exhausted
      console.warn('All Google Drive fallback URLs failed for:', src);
      onError?.();
    }
  };

  const handleLoad = () => {
    if (!hasError) {
      onLoad?.();
    }
  };

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      onError={handleError}
      onLoad={handleLoad}
    />
  );
}