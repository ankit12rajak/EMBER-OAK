export type MenuCategory = 
  | 'Starters' | 'Soups' | 'Salads' | 'Main Course' 
  | 'Pasta' | 'Pizza' | 'Grills' | 'Desserts' 
  | 'Beverages' | 'Chef Special';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  image: string;
  vegetarian: boolean;
  spicy: boolean;
  bestseller: boolean;
  available: boolean;
  preparationTime: number; // in minutes
  rating: number;
  reviewCount: number;
}
