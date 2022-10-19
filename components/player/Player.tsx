import { useEffect, useRef, useState } from 'react';
import { useRecoilState } from 'recoil';
import useAudioPlayer from '~/hooks/useAudioPlayer.ts';
import Bar from '~/components/player/Bar.tsx';
import Cover from '~/components/player/Cover.tsx';
import TrackInfo from '~/components/player/TrackInfo.tsx';
import { AudioUrlAtom, NowPlayingAtom } from '~/store.ts';
import {
  Add,
  Alert,
  Backward,
  FilledLike,
  Forward,
  Like,
  Loop,
  Mute,
  Pause,
  Play,
  Queue,
  Shuffle,
  Volume,
} from '~/components/icon/index.ts';
import VolumeBar from '~/components/player/VolumeBar.tsx';

function formatTime(time: number | string) {
  let M = 0;
  let S = Number.parseInt(time.toString());

  while (S - 60 >= 0) {
    M += 1;
    S -= 60;
  }

  return `${M.toString().padStart(2, '0')}:${S.toString().padStart(2, '0')}`;
}

function Player() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioUrl, setAudioUrl] = useRecoilState(AudioUrlAtom);
  const [nowPlaying, setNowPlaying] = useRecoilState(NowPlayingAtom);
  const { currentTime, duration, playing, setPlaying, setClickedTime } =
    useAudioPlayer(audioRef);
  const buttonContainerRef = useRef<HTMLDivElement>(null);
  const [liked, setLiked] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(55);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume / 100;
  }, [volume]);

  return (
    <section className='bg-dark-900/90 backdrop-blur-sm rounded-t-xl w-full fixed bottom-0 z-50'>
      <audio
        src={audioUrl}
        ref={audioRef}
        controls={false}
        onVolumeChange={(e) =>
          setVolume(Math.round((e.target as HTMLAudioElement).volume * 100))
        }
      />
      <div className='max-w-[110rem] mx-auto flex items-center justify-center gap-x-10 px-10 py-6'>
        <div className='flex items-center justify-center gap-x-6'>
          <Cover url={nowPlaying?.album?.cover} />
          <TrackInfo
            id={nowPlaying?.id}
            name={nowPlaying?.name}
            artists={nowPlaying?.artists}
          />
        </div>
        <div className='w-full max-w-4xl flex flex-col items-center mx-auto'>
          <div className='w-full flex items-center justify-between mb-4'>
            <div
              className='flex items-center gap-x-1.5'
              ref={buttonContainerRef}
            >
              <button className='bg-dark-800 h-9 w-9 flex items-center justify-center rounded-lg'>
                {liked ? <FilledLike onClick={() => {}} /> : <Like />}
              </button>
              <button className='bg-dark-800 h-9 w-9 flex items-center justify-center rounded-lg'>
                <Add />
              </button>
              <button className='bg-dark-800 h-9 w-9 flex items-center justify-center rounded-lg'>
                <Queue />
              </button>
              <button className='bg-dark-800 h-9 w-9 flex items-center justify-center rounded-lg'>
                <Alert />
              </button>
            </div>
            <div className='flex items-center gap-x-5'>
              <Loop onClick={() => {}} />
              <Backward onClick={() => {}} />
              {playing ? (
                <Pause onClick={() => setPlaying(false)} />
              ) : (
                <Play onClick={() => setPlaying(true)} />
              )}
              <Forward onClick={() => {}} />
              <Shuffle onClick={() => {}} />
            </div>
            <div
              className='flex items-center gap-x-2'
              style={{ width: buttonContainerRef.current?.offsetWidth }}
            >
              {muted || volume === 0 ? (
                <Mute
                  onClick={() => {
                    if (volume === 0) setVolume(100);
                    setMuted(false);
                  }}
                />
              ) : (
                <Volume onClick={() => setMuted(true)} />
              )}
              <VolumeBar
                muted={muted}
                volume={volume}
                onVolumeChange={(volume) => setVolume(volume)}
              />
              <span className='min-w-9 max-w-9 text-white text-sm text-left block font-light'>
                {volume}%
              </span>
            </div>
          </div>
          <div className='w-full flex items-center gap-x-3'>
            <span className='text-sm text-white leading-none'>
              {nowPlaying ? formatTime(Math.floor(currentTime)) : '--:--'}
            </span>
            <Bar
              currentTime={currentTime}
              duration={duration}
              setClickedTime={setClickedTime}
            />
            <span className='text-sm text-white leading-none'>
              {nowPlaying ? formatTime(Math.floor(duration)) : '--:--'}
            </span>
          </div>
        </div>
        <div className='w-[304px] flex items-center justify-center gap-x-6 flex-shrink-0'>
          <section
            className={`bg-rose-500 flex w-full h-20 rounded-xl px-3 py-1.5 transition-opacity duration-300 ${
              nowPlaying ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <span className='text-sm font-semibold text-white'>가사</span>
          </section>
        </div>
      </div>
    </section>
  );
}

export default Player;
