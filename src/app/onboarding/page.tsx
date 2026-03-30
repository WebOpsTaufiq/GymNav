'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Building, MapPin, Users, Loader2, ArrowRight, Target } from 'lucide-react';
import Link from 'next/link';

export default function OnboardingPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gymName, setGymName] = useState("");
  const [city, setCity] = useState("");
  const [memberCount, setMemberCount] = useState("Under 50");
  
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user found.");

      // 1. Create the gym (status: pending by default)
      const { data: gymData, error: gymError } = await supabase
        .from('gyms')
        .insert({
          name: gymName,
          city: city,
          member_count_estimate: memberCount,
          owner_id: user.id,
          status: 'pending' // Enforce pending status for manual approval
        })
        .select()
        .single();

      if (gymError) throw gymError;

      // 2. Update/Upsert the profile with gym_id
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          gym_id: gymData.id,
          role: 'owner'
        });

      if (profileError) throw profileError;

      // 3. Success! Go to dashboard (middleware will handle the /pending redirect)
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to complete onboarding.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8 group w-max mx-auto">
          <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center shadow-lg">
            <Target className="w-6 h-6 text-white stroke-[2.5]" />
          </div>
          <span className="font-black text-2xl tracking-tighter text-slate-900">GymNav</span>
        </div>
        
        <h2 className="text-center text-3xl font-black tracking-tight text-slate-900 mb-2">Create Your Workspace</h2>
        <p className="text-center text-slate-500 font-medium mb-10">Tell us about your facility to get started.</p>
        
        <div className="bg-white py-10 px-8 shadow-2xl border border-slate-200 rounded-[2.5rem] relative overflow-hidden">
           <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Gym Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Building className="h-5 w-5 text-slate-300" />
                  </div>
                  <input 
                    type="text" 
                    required 
                    value={gymName} 
                    onChange={(e) => setGymName(e.target.value)}
                    className="block w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-slate-900 font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]" 
                    placeholder="e.g. Iron Paradise" 
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">City</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-slate-300" />
                  </div>
                  <input 
                    type="text" 
                    required 
                    value={city} 
                    onChange={(e) => setCity(e.target.value)}
                    className="block w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-slate-900 font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]" 
                    placeholder="e.g. Mumbai" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Approx. Member Count</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Users className="h-5 w-5 text-slate-300" />
                  </div>
                  <select 
                    value={memberCount} 
                    onChange={(e) => setMemberCount(e.target.value)}
                    className="block w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-slate-900 font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"
                  >
                    <option value="Under 50">Under 50</option>
                    <option value="50-100">50-100</option>
                    <option value="100-300">100-300</option>
                    <option value="300+">300+</option>
                  </select>
                </div>
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full flex justify-center items-center gap-3 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-slate-800 transition-all shadow-xl active:scale-95 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Finish Setup <ArrowRight className="w-4 h-4" /></>}
                </button>
              </div>
           </form>

           {error && (
             <div className="mt-8 p-4 bg-red-50 border border-red-100 rounded-xl flex gap-3 items-center text-red-600 font-bold text-xs animate-in fade-in duration-300">
                <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center shrink-0">!</div>
                {error}
             </div>
           )}
        </div>
        
        <p className="mt-8 text-center text-slate-400 text-xs font-bold">
           Logged in as <span className="text-slate-600 underline">Owner</span>. 
           Need help? WhatsApp +91-987-6543-210
        </p>
      </div>
    </div>
  );
}
