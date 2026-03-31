import { createClient } from '@/lib/supabase/server';
import RevenueChart from '@/components/dashboard/revenue-chart';
import AiBriefing from '@/components/dashboard/ai-briefing';
import Link from 'next/link';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <div>Unauthorized. Please log in.</div>;
  }

  const { data: profile } = await supabase.from('profiles').select('gym_id').eq('id', user.id).single();
  const gymId = profile?.gym_id;

  if (!gymId) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center max-w-lg mx-auto">
         <div className="w-24 h-24 bg-[#ccff00] rounded-[32px] flex items-center justify-center mb-10 text-[#111111] shadow-lg animate-bounce-slow">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
         </div>
         <h2 className="text-4xl font-black text-[#111111] mb-4 tracking-tighter">Initialize Workspace</h2>
         <p className="text-gray-500 font-bold leading-relaxed mb-12 max-w-md">Your facility data isn't mapped yet. Run the activation sequence to initiate your management OS.</p>
         <Link href="/onboarding" className="group flex items-center justify-between rounded-full bg-[#111111] p-2 pr-6 text-white text-lg font-bold transition-all hover:bg-[#ccff00] hover:text-[#111111]">
            <div className="w-12 h-12 bg-white/10 group-hover:bg-[#111111] rounded-full flex items-center justify-center transition-colors mr-4">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-white group-hover:text-[#ccff00]" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </div>
            <span>Complete Setup</span>
         </Link>
      </div>
    );
  }

  // --- Date Scoping ---
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const sixMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 5, 1);

  // --- Mass Server DB Fetch (Parallel Execution) ---
  const [
    { data: activeMembers },
    { count: newMembersCount },
    { count: checkinsTodayCount },
    { count: failedPaymentsCount },
    { data: paymentsLast6Months },
    { data: recentCheckins },
    { data: recentMembers },
    { data: recentPayments }
  ] = await Promise.all([
    supabase.from('members').select('id, plan_price').eq('gym_id', gymId).eq('status', 'active'),
    supabase.from('members').select('*', { count: 'exact', head: true }).eq('gym_id', gymId).gte('created_at', firstDayOfMonth.toISOString()),
    supabase.from('checkins').select('*', { count: 'exact', head: true }).eq('gym_id', gymId).gte('checked_in_at', today.toISOString()),
    supabase.from('payments').select('*', { count: 'exact', head: true }).eq('gym_id', gymId).eq('status', 'failed'),
    supabase.from('payments').select('amount, paid_at').eq('gym_id', gymId).eq('status', 'paid').gte('paid_at', sixMonthsAgo.toISOString()),
    supabase.from('checkins').select('id, checked_in_at, members(full_name)').eq('gym_id', gymId).order('checked_in_at', { ascending: false }).limit(8),
    supabase.from('members').select('id, created_at, full_name').eq('gym_id', gymId).order('created_at', { ascending: false }).limit(8),
    supabase.from('payments').select('id, paid_at, amount, members(full_name)').eq('gym_id', gymId).eq('status', 'paid').order('paid_at', { ascending: false }).limit(8)
  ]);

  const totalMembersCount = activeMembers?.length || 0;
  const mrr = activeMembers?.reduce((acc, m) => acc + (Number(m.plan_price) || 0), 0) || 0;
  const hasData = totalMembersCount > 0;

  // --- Process Revenue Grouping (Last 6 Months) ---
  const revenueByMonth = new Map();
  for (let i = 5; i >= 0; i--) {
     const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
     const key = d.toLocaleString('en-US', { month: 'short' });
     revenueByMonth.set(key, 0);
  }
  paymentsLast6Months?.forEach(p => {
     const d = new Date(p.paid_at);
     const key = d.toLocaleString('en-US', { month: 'short' });
     if (revenueByMonth.has(key)) {
        revenueByMonth.set(key, revenueByMonth.get(key) + Number(p.amount));
     }
  });
  const chartData = Array.from(revenueByMonth.entries()).map(([name, revenue]) => ({ name, revenue }));

  // --- Merge Activity Timeline ---
  const activities: any[] = [];
  recentCheckins?.forEach(c => activities.push({ type: 'checkin', text: `${(c.members as any)?.full_name || 'Member'} checked in`, date: new Date(c.checked_in_at) }));
  recentMembers?.forEach(m => activities.push({ type: 'new_member', text: `${m.full_name} joined the gym`, date: new Date(m.created_at) }));
  recentPayments?.forEach(p => activities.push({ type: 'payment', text: `${(p.members as any)?.full_name || 'Member'} paid ₹${p.amount}`, date: new Date(p.paid_at) }));
  
  activities.sort((a, b) => b.date.getTime() - a.date.getTime());
  const finalActivities = activities.slice(0, 8);

  return (
    <div className="space-y-6">
       
       {/* 1. KPI CARDS ROW */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
         <KPICard 
            title="Total Members" 
            value={totalMembersCount} 
            subtext={`↑ ${newMembersCount || 0} joined this month`} 
            subtextIsPositive={true}
            isEmpty={!hasData}
         />
         <KPICard 
            title="MRR" 
            value={`₹${mrr.toLocaleString('en-IN')}`} 
            subtext={`+0% vs last month`} 
            subtextIsPositive={true}
            isEmpty={!hasData}
         />
         <KPICard 
            title="Today's Check-ins" 
            value={checkinsTodayCount || 0} 
            subtext="Currently marked active"
            isEmpty={!hasData}
         />
         <KPICard 
            title="Pending / Failed Payments" 
            value={failedPaymentsCount || 0} 
            subtext={(failedPaymentsCount || 0) > 0 ? 'Requires immediate action' : 'All accounts clear'}
            isAlert={(failedPaymentsCount || 0) > 0}
            isEmpty={!hasData}
         />
       </div>

       {/* 2. AI MORNING BRIEFING CARD */}
       <AiBriefing />

       {/* 3. TWO COLUMN LAYOUT */}
       <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 bg-white p-8 rounded-[40px] border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.02)] flex flex-col min-h-[400px]">
             <h2 className="text-2xl font-black text-[#111111] tracking-tighter mb-1">Revenue Trend</h2>
             <p className="text-sm font-bold text-gray-400">Trailing volume analytics</p>
             <div className="flex-1 mt-6">
                <RevenueChart data={chartData} hasData={hasData} />
             </div>
          </div>
          
          <div className="lg:col-span-2 space-y-6">
              {/* ACTIVITY FEED */}
             <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.02)]">
                <h2 className="text-2xl font-black text-[#111111] tracking-tighter mb-6">Live Feed</h2>
                {!hasData ? (
                   <div className="text-center py-10 bg-[#FAFAFA] rounded-[24px]">
                      <p className="text-sm font-bold text-gray-400 mb-4">Awaiting telemetry.</p>
                      <Link href="/dashboard/members" className="text-sm font-black text-[#111111] border-b-2 border-[#ccff00] hover:text-[#ccff00] transition-colors">
                         Add first member &rarr;
                      </Link>
                   </div>
                ) : finalActivities.length > 0 ? (
                   <div className="space-y-4">
                       {finalActivities.map((act, i) => (
                         <div key={i} className="flex gap-4 items-center p-3 rounded-2xl hover:bg-[#FAFAFA] transition-colors">
                            <div className="w-10 h-10 rounded-full bg-[#FAFAFA] flex items-center justify-center shrink-0 border border-gray-100">
                               {act.type === 'checkin' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                               {act.type === 'new_member' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ccff00" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>}
                               {act.type === 'payment' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-[13px] text-[#111111] font-bold truncate leading-tight">{act.text}</p>
                            </div>
                         </div>
                      ))}
                   </div>
                ) : (
                   <p className="text-sm font-medium text-slate-500 text-center py-6">No recent activity on record.</p>
                )}
             </div>
          </div>
       </div>
    </div>
  );
}

function KPICard({ title, value, subtext, subtextIsPositive, isAlert = false, isEmpty = false }: any) {
  return (
    <div className={`bg-white p-8 rounded-[40px] border flex flex-col h-full justify-between transition-transform duration-300 hover:-translate-y-1 ${isAlert ? 'border-red-500 shadow-[0_10px_40px_rgba(239,68,68,0.1)]' : 'border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.02)]'}`}>
      <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{title}</h3>
      
      <div className="mt-6 mb-4">
        {isEmpty ? (
          <p className="text-4xl font-black tracking-tighter text-gray-200">-</p>
        ) : (
          <p className={`text-4xl font-black tracking-tighter ${isAlert ? 'text-red-500' : 'text-[#111111]'}`}>{value}</p>
        )}
      </div>
      
      {!isEmpty && subtext && (
        <p className={`text-xs font-bold leading-tight ${subtextIsPositive ? 'text-[#ccff00] bg-[#111111] px-2 py-1 rounded w-max' : isAlert ? 'text-red-500' : 'text-gray-400'}`}>
          {subtext}
        </p>
      )}
      
      {isEmpty && (
        <Link href="/dashboard/members" className="text-[10px] font-black text-[#111111] uppercase tracking-widest border-b border-[#111111] w-max hover:text-[#ccff00] hover:border-[#ccff00] transition-colors mt-2 pb-0.5">
          Map Data
        </Link>
      )}
    </div>
  );
}
