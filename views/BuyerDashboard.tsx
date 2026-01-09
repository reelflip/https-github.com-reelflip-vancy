
import React, { useState } from 'react';
import { User, Order, OrderStatus, Product, Address, LogisticsPartner } from '../types.ts';

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
  user, orders, cart, wishlist, onAddToCart, onToggleWishlist
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'tracking'>('overview');
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);

  const buyerOrders = orders.filter(o => o.buyerId === user.id);

  const renderTracking = (order: Order) => {
    const steps = [
      { s: OrderStatus.PENDING, l: 'Order Received' },
      { s: OrderStatus.PROCESSING, l: 'Packing Piece' },
      { s: OrderStatus.SHIPPED, l: 'Handed to Logistics' },
      { s: OrderStatus.OUT_FOR_DELIVERY, l: 'Out for Delivery' },
      { s: OrderStatus.DELIVERED, l: 'Arrived at Destination' }
    ];
    
    const currentIndex = steps.findIndex(st => st.s === order.status);

    return (
      <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-2xl animate-in zoom-in-95 duration-700">
         <div className="flex justify-between items-start mb-16">
            <div>
               <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-1">Live Manifest: {order.id}</p>
               <h3 className="text-3xl font-black uppercase tracking-tighter">Logistics Tracking</h3>
            </div>
            <button onClick={() => setTrackingOrder(null)} className="text-[10px] font-black uppercase border-b border-black">Close Tracker</button>
         </div>

         <div className="grid grid-cols-5 gap-4 mb-20 relative">
            <div className="absolute top-4 left-0 right-0 h-1 bg-slate-100 -z-10" />
            {steps.map((step, idx) => (
              <div key={idx} className="flex flex-col items-center text-center">
                 <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-4 transition-all duration-1000 ${idx <= (currentIndex === -1 ? 0 : currentIndex) ? 'bg-black text-white' : 'bg-slate-50 text-slate-300'}`}>
                    {idx <= (currentIndex === -1 ? 0 : currentIndex) ? '✓' : idx + 1}
                 </div>
                 <p className={`text-[9px] font-black uppercase tracking-widest ${idx <= (currentIndex === -1 ? 0 : currentIndex) ? 'text-black' : 'text-slate-300'}`}>{step.l}</p>
              </div>
            ))}
         </div>

         <div className="p-10 bg-slate-50 rounded-[3rem] grid grid-cols-2 gap-10">
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Carrier Intelligence</p>
               <p className="text-lg font-bold">{order.logisticsPartner || 'Carrier Unassigned'}</p>
               <p className="text-xs font-mono text-slate-400 mt-2">{order.trackingId || 'Awaiting Airway Bill Generation'}</p>
            </div>
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Arrival Estimate</p>
               <p className="text-lg font-bold">{order.estimatedDelivery || 'Pending Dispatch'}</p>
               <p className="text-[9px] font-black text-green-600 uppercase mt-2">On-Time Projection</p>
            </div>
         </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col lg:flex-row gap-16">
      <aside className="lg:w-72 space-y-2">
         <div className="flex items-center gap-4 mb-10 pb-10 border-b border-slate-100">
            <img src={user.avatar} className="w-16 h-16 rounded-full" alt="" />
            <div>
               <h4 className="font-black text-slate-900 truncate">{user.name}</h4>
               <span className="text-[9px] font-black uppercase text-orange-600 tracking-widest">Premium Curator</span>
            </div>
         </div>
         {['overview', 'orders', 'wishlist'].map(t => (
           <button key={t} onClick={() => setActiveTab(t as any)} className={`w-full text-left px-8 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === t ? 'bg-black text-white shadow-xl' : 'text-slate-400 hover:bg-slate-50'}`}>
              {t}
           </button>
         ))}
      </aside>

      <main className="flex-grow">
         {trackingOrder ? renderTracking(trackingOrder) : (
           <div className="space-y-12 animate-in fade-in duration-700">
              <h2 className="text-5xl font-black uppercase tracking-tighter">Your Archive</h2>
              <div className="grid grid-cols-1 gap-6">
                {buyerOrders.map(o => (
                  <div key={o.id} className="bg-white p-10 rounded-[3rem] border border-slate-100 flex justify-between items-center group hover:shadow-2xl transition-all">
                     <div>
                        <p className="text-[9px] font-black text-orange-600 uppercase tracking-widest mb-2">Order ID: {o.id}</p>
                        <h4 className="text-lg font-bold mb-4">{o.items.map(i => i.productName).join(', ')}</h4>
                        <div className="flex gap-4 items-center">
                           <span className="text-[10px] font-black bg-slate-50 px-4 py-2 rounded-full uppercase tracking-widest text-slate-400">{o.status}</span>
                           <button onClick={() => setTrackingOrder(o)} className="text-[9px] font-black uppercase tracking-widest text-indigo-600 border-b border-indigo-600 pb-0.5">Track Parcel →</button>
                        </div>
                     </div>
                     <div className="text-right">
                        <p className="text-2xl font-black">₹{o.total.toLocaleString('en-IN')}</p>
                        <p className="text-[9px] font-black text-slate-300 uppercase mt-1">{new Date(o.date).toLocaleDateString()}</p>
                     </div>
                  </div>
                ))}
              </div>
           </div>
         )}
      </main>
    </div>
  );
};

export default BuyerDashboard;
