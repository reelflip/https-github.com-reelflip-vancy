
import React, { useState } from 'react';
import { User, Order, OrderStatus, Product, Address } from '../types.ts';

interface BuyerDashboardProps {
  user: User;
  orders: Order[];
  cart: { product: Product; quantity: number }[];
  wishlist: Product[];
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onAddToCart: (p: Product) => void;
  onRemoveFromCart: (productId: string) => void;
  onAddAddress: (addr: Omit<Address, 'id'>) => void;
  onRemoveAddress: (id: string) => void;
  onToggleWishlist: (p: Product) => void;
}

const BuyerDashboard: React.FC<BuyerDashboardProps> = ({ 
  user, orders, cart, wishlist, onUpdateOrderStatus, onAddToCart, onRemoveFromCart, onAddAddress, onRemoveAddress, onToggleWishlist
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'wishlist' | 'addresses'>('overview');
  const [showAddrForm, setShowAddrForm] = useState(false);
  const [newAddr, setNewAddr] = useState<Omit<Address, 'id'>>({ type: 'Home', street: '', city: '', zip: '' });

  const buyerOrders = orders.filter(o => o.buyerId === user.id);

  const renderAddresses = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-3xl font-black text-slate-900">Delivery Addresses</h3>
        <button onClick={() => setShowAddrForm(true)} className="bg-black text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">Add New</button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {user.addresses.map(addr => (
          <div key={addr.id} className="bg-white p-8 rounded-[2rem] border border-slate-200 relative group">
            <span className="text-[10px] font-black uppercase tracking-widest bg-slate-100 px-2 py-1 rounded mb-4 inline-block">{addr.type}</span>
            <p className="font-bold text-slate-800">{addr.street}</p>
            <p className="text-sm text-slate-500">{addr.city}, {addr.zip}</p>
            <button onClick={() => onRemoveAddress(addr.id)} className="absolute top-8 right-8 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth="2"/></svg>
            </button>
          </div>
        ))}
      </div>

      {showAddrForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-md p-8">
            <h4 className="text-xl font-black mb-6">New Indian Address</h4>
            <div className="space-y-4">
              <select className="w-full bg-slate-50 border-none rounded-xl py-3 px-4" value={newAddr.type} onChange={e => setNewAddr({...newAddr, type: e.target.value as any})}>
                <option>Home</option><option>Work</option><option>Other</option>
              </select>
              <input placeholder="Flat, Street, Area" className="w-full bg-slate-50 border-none rounded-xl py-3 px-4" value={newAddr.street} onChange={e => setNewAddr({...newAddr, street: e.target.value})}/>
              <div className="grid grid-cols-2 gap-4">
                <input placeholder="City" className="w-full bg-slate-50 border-none rounded-xl py-3 px-4" value={newAddr.city} onChange={e => setNewAddr({...newAddr, city: e.target.value})}/>
                <input placeholder="Pincode" className="w-full bg-slate-50 border-none rounded-xl py-3 px-4" value={newAddr.zip} onChange={e => setNewAddr({...newAddr, zip: e.target.value})}/>
              </div>
              <div className="flex gap-4 pt-4">
                <button onClick={() => setShowAddrForm(false)} className="flex-1 py-3 rounded-xl bg-slate-100 font-bold">Cancel</button>
                <button onClick={() => { onAddAddress(newAddr); setShowAddrForm(false); }} className="flex-1 py-3 rounded-xl bg-black text-white font-bold">Save Address</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderWishlist = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h3 className="text-3xl font-black text-slate-900">Saved Pieces</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {wishlist.map(p => (
          <div key={p.id} className="group relative">
            <div className="aspect-[3/4] rounded-3xl overflow-hidden bg-slate-100 mb-4">
              <img src={p.images[0]} className="w-full h-full object-cover" alt="" />
              <button onClick={() => onToggleWishlist(p)} className="absolute top-4 right-4 bg-white/80 p-2 rounded-full text-red-500">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
              </button>
            </div>
            <h4 className="font-bold text-sm">{p.name}</h4>
            <p className="text-sm font-black">₹{p.price.toLocaleString('en-IN')}</p>
            <button onClick={() => onAddToCart(p)} className="mt-2 w-full bg-black text-white py-2 rounded-xl text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Add to Bag</button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col lg:flex-row gap-12">
      <aside className="lg:w-64 space-y-1">
        <div className="p-6 mb-4 flex items-center gap-4 border-b border-slate-100">
          <img src={user.avatar} className="w-12 h-12 rounded-full" alt="" />
          <div><p className="font-black text-sm truncate w-32">{user.name}</p><p className="text-[10px] font-bold text-slate-400 uppercase">Platinum Member</p></div>
        </div>
        {[
          { id: 'overview', label: 'Dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6z' },
          { id: 'orders', label: 'My Orders', icon: 'M16 11V7a4 4 0 118 0m-4 4v2' },
          { id: 'wishlist', label: 'Wishlist', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364' },
          { id: 'addresses', label: 'Addresses', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' }
        ].map(item => (
          <button key={item.id} onClick={() => setActiveTab(item.id as any)} className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-sm transition-all ${activeTab === item.id ? 'bg-black text-white' : 'text-slate-500 hover:bg-slate-100'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d={item.icon} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            {item.label}
          </button>
        ))}
      </aside>
      <main className="flex-1">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="bg-slate-900 text-white p-12 rounded-[3rem] relative overflow-hidden">
              <h3 className="text-4xl font-light mb-4">Namaste, <span className="font-bold">{user.name.split(' ')[0]}</span></h3>
              <p className="text-slate-400 max-w-sm">Welcome to your personal Indian craft archive. Track your festive orders and wishlist here.</p>
              <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/20 blur-[80px]"></div>
            </div>
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-white p-8 rounded-3xl border border-slate-100 text-center"><p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Orders</p><p className="text-3xl font-black">{buyerOrders.length}</p></div>
              <div className="bg-white p-8 rounded-3xl border border-slate-100 text-center"><p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Wishlist</p><p className="text-3xl font-black">{wishlist.length}</p></div>
              <div className="bg-white p-8 rounded-3xl border border-slate-100 text-center"><p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Tier</p><p className="text-xs font-black bg-orange-100 text-orange-700 px-2 py-1 rounded inline-block mt-2">PREMIUM</p></div>
            </div>
          </div>
        )}
        {activeTab === 'wishlist' && renderWishlist()}
        {activeTab === 'addresses' && renderAddresses()}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <h3 className="text-3xl font-black text-slate-900">Your Orders</h3>
            {buyerOrders.map(o => (
              <div key={o.id} className="bg-white p-8 rounded-3xl border border-slate-100 flex justify-between items-center group">
                <div>
                  <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest">ORDER #{o.id}</p>
                  <p className="text-sm text-slate-500">{new Date(o.date).toLocaleDateString()}</p>
                  <p className="mt-2 font-bold text-slate-800">{o.items.map(i => i.productName).join(', ')}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black">₹{o.total.toLocaleString('en-IN')}</p>
                  <span className="text-[10px] font-black bg-slate-100 px-3 py-1 rounded-full uppercase">{o.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default BuyerDashboard;