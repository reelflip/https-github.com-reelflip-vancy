
import React, { useState } from 'react';
import { Product } from '../types.ts';

interface ProductDetailProps {
  product: Product;
  onAddToCart: (p: Product) => void;
  onBack: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onAddToCart, onBack }) => {
  const [activeImage, setActiveImage] = useState(product.images[0]);

  return (
    <div className="bg-white min-h-screen pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <nav className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-xs font-black uppercase tracking-widest hover:text-orange-600 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M15 19l-7-7 7-7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Collection
        </button>
        <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">{product.brand} — {product.category}</span>
      </nav>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Gallery Section */}
        <div className="space-y-4">
          <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-slate-50 shadow-sm relative group">
            <img src={activeImage} className="w-full h-full object-cover" alt={product.name} />
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
            {product.images.map((img, idx) => (
              <button 
                key={idx} 
                onClick={() => setActiveImage(img)}
                className={`flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all ${activeImage === img ? 'border-black scale-95' : 'border-transparent opacity-60 hover:opacity-100'}`}
              >
                <img src={img} className="w-full h-full object-cover" alt="" />
              </button>
            ))}
          </div>
        </div>

        {/* Info Section */}
        <div className="lg:sticky lg:top-32 self-start space-y-10">
          <div>
            <p className="text-orange-600 font-black text-xs uppercase tracking-[0.3em] mb-3">{product.brand}</p>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-tight mb-4">{product.name}</h1>
            <div className="flex items-center gap-6">
              <span className="text-3xl font-black text-slate-900">₹{product.price.toLocaleString('en-IN')}</span>
              <span className="bg-green-100 text-green-700 text-[10px] font-black px-3 py-1 rounded-full uppercase">In Stock</span>
            </div>
          </div>

          <div className="space-y-4 pt-6">
            <button 
              onClick={() => onAddToCart(product)}
              className="w-full bg-black text-white py-6 rounded-[2rem] font-black text-lg uppercase tracking-widest shadow-2xl hover:scale-[1.02] active:scale-95 transition-all"
            >
              Add to Bag
            </button>
          </div>

          <div className="pt-10 border-t border-slate-100 space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-3">Product Story</h3>
            <p className="text-slate-500 text-sm leading-relaxed">{product.detailedDescription || product.description}</p>
            
            <div className="grid grid-cols-2 gap-8 pt-4">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Fabric</p>
                <p className="text-sm font-bold text-slate-800">{product.fabric || 'Premium Blend'}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Fit</p>
                <p className="text-sm font-bold text-slate-800">{product.fit || 'Standard'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
