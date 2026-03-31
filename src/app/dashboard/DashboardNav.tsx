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
  { name: 'Schedule', href: '/dashboard/schedule', icon: CalendarIcon },
  { name: 'Analytics', href: '/dashboard/analytics', icon: ChartIcon },
  { name: 'Billing', href: '/dashboard/billing', icon: CardIcon },
];

const OP_LINKS = [
  { name: 'Check-In', href: '/dashboard/checkin', icon: CheckIcon },
  { name: 'Leads', href: '/dashboard/leads', icon: FunnelIcon },
  { name: 'Communications', href: '/dashboard/comms', icon: MessageIcon },
  { name: 'Staff', href: '/dashboard/staff', icon: PersonIcon },
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
    
    // Spec: "AI Concierge — style this differently. Indigo background pill, white text, sparkle icon. Makes it feel premium."
    if (isAi) {
      return (
        <Link href={href} className={`group flex items-center justify-between px-4 py-2.5 mt-4 text-sm font-semibold rounded-full text-white shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 ${active ? 'bg-indigo-700 ring-2 ring-indigo-300 ring-offset-1 ring-offset-white' : 'bg-gradient-to-r from-indigo-500 to-purple-600'}`}>
           <div className="flex items-center gap-3">
             <Icon />
             {name}
           </div>
        </Link>
      );
    }

    // Spec: "Active nav item: indigo background, white text, slightly rounded. Inactive: gray text, hover darkens slightly."
    return (
      <Link href={href} className={`group flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors ${active ? 'bg-indigo-600 text-white font-medium shadow-sm' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100 font-medium'}`}>
         <span className={`${active ? 'text-indigo-100' : 'text-slate-400 group-hover:text-slate-500'}`}><Icon /></span>
         {name}
      </Link>
    );
  };

  return (
    // Default light mode shell via bg-slate-50 (#f8fafc equivalent in tailwind)
    <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm block md:hidden transition-opacity" 
          onClick={() => setMobileOpen(false)} 
        />
      )}
      
      {/* Sidebar - fixed left 240px */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-[240px] bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out md:translate-x-0 flex flex-col ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Sidebar Logo Header */}
        <div className="h-16 flex items-center px-6 border-b border-slate-100 shrink-0">
           <span className="font-bold text-lg tracking-tight text-slate-900">GymNav</span>
        </div>

        {/* Sidebar Navigation Container */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8 flex flex-col">
           <div>
             <h3 className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">Main</h3>
             <nav className="space-y-1">
               {MAIN_LINKS.map(link => <NavItem key={link.href} {...link} />)}
             </nav>
           </div>
           
           <div>
             <h3 className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">Operations</h3>
             <nav className="space-y-1">
               {OP_LINKS.map(link => <NavItem key={link.href} {...link} />)}
             </nav>
           </div>

           <div className="mt-8 pt-4 border-t border-slate-100">
             <h3 className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">AI</h3>
             <nav className="space-y-1">
               <NavItem name="AI Concierge" href="/dashboard/concierge" icon={SparkleIcon} isAi={true} />
             </nav>
           </div>

           {isOwner && (
             <div className="mt-auto pt-8">
               <h3 className="px-3 text-[11px] font-bold text-indigo-400 uppercase tracking-wider mb-2">Platform Owner</h3>
               <nav>
                 <Link href="/admin" className="group flex items-center justify-between px-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-white shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-0.5 transition-all">
                    <div className="flex items-center gap-3">
                      <CrownIcon />
                      <span className="text-xs font-black uppercase tracking-wider">Super Admin</span>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]"></div>
                 </Link>
               </nav>
             </div>
           )}
        </div>

        {/* Sidebar Footer - Settings & User Context */}
        <div className="shrink-0 p-4 border-t border-slate-200 bg-slate-50/50">
           <div className="mb-4">
             <NavItem name="Settings" href="/dashboard/settings" icon={GearIcon} />
           </div>
           
           <div className="pt-4 border-t border-slate-200 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white text-indigo-700 flex items-center justify-center font-bold uppercase text-sm border border-slate-300 shadow-sm shrink-0">
                {profile?.full_name ? profile.full_name.charAt(0) : 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate leading-tight">{gym?.name || "Your Gym"}</p>
                <p className="text-xs font-medium text-slate-500 capitalize">{profile?.role || "Owner"}</p>
              </div>
              <button 
                onClick={handleLogout} 
                className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-200 rounded-md transition-colors" 
                title="Log out"
              >
                 <LogOutIcon />
              </button>
           </div>
        </div>

      </aside>

      {/* Main Window Frame */}
      <div className="flex-1 flex flex-col min-w-0 md:ml-[240px] transition-all duration-300">
        
        {/* Topbar sticky header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 shrink-0 relative z-30 shadow-sm">
          <div className="flex items-center gap-4">
            <button className="md:hidden p-2 -ml-2 text-slate-500 hover:text-slate-900 rounded-md transition-colors cursor-pointer" onClick={() => setMobileOpen(true)}>
               <MenuIcon />
            </button>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">{getPageTitle()}</h1>
          </div>
          
          <div className="flex items-center gap-4">
             <button className="p-2 text-slate-400 hover:text-slate-900 rounded-full hover:bg-slate-50 transition-colors">
                <BellIcon />
             </button>
             <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-bold border border-indigo-200 shadow-sm cursor-pointer hover:bg-indigo-200 transition-colors">
               {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : 'U'}
             </div>
          </div>
        </header>

        {/* Dynamic Content Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
           <div className="max-w-6xl mx-auto">
             {children}
           </div>
        </main>

      </div>
    </div>
  );
}
