export interface Review {
  id: string;
  customerId: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  avatar: string;
}

export const reviews: Review[] = [
  {
    id: 'rev-01',
    customerId: 'c1',
    customerName: 'Aarav Patel',
    rating: 5,
    comment: 'Absolutely amazing food! The Butter Chicken was incredibly flavorful and the naan was perfectly soft. We will definitely be coming back.',
    date: '2026-09-28',
    avatar: '/images/avatars/c1.jpg'
  },
  {
    id: 'rev-02',
    customerId: 'c2',
    customerName: 'Diya Sharma',
    rating: 4,
    comment: 'Great ambiance and very attentive staff. The portions are generous, though the biryani was a little spicier than I expected.',
    date: '2026-09-20',
    avatar: '/images/avatars/c2.jpg'
  },
  {
    id: 'rev-03',
    customerId: 'c3',
    customerName: 'Rohan Gupta',
    rating: 5,
    comment: 'One of the best dining experiences we have had recently. The Paneer Tikka was smoky and fresh. Highly recommended for family dinners.',
    date: '2026-09-15',
    avatar: '/images/avatars/c3.jpg'
  },
  {
    id: 'rev-04',
    customerId: 'c4',
    customerName: 'Ananya Singh',
    rating: 5,
    comment: 'A true taste of authentic cuisine! The desserts, especially the Gulab Jamun, were out of this world. Fantastic service too.',
    date: '2026-09-10',
    avatar: '/images/avatars/c4.jpg'
  },
  {
    id: 'rev-05',
    customerId: 'c5',
    customerName: 'Vikram Malhotra',
    rating: 3,
    comment: 'The food was decent but we had to wait quite a while for our main course. The starters were excellent though.',
    date: '2026-09-02',
    avatar: '/images/avatars/c5.jpg'
  },
  {
    id: 'rev-06',
    customerId: 'c6',
    customerName: 'Neha Desai',
    rating: 4,
    comment: 'Lovely restaurant with a cozy vibe. The Dal Makhani is an absolute must-try. Prices are reasonable for the quality.',
    date: '2026-08-25',
    avatar: '/images/avatars/c6.jpg'
  },
  {
    id: 'rev-07',
    customerId: 'c7',
    customerName: 'Arjun Reddy',
    rating: 5,
    comment: 'We hosted a small gathering here and everything was perfect. The management took care of every detail effortlessly.',
    date: '2026-08-18',
    avatar: '/images/avatars/c7.jpg'
  },
  {
    id: 'rev-08',
    customerId: 'c8',
    customerName: 'Kavya Joshi',
    rating: 4,
    comment: 'Really enjoyed the weekend buffet spread. Lots of variety for vegetarians. Just wish they had more parking space.',
    date: '2026-08-10',
    avatar: '/images/avatars/c8.jpg'
  },
  {
    id: 'rev-09',
    customerId: 'c9',
    customerName: 'Siddharth Verma',
    rating: 5,
    comment: 'Excellent food and prompt service. The mocktails were surprisingly refreshing. A top-notch place for dinner dates.',
    date: '2026-08-01',
    avatar: '/images/avatars/c9.jpg'
  },
  {
    id: 'rev-10',
    customerId: 'c10',
    customerName: 'Meera Kapoor',
    rating: 4,
    comment: 'Their tandoori items are simply the best in town. Staff is polite and helpful with recommendations.',
    date: '2026-07-28',
    avatar: '/images/avatars/c10.jpg'
  },
  {
    id: 'rev-11',
    customerId: 'c11',
    customerName: 'Karan Shah',
    rating: 3,
    comment: 'Food is good, but the music was a bit too loud for a relaxed conversation. Might prefer visiting on a weekday next time.',
    date: '2026-07-22',
    avatar: '/images/avatars/c11.jpg'
  },
  {
    id: 'rev-12',
    customerId: 'c12',
    customerName: 'Priya Iyer',
    rating: 5,
    comment: 'Authentic flavors that remind me of home cooking. The South Indian thali is a hidden gem on their menu.',
    date: '2026-07-15',
    avatar: '/images/avatars/c12.jpg'
  },
  {
    id: 'rev-13',
    customerId: 'c13',
    customerName: 'Rahul Nair',
    rating: 4,
    comment: 'Great portion sizes and well-presented dishes. The Garlic Naan paired with Rogan Josh was a heavenly combination.',
    date: '2026-07-08',
    avatar: '/images/avatars/c13.jpg'
  },
  {
    id: 'rev-14',
    customerId: 'c14',
    customerName: 'Riya Banerjee',
    rating: 5,
    comment: 'We celebrate all our family birthdays here. They always make us feel special and the food never disappoints!',
    date: '2026-07-04',
    avatar: '/images/avatars/c14.jpg'
  },
  {
    id: 'rev-15',
    customerId: 'c15',
    customerName: 'Aditya Choudhury',
    rating: 5,
    comment: 'Superb experience from start to finish. Fast service, delicious food, and a very hygienic environment.',
    date: '2026-07-01',
    avatar: '/images/avatars/c15.jpg'
  }
];
