export interface BaseDocument {
  id: string;
  order: number;
  visibility: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Profile extends BaseDocument {
  name: string;
  headline: string;
  photoUrl: string;
  bannerUrl?: string;
  about: string;
}

export interface Section extends BaseDocument {
  type: string;
  title: string;
  layout: 'tab' | 'inline' | 'hybrid';
}

export interface Entry extends BaseDocument {
  sectionId: string;
  title: string;
  content: string;
  images?: string[];
  links?: { url: string; text: string }[];
  dateRange?: { start: string; end?: string };
  tags?: string[];
  organization?: string;
  logoUrl?: string;
  location?: string;
  mediaLinks?: { url: string; type: 'image' | 'video' | 'pdf' | 'ppt' | 'pptx'; thumbnail?: string; title?: string }[];
  // Publication-specific fields
  publisher?: string;
  publicationDate?: string;
  coAuthors?: string[];
  publicationUrl?: string;
  rssUrl?: string;
  publicationType?: string; // For tab categorization
  publicationTypeLabel?: string; // Custom display name for publication type tabs
}

export interface Highlight extends BaseDocument {
  text: string;
  icon?: string;
}

export interface Featured extends BaseDocument {
  imageUrl: string;
  text: string;
  buttonText?: string;
  buttonUrl?: string;
}

export interface Social extends BaseDocument {
  platform: string;
  url: string;
  icon: string;
}

export interface Setting {
  key: string;
  value: any;
}