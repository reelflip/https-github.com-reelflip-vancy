
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
  const marqueeRef = useRef<HTMLDivElement>(null);

  const promoSlides = [
    {
      image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=2070",
      title: "Festive Grandeur",
      sub: "Hand-embroidered heritage wear for the modern wardrobe. Celebrate in style.",
      color: "bg-orange-50",
      accent: "text-orange-600"
    },
    {
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070",
      title: "Urban Archive",
      sub: "Oversized fits, street aesthetics, and premium technical fabrics. Explore the city.",
      color: "bg-blue-50",
      accent: "text-blue-600"
    },
    {
      image: "https://images.unsplash.com/photo-1445205170230-053b830c6050?q=80&w=2070",
      title: "Summer Solstice",
      sub: "Breathable linen and vibrant palettes for your next coastal escape.",
      color: "bg-emerald-50",
      accent: "text-emerald-600"
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

    const matchesFabric = filters.fabric === 'All' || p.fabric === filters.fabric;
    const matchesFit = filters.fit === 'All' || p.fit === filters.fit;
    const matchesOccasion = filters.occasion === 'All' || p.occasion === filters.occasion;
    const matchesSub = filters.subcategory === 'All' || p.subcategory === filters.subcategory;
    const matchesRating = p.rating >= filters.rating;

    return matchesCategory && matchesSearch && matchesPrice && matchesFabric && matchesFit && matchesOccasion && matchesSub && matchesRating;
  });

  const trendingProducts = products.slice(0, 6);

  const currentSubcats = Array.from(new Set(
    products
      .filter(p => selectedCategory === 'All' || p.category === selectedCategory)
      .map(p => p.subcategory)
  ));

  const navigateToProduct = (id: string) => {
    window.location.hash = `#/product/${id}`;
  };

  return (
    <div className="bg-white min-h-screen overflow-x-hidden">
      {/* Brand Marquee */}
      <div className="bg-black py-4 flex overflow-hidden whitespace-nowrap border-b border-white/10 relative z-20">
        <div className="flex animate-[marquee_30s_linear_infinite] gap-12 items-center">
          {[...brandNames, ...brandNames].map((brand, i) => (
            <span key={i} className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em] hover:text-white transition-colors cursor-default">
              {brand}
            </span>
          ))}
        </div>
      </div>

      {/* Dynamic Hero Section */}
      <section className="relative h-[650px] md:h-[850px] w-full overflow-hidden bg-slate-900">
        {promoSlides.map((slide, idx) => (
          <div key={idx} className={`absolute inset-0 transition-all duration-1000 ease-in-out flex items-center ${idx === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`}>
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" />
            <img src={slide.image} className="absolute inset-0 w-full h-full object-cover" alt="" />
            
            <div className="relative z-20 max-w-7xl mx-auto px-8 w-full">
              <div className="max-w-2xl">
                <span className={`${slide.accent} font-black uppercase tracking-[0.5em] text-[11px] mb-6 block animate-in fade-in slide-in-from-left-4 duration-500`}>
                  NEXUS EXCLUSIVE — 2024
                </span>
                <h1 className="text-6xl md:text-[10rem] font-black text-white tracking-tighter leading-[0.85] mb-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                  {slide.title}
                </h1>
                <p className="text-white/70 text-lg md:text-xl mb-12 font-medium max-w-lg leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                  {slide.sub}
                </p>
                <div className="flex items-center gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
                  <button 
                    onClick={() => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })}
                    className="bg-white text-black px-12 py-6 rounded-full font-black uppercase text-xs tracking-widest hover:bg-black hover:text-white hover:scale-105 transition-all shadow-2xl"
                  >
                    Explore Collection
                  </button>
                  <button className="text-white font-black text-xs uppercase tracking-widest border-b-2 border-white/20 pb-1 hover:border-white transition-all">
                    View Lookbook
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Slide Indicators */}
        <div className="absolute bottom-12 right-12 z-20 flex gap-3">
          {promoSlides.map((_, i) => (
            <button 
              key={i} 
              onClick={() => setCurrentSlide(i)}
              className={`h-1 transition-all duration-500 rounded-full ${i === currentSlide ? 'w-16 bg-white' : 'w-4 bg-white/30'}`}
            />
          ))}
        </div>
      </section>

      {/* Style Pulse - Trending Horizontal Section */}
      <section className="py-24 bg-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 mb-12 flex justify-between items-end">
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">The Nexus Pulse</h2>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mt-2">Real-time Trending Drops</p>
          </div>
          <button className="text-xs font-black uppercase border-b-2 border-slate-900 pb-1">View All Drops</button>
        </div>
        
        <div className="flex gap-8 overflow-x-auto px-8 no-scrollbar pb-10">
          {trendingProducts.map((p, i) => (
            <div key={p.id} onClick={() => navigateToProduct(p.id)} className="flex-shrink-0 w-80 group cursor-pointer transition-transform hover:-translate-y-2">
              <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-white mb-6 shadow-sm group-hover:shadow-2xl transition-all relative">
                <img src={p.images[0]} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="" />
                <div className="absolute top-6 left-6 bg-black/80 backdrop-blur-md text-white text-[9px] font-black uppercase px-3 py-1.5 rounded-full tracking-tighter">
                  HOT — {Math.floor(Math.random() * 50) + 10} Left
                </div>
              </div>
              <p className="text-[10px] font-black text-orange-600 uppercase mb-1">{p.brand}</p>
              <h4 className="font-bold text-slate-900 truncate">{p.name}</h4>
              <p className="text-lg font-black text-slate-900 mt-1">₹{p.price.toLocaleString('en-IN')}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Curated Style Tiles */}
      <section className="max-w-7xl mx-auto px-8 py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { label: 'Ethereal Ethnic', img: 'https://images.unsplash.com/photo-1583394293214-28ded15ee548?q=80&w=800', cat: 'Women' },
            { label: 'Street Elite', img: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=800', cat: 'Men' },
            { label: 'Nexus Basics', img: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e12?q=80&w=800', cat: 'Unisex' }
          ].map((tile, i) => (
            <div 
              key={i} 
              onClick={() => setSelectedCategory(tile.cat)}
              className="relative h-[500px] rounded-[3rem] overflow-hidden group cursor-pointer shadow-lg"
            >
              <img src={tile.img} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
              <div className="absolute bottom-10 left-10 right-10 flex flex-col items-center">
                 <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-[2rem] w-full text-center transform translate-y-4 group-hover:translate-y-0 transition-transform">
                    <h3 className="text-white text-2xl font-black uppercase tracking-tighter mb-2">{tile.label}</h3>
                    <p className="text-white/60 text-[10px] font-black uppercase tracking-widest">Explore Now</p>
                 </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Main Grid Area */}
      <section id="shop" className="max-w-7xl mx-auto px-8 py-24 flex flex-col lg:flex-row gap-16">
        
        {/* Style Studio Sidebar (Filters) */}
        <aside className="lg:w-80 flex-shrink-0">
          <div className="sticky top-32 space-y-12">
            <div className="flex justify-between items-center pb-6 border-b border-slate-100">
               <h3 className="text-xs font-black uppercase tracking-[0.4em] text-slate-900">Style Studio</h3>
               <button 
                  onClick={() => { setFilters({ priceRange: 'All', fabric: 'All', fit: 'All', occasion: 'All', subcategory: 'All', rating: 0 }); setSelectedCategory('All'); }}
                  className="text-[9px] font-black uppercase text-orange-600 hover:tracking-widest transition-all"
               >
                 Reset
               </button>
            </div>
            
            <div className="space-y-10">
              {/* Department */}
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase mb-5 tracking-widest">Archive Department</p>
                <div className="grid grid-cols-2 gap-3">
                  {['All', 'Men', 'Women', 'Unisex', 'Kids'].map(c => (
                    <button 
                      key={c} 
                      onClick={() => setSelectedCategory(c)} 
                      className={`py-3 rounded-2xl text-[10px] font-black uppercase transition-all ${selectedCategory === c ? 'bg-black text-white shadow-xl' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Point */}
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase mb-5 tracking-widest">Price Point</p>
                <div className="space-y-2">
                  {['All', 'Under 999', '999-1999', '1999-2999', 'Premium'].map(p => (
                    <button 
                      key={p} 
                      onClick={() => setFilters({...filters, priceRange: p})} 
                      className={`w-full text-left px-5 py-4 rounded-2xl text-xs font-bold transition-all flex justify-between items-center ${filters.priceRange === p ? 'bg-orange-50 text-orange-600 border border-orange-100' : 'bg-white border border-slate-100 text-slate-500 hover:border-slate-300'}`}
                    >
                      {p}
                      {filters.priceRange === p && <div className="w-1.5 h-1.5 rounded-full bg-orange-600" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Occasion Selection */}
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase mb-5 tracking-widest">The Occasion</p>
                <div className="flex flex-wrap gap-2">
                  {['Casual Wear', 'Office Wear', 'Party Wear', 'Gym / Sports', 'Festive Wear'].map(o => (
                    <button 
                      key={o} 
                      onClick={() => setFilters({...filters, occasion: filters.occasion === o ? 'All' : o})}
                      className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase border-2 transition-all ${filters.occasion === o ? 'bg-black border-black text-white' : 'border-slate-50 bg-slate-50 text-slate-400 hover:border-slate-200'}`}
                    >
                      {o}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <div className="flex-grow">
          {/* AI Search & Title */}
          <div className="mb-20">
            <div className="flex flex-col md:flex-row justify-between items-center gap-10 mb-12">
               <div>
                 <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase mb-2">The Archive</h2>
                 <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">
                   {filteredProducts.length} Pieces Found In <span className="text-black font-black">{selectedCategory}</span>
                 </p>
               </div>
               <div className="relative w-full md:w-auto flex-grow max-w-lg">
                  <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeWidth="2.5"/></svg>
                  </div>
                  <input 
                    type="text" 
                    placeholder="Describe your style (e.g., Silk shirts for weddings)..." 
                    className="w-full bg-white border-2 border-slate-100 rounded-[2.5rem] pl-16 pr-8 py-6 text-sm font-medium outline-none focus:border-black shadow-sm transition-all placeholder:text-slate-300" 
                    value={searchQuery} 
                    onChange={e => setSearchQuery(e.target.value)} 
                  />
               </div>
            </div>

            {/* Active Filters Display */}
            <div className="flex flex-wrap gap-3">
               {filters.priceRange !== 'All' && <span className="bg-slate-900 text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest">{filters.priceRange}</span>}
               {filters.occasion !== 'All' && <span className="bg-slate-900 text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest">{filters.occasion}</span>}
               {filters.subcategory !== 'All' && <span className="bg-slate-900 text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest">{filters.subcategory}</span>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-12 gap-y-24">
            {filteredProducts.map((p, idx) => (
              <div 
                key={p.id} 
                className={`group flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-700`} 
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div 
                  className="relative aspect-[3/4] rounded-[3rem] overflow-hidden bg-slate-50 mb-8 cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500" 
                  onClick={() => navigateToProduct(p.id)}
                >
                  <img src={p.images[0]} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="" />
                  
                  {/* Visual Badges */}
                  <div className="absolute top-8 left-8 flex flex-col gap-3 pointer-events-none">
                     {p.rating >= 4.9 && <span className="bg-black text-white text-[9px] font-black uppercase px-4 py-2 rounded-xl shadow-xl tracking-[0.2em] border border-white/20">Editor's Choice</span>}
                     {p.stock < 20 && <span className="bg-orange-600 text-white text-[9px] font-black uppercase px-4 py-2 rounded-xl shadow-xl tracking-[0.2em]">Limited Drop</span>}
                  </div>

                  {/* Add to Cart Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-12">
                    <button 
                      onClick={(e) => { e.stopPropagation(); onAddToCart(p); }} 
                      className="w-full bg-white text-black py-6 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.3em] transform translate-y-8 group-hover:translate-y-0 transition-all duration-500 hover:bg-black hover:text-white"
                    >
                      Bag — ₹{p.price.toLocaleString('en-IN')}
                    </button>
                  </div>
                </div>

                <div className="px-6">
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-[10px] font-black text-orange-600 uppercase tracking-[0.3em]">{p.brand}</p>
                    <div className="flex items-center gap-1.5">
                        <svg className="w-3 h-3 text-yellow-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                        <span className="text-[11px] font-black text-slate-800 tracking-tighter">{p.rating}</span>
                    </div>
                  </div>
                  <h3 className="font-bold text-slate-900 text-xl mb-4 truncate group-hover:text-orange-600 transition-colors cursor-pointer" onClick={() => navigateToProduct(p.id)}>
                    {p.name}
                  </h3>
                  <div className="flex items-end justify-between">
                    <div>
                        <p className="text-2xl font-black text-slate-900 leading-none">₹{p.price.toLocaleString('en-IN')}</p>
                        <p className="text-[10px] text-slate-400 mt-1 font-bold">Tax Included</p>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); navigateToProduct(p.id); }}
                      className="text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-black transition-colors"
                    >
                      View Piece →
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredProducts.length === 0 && (
              <div className="col-span-full py-40 text-center bg-slate-50 rounded-[5rem] border-4 border-dashed border-slate-100">
                <div className="max-w-md mx-auto">
                  <p className="text-slate-300 font-black uppercase tracking-[1em] mb-6">Archive Empty</p>
                  <p className="text-sm text-slate-400 font-medium mb-10">We couldn't find any pieces matching your current style filters.</p>
                  <button 
                    onClick={() => { setFilters({ priceRange: 'All', fabric: 'All', fit: 'All', occasion: 'All', subcategory: 'All', rating: 0 }); setSelectedCategory('All'); }}
                    className="bg-black text-white px-10 py-5 rounded-full font-black uppercase text-[10px] tracking-widest shadow-xl"
                  >
                    Clear All Refinements
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Style Newsletter / CTA */}
      <section className="bg-black py-32 mt-20 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-8 text-center relative z-10">
          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase mb-8">Join the Nexus Insider</h2>
          <p className="text-white/50 text-lg font-medium mb-12">Get early access to limited edition drops and AI-curated style reports.</p>
          <div className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto">
            <input type="email" placeholder="Your Fashion Handle (Email)" className="flex-grow bg-white/10 border border-white/20 rounded-full px-8 py-5 text-white outline-none focus:bg-white/20 transition-all" />
            <button className="bg-white text-black px-12 py-5 rounded-full font-black uppercase text-xs tracking-widest hover:scale-105 transition-all">Request Invite</button>
          </div>
        </div>
        
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-600/20 blur-[150px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/20 blur-[150px] translate-y-1/2 -translate-x-1/2" />
      </section>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default Home;
