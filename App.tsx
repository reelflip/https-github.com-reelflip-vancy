
import React, { useState, useEffect } from 'react';
import { User, Product, UserRole, Order, UserStatus, OrderStatus, Address, PlatformSettings } from './types.ts';
import { INITIAL_PRODUCTS, MOCK_USERS, INITIAL_ORDERS } from './constants.tsx';
import Layout from './components/Layout.tsx';
import Home from './views/Home.tsx';
import SellerDashboard from './views/SellerDashboard.tsx';
import AdminDashboard from './views/AdminDashboard.tsx';
import BuyerDashboard from './views/BuyerDashboard.tsx';
import ProductDetail from './views/ProductDetail.tsx';
import { getShoppingAdvice } from './services/geminiService.ts';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(MOCK_USERS[0]);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [cart, setCart] = useState<{product: Product, quantity: number}[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [currentHash, setCurrentHash] = useState(window.location.hash || '#/');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [aiQuery, setAiQuery] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);
  
  // Platform-wide configurations
  const [platformSettings, setPlatformSettings] = useState<PlatformSettings>({
    commissionPercentage: 12, // Default 12%
    gstPercentage: 18
  });

  useEffect(() => {
    const handleHashChange = () => setCurrentHash(window.location.hash || '#/');
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleSwitchRole = (role: UserRole) => {
    const user = users.find(u => u.role === role) || users[0];
    setCurrentUser(user);
    if (role === UserRole.SELLER) window.location.hash = '#/seller-dashboard';
    else if (role === UserRole.ADMIN) window.location.hash = '#/admin-dashboard';
    else if (role === UserRole.BUYER) window.location.hash = '#/buyer-dashboard';
    else window.location.hash = '#/';
  };

  const handleAddToCart = (p: Product) => {
    if (p.stock <= 0) return alert("Item is out of stock!");
    setCart(prev => {
      const existing = prev.find(item => item.product.id === p.id);
      return existing ? prev.map(item => item.product.id === p.id ? { ...item, quantity: item.quantity + 1 } : item) : [...prev, { product: p, quantity: 1 }];
    });
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === productId);
      if (existing && existing.quantity > 1) return prev.map(item => item.product.id === productId ? { ...item, quantity: item.quantity - 1 } : item);
      return prev.filter(item => item.product.id !== productId);
    });
  };

  const handleToggleWishlist = (p: Product) => {
    setWishlist(prev => {
      const isWishlisted = prev.find(item => item.id === p.id);
      if (isWishlisted) {
        return prev.filter(item => item.id !== p.id);
      } else {
        return [...prev, p];
      }
    });
  };

  const askAi = async () => {
    if (!aiQuery.trim()) return;
    setIsAiLoading(true);
    try {
      const response = await getShoppingAdvice(aiQuery, products);
      setAiResponse(response);
    } catch (error) {
      console.error("AI Error:", error);
      setAiResponse("I'm sorry, I'm having trouble getting recommendations right now.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (cart.length === 0 || !currentUser) return;
    
    setIsProcessingCheckout(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    const orderTotal = cart.reduce((acc, curr) => acc + (curr.product.price * curr.quantity), 0);
    
    const newOrder: Order = {
      id: `ORD-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      buyerId: currentUser.id,
      date: new Date().toISOString(),
      total: orderTotal,
      status: OrderStatus.PENDING,
      items: cart.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        sellerId: item.product.sellerId
      }))
    };

    setOrders(prev => [newOrder, ...prev]);

    setProducts(prev => prev.map(p => {
      const cartItem = cart.find(ci => ci.product.id === p.id);
      if (cartItem) {
        return { ...p, stock: Math.max(0, p.stock - cartItem.quantity) };
      }
      return p;
    }));

    setCart([]);
    setIsProcessingCheckout(false);
    alert("Order Successful! Your selection is being prepared.");
    window.location.hash = '#/buyer-dashboard';
  };

  const renderContent = () => {
    const visibleProducts = products.filter(p => p.isModerated);

    if (currentHash.startsWith('#/product/')) {
      const productId = currentHash.split('/').pop();
      const product = products.find(p => p.id === productId);
      if (product) {
        return <ProductDetail product={product} onAddToCart={handleAddToCart} onBack={() => window.location.hash = '#/'} />;
      }
    }

    switch (currentHash) {
      case '#/': 
      case '#/shop':
        return <Home products={visibleProducts} onAddToCart={handleAddToCart} />;
      case '#/seller-dashboard':
        return currentUser?.role === UserRole.SELLER || currentUser?.role === UserRole.ADMIN ? (
          <SellerDashboard 
            user={currentUser} 
            products={products} 
            orders={orders} 
            platformSettings={platformSettings}
            onAddProduct={(newP) => setProducts(prev => [{ ...newP, id: `f${Math.random().toString(36).substr(2, 5)}`, reviews: [] }, ...prev])} 
            onUpdateProduct={(up) => setProducts(prev => prev.map(p => p.id === up.id ? up : p))} 
            onDeleteProduct={id => setProducts(p => p.filter(x => x.id !== id))} 
            onUpdateOrderStatus={(oid, s) => setOrders(prev => prev.map(o => o.id === oid ? { ...o, status: s } : o))} 
          />
        ) : <Home products={visibleProducts} onAddToCart={handleAddToCart} />;
      case '#/admin-dashboard':
        return currentUser?.role === UserRole.ADMIN ? (
          <AdminDashboard 
            users={users} 
            products={products} 
            orders={orders} 
            platformSettings={platformSettings}
            onUpdatePlatformSettings={setPlatformSettings}
            onUpdateUserStatus={(uid, s) => setUsers(prev => prev.map(u => u.id === uid ? { ...u, status: s } : u))} 
            onUpdateProductModeration={(id, mod) => setProducts(prev => prev.map(p => p.id === id ? { ...p, isModerated: mod } : p))} 
            onDeleteProduct={id => setProducts(p => p.filter(x => x.id !== id))} 
          />
        ) : <Home products={visibleProducts} onAddToCart={handleAddToCart} />;
      case '#/buyer-dashboard':
        return currentUser ? (
          <BuyerDashboard 
            user={currentUser} 
            orders={orders} 
            cart={cart} 
            wishlist={wishlist} 
            onUpdateOrderStatus={(oid, s) => setOrders(prev => prev.map(o => o.id === oid ? { ...o, status: s } : o))} 
            onAddToCart={handleAddToCart} 
            onRemoveFromCart={handleRemoveFromCart} 
            onAddAddress={(addr) => {
              const na = { ...addr, id: Math.random().toString(36).substr(2, 5) };
              setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, addresses: [...u.addresses, na] } : u));
              setCurrentUser(prev => prev ? { ...prev, addresses: [...prev.addresses, na] } : null);
            }} 
            onRemoveAddress={(id) => {
              setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, addresses: u.addresses.filter(a => a.id !== id) } : u));
              setCurrentUser(prev => prev ? { ...prev, addresses: prev.addresses.filter(a => a.id !== id) } : null);
            }} 
            onToggleWishlist={handleToggleWishlist} 
          />
        ) : <Home products={visibleProducts} onAddToCart={handleAddToCart} />;
      case '#/cart':
        return (
          <div className="max-w-4xl mx-auto px-4 py-20 animate-in fade-in duration-700">
            <h1 className="text-5xl font-black mb-16 uppercase tracking-tighter">Your Bag</h1>
            {cart.length === 0 ? (
              <div className="text-center py-20 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
                <p className="text-slate-400 font-bold mb-6">EMPTY BAG</p>
                <button onClick={() => window.location.hash = '#/'} className="text-black border-b-2 border-black pb-1 uppercase text-xs font-black tracking-widest">Start Shopping</button>
              </div>
            ) : (
              <div className="space-y-6">
                {cart.map(item => (
                  <div key={item.product.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-6">
                      <img src={item.product.images[0]} className="w-24 h-24 rounded-[2rem] object-cover" alt="" />
                      <div>
                        <h4 className="text-lg font-bold text-slate-900">{item.product.name}</h4>
                        <p className="text-xs text-slate-400 uppercase font-bold">{item.product.brand}</p>
                        <div className="mt-2 flex items-center gap-3">
                           <button onClick={() => handleRemoveFromCart(item.product.id)} className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center font-bold">-</button>
                           <span className="font-bold">{item.quantity}</span>
                           <button onClick={() => handleAddToCart(item.product)} className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center font-bold">+</button>
                        </div>
                      </div>
                    </div>
                    <p className="text-2xl font-black text-slate-900">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</p>
                  </div>
                ))}
                <div className="pt-10 flex flex-col items-end gap-6">
                   <div className="text-right">
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Total Amount</p>
                      <p className="text-6xl font-black text-slate-900">₹{cart.reduce((acc, curr) => acc + (curr.product.price * curr.quantity), 0).toLocaleString('en-IN')}</p>
                   </div>
                   <button 
                    onClick={handleCheckout} 
                    disabled={isProcessingCheckout}
                    className={`bg-black text-white px-16 py-6 rounded-full font-black text-xl shadow-2xl transition-all uppercase tracking-[0.2em] ${isProcessingCheckout ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}`}
                   >
                    {isProcessingCheckout ? 'Processing...' : 'Place Order'}
                   </button>
                </div>
              </div>
            )}
          </div>
        );
      default: return <Home products={visibleProducts} onAddToCart={handleAddToCart} />;
    }
  };

  return (
    <Layout user={currentUser} onLogout={() => setCurrentUser(null)} onSwitchRole={handleSwitchRole} cartCount={cart.reduce((a, c) => a + c.quantity, 0)}>
      {renderContent()}
      <div className="fixed bottom-8 right-8 z-50">
        <div className="relative group">
          <button className="w-16 h-16 bg-black text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all active:scale-95">
             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" strokeWidth="2"/></svg>
          </button>
          <div className="absolute bottom-20 right-0 w-80 bg-white rounded-[2rem] shadow-2xl border border-slate-100 p-8 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
            <h4 className="font-bold text-slate-900 mb-2">Nexus Shopping AI</h4>
            <div className="space-y-4">
              {aiResponse && <div className="bg-slate-50 p-4 rounded-xl text-xs text-slate-800 leading-relaxed max-h-40 overflow-y-auto">{aiResponse}</div>}
              <div className="flex gap-2">
                <input type="text" className="flex-grow bg-slate-50 border-none rounded-xl px-4 py-2 text-sm outline-none" placeholder="Ask about styles..." value={aiQuery} onChange={e => setAiQuery(e.target.value)} onKeyPress={e => e.key === 'Enter' && askAi()}/>
                <button onClick={askAi} disabled={isAiLoading} className="bg-black text-white p-2 rounded-xl">{isAiLoading ? '...' : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeWidth="2"/></svg>}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default App;