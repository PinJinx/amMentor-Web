'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/authcontext';
import { Brain, Code, Smartphone, Monitor, Award, HelpCircle } from 'lucide-react';
import { fetchTracks as apiFetchTracks } from '@/lib/api';

export default function TrackSelectionPage() {
  const [selectedTrack, setSelectedTrack] = useState<number>(-1);
  const [tracks, updatetracks] = useState<{ id: number; name: string; icon: React.ElementType }[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasRedirected, setHasRedirected] = useState(false);
  const { userRole, isLoggedIn } = useAuth();
  const router = useRouter();

  const { isInitialized } = useAuth();

  useEffect(() => {
    if (!isInitialized || hasRedirected) return; // wait for auth hydration and prevent duplicate redirects

    if (!isLoggedIn) {
      setHasRedirected(true);
      router.push('/');
      return;
    }
    if (userRole === 'Mentor') {
      setHasRedirected(true);
      router.push('/dashboard');
      return;
    }
    if (userRole !== 'Mentee') {
      setHasRedirected(true);
      router.push('/');
      return;
    }

    async function fetchdata() {
      try {
  const icons_set = {1:Brain,2:Code,3:Smartphone,4:Monitor,5:Award};
  const response: { id: number; title: string }[] = await apiFetchTracks();

        const updatedTracks = response.map((element) => ({
          id: element.id,
          name: element.title,
          icon: icons_set[element.id as keyof typeof icons_set] || HelpCircle, 
        }));
        updatetracks(updatedTracks);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch tracks:', error);
        setLoading(false);
      }
    }
    fetchdata();
  }, [router, userRole, isLoggedIn, isInitialized, hasRedirected]);

  const handleTrackSelect = (trackId: number) => {
    setSelectedTrack(trackId);
    
    const selectedTrackObj = tracks.find(track => track.id === trackId);
    if (selectedTrackObj) {
      sessionStorage.setItem('currentTrack', JSON.stringify({
        id: selectedTrackObj.id,
        name: selectedTrackObj.name
      }));
    }
    
    router.push('/dashboard');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center w-full">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[360px] mx-auto">
      <div className="space-y-6">
        <div>
          <div className="text-v1-text-white flex justify-center items-center text-4xl font-bold">
            amMENT<span className="text-v1-primary-yellow">&lt;&gt;</span>R
          </div>

          <div className="text-center mt-3">
            <p className="text-v1-text-muted text-[11px] tracking-[0.15em] uppercase font-medium">
              Select a Track
            </p>
          </div>
        </div>
        <div className="space-y-3">
          {tracks.map((track) => {
            const IconComponent = track.icon;
            const active = selectedTrack === track.id;

            return (
              <button
                key={track.id}
                onClick={() => handleTrackSelect(track.id)}
                className={`
                  w-full flex items-center px-4 py-3.5 rounded-xl
                  border transition-all
                  ${
                    active
                      ? "bg-v1-primary-yellow text-black border-v1-primary-yellow"
                      : "bg-v1-bg-input text-v1-text-white border-v1-bg-hover hover:border-v1-bg-hover-strong"
                  }
                `}
              >
                <div
                  className={`
                    w-9 h-9 rounded-full flex items-center justify-center mr-4
                    ${
                      active
                        ? "bg-black text-v1-primary-yellow"
                        : "bg-v1-bg-hover text-v1-primary-yellow"
                    }
                  `}
                >
                  <IconComponent size={18} />
                </div>

                <span className="text-[15px] font-medium">
                  {track.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}