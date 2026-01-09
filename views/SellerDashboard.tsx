
import React, { useState, useMemo } from 'react';
import { Product, User, Order, OrderStatus, ProductVariant, PlatformSettings } from '../types.ts';
import { generateProductDescription } from '../services/geminiService.ts';

interface SellerDashboardProps {
  user: User;
  products: Product[];
  orders: Order[];
  platformSettings: PlatformSettings;
  onAddProduct: (p: Omit<Product, 'id' | 'reviews'>) => void;
  onUpdateProduct: (p: Product) => void;
  onDeleteProduct: (id: string) => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
}

const SellerDashboard: React.FC<SellerDashboardProps> = ({ 
  user, products, orders, platformSettings, onAddProduct, onUpdateProduct, onDeleteProduct, onUpdateOrderStatus 
}) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'orders'>('inventory');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ 
    name: '', 
    brand: '', 
    price: 0, 
    description: '', 
    detailedDescription: '',
    category: 'Men' as any,
    subcategory: 'T-Shirts',
    gender: 'Men' as any,
    fabric: 'Cotton',
    fit: 'Regular Fit',
    occasion: 'Casual Wear',
    stock: 10 
  });
  const [imageUrls, setImageUrls] = useState<string[]>(['']);
  const [isGenerating, setIsGenerating] = useState(false);

  const sellerProducts = products.filter(p => p.sellerId === user.id);
  const sellerOrders = orders.filter(o => o.items.some(i => i.sellerId === user.id));
  const sellerRevenue = orders.reduce((acc, o) => acc + o.items.filter(i => i.sellerId === user.id).reduce((iacc, curr) => iacc + (curr.price * curr.quantity), 0), 0);

  // Net earnings calculation
  const netEarnings = useMemo(() => {
    const commission = (formData.price * platformSettings.commissionPercentage) / 100;
    return formData.price - commission;
  }, [formData.price, platformSettings.commissionPercentage]);

  const handleAiGenerate = async () => {
    if (!formData.name) return alert("Enter product name first");
    setIsGenerating(true);
    try {
      const desc = await generateProductDescription(formData.name, formData.subcategory);
      setFormData({ ...formData, detailedDescription: desc });
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    const filteredImages = imageUrls.filter(u => u.trim());
    if (filteredImages.length === 0) return alert("Please add at least one image URL.");
    
    onAddProduct({ 
      ...formData, 
      sellerId: user.id, 
      images: filteredImages, 
      rating: 5, 
      isModerated: true,
      variants: []
    });
    setShowForm(false);
    // Reset form
    setFormData({ name: '', brand: '', price: 0, description: '', detailedDescription: '', category: 'Men' as any, subcategory: 'T-Shirts', gender: 'Men' as any, fabric: 'Cotton', fit: 'Regular Fit', occasion: 'Casual Wear', stock: 10 });
    setImageUrls(['']);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 mb-16">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase">Merchant Console</h1>
          <p className="text-[10px] font-black text-slate-400 mt-2 tracking-[0.5em] uppercase">Scale Your Fashion Brand Across India</p>
        </div>
        <div className="flex gap-6 items-center">
          <div className="bg-white px-10 py-6 rounded-[2.5rem] border border-slate-100 shadow-sm text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Lifetime Gross</p>
            <p className="text-3xl font-black">₹{sellerRevenue.toLocaleString('en-IN')}</p>
          </div>
          <div className="bg-slate-100 p-1.5 rounded-[2rem] flex">
            <button onClick={() => setActiveTab('inventory')} className={`px-10 py-4 rounded-[1.5rem] text-[10px] font-black uppercase transition-all tracking-widest ${activeTab === 'inventory' ? 'bg-white shadow-xl text-black' : 'text-slate-400'}`}>Inventory</button>
            <button onClick={() => setActiveTab('orders')} className={`px-10 py-4 rounded-[1.5rem] text-[10px] font-black uppercase transition-all tracking-widest ${activeTab === 'orders' ? 'bg-white shadow-xl text-black' : 'text-slate-400'}`}>Sales</button>
          </div>
        </div>
      </div>

      {activeTab === 'inventory' ? (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-black text-slate-900 tracking-tighter">Current Archive ({sellerProducts.length})</h3>
            <button onClick={() => setShowForm(true)} className="bg-black text-white px-10 py-5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl hover:scale-105 transition-all">Launch New Piece</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {sellerProducts.map(p => (
              <div key={p.id} className="bg-white p-6 rounded-[3rem] border border-slate-100 shadow-sm relative group">
                <img src={p.images[0]} className="w-full h-60 object-cover rounded-[2rem] mb-6" alt="" />
                <div className="px-2">
                    <p className="text-[10px] font-black text-orange-600 uppercase mb-2">{p.brand}</p>
                    <h4 className="font-bold text-slate-900 truncate mb-2">{p.name}</h4>
                    <div className="flex justify-between items-end">
                      <p className="text-lg font-black">₹{p.price.toLocaleString('en-IN')}</p>
                      <p className={`text-[10px] font-black uppercase ${p.stock < 10 ? 'text-red-500' : 'text-slate-400'}`}>{p.stock} Units</p>
                    </div>
                </div>
                <button onClick={() => onDeleteProduct(p.id)} className="absolute top-10 right-10 bg-red-500 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-xl hover:bg-red-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth="2.5"/></svg>
                </button>
              </div>
            ))}
            {sellerProducts.length === 0 && (
              <div className="col-span-full py-32 text-center border-4 border-dashed border-slate-100 rounded-[4rem]">
                 <p className="text-slate-300 font-black uppercase tracking-widest">No Active Listings</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-[3rem] border border-slate-100 overflow-hidden shadow-sm animate-in fade-in duration-500">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-widest">
              <tr><th className="px-10 py-8">Ref ID</th><th className="px-10 py-8">Manifest</th><th className="px-10 py-8">Net Value</th><th className="px-10 py-8">Lifecycle</th><th className="px-10 py-8">Operational Action</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {sellerOrders.map(o => (
                <tr key={o.id} className="group hover:bg-slate-50 transition-colors">
                  <td className="px-10 py-8 font-mono text-[11px] text-orange-600">NXS-{o.id}</td>
                  <td className="px-10 py-8">
                    {o.items.filter(i => i.sellerId === user.id).map((i, idx) => (
                      <div key={idx} className="flex flex-col mb-1 last:mb-0">
                          <p className="text-sm font-black text-slate-900">{i.quantity}x {i.productName}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">₹{i.price.toLocaleString('en-IN')}</p>
                      </div>
                    ))}
                  </td>
                  <td className="px-10 py-8">
                      <p className="text-lg font-black text-slate-900">₹{o.items.filter(i => i.sellerId === user.id).reduce((a,c) => a+(c.price*c.quantity),0).toLocaleString('en-IN')}</p>
                  </td>
                  <td className="px-10 py-8"><span className={`text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest ${o.status === 'PENDING' ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'}`}>{o.status}</span></td>
                  <td className="px-10 py-8">
                    {o.status === OrderStatus.PENDING && (
                      <button onClick={() => onUpdateOrderStatus(o.id, OrderStatus.SHIPPED)} className="bg-black text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-colors shadow-lg">Confirm Shipment</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Product Creation Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-6">
          <div className="bg-white rounded-[4rem] w-full max-w-5xl p-16 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-500 shadow-2xl no-scrollbar">
            <div className="flex justify-between items-center mb-16">
              <div>
                <h2 className="text-5xl font-black uppercase tracking-tighter mb-2">Inventory Log</h2>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.4em]">Detail Every Attribute for High Conversion</p>
              </div>
              <button onClick={() => setShowForm(false)} className="text-slate-300 hover:text-black transition-colors transform hover:rotate-90 duration-500">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2.5"/></svg>
              </button>
            </div>

            <form onSubmit={handlePublish} className="space-y-16">
              {/* Primary Identity */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="col-span-2"><label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-4">Product Name</label><input required className="w-full bg-slate-50 border-2 border-slate-50 rounded-3xl py-6 px-10 text-lg font-bold focus:border-black outline-none transition-all" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}/></div>
                <div><label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-4">Brand Identity</label><input required className="w-full bg-slate-50 border-2 border-slate-50 rounded-3xl py-6 px-10 text-lg font-bold focus:border-black outline-none transition-all" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})}/></div>
              </div>

              {/* Categorization & Pricing */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div><label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-4">Department</label>
                <select className="w-full bg-slate-50 border-none rounded-3xl py-6 px-8 font-bold appearance-none cursor-pointer" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as any, gender: e.target.value as any})}>
                  <option>Men</option><option>Women</option><option>Unisex</option><option>Kids</option>
                </select></div>
                <div><label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-4">Subcategory Tag</label>
                <input required placeholder="e.g., Oversized Tee" className="w-full bg-slate-50 border-none rounded-3xl py-6 px-8 font-bold" value={formData.subcategory} onChange={e => setFormData({...formData, subcategory: e.target.value})}/></div>
                
                {/* Price & Earnings Calculator */}
                <div className="relative">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-4">Selling Price (₹)</label>
                  <input type="number" required className="w-full bg-slate-50 border-none rounded-3xl py-6 px-8 font-bold" value={formData.price} onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})}/>
                  <div className="mt-4 px-2">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase">
                        <span className="text-slate-400 tracking-tighter">Your Net Earnings:</span>
                        <span className="text-green-600 font-black">₹{netEarnings.toLocaleString('en-IN')}</span>
                    </div>
                    <p className="text-[9px] text-slate-300 mt-1 italic leading-none">After platform fee ({platformSettings.commissionPercentage}%)</p>
                  </div>
                </div>

                <div><label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-4">Stock Units</label>
                <input type="number" required className="w-full bg-slate-50 border-none rounded-3xl py-6 px-8 font-bold" value={formData.stock} onChange={e => setFormData({...formData, stock: parseInt(e.target.value)})}/></div>
              </div>

              {/* Fashion Filters (CRITICAL) */}
              <div className="p-12 bg-slate-50 rounded-[3rem] grid grid-cols-1 md:grid-cols-3 gap-12 border border-slate-100">
                <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-4">Fabrication</label>
                    <select className="w-full bg-white border-none rounded-2xl py-5 px-8 font-bold shadow-sm" value={formData.fabric} onChange={e => setFormData({...formData, fabric: e.target.value})}>
                        {['Cotton', 'Linen', 'Silk', 'Denim', 'Polyester', 'Viscose', 'Leather', 'Fleece', 'Nylon', 'Chiffon', 'Satin', 'Velvet'].map(f => <option key={f}>{f}</option>)}
                    </select>
                </div>
                <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-4">Fit / Silhouette</label>
                    <select className="w-full bg-white border-none rounded-2xl py-5 px-8 font-bold shadow-sm" value={formData.fit} onChange={e => setFormData({...formData, fit: e.target.value})}>
                        {['Slim Fit', 'Regular Fit', 'Oversized', 'Relaxed Fit', 'Tailored'].map(f => <option key={f}>{f}</option>)}
                    </select>
                </div>
                <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-4">Occasion Logic</label>
                    <select className="w-full bg-white border-none rounded-2xl py-5 px-8 font-bold shadow-sm" value={formData.occasion} onChange={e => setFormData({...formData, occasion: e.target.value})}>
                        {['Casual Wear', 'Office Wear', 'Party Wear', 'Gym / Sports', 'Travel Wear', 'Festive Wear'].map(o => <option key={o}>{o}</option>)}
                    </select>
                </div>
              </div>

              {/* Visual Assets */}
              <div>
                <div className="flex justify-between items-center mb-6">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">High-Resolution Visuals (URLs)</label>
                  <button type="button" onClick={() => setImageUrls([...imageUrls, ''])} className="text-[10px] font-black text-orange-600 uppercase bg-orange-50 px-4 py-2 rounded-full">+ Add Asset Row</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {imageUrls.map((url, i) => (
                    <div key={i} className="relative group">
                        <input placeholder="https://unsplash.com/fashion-piece.jpg" className="w-full bg-slate-50 border-none rounded-3xl py-6 px-10 text-xs font-mono" value={url} onChange={e => { const ni = [...imageUrls]; ni[i] = e.target.value; setImageUrls(ni); }}/>
                        {imageUrls.length > 1 && (
                            <button type="button" onClick={() => setImageUrls(imageUrls.filter((_, idx) => idx !== i))} className="absolute right-4 top-1/2 -translate-y-1/2 text-red-300 hover:text-red-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2.5"/></svg></button>
                        )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Description & AI */}
              <div>
                <div className="flex justify-between items-center mb-6">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Product Narrative</label>
                   <button type="button" onClick={handleAiGenerate} disabled={isGenerating} className="text-[11px] font-black text-white bg-black px-6 py-3 rounded-full uppercase tracking-widest shadow-xl flex items-center gap-3 active:scale-95 transition-all">
                     {isGenerating ? 'Drafting...' : '✨ Gemini AI Storyteller'}
                   </button>
                </div>
                <textarea rows={6} className="w-full bg-slate-50 border-none rounded-[3rem] py-10 px-12 text-lg leading-relaxed font-medium focus:bg-white border-2 border-transparent focus:border-slate-100 transition-all" placeholder="Craft a story about this piece. Fabrication, heritage, styling tips..." value={formData.detailedDescription} onChange={e => setFormData({...formData, detailedDescription: e.target.value})}/>
              </div>

              <button type="submit" className="w-full bg-orange-600 text-white py-10 rounded-[3rem] font-black uppercase tracking-[0.4em] text-xl shadow-2xl hover:bg-orange-700 hover:scale-[1.01] active:scale-95 transition-all">Publish Live to Nexus Archive</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;