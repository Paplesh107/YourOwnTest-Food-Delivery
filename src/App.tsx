/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  ShoppingCart, 
  Star, 
  Clock, 
  ChevronLeft, 
  Plus, 
  Minus, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  History,
  Home as HomeIcon,
  User,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Category, 
  FoodItem, 
  CartItem, 
  OrderStatus, 
  Order,
  DeliveryAgent,
  RestaurantInfo
} from './types';
import { 
  CATEGORIES, 
  FOOD_ITEMS, 
  MOCK_DELIVERY_AGENT, 
  MOCK_RESTAURANT_INFO 
} from './constants';

// --- Components ---

const StarRating = ({ rating, size = 16 }: { rating: number, size?: number }) => {
  return (
    <div className="flex items-center gap-1">
      <Star size={size} className="fill-yellow-400 text-yellow-400" />
      <span className="text-sm font-semibold">{rating}</span>
    </div>
  );
};

interface FoodCardProps {
  item: FoodItem;
  onClick: (item: FoodItem) => void;
}

const FoodCard: React.FC<FoodCardProps> = ({ 
  item, 
  onClick 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      layoutId={`card-${item.id}`}
      className="relative bg-white rounded-3xl overflow-hidden shadow-sm border border-black/5 cursor-pointer group"
      whileHover={{ y: -4, shadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => onClick(item)}
    >
      <div className="relative h-48 overflow-hidden">
        <motion.img
          layoutId={`image-${item.id}`}
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
          <StarRating rating={item.rating} size={12} />
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-bold text-lg text-gray-900 leading-tight">{item.name}</h3>
          <span className="font-bold text-emerald-600">${item.price.toFixed(2)}</span>
        </div>
        <p className="text-xs text-gray-500 mb-3">{item.restaurantName}</p>
        
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>{item.deliveryTime}</span>
          </div>
        </div>
      </div>

      {/* Quick Details Overlay (Simulating Android Hover/Long Press) */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center text-white p-6 text-center"
          >
            <StarRating rating={item.rating} size={20} />
            <p className="mt-2 font-medium">{item.deliveryTime} Delivery</p>
            <p className="text-sm opacity-80">{item.restaurantName}</p>
            <div className="mt-4 bg-white text-black px-4 py-2 rounded-full text-sm font-bold">
              View Details
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// --- Main App ---

export default function App() {
  // Navigation State
  const [currentScreen, setCurrentScreen] = useState<'home' | 'detail' | 'cart' | 'tracking' | 'history'>('home');
  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);
  
  // App State (ViewModel)
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Derived State
  const filteredItems = useMemo(() => {
    return FOOD_ITEMS.filter(item => {
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           item.restaurantName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [cart]);

  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  // Actions
  const addToCart = (item: FoodItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === id);
      if (existing && existing.quantity > 1) {
        return prev.map(i => i.id === id ? { ...i, quantity: i.quantity - 1 } : i);
      }
      return prev.filter(i => i.id !== id);
    });
  };

  const handleCheckout = () => {
    const newOrder: Order = {
      id: `ORD-${Math.floor(Math.random() * 10000)}`,
      items: [...cart],
      total: cartTotal,
      status: 'Preparing',
      timestamp: Date.now(),
      deliveryAgent: MOCK_DELIVERY_AGENT,
      restaurantInfo: MOCK_RESTAURANT_INFO
    };
    
    setOrders(prev => [newOrder, ...prev]);
    setCurrentOrder(newOrder);
    setCart([]);
    setCurrentScreen('tracking');

    // Simulate order progress
    setTimeout(() => updateOrderStatus(newOrder.id, 'Packed'), 5000);
    setTimeout(() => updateOrderStatus(newOrder.id, 'Out for delivery'), 10000);
    setTimeout(() => updateOrderStatus(newOrder.id, 'Delivered'), 15000);
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    setCurrentOrder(prev => prev?.id === orderId ? { ...prev, status } : prev);
  };

  const handleFeedback = (orderId: string, rating: number, comment: string) => {
    // In a real app, this would send to an API
    alert(`Thank you for your feedback! You rated ${rating} stars.`);
    setCurrentScreen('home');
  };

  // --- Screen Renderers ---

  const renderHome = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pb-24"
    >
      {/* Header */}
      <header className="px-6 pt-8 pb-4 sticky top-0 bg-[#f8f9fa] z-10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-sm text-gray-500">Deliver to</p>
            <div className="flex items-center gap-1">
              <MapPin size={16} className="text-emerald-500" />
              <span className="font-bold">Current Location</span>
            </div>
          </div>
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={() => setCurrentScreen('history')}
            className="p-2 bg-white rounded-full shadow-sm border border-black/5"
          >
            <History size={20} />
          </motion.button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search for food, restaurants..."
            className="w-full bg-white border border-black/5 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Categories */}
        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
          {CATEGORIES.map(cat => (
            <motion.button
              key={cat}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeCategory === cat 
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' 
                : 'bg-white text-gray-600 border border-black/5'
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </div>
      </header>

      {/* Food List */}
      <div className="px-6 grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        {filteredItems.map(item => (
          <FoodCard 
            key={item.id} 
            item={item} 
            onClick={(item) => {
              setSelectedItem(item);
              setCurrentScreen('detail');
            }} 
          />
        ))}
      </div>
    </motion.div>
  );

  const renderDetail = () => {
    if (!selectedItem) return null;
    const cartItem = cart.find(i => i.id === selectedItem.id);

    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen bg-white"
      >
        <div className="relative h-[40vh]">
          <motion.img 
            layoutId={`image-${selectedItem.id}`}
            src={selectedItem.image} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-8 left-6 right-6 flex justify-between">
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={() => setCurrentScreen('home')}
              className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg"
            >
              <ChevronLeft size={24} />
            </motion.button>
          </div>
        </div>

        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white -mt-10 rounded-t-[40px] p-8 relative z-10"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">{selectedItem.name}</h1>
              <p className="text-gray-500">{selectedItem.restaurantName}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-emerald-600">${selectedItem.price.toFixed(2)}</p>
              <StarRating rating={selectedItem.rating} />
            </div>
          </div>

          <div className="flex gap-6 mb-8">
            <div className="flex flex-col items-center p-3 bg-gray-50 rounded-2xl flex-1">
              <Clock size={20} className="text-emerald-500 mb-1" />
              <span className="text-xs text-gray-400">Delivery</span>
              <span className="text-sm font-bold">{selectedItem.deliveryTime}</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-gray-50 rounded-2xl flex-1">
              <Clock size={20} className="text-orange-500 mb-1" />
              <span className="text-xs text-gray-400">Prep Time</span>
              <span className="text-sm font-bold">{selectedItem.prepTime}</span>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="font-bold text-lg mb-2">Description</h3>
            <p className="text-gray-600 leading-relaxed">
              {selectedItem.description}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center bg-gray-100 rounded-full p-1">
              <motion.button 
                whileTap={{ scale: 0.8 }}
                onClick={() => removeFromCart(selectedItem.id)}
                className="p-2 bg-white rounded-full shadow-sm"
              >
                <Minus size={20} />
              </motion.button>
              <span className="px-4 font-bold">{cartItem?.quantity || 0}</span>
              <motion.button 
                whileTap={{ scale: 0.8 }}
                onClick={() => addToCart(selectedItem)}
                className="p-2 bg-emerald-500 text-white rounded-full shadow-lg shadow-emerald-500/30"
              >
                <Plus size={20} />
              </motion.button>
            </div>
            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (!cartItem) addToCart(selectedItem);
                setCurrentScreen('cart');
              }}
              className="flex-1 bg-emerald-500 text-white py-4 rounded-2xl font-bold shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-2"
            >
              <ShoppingCart size={20} />
              Add to Cart
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  const renderCart = () => (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-screen bg-[#f8f9fa] pb-32"
    >
      <header className="px-6 pt-8 pb-4 flex items-center gap-4">
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={() => setCurrentScreen('home')}
          className="p-2 bg-white rounded-full shadow-sm"
        >
          <ChevronLeft size={24} />
        </motion.button>
        <h1 className="text-2xl font-bold">My Cart</h1>
      </header>

      <div className="px-6 mt-6 space-y-4">
        {cart.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart size={40} className="text-gray-300" />
            </div>
            <p className="text-gray-500">Your cart is empty</p>
            <button 
              onClick={() => setCurrentScreen('home')}
              className="mt-4 text-emerald-500 font-bold"
            >
              Browse Food
            </button>
          </div>
        ) : (
          cart.map(item => (
            <motion.div 
              key={item.id}
              layout
              className="bg-white p-4 rounded-3xl flex items-center gap-4 shadow-sm border border-black/5"
            >
              <img src={item.image} className="w-20 h-20 rounded-2xl object-cover" referrerPolicy="no-referrer" />
              <div className="flex-1">
                <h3 className="font-bold">{item.name}</h3>
                <p className="text-xs text-gray-400">{item.restaurantName}</p>
                <p className="text-emerald-600 font-bold mt-1">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
              <div className="flex items-center bg-gray-50 rounded-full p-1">
                <button onClick={() => removeFromCart(item.id)} className="p-1"><Minus size={16} /></button>
                <span className="px-2 text-sm font-bold">{item.quantity}</span>
                <button onClick={() => addToCart(item)} className="p-1"><Plus size={16} /></button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white p-8 rounded-t-[40px] shadow-2xl border-t border-black/5">
          <div className="flex justify-between mb-6">
            <span className="text-gray-500">Total Price</span>
            <span className="text-2xl font-bold text-emerald-600">${cartTotal.toFixed(2)}</span>
          </div>
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={handleCheckout}
            className="w-full bg-emerald-500 text-white py-4 rounded-2xl font-bold shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-2"
          >
            Checkout
            <ArrowRight size={20} />
          </motion.button>
        </div>
      )}
    </motion.div>
  );

  const renderTracking = () => {
    if (!currentOrder) return null;

    const steps: OrderStatus[] = ['Preparing', 'Packed', 'Out for delivery', 'Delivered'];
    const currentStepIndex = steps.indexOf(currentOrder.status);

    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-[#f8f9fa]"
      >
        <header className="px-6 pt-8 pb-4 flex items-center justify-between">
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={() => setCurrentScreen('home')}
            className="p-2 bg-white rounded-full shadow-sm"
          >
            <ChevronLeft size={24} />
          </motion.button>
          <h1 className="text-xl font-bold">Track Order</h1>
          <div className="w-10" />
        </header>

        <div className="px-6 mt-6">
          {/* Status Stepper */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-black/5 mb-6">
            <div className="flex justify-between items-center mb-8">
              <div>
                <p className="text-sm text-gray-400">Estimated Delivery</p>
                <h2 className="text-2xl font-bold">12:55 PM</h2>
              </div>
              <div className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold">
                {currentOrder.status}
              </div>
            </div>

            <div className="relative flex justify-between">
              {/* Line */}
              <div className="absolute top-4 left-0 right-0 h-1 bg-gray-100 -z-0" />
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                className="absolute top-4 left-0 h-1 bg-emerald-500 -z-0" 
              />
              
              {steps.map((step, idx) => (
                <div key={step} className="flex flex-col items-center gap-2 relative z-10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    idx <= currentStepIndex ? 'bg-emerald-500 text-white' : 'bg-white border-2 border-gray-100 text-gray-300'
                  }`}>
                    {idx < currentStepIndex ? <CheckCircle2 size={16} /> : <span className="text-xs font-bold">{idx + 1}</span>}
                  </div>
                  <span className={`text-[10px] font-bold ${idx <= currentStepIndex ? 'text-gray-900' : 'text-gray-300'}`}>
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Agent */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-black/5 mb-6">
            <h3 className="font-bold mb-4">Delivery Agent</h3>
            <div className="flex items-center gap-4">
              <img src={currentOrder.deliveryAgent.photo} className="w-14 h-14 rounded-full" />
              <div className="flex-1">
                <h4 className="font-bold">{currentOrder.deliveryAgent.name}</h4>
                <div className="flex items-center gap-1">
                  <Star size={12} className="fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-semibold">{currentOrder.deliveryAgent.rating}</span>
                </div>
              </div>
              <motion.button 
                whileTap={{ scale: 0.9 }}
                className="p-3 bg-emerald-500 text-white rounded-full shadow-lg shadow-emerald-500/30"
              >
                <Phone size={20} />
              </motion.button>
            </div>
          </div>

          {/* Restaurant Info (When Packed or later) */}
          {currentStepIndex >= 1 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-3xl shadow-sm border border-black/5 mb-6"
            >
              <h3 className="font-bold mb-4">Restaurant Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Shopkeeper</span>
                  <span className="font-medium">{currentOrder.restaurantInfo.shopkeeperName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Address</span>
                  <span className="font-medium text-right max-w-[200px]">{currentOrder.restaurantInfo.address}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Ready Time</span>
                  <span className="font-medium">{currentOrder.restaurantInfo.readyTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Dispatch Time</span>
                  <span className="font-medium">{currentOrder.restaurantInfo.dispatchTime}</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Feedback Section (When Delivered) */}
          {currentOrder.status === 'Delivered' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-emerald-500 p-8 rounded-[40px] text-white text-center"
            >
              <h3 className="text-2xl font-bold mb-2">Enjoy your meal!</h3>
              <p className="opacity-80 mb-6">How was your experience today?</p>
              
              <div className="flex justify-center gap-2 mb-8">
                {[1, 2, 3, 4, 5].map(star => (
                  <motion.button
                    key={star}
                    whileTap={{ scale: 0.8 }}
                    onClick={() => handleFeedback(currentOrder.id, star, '')}
                    className="p-2"
                  >
                    <Star size={32} className="fill-white text-white" />
                  </motion.button>
                ))}
              </div>
              
              <button 
                onClick={() => setCurrentScreen('home')}
                className="bg-white text-emerald-500 px-8 py-3 rounded-2xl font-bold"
              >
                Back to Home
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    );
  };

  const renderHistory = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#f8f9fa] pb-24"
    >
      <header className="px-6 pt-8 pb-4 flex items-center gap-4">
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={() => setCurrentScreen('home')}
          className="p-2 bg-white rounded-full shadow-sm"
        >
          <ChevronLeft size={24} />
        </motion.button>
        <h1 className="text-2xl font-bold">Order History</h1>
      </header>

      <div className="px-6 mt-6 space-y-4">
        {orders.length === 0 ? (
          <p className="text-center text-gray-400 py-20">No orders yet</p>
        ) : (
          orders.map(order => (
            <div key={order.id} className="bg-white p-6 rounded-3xl shadow-sm border border-black/5">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold">{order.id}</h3>
                  <p className="text-xs text-gray-400">{new Date(order.timestamp).toLocaleDateString()}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                  order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'
                }`}>
                  {order.status}
                </div>
              </div>
              <div className="flex items-center gap-2 mb-2">
                {order.items.slice(0, 3).map(item => (
                  <img key={item.id} src={item.image} className="w-10 h-10 rounded-lg object-cover" referrerPolicy="no-referrer" />
                ))}
                {order.items.length > 3 && (
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold">
                    +{order.items.length - 3}
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mb-4 line-clamp-1">
                {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
              </p>
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg">${order.total.toFixed(2)}</span>
                <button 
                  onClick={() => {
                    setCurrentOrder(order);
                    setCurrentScreen('tracking');
                  }}
                  className="text-emerald-500 text-sm font-bold"
                >
                  View Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#f8f9fa] font-sans text-gray-900 shadow-2xl relative overflow-hidden">
      <AnimatePresence mode="wait">
        {currentScreen === 'home' && renderHome()}
        {currentScreen === 'detail' && renderDetail()}
        {currentScreen === 'cart' && renderCart()}
        {currentScreen === 'tracking' && renderTracking()}
        {currentScreen === 'history' && renderHistory()}
      </AnimatePresence>

      {/* Bottom Navigation (Only on Home/History) */}
      {(currentScreen === 'home' || currentScreen === 'history') && (
        <motion.nav 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white/80 backdrop-blur-lg border-t border-black/5 px-8 py-4 flex justify-between items-center z-20"
        >
          <button onClick={() => setCurrentScreen('home')} className={`flex flex-col items-center gap-1 ${currentScreen === 'home' ? 'text-emerald-500' : 'text-gray-400'}`}>
            <HomeIcon size={24} />
            <span className="text-[10px] font-bold">Home</span>
          </button>
          <div className="relative">
            <button onClick={() => setCurrentScreen('cart')} className="bg-emerald-500 text-white p-4 rounded-full -mt-12 shadow-xl shadow-emerald-500/30 border-4 border-[#f8f9fa]">
              <ShoppingCart size={24} />
            </button>
            {cartCount > 0 && (
              <span className="absolute -top-10 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                {cartCount}
              </span>
            )}
          </div>
          <button onClick={() => setCurrentScreen('history')} className={`flex flex-col items-center gap-1 ${currentScreen === 'history' ? 'text-emerald-500' : 'text-gray-400'}`}>
            <User size={24} />
            <span className="text-[10px] font-bold">Profile</span>
          </button>
        </motion.nav>
      )}
    </div>
  );
}
