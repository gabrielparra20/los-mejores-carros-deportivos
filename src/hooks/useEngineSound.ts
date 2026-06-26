import { useRef, useCallback } from 'react';

const SOUNDS_BASE = '/sounds';

const SOUND_MAP: Record<string, string> = {
  'ferrari-laferrari': 'ferrari-laferrari.mp3',
  'lamborghini-murcielago': 'lamborghini-murcielago.mp3',
  'porsche-918': 'porsche-918.mp3',
  'mclaren-p1': 'mclaren-p1.mp3',
  'bugatti-chiron': 'bugatti-chiron.mp3',
  'ferrari-f40': 'ferrari-laferrari.mp3',
  'lamborghini-aventador': 'lamborghini-murcielago.mp3',
  'porsche-911-gt3': 'porsche-918.mp3',
  'mclaren-720s': 'mclaren-p1.mp3',
  'bugatti-veyron': 'bugatti-chiron.mp3',
};

export function useEngineSound(carId: string | undefined) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const play = useCallback(() => {
    if (!carId || !SOUND_MAP[carId]) return;

    const file = SOUND_MAP[carId];
    const url = `${SOUNDS_BASE}/${file}`;

    /* Re-use or create audio element (no Howler dependency) */
    if (!audioRef.current || audioRef.current.dataset.src !== url) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      const audio = new Audio();
      audio.src = url;
      audio.volume = 0.5;
      audio.preload = 'auto';
      audio.dataset.src = url;
      audioRef.current = audio;
    }

    const a = audioRef.current;
    a.currentTime = 0;
    a.play().catch((err) => {
      /* Browser likely needs user gesture first — ignore silently */
      if (err.name !== 'AbortError') {
        console.warn(`[sound] ${file}:`, err.message);
      }
    });
  }, [carId]);

  const stop = useCallback(() => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);

  return { play, stop };
}
