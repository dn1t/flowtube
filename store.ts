import { atom } from 'recoil';
import { Track } from '~/lib/getAlbum.ts';

export const PlayingAtom = atom({
  key: 'playing',
  default: false,
});

export const AudioUrlAtom = atom<string>({
  key: 'audioUrl',
  default: undefined,
});

export const NowPlayingAtom = atom<Track & { lyrics: string }>({
  key: 'nowPlaying',
  default: undefined,
});
