
import React, { useState } from 'react';
import { User, Product, UserRole, UserStatus, Order, PlatformSettings, OrderStatus, LogisticsPartner, PaymentStatus } from '../types.ts';

interface AdminDashboardProps {
  users: User[];
  products: Product[];
  orders: Order[];
  platformSettings: PlatformSettings;
  onUpdatePlatformSettings: (settings: PlatformSettings) => void;
  onUpdateUserStatus: (userId: string, status: UserStatus) => void;
  onUpdateProductModeration: (productId: string, moderated: boolean) => void;
  onDeleteProduct: (productId: string) => void;
  onAssignLogistics: (orderId: string, partner: LogisticsPartner) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  users, products, orders, platformSettings, onUpdatePlatformSettings, onUpdateUserStatus, onUpdateProductModeration, onDeleteProduct, onAssignLogistics 
}) => {
  const [activeTab, setActiveTab] = useState<'stats' | 'logistics' | 'inventory' | 'users' | 'partners'>('stats');

  // Simulated state for Partner Registry (In a real app, these would come from props/DB)
  const [partners, setPartners] = useState({
    logistics: [
      { id: '1', name: 'Delhivery', status: 'Active', apiEndpoint: 'api.delhivery.com/v3' },
      { id: '2', name: 'BlueDart', status: 'Active', apiEndpoint: 'api.bluedart.com/ship' },
      { id: '3', name: 'Nexus FastTrack', status: 'Maintenance', apiEndpoint: 'internal.nexus.logistics' }
    ],
    payments: [
      { id: '1', name: 'Nexus Pay (Internal)', status: 'Active', method: 'Direct API' },
      { id: '2', name: 'Razorpay Integration', status: 'Active', method: 'Webhook' },
      { id: '3', name: 'Stripe Gateway', status: 'Inactive', method: 'Redirect' }
    ]
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 mb-20">
        <div>
          <h1 className="text-6xl font-black text-slate-900 uppercase tracking-tighter">Command Panel</h1>
          <p className="text-slate-400 font-bold uppercase tracking-[0.5em] text-[10px] mt-2">Platform Governance & Global Fulfillment</p>
        </div>
        <nav className="bg-slate-100 p-1.5 rounded-[2.5rem] flex flex-wrap gap-1">
          {['stats', 'logistics', 'inventory', 'users', 'partners'].map(t => (
            <button 
              key={t} 
              onClick={() => setActiveTab(t as any)} 
              className={`px-8 py-4 rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === t ? 'bg-white shadow-xl text-black scale-105' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {t}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'stats' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { label: 'Platform GMV', val: `₹${orders.reduce((a,c)=>a+c.total,0).toLocaleString('en-IN')}`, sub: 'Lifetime Volume' },
            { label: 'Active Catalog', val: products.length, sub: 'Verified Listings' },
            { label: 'Global Users', val: users.length, sub: `${users.filter(u=>u.role===UserRole.SELLER).length} Professional Sellers` },
            { label: 'Fulfillment Rate', val: '94.2%', sub: 'Avg. 2.4 Days Delivery' }
          ].map((stat, i) => (
            <div key={i} className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm group hover:shadow-2xl transition-all duration-500">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 group-hover:text-orange-600 transition-colors">{stat.label}</p>
               <p className="text-5xl font-black tracking-tighter text-slate-900 mb-2">{stat.val}</p>
               <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{stat.sub}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'logistics' && (
        <div className="space-y-10">
          <div className="bg-slate-900 rounded-[3rem] p-10 flex justify-between items-center text-white">
            <div>
               <h3 className="text-2xl font-black uppercase tracking-tighter">Operational Pipeline</h3>
               <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">Awaiting Courier Assignment</p>
            </div>
            <div className="flex gap-4">
               <span className="bg-white/10 px-6 py-3 rounded-2xl text-xs font-bold border border-white/10">{orders.filter(o => o.status === OrderStatus.PENDING).length} Pending</span>
            </div>
          </div>
          
          <div className="bg-white rounded-[3.5rem] border border-slate-100 overflow-hidden shadow-sm">
            <table className="w-full text-left">
               <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                  <tr><th className="px-10 py-8">Ref ID</th><th className="px-10 py-8">Origin (Seller)</th><th className="px-10 py-8">Destination</th><th className="px-10 py-8">Carrier</th><th className="px-10 py-8">Action</th></tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {orders.map(o => {
                    const seller = users.find(u => u.id === o.items[0]?.sellerId);
                    return (
                      <tr key={o.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-10 py-8 font-mono text-[10px] text-orange-600 font-bold">{o.id}</td>
                        <td className="px-10 py-8">
                           <p className="text-sm font-black text-slate-900">{seller?.name || 'Nexus Warehouse'}</p>
                           <p className="text-[10px] text-slate-400 font-bold uppercase">{seller?.email}</p>
                        </td>
                        <td className="px-10 py-8">
                           <p className="text-sm font-bold text-slate-600">Premium Shipping</p>
                           <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">Domestic Hub-to-Door</p>
                        </td>
                        <td className="px-10 py-8">
                           <span className={`text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest ${o.logisticsPartner ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'}`}>
                             {o.logisticsPartner || 'WAITING'}
                           </span>
                        </td>
                        <td className="px-10 py-8">
                          {!o.logisticsPartner && o.paymentStatus === PaymentStatus.PAID ? (
                             <div className="flex gap-2">
                                {Object.values(LogisticsPartner).map(lp => (
                                  <button key={lp} onClick={() => onAssignLogistics(o.id, lp)} className="px-4 py-2 bg-black text-white text-[8px] font-black uppercase rounded-xl hover:bg-orange-600 transition-all">Assign {lp}</button>
                                ))}
                             </div>
                          ) : (
                            <button className="text-[10px] font-black uppercase border border-slate-200 px-6 py-2 rounded-xl text-slate-400 cursor-default">In Transit</button>
                          )}
                        </td>
                      </tr>
                    )
                  })}
               </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'inventory' && (
        <div className="space-y-12">
           <div className="flex justify-between items-end">
              <h3 className="text-3xl font-black uppercase tracking-tighter">Global Inventory Moderation</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reviewing {products.length} listed pieces</p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map(p => {
                const seller = users.find(u => u.id === p.sellerId);
                return (
                  <div key={p.id} className="bg-white p-8 rounded-[3rem] border border-slate-100 group shadow-sm flex flex-col">
                    <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden mb-6">
                       <img src={p.images[0]} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" alt="" />
                       <div className="absolute top-4 right-4">
                          <button onClick={() => onUpdateProductModeration(p.id, !p.isModerated)} className={`p-3 rounded-full shadow-xl transition-all ${p.isModerated ? 'bg-green-500 text-white' : 'bg-white text-slate-300'}`}>
                             {p.isModerated ? '✓' : '!'}
                          </button>
                       </div>
                    </div>
                    <div className="flex-grow">
                       <p className="text-[10px] font-black text-orange-600 uppercase mb-2 tracking-widest">{seller?.name || 'NXS-Official'}</p>
                       <h4 className="font-bold text-slate-900 truncate mb-1">{p.name}</h4>
                       <p className="text-xl font-black mb-6">₹{p.price.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                       <button onClick={() => onUpdateProductModeration(p.id, true)} className="bg-slate-50 text-[9px] font-black uppercase tracking-widest py-3 rounded-xl hover:bg-slate-100">Approve</button>
                       <button onClick={() => onDeleteProduct(p.id)} className="bg-red-50 text-red-500 text-[9px] font-black uppercase tracking-widest py-3 rounded-xl hover:bg-red-100">Ban Piece</button>
                    </div>
                  </div>
                )
              })}
           </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-white rounded-[3.5rem] border border-slate-100 overflow-hidden shadow-sm">
           <table className="w-full text-left">
              <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                 <tr><th className="px-10 py-8">User Profile</th><th className="px-10 py-8">Authority Level</th><th className="px-10 py-8">Status Registry</th><th className="px-10 py-8">Governance</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                 {users.map(u => (
                   <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-10 py-8 flex items-center gap-4">
                         <img src={u.avatar} className="w-12 h-12 rounded-full ring-2 ring-slate-100" alt="" />
                         <div>
                            <p className="text-sm font-black text-slate-900">{u.name}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">{u.email}</p>
                         </div>
                      </td>
                      <td className="px-10 py-8">
                         <span className={`text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest ${u.role === UserRole.ADMIN ? 'bg-purple-100 text-purple-700' : u.role === UserRole.SELLER ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'}`}>
                           {u.role}
                         </span>
                      </td>
                      <td className="px-10 py-8">
                         <span className={`text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest ${u.status === UserStatus.APPROVED ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                           {u.status}
                         </span>
                      </td>
                      <td className="px-10 py-8">
                        <div className="flex gap-2">
                           <button onClick={() => onUpdateUserStatus(u.id, UserStatus.APPROVED)} className="bg-black text-white px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all">Verify</button>
                           <button onClick={() => onUpdateUserStatus(u.id, UserStatus.SUSPENDED)} className="border border-slate-200 text-slate-400 px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest hover:border-red-500 hover:text-red-500 transition-all">Suspend</button>
                        </div>
                      </td>
                   </tr>
                 ))}
              </tbody>
           </table>
        </div>
      )}

      {activeTab === 'partners' && (
        <div className="space-y-16">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Logistics Partner Management */}
              <div className="space-y-8">
                 <div className="flex justify-between items-end">
                    <h3 className="text-2xl font-black uppercase tracking-tighter">Logistics API Registry</h3>
                    <button className="text-[10px] font-black uppercase bg-slate-900 text-white px-6 py-3 rounded-full hover:scale-105 active:scale-95 transition-all">+ Add Carrier</button>
                 </div>
                 <div className="bg-white rounded-[3rem] border border-slate-100 overflow-hidden shadow-sm">
                    {partners.logistics.map(p => (
                      <div key={p.id} className="p-8 border-b border-slate-50 flex justify-between items-center hover:bg-slate-50 transition-all">
                         <div>
                            <h4 className="font-bold text-slate-900">{p.name}</h4>
                            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-tighter">{p.apiEndpoint}</p>
                         </div>
                         <div className="flex items-center gap-6">
                            <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-full ${p.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-400'}`}>{p.status}</span>
                            <button className="w-10 h-10 rounded-full hover:bg-slate-200 flex items-center justify-center transition-all">⚙</button>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>

              {/* Payment Gateway Management */}
              <div className="space-y-8">
                 <div className="flex justify-between items-end">
                    <h3 className="text-2xl font-black uppercase tracking-tighter">Gateway Config</h3>
                    <button className="text-[10px] font-black uppercase bg-slate-900 text-white px-6 py-3 rounded-full hover:scale-105 active:scale-95 transition-all">+ New Gateway</button>
                 </div>
                 <div className="bg-white rounded-[3rem] border border-slate-100 overflow-hidden shadow-sm">
                    {partners.payments.map(p => (
                      <div key={p.id} className="p-8 border-b border-slate-50 flex justify-between items-center hover:bg-slate-50 transition-all">
                         <div>
                            <h4 className="font-bold text-slate-900">{p.name}</h4>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{p.method}</p>
                         </div>
                         <div className="flex items-center gap-6">
                            <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-full ${p.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-400'}`}>{p.status}</span>
                            <button className="w-10 h-10 rounded-full hover:bg-slate-200 flex items-center justify-center transition-all">⚙</button>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>

           {/* Platform Logic Configuration */}
           <div className="bg-slate-50 p-16 rounded-[4rem] border border-slate-200">
              <h3 className="text-3xl font-black uppercase tracking-tighter mb-12">Core Platform Logic</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
                 <div>
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 block mb-6">Marketplace Commission (%)</label>
                    <input type="number" className="w-full bg-white border border-slate-200 rounded-3xl py-6 px-10 text-xl font-black outline-none focus:border-orange-600 transition-all" value={platformSettings.commissionPercentage} onChange={e => onUpdatePlatformSettings({...platformSettings, commissionPercentage: parseFloat(e.target.value)})}/>
                    <p className="text-[10px] font-bold text-slate-300 uppercase mt-4">Current platform take per transaction</p>
                 </div>
                 <div>
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 block mb-6">Global GST / VAT Logic (%)</label>
                    <input type="number" className="w-full bg-white border border-slate-200 rounded-3xl py-6 px-10 text-xl font-black outline-none focus:border-orange-600 transition-all" value={platformSettings.gstPercentage} onChange={e => onUpdatePlatformSettings({...platformSettings, gstPercentage: parseFloat(e.target.value)})}/>
                    <p className="text-[10px] font-bold text-slate-300 uppercase mt-4">Taxation standard applied across all SKUs</p>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
