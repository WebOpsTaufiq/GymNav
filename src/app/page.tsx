"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { CheckCircle2, ChevronDown, Check, Target, Zap, Clock, Users, AlertCircle, RefreshCw, BarChart3, MessageSquare, Smartphone, ArrowRight } from "lucide-react";

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const faqData = [
    { q: "Is the setup fee refundable?", a: "The setup fee covers our team's time integrating your existing sheets and systems. While it is non-refundable, it ensures a seamless zero-downtime transition." },
    { q: "Can my members pay directly through the platform?", a: "Yes! We integrate with popular payment gateways allowing your users to pay seamlessly via UPI, Cards, or Netbanking." },
    { q: "Do I need technical knowledge to use this?", a: "Not at all. The platform is designed to be as simple as Notion or standard CRMs. If you can use WhatsApp or Excel, you can use our system." },
    { q: "What happens if I cross my plan's member limit?", a: "We will automatically notify you before you hit the limit. You can seamlessly upgrade to the next tier from your billing dashboard without any disruption." },
    { q: "Is there a mobile app?", a: "The platform is a meticulously responsive web app, functioning flawlessly on mobile browsers. We also provide a PWA you can save to your homescreen." }
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#111111] font-sans selection:bg-[#ccff00] selection:text-[#111111] overflow-hidden">
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? "bg-[#FAFAFA]/90 backdrop-blur-md py-4" : "bg-transparent py-6"}`}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
             <span className="font-bold text-2xl tracking-tight">GymNav</span>
          </Link>
          <div className="hidden md:flex items-center space-x-10 bg-white/60 backdrop-blur-md px-8 py-3 rounded-full border border-gray-200/50 shadow-sm">
            <Link href="#features" className="text-sm font-semibold text-gray-500 hover:text-[#111111] transition-colors">How it works</Link>
            <Link href="#pricing" className="text-sm font-semibold text-gray-500 hover:text-[#111111] transition-colors">Pricing</Link>
            <Link href="#faq" className="text-sm font-semibold text-gray-500 hover:text-[#111111] transition-colors">FAQ</Link>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/login" className="text-sm font-semibold text-[#111111] hover:text-gray-500 transition-colors">Login</Link>
            <Link href="/signup" className="text-sm font-semibold bg-white border border-gray-200 text-[#111111] px-6 py-3 rounded-full hover:bg-gray-50 transition-colors shadow-sm tracking-wide">
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-32">
        {/* HERO SECTION */}
        <section className="pt-20 pb-32 px-6 md:px-12 max-w-[1400px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Floating UI Abstract */}
            <div className="relative h-[600px] w-full hidden lg:block">
               <div className="absolute inset-0 bg-[#F4F4F5] rounded-[40px] m-8 border border-gray-100 flex items-center justify-center overflow-hidden">
                  {/* Abstract Background Elements */}
                  <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#ccff00]/20 rounded-full blur-[100px]" />
               </div>

               {/* Floating Card 1: Metric */}
               <div className="absolute top-16 left-0 bg-white p-6 rounded-[24px] shadow-[0_20px_40px_rgba(0,0,0,0.06)] border border-gray-100 w-72 transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                  <p className="text-sm font-semibold text-gray-500 mb-4">Total Active Members</p>
                  <div className="flex items-end gap-4 border-b border-gray-100 pb-6 mb-4">
                     <span className="text-5xl font-black tracking-tighter">1,273</span>
                     <span className="bg-[#ccff00] text-[#111111] text-xs font-bold px-2 py-1 rounded-md mb-2 flex items-center gap-1"><Zap className="w-3 h-3" /> +12%</span>
                  </div>
                  <div className="w-full h-12 bg-gray-50 rounded-xl relative overflow-hidden">
                     <div className="absolute top-0 left-0 h-full w-[80%] bg-[#111111] rounded-xl" />
                     <div className="absolute top-0 left-0 h-full w-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+MGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVybk1hcHBpbmc9InVzZXJTcGFjZU9uVXNlIj48cGF0dCBkPSJNMCAwbDQwIDQwbTAtNDBMMCA0MCIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9Ijc2MDAlIiBoZWlnaHQ9Ijc2MDAlIiBmaWxsPSJ1cmwoI2EpIiAvPjwvc3ZnPg==')] opacity-20 pointer-events-none" />
                  </div>
               </div>

               {/* Floating Card 2: Revenue */}
               <div className="absolute top-1/2 -translate-y-1/2 -right-8 bg-white p-6 rounded-[24px] shadow-[0_30px_60px_rgba(0,0,0,0.08)] border border-gray-100 w-80 transform rotate-2 hover:rotate-0 transition-transform duration-500 z-10">
                  <div className="flex items-center gap-4 mb-6">
                     <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center">
                        <BarChart3 className="w-6 h-6 text-[#111111]" />
                     </div>
                     <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Revenue</p>
                        <p className="text-2xl font-black tracking-tight">$10,928</p>
                     </div>
                  </div>
                  <div className="flex gap-2 h-24 items-end">
                      {[40, 70, 45, 90, 65, 100, 85].map((h, i) => (
                        <div key={i} className="flex-1 bg-gray-100 rounded-lg overflow-hidden relative">
                           <div className={`absolute bottom-0 w-full rounded-lg ${i === 5 ? 'bg-[#c084fc]' : 'bg-[#111111]'}`} style={{ height: `${h}%` }} />
                        </div>
                      ))}
                  </div>
               </div>

               {/* Floating Card 3: Small badge */}
               <div className="absolute bottom-24 left-12 bg-white px-5 py-4 rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-gray-100 flex items-center gap-4 z-20">
                  <div className="w-8 h-8 rounded-full bg-[#111111] flex items-center justify-center">
                     <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#111111]">Zero Failed Payments</p>
                    <p className="text-xs text-gray-500 font-medium">Auto-retries active</p>
                  </div>
               </div>
            </div>

            {/* Right: Typography setup */}
            <div className="max-w-xl mx-auto lg:mx-0">
               <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-gray-200 text-xs font-semibold text-gray-500 mb-8 shadow-sm">
                 <span className="w-2 h-2 rounded-full bg-[#ccff00]"></span>
                 Connecting operations
               </div>
               
               <h1 className="text-6xl md:text-[80px] font-black tracking-tighter leading-[1.05] mb-8">
                 Your Gym <br />
                 Runs Itself with <br />
                 <span className="text-[#111111]">GymNav</span>
               </h1>

               <p className="text-xl text-gray-500 mb-12 leading-relaxed font-medium">
                 Imagine a day where payments are collected, members are notified, and your gym works for you, not against you.
               </p>

               <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-16">
                 <Link href="/signup" className="group flex items-center bg-[#111111] text-white px-2 py-2 rounded-full font-semibold hover:bg-black transition-all hover:scale-105 duration-300">
                   <span className="px-6">Start for Free</span>
                   <div className="w-10 h-10 rounded-full bg-[#ccff00] flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
                     <ArrowRight className="w-5 h-5 text-[#111111]" />
                   </div>
                 </Link>
                 <Link href="#how-it-works" className="flex items-center gap-2 font-bold text-gray-600 hover:text-[#111111] transition-colors">
                   Learn more <ArrowRight className="w-4 h-4" />
                 </Link>
               </div>
            </div>
          </div>
        </section>

        {/* FEATURES GRID SECTION (Tools That Work...) */}
        <section id="features" className="py-32 px-6 md:px-12 max-w-[1400px] mx-auto">
           <div className="text-center max-w-2xl mx-auto mb-20">
              <div className="inline-block px-3 py-1.5 rounded-full bg-white border border-gray-200 text-xs font-semibold text-gray-500 mb-6 shadow-sm">
                 Facility operations
              </div>
              <h2 className="text-5xl font-black tracking-tighter mb-6 leading-tight">Gym owners spend more time chasing payments...</h2>
              <p className="text-lg text-gray-500 font-medium leading-relaxed">
                 ...than running their actual business. We flip the script so operations feel effortless.
              </p>
           </div>

           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Inverted Card */}
              <div className="bg-[#111111] p-8 rounded-[32px] text-white flex flex-col justify-between group shadow-[0_20px_40px_rgba(0,0,0,0.1)]">
                 <div>
                    <div className="w-14 h-14 rounded-2xl bg-[#ccff00] flex items-center justify-center mb-8">
                       <RefreshCw className="w-6 h-6 text-[#111111]" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Automate Renewals</h3>
                    <p className="text-gray-400 font-medium leading-relaxed mb-12">
                       Set up automated WhatsApp nudges. Never make an awkward collection call again.
                    </p>
                 </div>
                 <Link href="#" className="font-bold flex items-center gap-2 group-hover:gap-3 transition-all text-[#ccff00]">
                    Explore now <ArrowRight className="w-4 h-4" />
                 </Link>
              </div>

              {/* Standard Cards */}
              <FeatureCard 
                icon={<AlertCircle className="w-6 h-6 text-gray-600" />} 
                title="Failed Payment Fix" 
                desc="Instantly capture UPI or Cash without tracking notebooks leading to revenue leakage." 
              />
              <FeatureCard 
                icon={<Users className="w-6 h-6 text-gray-600" />} 
                title="Member Check-In" 
                desc="Give members a seamless entry experience with active, individualized QR codes." 
              />
              <FeatureCard 
                icon={<BarChart3 className="w-6 h-6 text-gray-600" />} 
                title="Track Revenue" 
                desc="See exact cash flow metrics. Compare P&L instantly without complex spreadsheets." 
              />
           </div>
        </section>

        {/* HOW IT WORKS WIDGET SECTION */}
        <section id="how-it-works" className="py-32 bg-white mt-16 rounded-[60px] max-w-[1400px] mx-auto px-6 md:px-12 shadow-[0_-20px_80px_rgba(0,0,0,0.02)]">
           <div className="text-center max-w-2xl mx-auto mb-20">
              <div className="inline-block px-3 py-1.5 rounded-full bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-500 mb-6">
                 Timely reminders
              </div>
              <h2 className="text-5xl font-black tracking-tighter mb-6 leading-tight">Sort operational importance, never miss a beat</h2>
              <p className="text-lg text-gray-500 font-medium leading-relaxed">
                 Get feedback, share updates, and keep your entire gym staff aligned effortlessly.
              </p>
           </div>

           <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h3 className="text-4xl font-black tracking-tighter mb-6">Sort tasks by priority and dates</h3>
                <p className="text-lg text-gray-500 font-medium leading-relaxed mb-10">
                  Whether you import members from excel or add them manually, smart WhatsApp and SMS nudges are sent exactly on schedule.
                </p>
                <Link href="/signup" className="group inline-flex items-center bg-[#111111] text-white px-2 py-2 rounded-full font-semibold hover:bg-black transition-all hover:scale-105 duration-300">
                  <span className="px-6">Start for Free</span>
                  <div className="w-10 h-10 rounded-full bg-[#ccff00] flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
                    <ArrowRight className="w-5 h-5 text-[#111111]" />
                  </div>
                </Link>
              </div>

              {/* Stacked floating cards visual */}
              <div className="relative h-[500px] bg-[#FAFAFA] rounded-[40px] border border-gray-100 p-8 flex items-center justify-center overflow-hidden w-full">
                 <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[#F4F4F5]" />
                 
                 {/* Main List Card */}
                 <div className="bg-white rounded-[24px] p-8 shadow-[0_20px_40px_rgba(0,0,0,0.05)] border border-gray-100 w-full max-w-sm z-10">
                   <h4 className="font-bold text-xl mb-6">Today's Pipeline</h4>
                   <div className="space-y-4">
                     <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0" />
                        <div className="flex-1">
                           <div className="h-3 bg-gray-200 rounded-full w-3/4 mb-2" />
                           <div className="h-2 bg-gray-200 rounded-full w-1/2" />
                        </div>
                     </div>
                     <div className="flex items-center gap-4 bg-white shadow-[0_10px_20px_rgba(0,0,0,0.06)] p-5 rounded-xl border border-gray-100 transform -translate-x-6 scale-105 relative z-20">
                        <div className="w-10 h-10 rounded-full bg-[#111111] flex items-center justify-center flex-shrink-0">
                           <Zap className="w-5 h-5 text-[#ccff00]" />
                        </div>
                        <div className="flex-1">
                           <div className="text-sm font-bold text-[#111111] mb-1">Renew Subscriptions</div>
                           <div className="text-xs font-semibold text-gray-500">7 Members Expiring</div>
                        </div>
                     </div>
                     <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100 opacity-50">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0" />
                        <div className="flex-1">
                           <div className="h-3 bg-gray-200 rounded-full w-2/3 mb-2" />
                           <div className="h-2 bg-gray-200 rounded-full w-1/3" />
                        </div>
                     </div>
                   </div>
                 </div>

                 {/* Decorative Overlay Card */}
                 <div className="absolute bottom-16 -right-12 bg-white rounded-[24px] p-6 shadow-[0_30px_60px_rgba(0,0,0,0.08)] border border-gray-100 w-72 z-20 transform -rotate-3">
                    <div className="flex justify-between items-center mb-6">
                       <h4 className="font-bold">Sales Rating</h4>
                       <span className="bg-[#111111] text-white text-[10px] font-bold px-3 py-1.5 rounded-full">Top Performer</span>
                    </div>
                    <div className="flex gap-3 h-20 items-end">
                      {[30, 50, 40, 60, 90, 45, 70, 80].map((h, i) => (
                        <div key={i} className="flex-1 bg-gray-100 rounded-lg overflow-hidden relative">
                           <div className={`absolute bottom-0 w-full rounded-lg ${i === 4 ? 'bg-[#c084fc]' : 'bg-gray-300'}`} style={{ height: `${h}%` }} />
                        </div>
                      ))}
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* PRICING */}
        <section id="pricing" className="py-32 px-6 md:px-12 max-w-[1400px] mx-auto border-t border-gray-100 mt-20">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black tracking-tighter mb-6">Simple, predictable pricing</h2>
            <p className="text-lg text-gray-500 font-medium max-w-2xl mx-auto">
               All plans include a one-time setup fee of ₹2,999 to cover full onboarding. No surprises.
            </p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8 items-stretch">
             <PricingCard title="Starter" price="1,999" limits="Up to 100 members" popular={false} features={['Core Member DB', 'Automated Reminders', 'Basic Analytics', 'Email Support']} />
             <PricingCard title="Growth" price="3,999" limits="Up to 300 members" popular={true} features={['All Starter features', 'AI Daily Briefings', 'Lead Pipeline', 'QR Check-in System', 'Priority Support']} />
             <PricingCard title="Pro" price="6,999" limits="Unlimited members" popular={false} features={['All Growth features', 'Multi-location Ready', 'Custom API Access', 'Dedicated Account Manager', 'White-labeled App']} />
          </div>
        </section>

        {/* FAQ SECTION */}
        <section id="faq" className="py-32 px-6 md:px-12 max-w-[900px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black tracking-tighter">Frequently asked questions</h2>
          </div>
          <div className="space-y-4">
             {faqData.map((faq, i) => (
               <div key={i} className={`bg-white rounded-[24px] overflow-hidden transition-all duration-300 border ${activeFaq === i ? 'border-[#111111] shadow-[0_10px_30px_rgba(0,0,0,0.05)]' : 'border-gray-200'}`}>
                 <button 
                   onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                   className="w-full text-left px-8 py-6 flex justify-between items-center focus:outline-none"
                 >
                   <span className="font-bold text-lg">{faq.q}</span>
                   <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${activeFaq === i ? 'bg-[#111111] text-white' : 'bg-gray-100 text-[#111111]'}`}>
                     <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${activeFaq === i ? 'rotate-180' : ''}`} />
                   </div>
                 </button>
                 <div className={`px-8 overflow-hidden transition-all duration-300 ${activeFaq === i ? 'max-h-40 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                   <p className="text-gray-500 font-medium leading-relaxed">{faq.a}</p>
                 </div>
               </div>
             ))}
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-white py-16 border-t border-gray-100">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <Link href="/" className="flex items-center gap-3">
             <span className="font-bold text-2xl tracking-tight">GymNav</span>
          </Link>
          <p className="text-gray-500 text-sm font-medium">© {new Date().getFullYear()} GymNav Technologies. All rights reserved.</p>
          <div className="flex space-x-8 text-sm font-bold">
             <Link href="#" className="text-gray-400 hover:text-[#111111] transition-colors">Privacy</Link>
             <Link href="#" className="text-gray-400 hover:text-[#111111] transition-colors">Terms</Link>
             <Link href="#" className="text-gray-400 hover:text-[#111111] transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ title, desc, icon }: { title: string, desc: string, icon: React.ReactNode }) {
  return (
    <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex flex-col items-start hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all duration-300 group">
      <div className="w-14 h-14 bg-[#FAFAFA] border border-gray-100 rounded-2xl mb-8 flex items-center justify-center group-hover:bg-gray-100 transition-colors">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-gray-500 font-medium leading-relaxed mb-10 flex-1">{desc}</p>
      <Link href="#" className="font-bold flex items-center gap-2 text-[#111111] group-hover:gap-3 transition-all">
         Explore now <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  )
}

