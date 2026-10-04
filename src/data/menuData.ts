import type { MenuItem, MenuCategory } from '../types';

export const menuCategories: MenuCategory[] = [
  'Starters', 'Soups', 'Salads', 'Main Course', 
  'Pasta', 'Pizza', 'Grills', 'Desserts', 
  'Beverages', 'Chef Special'
];

export const menuItems: MenuItem[] = [
  // Starters
  {
    id: 'm1', name: 'Paneer Tikka', description: 'Cubes of paneer marinated in yogurt and spices, grilled in a tandoor.', price: 345, category: 'Starters', image: '/images/menu/m1.jpg', vegetarian: true, spicy: false, bestseller: false, available: true, preparationTime: 20, rating: 4.5, reviewCount: 120
  },
  {
    id: 'm2', name: 'Chicken Seekh Kebab', description: 'Minced chicken spiced and molded onto skewers, cooked over glowing charcoal.', price: 395, category: 'Starters', image: '/images/menu/m2.jpg', vegetarian: false, spicy: true, bestseller: false, available: true, preparationTime: 25, rating: 4.3, reviewCount: 95
  },
  {
    id: 'm3', name: 'Crispy Calamari', description: 'Golden fried calamari rings served with zesty garlic aioli.', price: 425, category: 'Starters', image: '/images/menu/m3.jpg', vegetarian: false, spicy: false, bestseller: false, available: true, preparationTime: 15, rating: 4.6, reviewCount: 80
  },
  {
    id: 'm4', name: 'Vegetable Spring Rolls', description: 'Crispy rolls stuffed with julienned vegetables and served with sweet chili sauce.', price: 275, category: 'Starters', image: '/images/menu/m4.jpg', vegetarian: true, spicy: false, bestseller: false, available: true, preparationTime: 15, rating: 4.2, reviewCount: 150
  },
  {
    id: 'm5', name: 'Mutton Galouti Kebab', description: 'Melt-in-the-mouth minced mutton kebabs flavored with aromatic Indian spices.', price: 495, category: 'Starters', image: '/images/menu/m5.jpg', vegetarian: false, spicy: false, bestseller: true, available: true, preparationTime: 25, rating: 4.9, reviewCount: 210
  },
  {
    id: 'm6', name: 'Hara Bhara Kebab', description: 'Healthy and delicious spinach and green peas patties with Indian spices.', price: 295, category: 'Starters', image: '/images/menu/m6.jpg', vegetarian: true, spicy: false, bestseller: false, available: true, preparationTime: 20, rating: 4.1, reviewCount: 65
  },
  
  // Soups
  {
    id: 'm7', name: 'Tomato Basil Soup', description: 'Rich and creamy soup made with fresh tomatoes and sweet basil leaves.', price: 195, category: 'Soups', image: '/images/menu/m7.jpg', vegetarian: true, spicy: false, bestseller: false, available: true, preparationTime: 10, rating: 4.4, reviewCount: 140
  },
  {
    id: 'm8', name: 'Hot & Sour Chicken Soup', description: 'Spicy and tangy oriental soup with shredded chicken, bamboo shoots, and mushrooms.', price: 225, category: 'Soups', image: '/images/menu/m8.jpg', vegetarian: false, spicy: true, bestseller: false, available: true, preparationTime: 12, rating: 4.3, reviewCount: 110
  },
  {
    id: 'm9', name: 'Mushroom Cappuccino', description: 'Earthy wild mushroom soup topped with a light milk froth.', price: 245, category: 'Soups', image: '/images/menu/m9.jpg', vegetarian: true, spicy: false, bestseller: false, available: true, preparationTime: 15, rating: 4.7, reviewCount: 85
  },
  {
    id: 'm10', name: 'Seafood Chowder', description: 'Thick and hearty soup loaded with fresh seasonal seafood and potatoes.', price: 325, category: 'Soups', image: '/images/menu/m10.jpg', vegetarian: false, spicy: false, bestseller: false, available: false, preparationTime: 20, rating: 4.5, reviewCount: 50
  },
  
  // Salads
  {
    id: 'm11', name: 'Caesar Salad', description: 'Crisp romaine lettuce with parmesan, croutons, and classic Caesar dressing.', price: 325, category: 'Salads', image: '/images/menu/m11.jpg', vegetarian: false, spicy: false, bestseller: false, available: true, preparationTime: 10, rating: 4.2, reviewCount: 90
  },
  {
    id: 'm12', name: 'Greek Salad', description: 'Fresh cucumbers, tomatoes, red onions, kalamata olives, and feta cheese.', price: 295, category: 'Salads', image: '/images/menu/m12.jpg', vegetarian: true, spicy: false, bestseller: false, available: true, preparationTime: 10, rating: 4.4, reviewCount: 115
  },
  {
    id: 'm13', name: 'Grilled Chicken Salad', description: 'Tender grilled chicken breast over a bed of mixed greens with vinaigrette.', price: 375, category: 'Salads', image: '/images/menu/m13.jpg', vegetarian: false, spicy: false, bestseller: false, available: true, preparationTime: 15, rating: 4.6, reviewCount: 130
  },
  {
    id: 'm14', name: 'Quinoa Avocado Bowl', description: 'Nutrient-rich bowl of quinoa, fresh avocado, cherry tomatoes, and microgreens.', price: 395, category: 'Salads', image: '/images/menu/m14.jpg', vegetarian: true, spicy: false, bestseller: false, available: true, preparationTime: 12, rating: 4.8, reviewCount: 75
  },
  
  // Main Course
  {
    id: 'm15', name: 'Butter Chicken', description: 'Classic Indian dish of grilled chicken simmered in a smooth, rich tomato and butter gravy.', price: 445, category: 'Main Course', image: '/images/menu/m15.jpg', vegetarian: false, spicy: false, bestseller: true, available: true, preparationTime: 25, rating: 4.9, reviewCount: 340
  },
  {
    id: 'm16', name: 'Paneer Butter Masala', description: 'Cottage cheese cubes cooked in a rich and creamy tomato-based gravy.', price: 375, category: 'Main Course', image: '/images/menu/m16.jpg', vegetarian: true, spicy: false, bestseller: true, available: true, preparationTime: 20, rating: 4.8, reviewCount: 280
  },
  {
    id: 'm17', name: 'Lamb Rogan Josh', description: 'Aromatic Kashmiri lamb curry cooked with traditional spices and yogurt.', price: 545, category: 'Main Course', image: '/images/menu/m17.jpg', vegetarian: false, spicy: true, bestseller: false, available: true, preparationTime: 30, rating: 4.7, reviewCount: 155
  },
  {
    id: 'm18', name: 'Dal Makhani', description: 'Black lentils slow-cooked overnight with tomatoes, cream, and butter.', price: 295, category: 'Main Course', image: '/images/menu/m18.jpg', vegetarian: true, spicy: false, bestseller: false, available: true, preparationTime: 20, rating: 4.6, reviewCount: 210
  },
  {
    id: 'm19', name: 'Fish Curry (Goan)', description: 'Tangy and spicy coconut-based curry made with fresh catch of the day.', price: 475, category: 'Main Course', image: '/images/menu/m19.jpg', vegetarian: false, spicy: true, bestseller: false, available: true, preparationTime: 25, rating: 4.5, reviewCount: 95
  },
  {
    id: 'm20', name: 'Chicken Biryani', description: 'Fragrant basmati rice cooked with marinated chicken, saffron, and aromatic spices.', price: 425, category: 'Main Course', image: '/images/menu/m20.jpg', vegetarian: false, spicy: false, bestseller: true, available: true, preparationTime: 30, rating: 4.8, reviewCount: 310
  },
  
  // Pasta
  {
    id: 'm21', name: 'Spaghetti Carbonara', description: 'Classic Roman pasta with egg, hard cheese, cured pork, and black pepper.', price: 395, category: 'Pasta', image: '/images/menu/m21.jpg', vegetarian: false, spicy: false, bestseller: false, available: true, preparationTime: 20, rating: 4.3, reviewCount: 105
  },
  {
    id: 'm22', name: 'Penne Arrabbiata', description: 'Penne pasta tossed in a spicy garlic and tomato sauce.', price: 345, category: 'Pasta', image: '/images/menu/m22.jpg', vegetarian: true, spicy: true, bestseller: false, available: true, preparationTime: 18, rating: 4.4, reviewCount: 125
  },
  {
    id: 'm23', name: 'Chicken Alfredo', description: 'Fettuccine pasta in a rich, creamy parmesan sauce with grilled chicken.', price: 425, category: 'Pasta', image: '/images/menu/m23.jpg', vegetarian: false, spicy: false, bestseller: true, available: true, preparationTime: 22, rating: 4.7, reviewCount: 190
  },
  {
    id: 'm24', name: 'Mushroom Truffle Pasta', description: 'Linguine pasta tossed with wild mushrooms and finished with truffle oil.', price: 475, category: 'Pasta', image: '/images/menu/m24.jpg', vegetarian: true, spicy: false, bestseller: false, available: true, preparationTime: 20, rating: 4.8, reviewCount: 85
  },
  
  // Pizza
  {
    id: 'm25', name: 'Margherita', description: 'Classic Neapolitan pizza with San Marzano tomatoes, fresh mozzarella, and basil.', price: 345, category: 'Pizza', image: '/images/menu/m25.jpg', vegetarian: true, spicy: false, bestseller: false, available: true, preparationTime: 15, rating: 4.5, reviewCount: 160
  },
  {
    id: 'm26', name: 'Pepperoni Pizza', description: 'Crispy crust topped with zesty tomato sauce, mozzarella, and spicy pepperoni.', price: 445, category: 'Pizza', image: '/images/menu/m26.jpg', vegetarian: false, spicy: false, bestseller: false, available: true, preparationTime: 15, rating: 4.6, reviewCount: 220
  },
  {
    id: 'm27', name: 'BBQ Chicken Pizza', description: 'Tangy BBQ sauce base with grilled chicken, red onions, and cilantro.', price: 475, category: 'Pizza', image: '/images/menu/m27.jpg', vegetarian: false, spicy: false, bestseller: false, available: true, preparationTime: 18, rating: 4.4, reviewCount: 110
  },
  {
    id: 'm28', name: 'Four Cheese Pizza', description: 'A decadent blend of mozzarella, gorgonzola, parmesan, and provolone.', price: 425, category: 'Pizza', image: '/images/menu/m28.jpg', vegetarian: true, spicy: false, bestseller: false, available: true, preparationTime: 15, rating: 4.7, reviewCount: 135
  },
  
  // Grills
  {
    id: 'm29', name: 'Grilled Salmon', description: 'Perfectly grilled salmon fillet served with asparagus and lemon butter sauce.', price: 695, category: 'Grills', image: '/images/menu/m29.jpg', vegetarian: false, spicy: false, bestseller: true, available: true, preparationTime: 25, rating: 4.8, reviewCount: 175
  },
  {
    id: 'm30', name: 'Tandoori Chicken', description: 'Half chicken marinated in yogurt and traditional tandoori spices, char-grilled.', price: 445, category: 'Grills', image: '/images/menu/m30.jpg', vegetarian: false, spicy: true, bestseller: false, available: true, preparationTime: 30, rating: 4.5, reviewCount: 215
  },
  {
    id: 'm31', name: 'Lamb Chops', description: 'Tender lamb chops marinated with fresh herbs and grilled to perfection.', price: 745, category: 'Grills', image: '/images/menu/m31.jpg', vegetarian: false, spicy: false, bestseller: false, available: true, preparationTime: 25, rating: 4.9, reviewCount: 85
  },
  {
    id: 'm32', name: 'Grilled Vegetable Platter', description: 'Assortment of seasonal vegetables grilled with olive oil and balsamic glaze.', price: 395, category: 'Grills', image: '/images/menu/m32.jpg', vegetarian: true, spicy: false, bestseller: false, available: false, preparationTime: 20, rating: 4.2, reviewCount: 55
  },
  
  // Desserts
  {
    id: 'm33', name: 'Tiramisu', description: 'Classic Italian dessert with coffee-soaked ladyfingers and mascarpone cream.', price: 345, category: 'Desserts', image: '/images/menu/m33.jpg', vegetarian: true, spicy: false, bestseller: false, available: true, preparationTime: 5, rating: 4.7, reviewCount: 145
  },
  {
    id: 'm34', name: 'Gulab Jamun', description: 'Soft, deep-fried milk dumplings soaked in a warm, fragrant sugar syrup.', price: 195, category: 'Desserts', image: '/images/menu/m34.jpg', vegetarian: true, spicy: false, bestseller: false, available: true, preparationTime: 5, rating: 4.6, reviewCount: 190
  },
  {
    id: 'm35', name: 'Chocolate Lava Cake', description: 'Decadent chocolate cake with a molten, gooey center served with vanilla ice cream.', price: 375, category: 'Desserts', image: '/images/menu/m35.jpg', vegetarian: true, spicy: false, bestseller: true, available: true, preparationTime: 15, rating: 4.9, reviewCount: 260
  },
  {
    id: 'm36', name: 'Mango Panna Cotta', description: 'Silky, smooth Italian dessert infused with fresh Alphonso mango purée.', price: 295, category: 'Desserts', image: '/images/menu/m36.jpg', vegetarian: true, spicy: false, bestseller: false, available: true, preparationTime: 5, rating: 4.5, reviewCount: 95
  },
  {
    id: 'm37', name: 'Rasmalai', description: 'Soft paneer discs soaked in thickened, sweetened, and cardamom-flavored milk.', price: 225, category: 'Desserts', image: '/images/menu/m37.jpg', vegetarian: true, spicy: false, bestseller: false, available: true, preparationTime: 5, rating: 4.8, reviewCount: 155
  },
  
  // Beverages
  {
    id: 'm38', name: 'Fresh Lime Soda', description: 'Refreshing sweet or salted lime cooler to beat the heat.', price: 145, category: 'Beverages', image: '/images/menu/m38.jpg', vegetarian: true, spicy: false, bestseller: false, available: true, preparationTime: 5, rating: 4.3, reviewCount: 120
  },
  {
    id: 'm39', name: 'Mango Lassi', description: 'Thick, creamy yogurt-based drink blended with sweet mango pulp.', price: 175, category: 'Beverages', image: '/images/menu/m39.jpg', vegetarian: true, spicy: false, bestseller: false, available: true, preparationTime: 5, rating: 4.7, reviewCount: 165
  },
  {
    id: 'm40', name: 'Cold Coffee', description: 'Chilled, frothy coffee blended with ice cream and chocolate syrup.', price: 195, category: 'Beverages', image: '/images/menu/m40.jpg', vegetarian: true, spicy: false, bestseller: false, available: true, preparationTime: 5, rating: 4.6, reviewCount: 180
  },
  {
    id: 'm41', name: 'Virgin Mojito', description: 'A refreshing mix of mint leaves, lemon juice, sugar, and soda.', price: 225, category: 'Beverages', image: '/images/menu/m41.jpg', vegetarian: true, spicy: false, bestseller: false, available: true, preparationTime: 5, rating: 4.4, reviewCount: 140
  },
  {
    id: 'm42', name: 'Masala Chai', description: 'Traditional Indian tea brewed with aromatic spices and herbs.', price: 95, category: 'Beverages', image: '/images/menu/m42.jpg', vegetarian: true, spicy: false, bestseller: false, available: true, preparationTime: 10, rating: 4.8, reviewCount: 205
  },
  
  // Chef Special
  {
    id: 'm43', name: 'Truffle Mushroom Risotto', description: 'Creamy arborio rice cooked with wild mushrooms and drizzled with truffle oil.', price: 595, category: 'Chef Special', image: '/images/menu/m43.jpg', vegetarian: true, spicy: false, bestseller: false, available: true, preparationTime: 25, rating: 4.9, reviewCount: 115
  },
  {
    id: 'm44', name: 'Lobster Thermidor', description: 'Classic French dish of lobster meat cooked in a rich wine sauce and gratinated.', price: 1295, category: 'Chef Special', image: '/images/menu/m44.jpg', vegetarian: false, spicy: false, bestseller: false, available: false, preparationTime: 35, rating: 4.8, reviewCount: 45
  },
  {
    id: 'm45', name: 'Wagyu Beef Steak', description: 'Premium Wagyu beef seared to perfection, served with garlic mash and red wine jus.', price: 1895, category: 'Chef Special', image: '/images/menu/m45.jpg', vegetarian: false, spicy: false, bestseller: false, available: true, preparationTime: 30, rating: 4.9, reviewCount: 30
  }
];
