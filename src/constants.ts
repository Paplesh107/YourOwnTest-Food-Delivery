import { FoodItem, Category } from './types';

export const CATEGORIES: Category[] = ['All', 'Indian', 'Pizza', 'Burger', 'Drinks', 'Desserts'];

export const FOOD_ITEMS: FoodItem[] = [
  {
    id: '1',
    name: 'Margherita Pizza',
    category: 'Pizza',
    price: 12.99,
    rating: 4.8,
    deliveryTime: '25-30 min',
    restaurantName: 'Pizza Palace',
    description: 'Classic Margherita with fresh mozzarella, tomato sauce, and basil on a crispy thin crust.',
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80',
    prepTime: '15 min'
  },
  {
    id: '7',
    name: 'Butter Chicken with Naan',
    category: 'Indian',
    price: 16.50,
    rating: 4.9,
    deliveryTime: '35-40 min',
    restaurantName: 'Taste of India',
    description: 'Tender chicken pieces in a rich, creamy tomato-based gravy, served with buttered garlic naan.',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80',
    prepTime: '25 min'
  },
  {
    id: '8',
    name: 'Paneer Tikka Masala',
    category: 'Indian',
    price: 14.25,
    rating: 4.7,
    deliveryTime: '30-35 min',
    restaurantName: 'Taste of India',
    description: 'Grilled paneer cubes in a spicy and creamy onion-tomato gravy.',
    image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=80',
    prepTime: '20 min'
  },
  {
    id: '2',
    name: 'Double Cheeseburger',
    category: 'Burger',
    price: 9.50,
    rating: 4.6,
    deliveryTime: '20-25 min',
    restaurantName: 'Burger Kingly',
    description: 'Two juicy beef patties with melted cheddar, lettuce, tomato, and our secret sauce.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    prepTime: '10 min'
  },
  {
    id: '9',
    name: 'Mineral Water (500ml)',
    category: 'Drinks',
    price: 1.50,
    rating: 4.9,
    deliveryTime: '10-15 min',
    restaurantName: 'Quick Stop',
    description: 'Pure, refreshing mineral water to stay hydrated.',
    image: 'https://images.unsplash.com/photo-1560023907-5f339617ea30?auto=format&fit=crop&w=800&q=80',
    prepTime: '1 min'
  },
  {
    id: '10',
    name: 'Coca Cola (330ml)',
    category: 'Drinks',
    price: 2.25,
    rating: 4.8,
    deliveryTime: '10-15 min',
    restaurantName: 'Quick Stop',
    description: 'Classic refreshing cola drink served chilled.',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80',
    prepTime: '1 min'
  },
  {
    id: '3',
    name: 'Strawberry Milkshake',
    category: 'Drinks',
    price: 5.99,
    rating: 4.9,
    deliveryTime: '15-20 min',
    restaurantName: 'Sweet Sips',
    description: 'Creamy strawberry milkshake topped with whipped cream and a fresh strawberry.',
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80',
    prepTime: '5 min'
  },
  {
    id: '4',
    name: 'Chocolate Lava Cake',
    category: 'Desserts',
    price: 7.25,
    rating: 4.7,
    deliveryTime: '30-35 min',
    restaurantName: 'Dessert Heaven',
    description: 'Warm chocolate cake with a gooey molten center, served with vanilla ice cream.',
    image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=800&q=80',
    prepTime: '20 min'
  },
  {
    id: '11',
    name: 'Mango Lassi',
    category: 'Drinks',
    price: 4.50,
    rating: 4.9,
    deliveryTime: '15-20 min',
    restaurantName: 'Taste of India',
    description: 'Traditional Indian yogurt-based drink with sweet mango pulp.',
    image: 'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=800&q=80',
    prepTime: '5 min'
  },
  {
    id: '5',
    name: 'Pepperoni Feast',
    category: 'Pizza',
    price: 14.99,
    rating: 4.5,
    deliveryTime: '25-30 min',
    restaurantName: 'Pizza Palace',
    description: 'Loaded with spicy pepperoni and extra mozzarella cheese.',
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80',
    prepTime: '15 min'
  },
  {
    id: '6',
    name: 'Crispy Chicken Burger',
    category: 'Burger',
    price: 8.75,
    rating: 4.4,
    deliveryTime: '20-25 min',
    restaurantName: 'Burger Kingly',
    description: 'Crispy fried chicken breast with spicy mayo and pickles.',
    image: 'https://images.unsplash.com/photo-1610614819513-58e34989848b?auto=format&fit=crop&w=800&q=80',
    prepTime: '12 min'
  }
];

export const MOCK_DELIVERY_AGENT = {
  name: 'John Doe',
  phone: '+1 234 567 890',
  rating: 4.8,
  photo: 'https://i.pravatar.cc/150?u=johndoe'
};

export const MOCK_RESTAURANT_INFO = {
  shopkeeperName: 'Mario Rossi',
  address: '123 Pizza St, Foodville',
  readyTime: '12:30 PM',
  dispatchTime: '12:45 PM'
};
