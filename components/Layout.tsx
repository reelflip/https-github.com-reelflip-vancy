
import React from 'react';
import { UserRole, User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
  onSwitchRole: (role: UserRole) => void;
  cartCount: number;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, onSwitchRole, cartCount }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-8">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent cursor-pointer" onClick={() => window.location.hash = '#/'}>
                NexusCommerce
              </span>
              <div className="hidden md:flex space-x-4">
                <a href="#/" className="text-slate-600 hover:text-blue-600 font-medium">Shop</a>
                {user?.role === UserRole.SELLER && <a href="#/seller-dashboard" className="text-slate-600 hover:text-blue-600 font-medium">Seller Center</a>}
                {user?.role === UserRole.ADMIN && <a href="#/admin-dashboard" className="text-slate-600 hover:text-blue-600 font-medium">Admin Panel</a>}
                {user?.role === UserRole.BUYER && <a href="#/buyer-dashboard" className="text-slate-600 hover:text-blue-600 font-medium">My Orders</a>}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative group">
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors">
                  <span className="text-sm font-medium text-slate-700">Switch Role</span>
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[60]">
                  <button onClick={() => onSwitchRole(UserRole.BUYER)} className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 first:rounded-t-xl">Buyer</button>
                  <button onClick={() => onSwitchRole(UserRole.SELLER)} className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50">Seller</button>
                  <button onClick={() => onSwitchRole(UserRole.ADMIN)} className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 last:rounded-b-xl">Admin</button>
                </div>
              </div>

              <div className="relative cursor-pointer" onClick={() => window.location.hash = '#/cart'}>
                <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{cartCount}</span>}
              </div>

              {user ? (
                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-semibold text-slate-800">{user.name}</p>
                    <p className="text-xs text-slate-500 capitalize">{user.role.toLowerCase()}</p>
                  </div>
                  <img src={user.avatar} className="w-8 h-8 rounded-full ring-2 ring-slate-100" alt="Avatar" />
                  <button onClick={onLogout} className="text-slate-400 hover:text-red-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                  </button>
                </div>
              ) : (
                <button className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">Login</button>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="flex-grow">
        {children}
      </main>
      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          &copy; 2024 NexusCommerce Platform. Powered by Gemini AI.
        </div>
      </footer>
    </div>
  );
};

export default Layout;
