import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { PlayingAtom } from '~/store.ts';

function useAudioPlayer(audioRef: React.RefObject<HTMLAudioElement>) {
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [playing, setPlaying] = useRecoilState(PlayingAtom);
  const [clickedTime, setClickedTime] = useState<number>(0);

  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;

      const setAudioData = () => {
        setDuration(audio.duration);
        setCurrentTime(audio.currentTime);
      };
      const setAudioTime = () => setCurrentTime(audio.currentTime);

      audio.addEventListener('loadeddata', setAudioData);
      audio.addEventListener('timeupdate', setAudioTime);

      playing ? audio.play() : audio.pause();

      if (clickedTime && clickedTime !== currentTime) {
        audio.currentTime = clickedTime;
        setClickedTime(0);
      }

      setAudioData();
      setAudioTime();

      return () => {
        audio.removeEventListener('loadeddata', setAudioData);
        audio.removeEventListener('timeupdate', setAudioTime);
      };
    }
  }, [audioRef, playing, clickedTime]);

  return {
    currentTime,
    duration,
    playing,
    setPlaying,
    setClickedTime,
  };
}

export default useAudioPlayer;
