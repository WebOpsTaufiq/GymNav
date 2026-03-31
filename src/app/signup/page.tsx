"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Target, Loader2, AlertCircle, ArrowRight, Building, MapPin, Users, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Step 1 states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  // Step 2 states
  const [gymName, setGymName] = useState("");
  const [city, setCity] = useState("");
  const [memberCount, setMemberCount] = useState("Under 50");

  const router = useRouter();
  const supabase = createClient();

  const handleStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    
    setLoading(true);
    setError(null);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        }
      }
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    // IF Supabase demands email confirmation, the session is NULL.
    // We seamlessly bypass this by calling our secure server API to auto-confirm them!
    if (!data.session && data.user) {
      try {
        await fetch('/api/confirm-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: data.user.id })
        });

        // Now that the backend considers them confirmed, programmatically sign them in to grab the session token
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (signInError) throw signInError;
      } catch (err: any) {
         setError("Auto-login bypass failed: " + err.message);
         setLoading(false);
         return;
      }
    }

    if (data.user) {
      setUserId(data.user.id);
      setStep(2);
    } else {
      setError("Failed to create account. Please try again.");
    }
    
    setLoading(false);
  };

  const handleStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      setError("User authentication context lost. Please start over.");
      setStep(1);
      return;
    }

    setLoading(true);
    setError(null);

    // 1. Insert into gyms
    const { data: gymData, error: gymError } = await supabase
      .from('gyms')
      .insert({
        name: gymName,
        city: city,
        member_count_estimate: memberCount,
        owner_id: userId
      })
      .select()
      .single();

    if (gymError) {
      console.error(gymError);
      setError("Failed to create gym workspace: " + gymError.message);
      setLoading(false);
      return;
    }

    // 2. Insert into profiles
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        gym_id: gymData.id,
        full_name: fullName,
        role: 'owner'
      });

    if (profileError) {
      console.error(profileError);
      setError("Failed to create user profile: " + profileError.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex font-sans selection:bg-[#ccff00] selection:text-[#111111]">
      
      {/* LEFT COLUMN: Signup Form */}
      <div className="w-full lg:w-[45%] flex flex-col justify-center px-8 sm:px-14 lg:px-20 bg-white relative z-10 lg:rounded-r-[40px] shadow-[20px_0_60px_rgba(0,0,0,0.03)] selection:bg-[#ccff00] min-h-screen transition-all py-12">
        <div className="w-full max-w-md mx-auto">
          {/* Logo Space (Text Only) */}
          <div className="mb-12 w-full flex justify-start">
            <Link href="/" className="font-bold text-2xl tracking-tight text-[#111111] hover:opacity-80 transition-opacity">GymNav</Link>
          </div>

          {/* Headings */}
          <div className="animate-fade-in-up" style={{ animationFillMode: 'both' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1">
                <div className={`w-10 h-1.5 rounded-full transition-colors duration-500 ${step === 1 ? 'bg-[#111111]' : 'bg-gray-200'}`}></div>
                <div className={`w-10 h-1.5 rounded-full transition-colors duration-500 ${step === 2 ? 'bg-[#111111]' : 'bg-gray-200'}`}></div>
              </div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-2">Step {step} of 2</span>
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-black tracking-tighter text-[#111111] mb-3">
              {step === 1 ? "Start your free trial." : "Set up your gym."}
            </h2>
            <p className="text-lg text-gray-500 mb-10 font-medium">
              {step === 1 ? (
                <>Already have an account? <Link href="/login" className="text-[#111111] underline decoration-2 decoration-[#ccff00] hover:text-[#ccff00] transition-colors">Sign in</Link>.</>
              ) : (
                "You're almost there! Tell us about your facility."
              )}
            </p>
          </div>

          {/* Form */}
          <div className="animate-fade-in-up" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
            {step === 1 ? (
              <form className="space-y-5" onSubmit={handleStep1}>
                <div>
                  <label htmlFor="fullName" className="block text-xs font-bold text-[#111111] mb-2 uppercase tracking-wide">Full Name</label>
                  <input id="fullName" type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} className="block w-full rounded-2xl border-0 bg-gray-50 py-3.5 px-5 text-[#111111] font-medium shadow-sm ring-1 ring-inset ring-transparent focus:bg-white focus:ring-2 focus:ring-inset focus:ring-[#111111] transition-all outline-none" placeholder="John Doe" />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-xs font-bold text-[#111111] mb-2 uppercase tracking-wide">Email address</label>
                  <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="block w-full rounded-2xl border-0 bg-gray-50 py-3.5 px-5 text-[#111111] font-medium shadow-sm ring-1 ring-inset ring-transparent focus:bg-white focus:ring-2 focus:ring-inset focus:ring-[#111111] transition-all outline-none" placeholder="owner@gym.com" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="password" className="block text-xs font-bold text-[#111111] mb-2 uppercase tracking-wide">Password</label>
                    <input id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="block w-full rounded-2xl border-0 bg-gray-50 py-3.5 px-5 text-[#111111] font-medium shadow-sm ring-1 ring-inset ring-transparent focus:bg-white focus:ring-2 focus:ring-inset focus:ring-[#111111] transition-all outline-none" placeholder="••••••••" />
                  </div>
                  <div>
                    <label htmlFor="confirmPassword" className="block text-xs font-bold text-[#111111] mb-2 uppercase tracking-wide">Confirm</label>
                    <input id="confirmPassword" type="password" required minLength={6} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="block w-full rounded-2xl border-0 bg-gray-50 py-3.5 px-5 text-[#111111] font-medium shadow-sm ring-1 ring-inset ring-transparent focus:bg-white focus:ring-2 focus:ring-inset focus:ring-[#111111] transition-all outline-none" placeholder="••••••••" />
                  </div>
                </div>

                <div className="pt-4">
                  <button type="submit" disabled={loading} className="group w-full flex items-center justify-between rounded-full bg-[#111111] p-2 pr-6 text-white text-lg font-bold transition-all hover:bg-[#ccff00] hover:text-[#111111] disabled:opacity-70 disabled:cursor-not-allowed">
                    <div className="w-12 h-12 bg-white/10 group-hover:bg-[#111111] rounded-full flex items-center justify-center transition-colors">
                      {loading ? <Loader2 className="w-6 h-6 animate-spin text-white group-hover:text-[#ccff00]" /> : <ArrowRight className="w-6 h-6 text-white group-hover:text-[#ccff00]" />}
                    </div>
                    <span>Continue to Setup</span>
                  </button>
                </div>
              </form>
            ) : (
              <form className="space-y-5 animate-fade-in-up" onSubmit={handleStep2}>
                <div>
                  <label htmlFor="gymName" className="block text-xs font-bold text-[#111111] mb-2 uppercase tracking-wide">Gym Name</label>
                  <div className="relative rounded-2xl shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                      <Building className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input id="gymName" type="text" required value={gymName} onChange={(e) => setGymName(e.target.value)} className="block w-full rounded-2xl border-0 bg-gray-50 py-3.5 pl-12 px-5 text-[#111111] font-medium shadow-sm ring-1 ring-inset ring-transparent focus:bg-white focus:ring-2 focus:ring-inset focus:ring-[#111111] transition-all outline-none" placeholder="Iron Paradise" />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="city" className="block text-xs font-bold text-[#111111] mb-2 uppercase tracking-wide">City</label>
                  <div className="relative rounded-2xl shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                      <MapPin className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input id="city" type="text" required value={city} onChange={(e) => setCity(e.target.value)} className="block w-full rounded-2xl border-0 bg-gray-50 py-3.5 pl-12 px-5 text-[#111111] font-medium shadow-sm ring-1 ring-inset ring-transparent focus:bg-white focus:ring-2 focus:ring-inset focus:ring-[#111111] transition-all outline-none" placeholder="Mumbai" />
                  </div>
                </div>

                <div>
                  <label htmlFor="members" className="block text-xs font-bold text-[#111111] mb-2 uppercase tracking-wide">Approx. Members</label>
                  <div className="relative rounded-2xl shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                      <Users className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <select id="members" value={memberCount} onChange={(e) => setMemberCount(e.target.value)} className="block w-full rounded-2xl border-0 bg-gray-50 py-3.5 pl-12 px-5 text-[#111111] font-medium shadow-sm ring-1 ring-inset ring-transparent focus:bg-white focus:ring-2 focus:ring-inset focus:ring-[#111111] transition-all outline-none appearance-none">
                      <option value="Under 50">Under 50</option>
                      <option value="50-100">50-100</option>
                      <option value="100-300">100-300</option>
                      <option value="300+">300+</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4">
                  <button type="submit" disabled={loading} className="group w-full flex items-center justify-between rounded-full bg-[#111111] p-2 pr-6 text-white text-lg font-bold transition-all hover:bg-[#ccff00] hover:text-[#111111] disabled:opacity-70 disabled:cursor-not-allowed">
                    <div className="w-12 h-12 bg-white/10 group-hover:bg-[#111111] rounded-full flex items-center justify-center transition-colors">
                      {loading ? <Loader2 className="w-6 h-6 animate-spin text-white group-hover:text-[#ccff00]" /> : <CheckCircle2 className="w-6 h-6 text-white group-hover:text-[#ccff00]" />}
                    </div>
                    <span>Complete Setup</span>
                  </button>
                </div>
              </form>
            )}

            {/* Alerts */}
            {error && (
              <div className="mt-8 flex items-start p-4 bg-red-50 border border-red-100 rounded-2xl animate-fade-in-up">
                <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-600 font-bold leading-relaxed">{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Illustration / Details */}
      <div className="hidden lg:flex lg:w-[55%] relative flex-col items-center justify-center p-12 overflow-hidden bg-[#FAFAFA]">
        
        {/* Abstract Background Blur Orbs */}
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#ccff00] rounded-full mix-blend-multiply opacity-20 blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-slate-200 rounded-full mix-blend-multiply opacity-50 blur-[120px]"></div>

        {/* Floating UI Composition */}
        <div className="relative w-full max-w-lg z-10 animate-fade-in-up" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
          
          {/* Main Glass Dashboard Widget */}
          <div className="bg-white/60 backdrop-blur-xl border border-white/80 p-10 rounded-[40px] shadow-[0_40px_80px_rgba(0,0,0,0.06)] transform hover:-translate-y-2 transition-transform duration-500">
            <div className="flex items-center justify-between mb-10">
              <div className="w-14 h-14 bg-[#111111] rounded-full flex items-center justify-center shadow-lg">
                <Target className="w-7 h-7 text-[#ccff00]" />
              </div>
              <div className="px-5 py-2.5 bg-white rounded-full text-xs font-black tracking-widest uppercase text-[#111111] shadow-sm">
                Launch Control
              </div>
            </div>

            <div className="space-y-5">
              <div className="h-4 w-1/3 bg-gray-200/80 rounded-full"></div>
              <div className="h-12 w-4/5 bg-[#111111] rounded-2xl"></div>
              <div className="h-4 w-1/2 bg-gray-200/80 rounded-full"></div>
            </div>

            {/* Micro Widgets */}
            <div className="mt-10 grid grid-cols-2 gap-5">
              <div className="p-6 bg-[#ccff00] rounded-[32px] shadow-sm flex flex-col justify-center transform hover:scale-105 transition-transform duration-300">
                <div className="text-sm font-bold text-[#111111]/60 uppercase tracking-wider mb-2">Activation</div>
                <div className="text-3xl font-black tracking-tighter text-[#111111]">Instant</div>
              </div>
              <div className="p-6 bg-white rounded-[32px] shadow-sm flex flex-col justify-center">
                <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Capacity</div>
                <div className="text-3xl font-black tracking-tighter text-[#111111]">Unlimited</div>
              </div>
            </div>
          </div>
          
          {/* Decorative Floating Pill */}
          <div className="absolute -left-12 top-32 bg-white px-6 py-4 rounded-full shadow-[0_20px_40px_rgba(0,0,0,0.08)] animate-bounce" style={{ animationDuration: '3.5s' }}>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-bold tracking-tight text-[#111111]">Workspace initializing</span>
            </div>
          </div>

        </div>

        {/* Bottom Text Statement */}
        <div className="absolute bottom-12 text-center w-full">
          <p className="text-[#111111] font-bold text-xl tracking-tight opacity-50">
            Automate renewals. Stop chasing payments.
          </p>
        </div>

      </div>
      
    </div>
  );
}
