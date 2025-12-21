export interface BaseDocument {
  id: string;
  order: number;
  visibility: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Profile extends BaseDocument {
  name: string;
  headline: string;
  photoUrl: string;
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
  dateRange?: { start: Date; end?: Date };
  tags?: string[];
}

export interface Highlight extends BaseDocument {
  text: string;
  icon?: string;
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