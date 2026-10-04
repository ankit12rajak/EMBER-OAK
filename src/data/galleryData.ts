export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category: 'Interior' | 'Food' | 'Events' | 'Ambiance';
}

export const galleryImages: GalleryImage[] = [
  { id: 'gal-01', src: '/images/gallery/gal-01.jpg', alt: 'Elegant main dining hall with warm lighting', category: 'Interior' },
  { id: 'gal-02', src: '/images/gallery/gal-02.jpg', alt: 'Private dining room setup for families', category: 'Interior' },
  { id: 'gal-03', src: '/images/gallery/gal-03.jpg', alt: 'Modern bar counter with premium spirits', category: 'Interior' },
  { id: 'gal-04', src: '/images/gallery/gal-04.jpg', alt: 'Comfortable booth seating by the window', category: 'Interior' },
  { id: 'gal-05', src: '/images/gallery/gal-05.jpg', alt: 'Signature Butter Chicken in copper handi', category: 'Food' },
  { id: 'gal-06', src: '/images/gallery/gal-06.jpg', alt: 'Assorted freshly baked Naan and Kulcha', category: 'Food' },
  { id: 'gal-07', src: '/images/gallery/gal-07.jpg', alt: 'Spicy Paneer Tikka on a sizzler plate', category: 'Food' },
  { id: 'gal-08', src: '/images/gallery/gal-08.jpg', alt: 'Aromatic Chicken Biryani garnished with fried onions', category: 'Food' },
  { id: 'gal-09', src: '/images/gallery/gal-09.jpg', alt: 'Crispy Samosas with mint and tamarind chutney', category: 'Food' },
  { id: 'gal-10', src: '/images/gallery/gal-10.jpg', alt: 'Traditional Thali featuring regional curries', category: 'Food' },
  { id: 'gal-11', src: '/images/gallery/gal-11.jpg', alt: 'Live Ghazal music performance', category: 'Events' },
  { id: 'gal-12', src: '/images/gallery/gal-12.jpg', alt: 'Diwali special buffet setup', category: 'Events' },
  { id: 'gal-13', src: '/images/gallery/gal-13.jpg', alt: 'Corporate luncheon with projector setup', category: 'Events' },
  { id: 'gal-14', src: '/images/gallery/gal-14.jpg', alt: 'Cozy romantic dinner setting with candles', category: 'Ambiance' },
  { id: 'gal-15', src: '/images/gallery/gal-15.jpg', alt: 'Outdoor patio seating under fairy lights', category: 'Ambiance' },
  { id: 'gal-16', src: '/images/gallery/gal-16.jpg', alt: 'Vibrant cultural artifacts wall decor', category: 'Ambiance' },
];
