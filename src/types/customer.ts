export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  visits: number;
  totalSpent: number;
  joinedDate: string;
  favoriteItems: string[]; // menu item IDs
}
