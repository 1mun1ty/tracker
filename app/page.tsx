'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Clock } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the main app
    router.push('/app');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl shadow-2xl shadow-cyan-500/30 mb-4 animate-pulse">
          <Clock className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          TimeFlow
        </h1>
        <p className="text-slate-400 mt-2">Loading...</p>
      </div>
    </div>
  );
}
