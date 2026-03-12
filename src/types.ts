export type Category = 'Pizza' | 'Burger' | 'Drinks' | 'Desserts' | 'Indian' | 'All';

export interface FoodItem {
  id: string;
  name: string;
  category: Category;
  price: number;
  rating: number;
  deliveryTime: string;
  restaurantName: string;
  description: string;
  image: string;
  prepTime: string;
}

export interface CartItem extends FoodItem {
  quantity: number;
}

export type OrderStatus = 'Preparing' | 'Packed' | 'Out for delivery' | 'Delivered';

export interface DeliveryAgent {
  name: string;
  phone: string;
  rating: number;
  photo: string;
}

export interface RestaurantInfo {
  shopkeeperName: string;
  address: string;
  readyTime: string;
  dispatchTime: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  timestamp: number;
  deliveryAgent: DeliveryAgent;
  restaurantInfo: RestaurantInfo;
}
