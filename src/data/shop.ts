import type { ImageSourcePropType } from 'react-native';

export type ShopCategory = {
  slug: string;
  name: string;
  image: ImageSourcePropType;
  subcategories: string[];
};

export type Product = {
  id: string;
  name: string;
  description: string;
  category: string;
  subcategory: string;
  price: number;
  image: ImageSourcePropType;
};

export const categories: ShopCategory[] = [
  {
    slug: 'pain-relief',
    name: 'Pain Relief',
    image: require('../../assets/images/medi-category-pain.png'),
    subcategories: ['Pain relievers', 'Cold & flu', 'Muscle care'],
  },
  {
    slug: 'vitamins',
    name: 'Vitamins',
    image: require('../../assets/images/medi-category-vitamins.png'),
    subcategories: ['Daily vitamins', 'Immunity', 'Minerals'],
  },
  {
    slug: 'skincare',
    name: 'Skincare',
    image: require('../../assets/images/medi-category-skincare.png'),
    subcategories: ['Face care', 'Body care', 'Sun protection'],
  },
  {
    slug: 'first-aid',
    name: 'First Aid',
    image: require('../../assets/images/medi-category-first-aid.png'),
    subcategories: ['Bandages', 'Antiseptics', 'First aid kits'],
  },
  {
    slug: 'baby-care',
    name: 'Baby Care',
    image: require('../../assets/images/medi-category-baby-care.png'),
    subcategories: ['Baby hygiene', 'Baby wellness', 'Feeding'],
  },
];

export const products: Product[] = [
  {
    id: 'pain-relief-tablets',
    name: 'Pain Relief Tablets',
    description: 'Everyday essentials · 10 tablets',
    category: 'Pain Relief',
    subcategory: 'Pain relievers',
    price: 45,
    image: require('../../assets/images/medi-category-pain.png'),
  },
  {
    id: 'cold-comfort',
    name: 'Cold Comfort',
    description: 'Cold & flu care · 10 tablets',
    category: 'Pain Relief',
    subcategory: 'Cold & flu',
    price: 68,
    image: require('../../assets/images/medi-category-pain.png'),
  },
  {
    id: 'daily-multivitamin',
    name: 'Daily Multivitamin',
    description: 'Daily wellness · 30 tablets',
    category: 'Vitamins',
    subcategory: 'Daily vitamins',
    price: 249,
    image: require('../../assets/images/medi-category-vitamins.png'),
  },
  {
    id: 'immunity-support',
    name: 'Immunity Support',
    description: 'Vitamin C · 20 tablets',
    category: 'Vitamins',
    subcategory: 'Immunity',
    price: 189,
    image: require('../../assets/images/medi-category-vitamins.png'),
  },
  {
    id: 'daily-moisturiser',
    name: 'Daily Moisturiser',
    description: 'Gentle daily care · 100 ml',
    category: 'Skincare',
    subcategory: 'Face care',
    price: 299,
    image: require('../../assets/images/medi-category-skincare.png'),
  },
  {
    id: 'sun-protection',
    name: 'Sun Protection Lotion',
    description: 'Everyday sun care · 50 ml',
    category: 'Skincare',
    subcategory: 'Sun protection',
    price: 349,
    image: require('../../assets/images/medi-category-skincare.png'),
  },
  {
    id: 'first-aid-kit',
    name: 'Everyday First Aid Kit',
    description: 'Home essentials · 1 kit',
    category: 'First Aid',
    subcategory: 'First aid kits',
    price: 225,
    image: require('../../assets/images/medi-category-first-aid.png'),
  },
  {
    id: 'adhesive-bandages',
    name: 'Adhesive Bandages',
    description: 'Flexible fabric · 20 strips',
    category: 'First Aid',
    subcategory: 'Bandages',
    price: 75,
    image: require('../../assets/images/medi-category-first-aid.png'),
  },
  {
    id: 'baby-gentle-wash',
    name: 'Baby Gentle Wash',
    description: 'Gentle everyday care · 200 ml',
    category: 'Baby Care',
    subcategory: 'Baby hygiene',
    price: 199,
    image: require('../../assets/images/medi-category-baby-care.png'),
  },
];

export const formatPrice = (amount: number) => `₹${amount.toFixed(0)}`;
