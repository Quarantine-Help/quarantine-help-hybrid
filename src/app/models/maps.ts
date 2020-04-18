export type RequestTypes = 'G' | 'M' | undefined;
export type Categories = 'all' | 'medicine' | 'grocery';
export interface SearchFilters {
  distance: number;
  category: Categories;
}
