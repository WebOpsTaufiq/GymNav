"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Target, Loader2, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  
  const router = useRouter();
  const supabase = createClient();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setLoading(true);
    setError(null);
    setMessage(null);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError("Please enter your email address first to reset password.");
      return;
    }
    
    setLoading(true);
    setError(null);
    setMessage(null);
    
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location?.origin || ''}/dashboard/settings`,
    });

    if (resetError) {
      setError(resetError.message);
    } else {
      setMessage("Password reset link sent to your email.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex font-sans selection:bg-[#ccff00] selection:text-[#111111]">
      
      {/* LEFT COLUMN: Login Form */}
      <div className="w-full lg:w-[45%] flex flex-col justify-center px-8 sm:px-16 lg:px-24 bg-white relative z-10 lg:rounded-r-[40px] shadow-[20px_0_60px_rgba(0,0,0,0.03)] selection:bg-[#ccff00] min-h-screen transition-all">
        <div className="w-full max-w-md mx-auto">
          {/* Logo Space (Text Only) */}
          <div className="mb-16 w-full flex justify-start">
            <Link href="/" className="font-bold text-2xl tracking-tight text-[#111111] hover:opacity-80 transition-opacity">GymNav</Link>
          </div>

          {/* Headings */}
          <div className="animate-fade-in-up" style={{ animationFillMode: 'both' }}>
            <h2 className="text-5xl font-black tracking-tighter text-[#111111] mb-3">
              Welcome back.
            </h2>
            <p className="text-lg text-gray-500 mb-10 font-medium">
              Log in to your workspace or{" "}
              <Link href="/signup" className="text-[#111111] underline decoration-2 decoration-[#ccff00] hover:text-[#ccff00] transition-colors">
                start your free trial
              </Link>.
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6 animate-fade-in-up" style={{ animationDelay: '100ms', animationFillMode: 'both' }} onSubmit={handleSignIn}>
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-[#111111] mb-2 uppercase tracking-wide">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-2xl border-0 bg-gray-50 py-4 px-5 text-[#111111] font-medium shadow-sm ring-1 ring-inset ring-transparent focus:bg-white focus:ring-2 focus:ring-inset focus:ring-[#111111] transition-all outline-none"
                placeholder="owner@gym.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-bold text-[#111111] uppercase tracking-wide">
                  Password
                </label>
                <button 
                  type="button" 
                  onClick={handleResetPassword}
                  className="text-sm font-semibold text-gray-500 hover:text-[#111111] transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-2xl border-0 bg-gray-50 py-4 px-5 text-[#111111] font-medium shadow-sm ring-1 ring-inset ring-transparent focus:bg-white focus:ring-2 focus:ring-inset focus:ring-[#111111] transition-all outline-none"
                placeholder="••••••••"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="group w-full flex items-center justify-between rounded-full bg-[#111111] p-2 pr-6 text-white text-lg font-bold transition-all hover:bg-[#ccff00] hover:text-[#111111] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <div className="w-12 h-12 bg-white/10 group-hover:bg-[#111111] rounded-full flex items-center justify-center transition-colors">
                  {loading ? (
                    <Loader2 className="w-6 h-6 animate-spin text-white group-hover:text-[#ccff00]" />
                  ) : (
                    <ArrowRight className="w-6 h-6 text-white group-hover:text-[#ccff00]" />
                  )}
                </div>
                <span>Sign In Securely</span>
              </button>
            </div>
          </form>

          {/* Alerts */}
          {error && (
            <div className="mt-8 flex items-start p-4 bg-red-50 border border-red-100 rounded-2xl animate-fade-in-up">
              <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600 font-bold leading-relaxed">{error}</p>
            </div>
          )}

          {message && (
            <div className="mt-8 flex items-start p-4 bg-green-50 border border-green-100 rounded-2xl animate-fade-in-up">
              <CheckCircle2 className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-700 font-bold leading-relaxed">{message}</p>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: Illustration / Details */}
      <div className="hidden lg:flex lg:w-[55%] relative flex-col items-center justify-center p-12 overflow-hidden bg-[#FAFAFA]">
        
        {/* Abstract Background Blur Orbs */}
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-[#ccff00] rounded-full mix-blend-multiply opacity-20 blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-slate-200 rounded-full mix-blend-multiply opacity-50 blur-[120px]"></div>

        {/* Floating UI Composition */}
        <div className="relative w-full max-w-lg z-10 animate-fade-in-up" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
          
          {/* Main Glass Dashboard Widget */}
          <div className="bg-white/60 backdrop-blur-xl border border-white/80 p-10 rounded-[40px] shadow-[0_40px_80px_rgba(0,0,0,0.06)] transform hover:-translate-y-2 transition-transform duration-500">
            <div className="flex items-center justify-between mb-10">
              <div className="w-14 h-14 bg-[#111111] rounded-full flex items-center justify-center shadow-lg">
                <Target className="w-7 h-7 text-[#ccff00]" />
              </div>
              <div className="px-5 py-2.5 bg-white rounded-full text-xs font-black tracking-widest uppercase text-[#111111] shadow-sm">
                Live Gym OS
              </div>
            </div>

            <div className="space-y-5">
              <div className="h-4 w-1/3 bg-gray-200/80 rounded-full"></div>
              <div className="h-12 w-4/5 bg-[#111111] rounded-2xl"></div>
              <div className="h-4 w-1/2 bg-gray-200/80 rounded-full"></div>
            </div>

            {/* Micro Widgets */}
            <div className="mt-10 grid grid-cols-2 gap-5">
              <div className="p-6 bg-white rounded-[32px] shadow-sm flex flex-col justify-center">
                <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">MRR</div>
                <div className="text-3xl font-black tracking-tighter text-[#111111]">$42.8k</div>
              </div>
              <div className="p-6 bg-[#ccff00] rounded-[32px] shadow-sm flex flex-col justify-center transform hover:scale-105 transition-transform duration-300">
                <div className="text-sm font-bold text-[#111111]/60 uppercase tracking-wider mb-2">Check-ins</div>
                <div className="text-3xl font-black tracking-tighter text-[#111111]">+142</div>
              </div>
            </div>
            
          </div>
          
          {/* Decorative Floating Pill */}
          <div className="absolute -right-12 top-24 bg-white px-6 py-4 rounded-full shadow-[0_20px_40px_rgba(0,0,0,0.08)] animate-bounce" style={{ animationDuration: '3s' }}>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-bold tracking-tight text-[#111111]">Auto-billing active</span>
            </div>
          </div>

        </div>

        {/* Bottom Text Statement */}
        <div className="absolute bottom-12 text-center w-full">
          <p className="text-[#111111] font-bold text-xl tracking-tight opacity-50">
            Your Gym. On Autopilot.
          </p>
        </div>

      </div>
      
    </div>
  );
}

