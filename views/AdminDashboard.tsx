
import React, { useState } from 'react';
import { User, Product, UserRole, UserStatus, Order, Campaign, PlatformSettings } from '../types.ts';

interface AdminDashboardProps {
  users: User[];
  products: Product[];
  orders: Order[];
  platformSettings: PlatformSettings;
  onUpdatePlatformSettings: (settings: PlatformSettings) => void;
  onUpdateUserStatus: (userId: string, status: UserStatus) => void;
  onUpdateProductModeration: (productId: string, moderated: boolean) => void;
  onDeleteProduct: (productId: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  users, products, orders, platformSettings, onUpdatePlatformSettings, onUpdateUserStatus, onUpdateProductModeration, onDeleteProduct 
}) => {
  const [activeTab, setActiveTab] = useState<'stats' | 'users' | 'moderation' | 'governance' | 'orders' | 'inventory'>('stats');
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    { id: 'c1', title: 'Diwali Festive Launch', discountCode: 'FESTIVE50', isActive: true }
  ]);

  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);

  // Helper to calculate inventory breakdown
  const getInventoryBreakdown = () => {
    const breakdown: Record<string, Record<string, { count: number, totalStock: number, lowStock: number }>> = {};
    
    products.forEach(p => {
      const cat = p.category;
      const sub = p.subcategory || 'Uncategorized';
      
      if (!breakdown[cat]) breakdown[cat] = {};
      if (!breakdown[cat][sub]) breakdown[cat][sub] = { count: 0, totalStock: 0, lowStock: 0 };
      
      breakdown[cat][sub].count += 1;
      breakdown[cat][sub].totalStock += p.stock;
      if (p.stock < 10) breakdown[cat][sub].lowStock += 1;
    });
    
    return breakdown;
  };

  const inventoryData = getInventoryBreakdown();

  const renderInventoryBreakdown = () => (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {Object.entries(inventoryData).map(([category, subcategories]) => (
          <div key={category} className="bg-white rounded-[3rem] border border-slate-100 p-10 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-900">{category} Fashion</h3>
              <span className="bg-slate-900 text-white text-[10px] font-black px-3 py-1 rounded-full">
                {Object.values(subcategories).reduce((a, b) => a + b.count, 0)} TOTAL ITEMS
              </span>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-4 text-[9px] font-black uppercase text-slate-400 tracking-widest pb-2 border-b border-slate-50">
                <div className="col-span-1">Subcategory</div>
                <div className="text-center">Count</div>
                <div className="text-center">Total Stock</div>
                <div className="text-right">Alerts</div>
              </div>
              
              {Object.entries(subcategories).map(([sub, stats]) => (
                <div key={sub} className="grid grid-cols-4 items-center py-2 group">
                  <div className="col-span-1 text-xs font-bold text-slate-800">{sub}</div>
                  <div className="text-center text-xs font-black text-slate-900">{stats.count}</div>
                  <div className="text-center text-xs text-slate-500 font-medium">{stats.totalStock}</div>
                  <div className="text-right">
                    {stats.lowStock > 0 ? (
                      <span className="text-[9px] font-black text-red-500 bg-red-50 px-2 py-1 rounded">{stats.lowStock} LOW STOCK</span>
                    ) : (
                      <span className="text-[9px] font-black text-green-500 bg-green-50 px-2 py-1 rounded">HEALTHY</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {/* Platform-wide Quick Inventory Action */}
      <div className="bg-slate-900 text-white p-12 rounded-[3.5rem] relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <h3 className="text-3xl font-black mb-2 uppercase tracking-tighter">Global Catalog Audit</h3>
            <p className="text-slate-400 max-w-md">Run a system-wide check for orphaned categories, missing images, or outdated pricing across the platform.</p>
          </div>
          <button className="bg-white text-black px-10 py-5 rounded-full font-black uppercase text-xs tracking-widest hover:scale-105 transition-all whitespace-nowrap">
            Initialize Audit
          </button>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
      </div>
    </div>
  );

  const renderGovernance = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Platform Fee Control */}
        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
          <h3 className="text-xl font-black mb-6 uppercase tracking-widest">Revenue Model</h3>
          <div className="space-y-6">
            <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">Global Platform Commission (%)</label>
                <div className="flex gap-4 items-center">
                    <input 
                        type="range" 
                        min="0" 
                        max="30" 
                        step="0.5"
                        className="flex-grow accent-orange-600"
                        value={platformSettings.commissionPercentage} 
                        onChange={(e) => onUpdatePlatformSettings({...platformSettings, commissionPercentage: parseFloat(e.target.value)})}
                    />
                    <span className="text-2xl font-black w-20 text-right">{platformSettings.commissionPercentage}%</span>
                </div>
            </div>
            
            <div className="flex justify-between items-center bg-slate-50 p-6 rounded-[2rem]">
                <div>
                    <span className="text-xs font-black uppercase tracking-widest block mb-1">GST Standard</span>
                    <p className="text-[10px] text-slate-400">Applied on all service invoices</p>
                </div>
                <input 
                    type="number" 
                    className="w-20 bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-black text-center"
                    value={platformSettings.gstPercentage} 
                    onChange={(e) => onUpdatePlatformSettings({...platformSettings, gstPercentage: parseFloat(e.target.value)})}
                />
            </div>

            <div className="bg-orange-50 p-6 rounded-[2rem] border border-orange-100">
                <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-2">Platform Projection</p>
                <p className="text-xs text-orange-900 leading-relaxed">
                    Based on your <strong>{platformSettings.commissionPercentage}%</strong> fee, platform revenue from current GMV would be 
                    <span className="font-black"> ₹{((totalRevenue * platformSettings.commissionPercentage) / 100).toLocaleString('en-IN')}</span>.
                </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
          <h3 className="text-xl font-black mb-6 uppercase tracking-widest">Campaign Management</h3>
          <div className="space-y-4">
            {campaigns.map(c => (
              <div key={c.id} className="flex justify-between items-center p-4 border border-slate-100 rounded-2xl">
                <div>
                  <p className="font-bold text-sm">{c.title}</p>
                  <p className="text-[10px] font-black text-slate-400 tracking-widest">{c.discountCode}</p>
                </div>
                <div className="flex gap-2">
                   <button className="text-[10px] font-black text-orange-600">EDIT</button>
                   <button className="text-[10px] font-black text-red-400">STOP</button>
                </div>
              </div>
            ))}
            <button className="w-full border-2 border-dashed border-slate-200 py-3 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest">Create New Campaign</button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16">
        <div>
          <h1 className="text-6xl font-black text-slate-900 uppercase tracking-tighter">Nexus Admin</h1>
          <p className="text-slate-400 font-bold uppercase tracking-[0.5em] text-[10px] mt-2">Centralized Command & Control</p>
        </div>
        <div className="bg-slate-100 p-1.5 rounded-[2rem] flex flex-wrap gap-1">
          {['stats', 'inventory', 'users', 'orders', 'moderation', 'governance'].map(t => (
            <button key={t} onClick={() => setActiveTab(t as any)} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === t ? 'bg-white shadow-xl text-black scale-105' : 'text-slate-400 hover:text-slate-600'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'stats' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { l: 'GMV (Gross Revenue)', v: `₹${totalRevenue.toLocaleString('en-IN')}`, c: 'orange' },
            { l: 'Registered Entities', v: users.length, c: 'indigo' },
            { l: 'Active Catalog', v: products.length, c: 'green' },
            { l: 'Pending Moderation', v: products.filter(p => !p.isModerated).length, c: 'amber' }
          ].map(s => (
            <div key={s.l} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm transition-transform hover:translate-y-[-4px]">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">{s.l}</p>
              <p className="text-4xl font-black text-slate-900">{s.v}</p>
              <div className="mt-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-[9px] font-bold text-slate-400 uppercase">Live Update</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'inventory' && renderInventoryBreakdown()}

      {activeTab === 'orders' && (
        <div className="bg-white rounded-[3rem] border border-slate-100 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">
              <tr>
                <th className="px-10 py-8">Reference</th>
                <th className="px-10 py-8">Entity</th>
                <th className="px-10 py-8">Value (INR)</th>
                <th className="px-10 py-8">Lifecycle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {orders.map(o => {
                const buyer = users.find(u => u.id === o.buyerId);
                return (
                  <tr key={o.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-10 py-8">
                      <p className="font-mono text-[10px] text-orange-600 mb-1">NXS-{o.id}</p>
                      <p className="text-[10px] text-slate-400">{new Date(o.date).toLocaleDateString()}</p>
                    </td>
                    <td className="px-10 py-8">
                      <p className="text-sm font-black text-slate-900">{buyer?.name || 'Guest User'}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{buyer?.role}</p>
                    </td>
                    <td className="px-10 py-8">
                       <p className="text-lg font-black">₹{o.total.toLocaleString('en-IN')}</p>
                    </td>
                    <td className="px-10 py-8">
                       <span className={`text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-[0.1em] ${o.status === 'SHIPPED' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                         {o.status}
                       </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-white rounded-[3rem] border border-slate-100 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400">
              <tr><th className="px-10 py-6">Profile</th><th className="px-10 py-6">Authorization</th><th className="px-10 py-6">Risk Level</th><th className="px-10 py-6">Control</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-10 py-8 flex items-center gap-4">
                    <img src={u.avatar} className="w-12 h-12 rounded-full bg-slate-100 shadow-sm" alt="" />
                    <div><p className="font-black text-sm text-slate-900">{u.name}</p><p className="text-[10px] text-slate-400 font-bold">{u.email}</p></div>
                  </td>
                  <td className="px-10 py-8"><span className="text-[10px] font-black bg-slate-100 px-4 py-1.5 rounded-full uppercase tracking-widest">{u.role}</span></td>
                  <td className="px-10 py-8"><span className={`text-[10px] font-black ${u.kycVerified ? 'text-green-600' : 'text-amber-500'} uppercase tracking-widest`}>{u.kycVerified ? 'VERIFIED' : 'PENDING REVIEW'}</span></td>
                  <td className="px-10 py-8">
                    <button className="text-[10px] font-black text-red-500 uppercase hover:underline tracking-widest">Restrict Session</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'governance' && renderGovernance()}
    </div>
  );
};

export default AdminDashboard;