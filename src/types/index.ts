export interface Option {
  id: string;
  label: string;
  color: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  options: Option[];
}

export type ScreenName = 'Home' | 'Lists' | 'Result';
