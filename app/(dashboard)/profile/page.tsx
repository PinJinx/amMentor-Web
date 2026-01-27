'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FaGithub,
  FaGitlab,
  FaTwitter,
  FaAt,
  FaSignOutAlt,
} from 'react-icons/fa';
import { useAuth } from '@/app/context/authcontext';
import { getUserByEmail } from '@/lib/api';

const ProfilePage = () => {
  const { logout, isInitialized, isLoggedIn } = useAuth();
  const router = useRouter();

  const [user, setUser] = useState<{ 
    name: string; 
    email: string; 
    role: string; 
    id: number;
    position?: number;
    total_points?: number;
    mentees_count?: number; 
  } | null>(null);
  
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (!isInitialized || hasRedirected) return;

      if (!isLoggedIn) {
        setHasRedirected(true);
        router.push('/login');
        return;
      }

      const cachedProfile = sessionStorage.getItem("cache_profile");
      if (cachedProfile) {
        setUser(JSON.parse(cachedProfile));
        return;
      }

      const email = localStorage.getItem('email');
      if (!email) {
        setHasRedirected(true);
        router.push('/login');
        return;
      }

      try {
        const data = await getUserByEmail(email);
        setUser(data);
        sessionStorage.setItem("cache_profile", JSON.stringify(data));
      } catch (err) {
        console.error('Failed to fetch user:', err);
        setHasRedirected(true);
        router.push('/login');
      }
    };

    fetchUser();
  }, [isInitialized, isLoggedIn, hasRedirected, router]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!user)
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-v1-bg-main">
        <div className="loader"></div>
      </div>
    );

  const isMentor = user.role === 'mentor';

  return (
    <div className="min-h-screen bg-v1-bg-main text-v1-text-white pt-16 pb-20 px-4 md:px-6 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="relative group overflow-hidden rounded-[40px] border border-white/5 bg-v1-bg-input/60 backdrop-blur-xl p-8 md:p-12 shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-v1-primary-yellow/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="flex flex-col md:flex-row items-center md:items-start w-full gap-8 md:gap-12 mb-12">
              <div className="relative">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-[3px] border-v1-primary-yellow flex items-center justify-center overflow-hidden bg-v1-bg-main shadow-[0_0_30px_rgba(254,196,48,0.1)]">
                   <span className="text-5xl md:text-6xl font-black text-v1-text-white italic">
                    {user.name.charAt(0)}
                  </span>
                </div>
                <div className="absolute bottom-2 right-4 w-6 h-6 bg-v1-green border-4 border-v1-bg-input rounded-full"></div>
              </div>
              <div className="flex flex-col items-center md:items-start flex-1">
                <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-2 text-v1-text-white uppercase italic">
                  {user.name}
                </h1>
                <p className="text-v1-text-muted text-lg mb-1">{user.email}</p>
                <p className="text-v1-primary-yellow font-bold uppercase tracking-widest text-sm">
                  {isMentor ? 'Mentor' : 'Mentee'} @ AMFOSS
                </p>

                {/* Social Icons */}
                <div className="flex gap-6 mt-6 text-v1-text-muted">
                  <Link href="#"><FaGithub size={22} className="hover:text-v1-text-white transition-all hover:scale-110" /></Link>
                  <Link href="#"><FaTwitter size={22} className="hover:text-v1-text-white transition-all hover:scale-110" /></Link>
                  <Link href="#"><FaGitlab size={22} className="hover:text-v1-text-white transition-all hover:scale-110" /></Link>
                  <Link href="#"><FaAt size={22} className="hover:text-v1-text-white transition-all hover:scale-110" /></Link>
                </div>
              </div>

              {/* Logout Action */}
              <div className="md:ml-auto">
                <button
                  onClick={handleLogout}
                  className="bg-v1-primary-yellow text-v1-bg-main px-8 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-v1-primary-yellow-hover transition-all shadow-[0_0_20px_rgba(254,196,48,0.2)] active:scale-95 text-sm uppercase tracking-wider"
                >
                  Logout <FaSignOutAlt size={14} />
                </button>
              </div>
            </div>

            {/* Visual Separator */}
            <div className="w-full h-[1px] bg-white/5 mb-10"></div>

            {/* Dynamic Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 w-full gap-8">
              <div className="flex flex-col items-center md:items-start">
                <p className="text-v1-text-muted uppercase tracking-tighter font-bold text-xs mb-1">
                  {isMentor ? 'Active Mentees' : 'Tasks Completed'}
                </p>
                <p className="text-4xl font-black text-v1-text-white">
                  {isMentor ? (user.mentees_count || '12') : '10'}
                </p>
              </div>

              <div className="flex flex-col items-center md:items-start">
                <p className="text-v1-text-muted uppercase tracking-tighter font-bold text-xs mb-1">Global Rank</p>
                <p className="text-4xl font-black text-v1-text-white">
                  #{user.position || (isMentor ? '42' : '15')}
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;