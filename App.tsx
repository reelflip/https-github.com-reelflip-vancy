
import React, { useState, useEffect } from 'react';
import { User, Product, UserRole, Order, UserStatus, OrderStatus, Address, PlatformSettings, PaymentStatus, LogisticsPartner } from './types.ts';
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
  
  // Checkout & Payment State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
  const [platformSettings, setPlatformSettings] = useState<PlatformSettings>({
    commissionPercentage: 12,
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

  // Fix: Added missing handleToggleWishlist function to manage the wishlist state
  const handleToggleWishlist = (p: Product) => {
    setWishlist(prev => {
      const exists = prev.find(item => item.id === p.id);
      if (exists) {
        return prev.filter(item => item.id !== p.id);
      }
      return [...prev, p];
    });
  };

  // MOCK PAYMENT API INTEGRATION
  const handleProcessPayment = async () => {
    if (cart.length === 0 || !currentUser) return;
    setIsProcessingPayment(true);
    
    // Simulate Gateway Response
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const orderTotal = cart.reduce((acc, curr) => acc + (curr.product.price * curr.quantity), 0);
    const newOrder: Order = {
      id: `NEX-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      buyerId: currentUser.id,
      date: new Date().toISOString(),
      total: orderTotal,
      status: OrderStatus.PENDING,
      paymentStatus: PaymentStatus.PAID,
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
      return cartItem ? { ...p, stock: Math.max(0, p.stock - cartItem.quantity) } : p;
    }));

    setCart([]);
    setIsProcessingPayment(false);
    setIsCheckoutOpen(false);
    window.location.hash = '#/buyer-dashboard';
    alert("Payment Successful. Order Confirmed!");
  };

  const handleAssignLogistics = async (orderId: string, partner: LogisticsPartner) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: OrderStatus.SHIPPED,
          logisticsPartner: partner,
          trackingId: `TRK-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          estimatedDelivery: new Date(Date.now() + 86400000 * 3).toLocaleDateString()
        };
      }
      return o;
    }));
  };

  const renderContent = () => {
    const visibleProducts = products.filter(p => p.isModerated);

    if (currentHash.startsWith('#/product/')) {
      const productId = currentHash.split('/').pop();
      const product = products.find(p => p.id === productId);
      if (product) return <ProductDetail product={product} onAddToCart={handleAddToCart} onBack={() => window.location.hash = '#/'} />;
    }

    switch (currentHash) {
      case '#/': 
      case '#/shop': return <Home products={visibleProducts} onAddToCart={handleAddToCart} />;
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
            onAssignLogistics={handleAssignLogistics}
          />
        ) : <Home products={visibleProducts} onAddToCart={handleAddToCart} />;
      case '#/buyer-dashboard':
        return currentUser ? (
          <BuyerDashboard 
            user={currentUser} orders={orders} cart={cart} wishlist={wishlist} 
            onUpdateOrderStatus={(oid, s) => setOrders(prev => prev.map(o => o.id === oid ? { ...o, status: s } : o))} 
            onAddToCart={handleAddToCart} onRemoveFromCart={handleRemoveFromCart} 
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
        const cartTotal = cart.reduce((acc, curr) => acc + (curr.product.price * curr.quantity), 0);
        return (
          <div className="max-w-4xl mx-auto px-4 py-20">
            <h1 className="text-5xl font-black mb-16 uppercase tracking-tighter">Your Bag</h1>
            {cart.length === 0 ? (
              <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-100">
                <p className="text-slate-300 font-black uppercase mb-6">Bag Empty</p>
                <button onClick={() => window.location.hash = '#/'} className="text-black border-b-2 border-black pb-1 uppercase text-xs font-black">Shop Now</button>
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
                        <div className="mt-4 flex items-center gap-3">
                           <button onClick={() => handleRemoveFromCart(item.product.id)} className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center font-bold hover:bg-slate-50">-</button>
                           <span className="font-bold w-6 text-center">{item.quantity}</span>
                           <button onClick={() => handleAddToCart(item.product)} className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center font-bold hover:bg-slate-50">+</button>
                        </div>
                      </div>
                    </div>
                    <p className="text-2xl font-black text-slate-900">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</p>
                  </div>
                ))}
                <div className="pt-16 flex flex-col items-end gap-6">
                   <div className="text-right">
                      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Total Due</p>
                      <p className="text-6xl font-black text-slate-900">₹{cartTotal.toLocaleString('en-IN')}</p>
                   </div>
                   <button onClick={() => setIsCheckoutOpen(true)} className="bg-black text-white px-20 py-7 rounded-full font-black text-xl shadow-2xl hover:scale-105 active:scale-95 transition-all uppercase tracking-widest">Proceed to Checkout</button>
                </div>
              </div>
            )}
            
            {/* PAYMENT GATEWAY SIMULATION */}
            {isCheckoutOpen && (
              <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[100] flex items-center justify-center p-6">
                <div className="bg-white rounded-[4rem] w-full max-w-xl p-16 animate-in zoom-in-95 duration-500 shadow-3xl">
                  <div className="text-center mb-12">
                     <div className="inline-block bg-slate-50 p-6 rounded-full mb-6">
                        <svg className="w-10 h-10 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                     </div>
                     <h2 className="text-3xl font-black uppercase tracking-tighter">Secure Payment</h2>
                     <p className="text-slate-400 text-sm font-bold mt-2 uppercase">Nexus SecureGateway — Amount: ₹{cartTotal.toLocaleString('en-IN')}</p>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Card Number</label>
                      <input disabled={isProcessingPayment} placeholder="**** **** **** 4455" className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-bold" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div>
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Expiry</label>
                          <input disabled={isProcessingPayment} placeholder="MM/YY" className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-bold" />
                       </div>
                       <div>
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">CVV</label>
                          <input disabled={isProcessingPayment} placeholder="***" type="password" className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-bold" />
                       </div>
                    </div>
                  </div>

                  <div className="mt-12 space-y-4">
                    <button 
                      onClick={handleProcessPayment} 
                      disabled={isProcessingPayment}
                      className="w-full bg-black text-white py-6 rounded-3xl font-black uppercase tracking-widest text-sm shadow-xl hover:bg-slate-800 disabled:opacity-50 transition-all"
                    >
                      {isProcessingPayment ? 'Authorizing...' : 'Pay Securely'}
                    </button>
                    <button onClick={() => setIsCheckoutOpen(false)} className="w-full text-slate-400 text-[10px] font-black uppercase tracking-widest">Cancel Transaction</button>
                  </div>
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
    </Layout>
  );
};

export default App;
