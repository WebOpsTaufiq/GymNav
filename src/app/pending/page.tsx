'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

function PendingContent() {
  const searchParams = useSearchParams();
  const reason = searchParams.get('reason');

  const CONTENT = {
    pending: {
      title: 'Approval Pending',
      message: 'Your account is pending approval. Our team is verifying your payment and details.',
      instruction: 'Payment received? Your account will be activated within a few hours.'
    },
    suspended: {
      title: 'Account Suspended',
      message: 'Your account has been suspended by the administrator.',
      instruction: 'Please contact support to resolve any issues.'
    },
    expired: {
      title: 'Subscription Expired',
      message: 'Your subscription has expired. Access to the dashboard is restricted.',
      instruction: 'Please renew your plan to continue using GymNav.'
    }
  };

  const current = (reason as keyof typeof CONTENT) in CONTENT 
    ? CONTENT[reason as keyof typeof CONTENT] 
    : CONTENT.pending;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center">
        <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-indigo-600">
           <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        </div>
        
        <h1 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">{current.title}</h1>
        <p className="text-slate-600 mb-6 font-medium leading-relaxed">
          {current.message}
        </p>
        
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 mb-8">
           <p className="text-sm font-bold text-slate-800">{current.instruction}</p>
           <p className="text-sm text-slate-500 mt-2 font-medium">Questions? Contact support via WhatsApp:</p>
           <a 
             href={`https://wa.me/${process.env.NEXT_PUBLIC_OWNER_WHATSAPP}`} 
             className="text-indigo-600 font-black text-lg block mt-1 hover:underline tracking-tight"
           >
             {process.env.NEXT_PUBLIC_OWNER_WHATSAPP}
           </a>
        </div>
        
        <div className="space-y-3">
           <Link href="/login" className="block w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-slate-800 transition-colors shadow-lg">
              Return to Login
           </Link>
           <button onClick={() => window.location.reload()} className="block w-full py-4 bg-white text-slate-900 border border-slate-200 rounded-2xl font-black text-sm hover:bg-slate-50 transition-colors">
              Refresh Status
           </button>
        </div>
      </div>
    </div>
  );
}

export default function PendingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-pulse font-black text-slate-400">Loading Status...</div>
      </div>
    }>
      <PendingContent />
    </Suspense>
  );
}
