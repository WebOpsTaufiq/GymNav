"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

// --- Inline SVGs mimicking standard Lucide/Feather styles ---
const GridIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
const ChartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
const CardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
const FunnelIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
const MessageIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
const PersonIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
const SparkleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path></svg>
const GearIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
const LogOutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
const BellIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
const MenuIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
const TargetIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>


// --- Navigation Configurations ---
const MAIN_LINKS = [
  { name: 'Dashboard', href: '/dashboard', icon: GridIcon },
  { name: 'Members', href: '/dashboard/members', icon: UsersIcon },
  { name: 'Analytics', href: '/dashboard/analytics', icon: ChartIcon },
  { name: 'Billing', href: '/dashboard/billing', icon: CardIcon },
];

const OP_LINKS = [
  { name: 'Check-In', href: '/dashboard/checkin', icon: CheckIcon },
  { name: 'Leads', href: '/dashboard/leads', icon: FunnelIcon },
];

const CrownIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"></path></svg>

export default function DashboardNav({ user, profile, gym, isOwner, children }: { user: any, profile: any, gym: any, isOwner?: boolean, children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Auto-close mobile menu gracefully when changing pages
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  const getPageTitle = () => {
    const allLinks = [...MAIN_LINKS, ...OP_LINKS, { name: 'Settings', href: '/dashboard/settings'}, { name: 'AI Concierge', href: '/dashboard/concierge'}];
    const activeRoute = allLinks.find(l => l.href === pathname);
    return activeRoute ? activeRoute.name : 'Overview';
  };

  const NavItem = ({ name, href, icon: Icon, isAi = false }: any) => {
    const active = pathname === href;
    
    if (isAi) {
      return (
        <Link href={href} className={`group flex items-center justify-between px-4 py-3 mt-4 text-sm font-bold rounded-2xl transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 ${active ? 'bg-[#111111] text-[#ccff00] ring-1 ring-[#ccff00]' : 'bg-[#ccff00] text-[#111111] border border-[#ccff00]/50'}`}>
           <div className="flex items-center gap-3">
             <Icon />
             {name}
           </div>
        </Link>
      );
    }

    return (
      <Link href={href} className={`group flex items-center gap-3 px-4 py-3 text-sm rounded-2xl transition-all font-bold ${active ? 'bg-[#111111] text-white shadow-md' : 'text-gray-500 hover:text-[#111111] hover:bg-gray-50'}`}>
         <span className={`${active ? 'text-[#ccff00]' : 'text-gray-400 group-hover:text-gray-600'}`}><Icon /></span>
         {name}
      </Link>
    );
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#FAFAFA] text-[#111111] font-sans selection:bg-[#ccff00] selection:text-[#111111]">
      
      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-[#111111]/40 backdrop-blur-sm block md:hidden transition-opacity" 
          onClick={() => setMobileOpen(false)} 
        />
      )}
      
      {/* Sidebar - fixed left 240px */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-[260px] bg-white border-r border-gray-100 transform transition-transform duration-300 ease-in-out md:translate-x-0 flex flex-col ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Sidebar Logo Header */}
        <div className="h-20 flex items-center px-8 border-b border-gray-50 shrink-0">
           <span className="font-black text-2xl tracking-tighter text-[#111111]">GymNav</span>
        </div>

        {/* Sidebar Navigation Container */}
        <div className="flex-1 overflow-y-auto py-8 px-5 space-y-10 flex flex-col">
           <div>
             <h3 className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Main</h3>
             <nav className="space-y-1.5">
               {MAIN_LINKS.map(link => <NavItem key={link.href} {...link} />)}
             </nav>
           </div>
           
           <div>
             <h3 className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Operations</h3>
             <nav className="space-y-1.5">
               {OP_LINKS.map(link => <NavItem key={link.href} {...link} />)}
             </nav>
           </div>

           <div className="mt-8 pt-6 border-t border-gray-50">
             <h3 className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">AI</h3>
             <nav className="space-y-1">
               <NavItem name="AI Concierge" href="/dashboard/concierge" icon={SparkleIcon} isAi={true} />
             </nav>
           </div>

           {isOwner && (
             <div className="mt-auto pt-8">
               <h3 className="px-4 text-[10px] font-black text-[#ccff00] uppercase tracking-widest mb-3">Platform Owner</h3>
               <nav>
                 <Link href="/admin" className="group flex items-center justify-between px-5 py-4 bg-[#111111] rounded-[20px] text-white shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-800">
                    <div className="flex items-center gap-3">
                      <div className="text-[#ccff00]"><CrownIcon /></div>
                      <span className="text-xs font-black uppercase tracking-wider">Super Admin</span>
                    </div>
                 </Link>
               </nav>
             </div>
           )}
        </div>

        {/* Sidebar Footer - Settings & User Context */}
        <div className="shrink-0 p-5 mt-auto">
           <div className="mb-4">
             <NavItem name="Settings" href="/dashboard/settings" icon={GearIcon} />
           </div>
           
           <div className="pt-4 border-t border-gray-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#ccff00] text-[#111111] flex items-center justify-center font-black uppercase tracking-wider text-sm shadow-sm shrink-0">
                {profile?.full_name ? profile.full_name.charAt(0) : 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-[#111111] truncate leading-tight">{gym?.name || "Your Gym"}</p>
                <p className="text-xs font-bold text-gray-400 capitalize">{profile?.role || "Owner"}</p>
              </div>
              <button 
                onClick={handleLogout} 
                className="p-2 text-gray-400 hover:text-[#111111] hover:bg-gray-100 rounded-xl transition-colors" 
                title="Log out"
              >
                 <LogOutIcon />
              </button>
           </div>
        </div>

      </aside>

      {/* Main Window Frame */}
      <div className="flex-1 flex flex-col min-w-0 md:ml-[260px] transition-all duration-300">
        
        {/* Topbar sticky header */}
        <header className="h-20 bg-[#FAFAFA]/80 backdrop-blur-md border-b border-gray-100/50 flex items-center justify-between px-6 sm:px-12 shrink-0 relative z-30 transition-all">
          <div className="flex items-center gap-6">
            <button className="md:hidden p-2 -ml-2 text-gray-500 hover:text-[#111111] rounded-xl transition-colors cursor-pointer" onClick={() => setMobileOpen(true)}>
               <MenuIcon />
            </button>
            <h1 className="text-3xl font-black text-[#111111] tracking-tighter">{getPageTitle()}</h1>
          </div>
          
          <div className="flex items-center gap-5">
             <button className="p-2.5 text-gray-400 hover:text-[#111111] rounded-full hover:bg-gray-100 transition-colors">
                <BellIcon />
             </button>
             <div className="w-10 h-10 rounded-xl bg-[#111111] text-[#ccff00] flex items-center justify-center text-sm font-black shadow-lg shadow-black/10 cursor-pointer hover:scale-105 transition-transform">
               {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : 'U'}
             </div>
          </div>
        </header>

        {/* Dynamic Content Body */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-12">
           <div className="max-w-[1400px] mx-auto">
             {children}
           </div>
        </main>

      </div>
    </div>
  );
}
