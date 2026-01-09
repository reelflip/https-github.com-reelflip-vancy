
import { UserRole, UserStatus, Product, Category, User, Order, OrderStatus } from './types';

export const CATEGORIES: Category[] = [
  { id: 'men', name: 'Men', icon: '👔' },
  { id: 'women', name: 'Women', icon: '👗' },
  { id: 'unisex', name: 'Unisex', icon: '👕' },
  { id: 'kids', name: 'Kids', icon: '👶' }
];

export const INITIAL_PRODUCTS: Product[] = [
  // --- MEN: T-SHIRTS (5 Samples) ---
  {
    id: 'm-ts-1', name: 'Essential Round Neck Tee', brand: 'Roadster',
    description: '100% Cotton daily wear.', price: 599, category: 'Men', subcategory: 'Round Neck', gender: 'Men',
    fabric: 'Cotton', fit: 'Regular Fit', occasion: 'Casual Wear', sellerId: 's1', stock: 100, rating: 4.5, reviews: [],
    images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800'],
    variants: [], isModerated: true
  },
  {
    id: 'm-ts-2', name: 'Classic Pique Polo', brand: 'U.S. Polo Assn.',
    description: 'Signature polo with embroidered logo.', price: 1499, category: 'Men', subcategory: 'Polo', gender: 'Men',
    fabric: 'Pique Cotton', fit: 'Slim Fit', occasion: 'Office Wear', sellerId: 's1', stock: 45, rating: 4.8, reviews: [],
    images: ['https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=800'],
    variants: [], isModerated: true
  },
  {
    id: 'm-ts-3', name: 'Heavyweight Oversized Tee', brand: 'H&M',
    description: 'Trendy drop-shoulder silhouette.', price: 1299, category: 'Men', subcategory: 'Oversized', gender: 'Men',
    fabric: 'Cotton', fit: 'Oversized', occasion: 'Casual Wear', sellerId: 's1', stock: 30, rating: 4.6, reviews: [],
    images: ['https://images.unsplash.com/photo-1562157873-818bc0726f68?q=80&w=800'],
    variants: [], isModerated: true
  },
  {
    id: 'm-ts-4', name: 'Abstract Graphic Print Tee', brand: 'Bewakoof',
    description: 'Breathable fabric with high-quality print.', price: 699, category: 'Men', subcategory: 'Printed / Graphic', gender: 'Men',
    fabric: 'Cotton', fit: 'Regular Fit', occasion: 'Casual Wear', sellerId: 's1', stock: 80, rating: 4.3, reviews: [],
    images: ['https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=800'],
    variants: [], isModerated: true
  },
  {
    id: 'm-ts-5', name: 'Athletic Compression Tee', brand: 'HRX',
    description: 'Dry-fit technology for intense workouts.', price: 899, category: 'Men', subcategory: 'T-Shirts', gender: 'Men',
    fabric: 'Polyester', fit: 'Slim Fit', occasion: 'Gym / Sports', sellerId: 's1', stock: 55, rating: 4.7, reviews: [],
    images: ['https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=800'],
    variants: [], isModerated: true
  },

  // --- MEN: SHIRTS (5 Samples) ---
  {
    id: 'm-sh-1', name: 'Indigo Denim Shirt', brand: 'Levi\'s',
    description: 'Rugged western style denim.', price: 2999, category: 'Men', subcategory: 'Denim', gender: 'Men',
    fabric: 'Denim', fit: 'Regular Fit', occasion: 'Casual Wear', sellerId: 's1', stock: 25, rating: 4.9, reviews: [],
    images: ['https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=800'],
    variants: [], isModerated: true
  },
  {
    id: 'm-sh-2', name: 'Crisp White Formal Shirt', brand: 'Raymond',
    description: 'Premium cotton for high-stakes meetings.', price: 1899, category: 'Men', subcategory: 'Formal', gender: 'Men',
    fabric: 'Egyptian Cotton', fit: 'Slim Fit', occasion: 'Office Wear', sellerId: 's1', stock: 60, rating: 4.8, reviews: [],
    images: ['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=800'],
    variants: [], isModerated: true
  },
  {
    id: 'm-sh-3', name: 'Linen Vacation Shirt', brand: 'FabIndia',
    description: 'Relaxed linen with mandarin collar.', price: 2499, category: 'Men', subcategory: 'Casual', gender: 'Men',
    fabric: 'Linen', fit: 'Relaxed Fit', occasion: 'Travel Wear', sellerId: 's1', stock: 20, rating: 4.7, reviews: [],
    images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800'],
    variants: [], isModerated: true
  },
  {
    id: 'm-sh-4', name: 'Oxford Striped Shirt', brand: 'Peter England',
    description: 'Versatile stripes for day-to-night.', price: 1399, category: 'Men', subcategory: 'Casual', gender: 'Men',
    fabric: 'Oxford Cotton', fit: 'Regular Fit', occasion: 'Casual Wear', sellerId: 's1', stock: 40, rating: 4.4, reviews: [],
    images: ['https://images.unsplash.com/photo-1586363104864-50e2246b621e?q=80&w=800'],
    variants: [], isModerated: true
  },
  {
    id: 'm-sh-5', name: 'Evening Velvet Shirt', brand: 'Zara',
    description: 'Luxe velvet finish for parties.', price: 3990, category: 'Men', subcategory: 'Casual', gender: 'Men',
    fabric: 'Velvet', fit: 'Slim Fit', occasion: 'Party Wear', sellerId: 's1', stock: 15, rating: 4.6, reviews: [],
    images: ['https://images.unsplash.com/photo-1598032895397-b9472444bf93?q=80&w=800'],
    variants: [], isModerated: true
  },

  // --- WOMEN: TOPS (5 Samples) ---
  {
    id: 'w-tp-1', name: 'Floral Smocked Top', brand: 'Vero Moda',
    description: 'Sweetheart neck with puff sleeves.', price: 1499, category: 'Women', subcategory: 'Casual Tops', gender: 'Women',
    fabric: 'Viscose', fit: 'Regular Fit', occasion: 'Casual Wear', sellerId: 's2', stock: 35, rating: 4.7, reviews: [],
    images: ['https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?q=80&w=800'],
    variants: [], isModerated: true
  },
  {
    id: 'w-tp-2', name: 'Tie-Front Crop Top', brand: 'Urbanic',
    description: 'Trendy tie-dye effect for summer.', price: 799, category: 'Women', subcategory: 'Crop Tops', gender: 'Women',
    fabric: 'Cotton Blend', fit: 'Slim Fit', occasion: 'Casual Wear', sellerId: 's2', stock: 50, rating: 4.5, reviews: [],
    images: ['https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?q=80&w=800'],
    variants: [], isModerated: true
  },
  {
    id: 'w-tp-3', name: 'Satin Peplum Tunic', brand: 'Van Heusen',
    description: 'Sophisticated silk finish for work.', price: 1999, category: 'Women', subcategory: 'Tunics', gender: 'Women',
    fabric: 'Satin', fit: 'Regular Fit', occasion: 'Office Wear', sellerId: 's2', stock: 25, rating: 4.8, reviews: [],
    images: ['https://images.unsplash.com/photo-1604176354204-926e737828ee?q=80&w=800'],
    variants: [], isModerated: true
  },
  {
    id: 'w-tp-4', name: 'Boho Tassel Tunic', brand: 'Global Desi',
    description: 'Vibrant prints with mirror work.', price: 2499, category: 'Women', subcategory: 'Tunics', gender: 'Women',
    fabric: 'Rayon', fit: 'Relaxed Fit', occasion: 'Travel Wear', sellerId: 's2', stock: 20, rating: 4.6, reviews: [],
    images: ['https://images.unsplash.com/photo-1624313503011-6f216b0d9172?q=80&w=800'],
    variants: [], isModerated: true
  },
  {
    id: 'w-tp-5', name: 'Lace Overlay Party Top', brand: 'Only',
    description: 'Exquisite lace detailing.', price: 1799, category: 'Women', subcategory: 'Casual Tops', gender: 'Women',
    fabric: 'Nylon Lace', fit: 'Slim Fit', occasion: 'Party Wear', sellerId: 's2', stock: 15, rating: 4.4, reviews: [],
    images: ['https://images.unsplash.com/photo-1551163943-3f6a855d1153?q=80&w=800'],
    variants: [], isModerated: true
  },

  // --- WOMEN: DRESSES (5 Samples) ---
  {
    id: 'w-dr-1', name: 'Tiered Chiffon Maxi', brand: 'Mango',
    description: 'Flowy layers for a dreamy look.', price: 4590, category: 'Women', subcategory: 'Maxi / Midi', gender: 'Women',
    fabric: 'Chiffon', fit: 'Regular Fit', occasion: 'Travel Wear', sellerId: 's2', stock: 12, rating: 4.9, reviews: [],
    images: ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800'],
    variants: [], isModerated: true
  },
  {
    id: 'w-dr-2', name: 'Sequin Bodycon Dress', brand: 'Kazo',
    description: 'Turn heads at any party.', price: 3800, category: 'Women', subcategory: 'Party Wear', gender: 'Women',
    fabric: 'Sequined Poly', fit: 'Slim Fit', occasion: 'Party Wear', sellerId: 's2', stock: 10, rating: 4.8, reviews: [],
    images: ['https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=800'],
    variants: [], isModerated: true
  },
  {
    id: 'w-dr-3', name: 'Cotton Shirt Dress', brand: 'H&M',
    description: 'The ultimate office-to-dinner outfit.', price: 1999, category: 'Women', subcategory: 'Casual', gender: 'Women',
    fabric: 'Cotton Poplin', fit: 'Relaxed Fit', occasion: 'Office Wear', sellerId: 's2', stock: 30, rating: 4.6, reviews: [],
    images: ['https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?q=80&w=800'],
    variants: [], isModerated: true
  },
  {
    id: 'w-dr-4', name: 'Silk Slip Dress', brand: 'Zara',
    description: 'Minimalist elegance in emerald green.', price: 3590, category: 'Women', subcategory: 'Maxi / Midi', gender: 'Women',
    fabric: 'Silk Satin', fit: 'Slim Fit', occasion: 'Party Wear', sellerId: 's2', stock: 8, rating: 5.0, reviews: [],
    images: ['https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=800'],
    variants: [], isModerated: true
  },
  {
    id: 'w-dr-5', name: 'Vintage Polka Midi', brand: 'Forever New',
    description: 'Retro vibes with a modern cut.', price: 2999, category: 'Women', subcategory: 'Maxi / Midi', gender: 'Women',
    fabric: 'Viscose', fit: 'Regular Fit', occasion: 'Casual Wear', sellerId: 's2', stock: 18, rating: 4.7, reviews: [],
    images: ['https://images.unsplash.com/photo-1539109136881-3be0610cac48?q=80&w=800'],
    variants: [], isModerated: true
  },

  // --- UNISEX (5 Samples) ---
  {
    id: 'u-ho-1', name: 'Premium Oversized Hoodie', brand: 'Adidas',
    description: 'Cozy fleece for ultimate comfort.', price: 4499, category: 'Unisex', subcategory: 'Hoodies', gender: 'Unisex',
    fabric: 'Heavyweight Fleece', fit: 'Oversized', occasion: 'Gym / Sports', sellerId: 's1', stock: 40, rating: 4.8, reviews: [],
    images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800'],
    variants: [], isModerated: true
  },
  {
    id: 'u-sn-1', name: 'All-Star Canvas Sneakers', brand: 'Converse',
    description: 'The iconic high-top for everyone.', price: 5499, category: 'Unisex', subcategory: 'Sneakers', gender: 'Unisex',
    fabric: 'Canvas', fit: 'Regular Fit', occasion: 'Casual Wear', sellerId: 's1', stock: 50, rating: 5.0, reviews: [],
    images: ['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800'],
    variants: [], isModerated: true
  },
  {
    id: 'u-ts-1', name: 'Nexus Limited Edition Tee', brand: 'Nexus',
    description: 'Exclusive unisex drop for platform fans.', price: 999, category: 'Unisex', subcategory: 'T-Shirts', gender: 'Unisex',
    fabric: 'Organic Cotton', fit: 'Regular Fit', occasion: 'Casual Wear', sellerId: 's1', stock: 100, rating: 4.9, reviews: [],
    images: ['https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=800'],
    variants: [], isModerated: true
  },
  {
    id: 'u-cp-1', name: 'Structured Baseball Cap', brand: 'Nike',
    description: 'Adjustable strap with breathable mesh.', price: 1295, category: 'Unisex', subcategory: 'Caps', gender: 'Unisex',
    fabric: 'Polyester', fit: 'Regular Fit', occasion: 'Gym / Sports', sellerId: 's1', stock: 60, rating: 4.7, reviews: [],
    images: ['https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=800'],
    variants: [], isModerated: true
  },
  {
    id: 'u-bg-1', name: 'Hybrid Roll-Top Backpack', brand: 'Wildcraft',
    description: 'Waterproof utility for travel and work.', price: 2800, category: 'Unisex', subcategory: 'Bags', gender: 'Unisex',
    fabric: 'Nylon', fit: 'Regular Fit', occasion: 'Travel Wear', sellerId: 's1', stock: 25, rating: 4.6, reviews: [],
    images: ['https://images.unsplash.com/photo-1553062407-98eebec4c271?q=80&w=800'],
    variants: [], isModerated: true
  }
];

export const MOCK_USERS: User[] = [
  { 
    id: 'b1', 
    name: 'Arjun Kumar', 
    email: 'arjun@nexus.in', 
    role: UserRole.BUYER, 
    status: UserStatus.APPROVED, 
    avatar: 'https://i.pravatar.cc/150?u=arjun',
    addresses: [{ id: 'a1', type: 'Home', street: 'MG Road, Indiranagar', city: 'Bengaluru', zip: '560038' }]
  },
  { 
    id: 's1', 
    name: 'Priya Sharma', 
    email: 'priya@indiacrafts.com', 
    role: UserRole.SELLER, 
    status: UserStatus.APPROVED, 
    avatar: 'https://i.pravatar.cc/150?u=priya',
    addresses: [],
    kycVerified: true
  },
  { 
    id: 'a1', 
    name: 'Admin Nexus', 
    email: 'admin@nexus.in', 
    role: UserRole.ADMIN, 
    status: UserStatus.APPROVED, 
    avatar: 'https://i.pravatar.cc/150?u=admin_india',
    addresses: []
  }
];

export const INITIAL_ORDERS: Order[] = [];
