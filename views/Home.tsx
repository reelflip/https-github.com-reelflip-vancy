
import React, { useState, useEffect, useRef } from 'react';
import { Product, Category } from '../types.ts';
import { CATEGORIES } from '../constants.tsx';

interface HomeProps {
  products: Product[];
  onAddToCart: (p: Product) => void;
}

const Home: React.FC<HomeProps> = ({ products, onAddToCart }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    priceRange: 'All',
    fabric: 'All',
    fit: 'All',
    occasion: 'All',
    subcategory: 'All',
    rating: 0
  });

  const [currentSlide, setCurrentSlide] = useState(0);

  const promoSlides = [
    {
      image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=2070",
      title: "Festive Grandeur",
      sub: "Hand-embroidered heritage wear for the modern wardrobe. Celebrate in style.",
      accent: "text-orange-500"
    },
    {
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070",
      title: "Urban Archive",
      sub: "Oversized fits, street aesthetics, and premium technical fabrics. Explore the city.",
      accent: "text-blue-400"
    },
    {
      image: "https://images.unsplash.com/photo-1445205170230-053b830c6050?q=80&w=2070",
      title: "Summer Solstice",
      sub: "Breathable linen and vibrant palettes for your next coastal escape.",
      accent: "text-emerald-400"
    }
  ];

  const brandNames = ["Roadster", "Levis", "Manyavar", "Zara", "Adidas", "Nike", "H&M", "FabIndia", "Puma", "Biba", "Van Heusen", "Wildcraft"];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % promoSlides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [promoSlides.length]);

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.brand.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesPrice = true;
    if (filters.priceRange === 'Under 999') matchesPrice = p.price < 1000;
    else if (filters.priceRange === '999-1999') matchesPrice = p.price >= 1000 && p.price < 2000;
    else if (filters.priceRange === '1999-2999') matchesPrice = p.price >= 2000 && p.price < 3000;
    else if (filters.priceRange === 'Premium') matchesPrice = p.price >= 3000;

    const matchesOccasion = filters.occasion === 'All' || p.occasion === filters.occasion;

    return matchesCategory && matchesSearch && matchesPrice && matchesOccasion;
  });

  const trendingProducts = products.slice(0, 6);

  const navigateToProduct = (id: string) => {
    window.location.hash = `#/product/${id}`;
  };

  return (
    <div className="bg-white min-h-screen overflow-x-hidden">
      {/* Brand Marquee */}
      <div className="bg-black py-4 flex overflow-hidden whitespace-nowrap relative z-20">
        <div className="flex animate-[marquee_40s_linear_infinite] gap-12 items-center">
          {[...brandNames, ...brandNames, ...brandNames].map((brand, i) => (
            <span key={i} className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em] hover:text-white transition-colors cursor-default">
              {brand}
            </span>
          ))}
        </div>
      </div>

      {/* Dynamic Hero Section */}
      <section className="relative h-[700px] md:h-[90vh] w-full overflow-hidden bg-slate-900">
        {promoSlides.map((slide, idx) => (
          <div key={idx} className={`absolute inset-0 transition-all duration-1000 ease-in-out flex items-center ${idx === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'}`}>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
            <img src={slide.image} className="absolute inset-0 w-full h-full object-cover" alt="" />
            
            <div className="relative z-20 max-w-7xl mx-auto px-8 w-full">
              <div className="max-w-3xl">
                <div className="overflow-hidden mb-6">
                  <span className={`${slide.accent} font-black uppercase tracking-[0.6em] text-[10px] block animate-in slide-in-from-bottom-full duration-500`}>
                    NEW SEASON ARRIVAL — 2024
                  </span>
                </div>
                <h1 className="text-6xl md:text-[9rem] font-black text-white tracking-tighter leading-[0.8] mb-10 animate-in fade-in slide-in-from-bottom-12 duration-1000">
                  {slide.title}
                </h1>
                <p className="text-white/80 text-lg md:text-2xl mb-14 font-medium max-w-xl leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                  {slide.sub}
                </p>
                <div className="flex items-center gap-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-400">
                  <button 
                    onClick={() => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })}
                    className="bg-white text-black px-14 py-7 rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-black hover:text-white hover:scale-105 transition-all shadow-2xl active:scale-95"
                  >
                    Shop the Look
                  </button>
                  <button className="text-white font-black text-[10px] uppercase tracking-widest group flex items-center gap-3">
                    Watch Lookbook 
                    <span className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">▶</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Progress Dots */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex gap-4">
          {promoSlides.map((_, i) => (
            <button 
              key={i} 
              onClick={() => setCurrentSlide(i)}
              className={`h-1.5 transition-all duration-700 rounded-full ${i === currentSlide ? 'w-20 bg-white' : 'w-3 bg-white/20'}`}
            />
          ))}
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 right-12 z-20 hidden md:block animate-bounce">
            <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.3em] rotate-90 origin-right">Scroll to explore</p>
        </div>
      </section>

      {/* Style Pulse Section */}
      <section className="py-32 bg-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 mb-16 flex justify-between items-end">
          <div>
            <div className="flex items-center gap-3 mb-2">
               <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
               <p className="text-red-500 text-[10px] font-black uppercase tracking-widest">Live: Hot Drops</p>
            </div>
            <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase">The Nexus Pulse</h2>
          </div>
          <button className="text-[10px] font-black uppercase border-b-2 border-slate-900 pb-1 hover:text-orange-600 hover:border-orange-600 transition-all">View All Arrivals</button>
        </div>
        
        <div className="flex gap-10 overflow-x-auto px-8 no-scrollbar pb-10">
          {trendingProducts.map((p, i) => (
            <div key={p.id} onClick={() => navigateToProduct(p.id)} className="flex-shrink-0 w-80 group cursor-pointer">
              <div className="aspect-[4/5] rounded-[3rem] overflow-hidden bg-white mb-8 shadow-sm group-hover:shadow-3xl transition-all relative">
                <img src={p.images[0]} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                <div className="absolute bottom-8 left-8 right-8 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                   <button className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase text-[9px] tracking-widest shadow-xl">Quick View</button>
                </div>
              </div>
              <p className="text-[10px] font-black text-orange-600 uppercase mb-2">{p.brand}</p>
              <h4 className="text-lg font-bold text-slate-900 truncate">{p.name}</h4>
              <p className="text-xl font-black text-slate-900 mt-2">₹{p.price.toLocaleString('en-IN')}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Curated Vibe Tiles */}
      <section className="max-w-7xl mx-auto px-8 py-32">
        <div className="text-center mb-24">
            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 mb-6">Choose Your Atmosphere</h2>
            <h3 className="text-6xl font-black tracking-tighter uppercase text-slate-900">Curated Style Vibe</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { label: 'Ethereal Ethnic', img: 'https://images.unsplash.com/photo-1583394293214-28ded15ee548?q=80&w=800', cat: 'Women', sub: 'The Modern Heritage' },
            { label: 'Street Elite', img: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=800', cat: 'Men', sub: 'Urban Velocity' },
            { label: 'Nexus Basics', img: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e12?q=80&w=800', cat: 'Unisex', sub: 'Essential Comfort' }
          ].map((tile, i) => (
            <div 
              key={i} 
              onClick={() => setSelectedCategory(tile.cat)}
              className="relative h-[600px] rounded-[3.5rem] overflow-hidden group cursor-pointer shadow-xl transition-all duration-700 hover:-translate-y-4"
            >
              <img src={tile.img} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-12 left-10 right-10">
                 <p className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-3">{tile.sub}</p>
                 <h3 className="text-white text-4xl font-black uppercase tracking-tighter mb-6">{tile.label}</h3>
                 <div className="w-12 h-1 rounded-full bg-white transition-all duration-500 group-hover:w-full" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AI Search Command Center */}
      <section id="shop" className="max-w-7xl mx-auto px-8 py-32">
        <div className="bg-slate-900 rounded-[4rem] p-16 md:p-24 relative overflow-hidden flex flex-col items-center text-center">
            <div className="relative z-10 max-w-2xl">
                <h2 className="text-white text-5xl md:text-7xl font-black tracking-tighter uppercase mb-8">Personalized Archiving</h2>
                <p className="text-white/40 text-lg mb-16 font-medium">Describe the aesthetic you desire. Our AI-driven engine will curate your perfect wardrobe piece in real-time.</p>
                
                <div className="relative w-full">
                  <input 
                    type="text" 
                    placeholder="Search for 'Silk party wear under 5000' or 'Oversized black tees'..." 
                    className="w-full bg-white/10 border border-white/20 rounded-full px-12 py-8 text-white text-lg font-medium outline-none focus:bg-white/20 transition-all placeholder:text-white/20 shadow-2xl" 
                    value={searchQuery} 
                    onChange={e => setSearchQuery(e.target.value)} 
                  />
                  <button className="absolute right-4 top-1/2 -translate-y-1/2 bg-white text-black px-10 py-5 rounded-full font-black uppercase text-[10px] tracking-widest hover:scale-105 active:scale-95 transition-all">Find Piece</button>
                </div>
            </div>
            
            {/* Background Aesthetics */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-orange-600/20 blur-[120px] -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/20 blur-[120px] translate-x-1/2 translate-y-1/2" />
        </div>
      </section>

      {/* Filter & Main Grid */}
      <section className="max-w-7xl mx-auto px-8 py-32 flex flex-col lg:flex-row gap-20">
        <aside className="lg:w-80 flex-shrink-0">
          <div className="sticky top-32 space-y-16">
            <div>
               <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 mb-10">Refinement Studio</h3>
               <div className="space-y-4">
                  {['All', 'Men', 'Women', 'Unisex', 'Kids'].map(c => (
                    <button 
                      key={c} 
                      onClick={() => setSelectedCategory(c)} 
                      className={`w-full text-left px-8 py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${selectedCategory === c ? 'bg-black text-white shadow-xl' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                    >
                      {c}
                    </button>
                  ))}
               </div>
            </div>

            <div>
               <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 mb-10">Occasion Logic</h3>
               <div className="flex flex-wrap gap-3">
                  {['Casual Wear', 'Office Wear', 'Party Wear', 'Gym / Sports', 'Festive Wear'].map(o => (
                    <button 
                      key={o} 
                      onClick={() => setFilters({...filters, occasion: filters.occasion === o ? 'All' : o})}
                      className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase border-2 transition-all ${filters.occasion === o ? 'bg-orange-500 border-orange-500 text-white' : 'border-slate-50 text-slate-400 hover:border-slate-200'}`}
                    >
                      {o}
                    </button>
                  ))}
               </div>
            </div>
          </div>
        </aside>

        <div className="flex-grow">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-12 gap-y-24">
            {filteredProducts.map((p, idx) => (
              <div 
                key={p.id} 
                className="group flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-700" 
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div 
                  className="relative aspect-[3/4] rounded-[3.5rem] overflow-hidden bg-slate-50 mb-8 cursor-pointer shadow-sm hover:shadow-4xl transition-all duration-700" 
                  onClick={() => navigateToProduct(p.id)}
                >
                  <img src={p.images[0]} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="" />
                  
                  {p.rating >= 4.9 && (
                    <div className="absolute top-10 left-10">
                       <span className="bg-black text-white text-[8px] font-black uppercase px-4 py-2 rounded-xl tracking-widest">Editor's Pick</span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-12">
                    <button 
                      onClick={(e) => { e.stopPropagation(); onAddToCart(p); }} 
                      className="w-full bg-white text-black py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transform translate-y-8 group-hover:translate-y-0 transition-all duration-500 hover:bg-orange-600 hover:text-white"
                    >
                      Add to Bag — ₹{p.price.toLocaleString('en-IN')}
                    </button>
                  </div>
                </div>

                <div className="px-6">
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest">{p.brand}</p>
                    <div className="flex items-center gap-1">
                        <span className="text-[11px] font-black text-slate-800 tracking-tighter">★ {p.rating}</span>
                    </div>
                  </div>
                  <h3 className="font-bold text-slate-900 text-xl mb-4 truncate group-hover:text-orange-600 transition-colors cursor-pointer" onClick={() => navigateToProduct(p.id)}>
                    {p.name}
                  </h3>
                  <div className="flex items-end justify-between">
                    <p className="text-2xl font-black text-slate-900 leading-none">₹{p.price.toLocaleString('en-IN')}</p>
                    <button 
                      onClick={(e) => { e.stopPropagation(); navigateToProduct(p.id); }}
                      className="text-[9px] font-black uppercase tracking-widest text-slate-300 hover:text-black transition-colors"
                    >
                      Explore →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="py-40 text-center bg-slate-50 rounded-[5rem] border-2 border-dashed border-slate-200">
               <p className="text-slate-300 font-black uppercase tracking-[1em] mb-4">No Matches</p>
               <button onClick={() => { setSelectedCategory('All'); setFilters({ ...filters, occasion: 'All' }); }} className="text-xs font-black uppercase border-b-2 border-black pb-1">Reset Filters</button>
            </div>
          )}
        </div>
      </section>

      {/* Footer Branding */}
      <footer className="bg-black pt-32 pb-16">
         <div className="max-w-7xl mx-auto px-8">
            <div className="flex flex-col md:flex-row justify-between items-start gap-20 mb-32">
               <div className="max-w-md">
                  <h2 className="text-white text-4xl font-black tracking-tighter uppercase mb-8">NexusCommerce</h2>
                  <p className="text-white/40 leading-relaxed font-medium">Redefining the digital marketplace with AI-curated heritage and urban collections. Experience the new standard in multi-vendor fashion.</p>
               </div>
               <div className="grid grid-cols-2 md:grid-cols-3 gap-16">
                  <div>
                    <h4 className="text-white text-[10px] font-black uppercase tracking-widest mb-8">Navigation</h4>
                    <ul className="space-y-4 text-white/40 text-[10px] font-black uppercase">
                        <li><a href="#" className="hover:text-white">The Archive</a></li>
                        <li><a href="#" className="hover:text-white">Seller Center</a></li>
                        <li><a href="#" className="hover:text-white">Admin Hub</a></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-white text-[10px] font-black uppercase tracking-widest mb-8">Social</h4>
                    <ul className="space-y-4 text-white/40 text-[10px] font-black uppercase">
                        <li><a href="#" className="hover:text-white">Instagram</a></li>
                        <li><a href="#" className="hover:text-white">Behance</a></li>
                        <li><a href="#" className="hover:text-white">Pinterest</a></li>
                    </ul>
                  </div>
               </div>
            </div>
            <div className="pt-16 border-t border-white/10 flex justify-between items-center">
               <p className="text-white/20 text-[9px] font-black uppercase tracking-[0.3em]">&copy; 2024 Nexus Platform Labs</p>
               <p className="text-white/20 text-[9px] font-black uppercase tracking-[0.3em]">Built for the modern web</p>
            </div>
         </div>
      </footer>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default Home;