function PricingCard({ title, price, limits, popular, features }: { title: string, price: string, limits: string, popular: boolean, features: string[] }) {
  return (
    <div className={`bg-white p-10 rounded-[40px] border flex flex-col h-full relative transition-transform hover:-translate-y-2 duration-500 ${popular ? 'border-[#111111] shadow-[0_30px_60px_rgba(0,0,0,0.1)] lg:-mt-8' : 'border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)]'}`}>
      {popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#ccff00] text-[#111111] text-xs font-black uppercase tracking-widest py-2 px-6 rounded-full shadow-md">
          Most Popular
        </div>
      )}
      <h3 className="text-2xl font-black tracking-tight mb-2">{title}</h3>
      <p className="text-sm font-bold text-gray-400 mb-8">{limits}</p>
      
      <div className="mb-10 flex items-baseline">
         <span className="text-6xl font-black tracking-tighter">₹{price}</span>
         <span className="text-gray-500 font-semibold ml-2">/mo</span>
      </div>
      
      <ul className="space-y-5 mb-12 flex-1">
        {features.map((f, i) => (
          <li key={i} className="flex items-center text-[15px] font-semibold text-gray-600">
             <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-4 flex-shrink-0 ${popular ? 'bg-[#111111] text-white' : 'bg-gray-100 text-[#111111]'}`}>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
             </div>
             {f}
          </li>
        ))}
      </ul>
      
      <Link href="/signup" className={`w-full py-4 rounded-full text-center font-bold transition-all ${popular ? 'bg-[#111111] text-white hover:bg-black hover:shadow-xl' : 'bg-white text-[#111111] border border-gray-200 hover:bg-gray-50'}`}>
        Get Started
      </Link>
    </div>
  )
}
