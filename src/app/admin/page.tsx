import { createClient } from '@/lib/supabase/server';
import { getAdminClient } from '@/lib/supabase/admin';
import Link from 'next/link';
import { AdminActions } from './AdminActions';

export default async function AdminPanel() {
  const supabase = await createClient();
  const supabaseAdmin = getAdminClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.email !== process.env.NEXT_PUBLIC_OWNER_EMAIL) {
    return (
      <div className="min-h-screen flex items-center justify-center font-mono">
         <p className="text-slate-500">404 - Page Not Found</p>
      </div>
    );
  }

  const { data: gyms, error: gymFetchError } = await supabaseAdmin
    .from('gyms')
    .select('*, owner:profiles(id, full_name)')
    .order('created_at', { ascending: false });

  if (gymFetchError) {
    console.error('Gym Fetch Error:', gymFetchError.message);
    console.error('Details:', gymFetchError.details);
    console.error('Hint:', gymFetchError.hint);
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">GymNav Admin Panel</h1>
            <p className="text-slate-500 font-medium">Manage gym authorizations and subscriptions</p>
          </div>
          <div className="px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-xl">
             <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Logged in as Owner</p>
             <p className="text-sm font-black text-indigo-900">{user.email}</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">Gym Name</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">Owner Email</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">Plan</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">Expires</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {gyms?.map((gym: any) => (
                <AdminRow key={gym.id} gym={gym} />
              ))}
              {(!gyms || gyms.length === 0) && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-medium italic">
                    No gyms found in the system.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AdminRow({ gym }: { gym: any }) {
  return (
    <tr className="hover:bg-slate-50/50 transition-colors">
      <td className="px-6 py-5">
        <p className="text-sm font-black text-slate-900">{gym.name}</p>
        <p className="text-[10px] font-bold text-slate-400 uppercase">{gym.city}</p>
      </td>
      <td className="px-6 py-5 align-middle">
        <p className="text-sm font-medium text-slate-600">
          {(Array.isArray(gym.owner) ? gym.owner[0] : gym.owner)?.full_name || 'N/A'}
        </p>
      </td>
      <td className="px-6 py-5 align-middle">
        <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
          gym.status === 'active' ? 'bg-green-100 text-green-700' :
          gym.status === 'pending' ? 'bg-amber-100 text-amber-700' :
          gym.status === 'suspended' ? 'bg-red-100 text-red-700' :
          'bg-slate-100 text-slate-700'
        }`}>
          {gym.status}
        </span>
      </td>
      <td className="px-6 py-5 align-middle">
        <span className="text-xs font-black text-slate-900 uppercase">{gym.plan}</span>
      </td>
      <td className="px-6 py-5 align-middle">
        <p className="text-sm font-medium text-slate-600">
          {gym.expires_at ? new Date(gym.expires_at).toLocaleDateString() : '-'}
        </p>
      </td>
      <td className="px-6 py-5 align-middle">
         {/* Using a client component for the actions to handle the dropdown/fetch */}
         <AdminActions gymId={gym.id} currentStatus={gym.status} />
      </td>
    </tr>
  );
}

