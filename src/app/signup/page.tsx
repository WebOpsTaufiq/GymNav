"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Target, Loader2, AlertCircle, ArrowRight, Building, MapPin, Users } from "lucide-react";
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
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8 group w-max mx-auto">
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center transition-transform group-hover:scale-105">
            <Target className="w-5 h-5 text-white stroke-[2.5]" />
          </div>
          <span className="font-semibold text-2xl tracking-tight text-slate-900">GymNav</span>
        </Link>
        <h2 className="text-center text-3xl font-bold tracking-tight text-slate-900">
          {step === 1 ? "Create your account" : "Set up your gym"}
        </h2>
        <p className="mt-2 text-center text-sm text-slate-500">
          {step === 1 ? (
            <>Already have an account? <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">Sign in</Link></>
          ) : (
            "You're almost there! Tell us about your facility."
          )}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm border border-slate-200 sm:rounded-2xl sm:px-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-slate-100">
             <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: step === 1 ? '50%' : '100%' }}></div>
          </div>

          {step === 1 ? (
            <form className="space-y-5" onSubmit={handleStep1}>
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-slate-700">Full Name</label>
                <div className="mt-1">
                  <input id="fullName" type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} className="block w-full rounded-lg border-0 py-2.5 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm" placeholder="John Doe" />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email address</label>
                <div className="mt-1">
                  <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="block w-full rounded-lg border-0 py-2.5 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm" placeholder="owner@gym.com" />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700">Password</label>
                <div className="mt-1">
                  <input id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="block w-full rounded-lg border-0 py-2.5 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm" placeholder="••••••••" />
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700">Confirm Password</label>
                <div className="mt-1">
                  <input id="confirmPassword" type="password" required minLength={6} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="block w-full rounded-lg border-0 py-2.5 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm" placeholder="••••••••" />
                </div>
              </div>

              <div className="pt-2">
                <button type="submit" disabled={loading} className="flex w-full justify-center items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-600 disabled:opacity-70 disabled:cursor-not-allowed">
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Continue <ArrowRight className="w-4 h-4 ml-1" /></>}
                </button>
              </div>
            </form>
          ) : (
            <form className="space-y-5" onSubmit={handleStep2}>
              <div>
                <label htmlFor="gymName" className="block text-sm font-medium text-slate-700">Gym Name</label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Building className="h-5 w-5 text-slate-400" aria-hidden="true" />
                  </div>
                  <input id="gymName" type="text" required value={gymName} onChange={(e) => setGymName(e.target.value)} className="block w-full rounded-lg border-0 py-2.5 pl-10 px-3 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm" placeholder="Iron Paradise" />
                </div>
              </div>
              
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-slate-700">City</label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <MapPin className="h-5 w-5 text-slate-400" aria-hidden="true" />
                  </div>
                  <input id="city" type="text" required value={city} onChange={(e) => setCity(e.target.value)} className="block w-full rounded-lg border-0 py-2.5 pl-10 px-3 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm" placeholder="Mumbai" />
                </div>
              </div>

              <div>
                <label htmlFor="members" className="block text-sm font-medium text-slate-700">Approx. Members</label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Users className="h-5 w-5 text-slate-400" aria-hidden="true" />
                  </div>
                  <select id="members" value={memberCount} onChange={(e) => setMemberCount(e.target.value)} className="block w-full rounded-lg border-0 py-3 pl-10 px-3 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm bg-white">
                    <option value="Under 50">Under 50</option>
                    <option value="50-100">50-100</option>
                    <option value="100-300">100-300</option>
                    <option value="300+">300+</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button type="submit" disabled={loading} className="flex w-full justify-center items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-600 disabled:opacity-70 disabled:cursor-not-allowed">
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Complete Setup"}
                </button>
              </div>
            </form>
          )}

          {error && (
            <div className="mt-6 flex items-start p-4 bg-red-50 border border-red-100 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600 font-medium leading-relaxed">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
