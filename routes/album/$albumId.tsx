import { Head, Link, useData } from 'aleph/react';
import { Fragment } from 'react';
import { useRecoilState } from 'recoil';
import { findBestMatch } from 'string_similarity';
import {
  Album,
  AlbumInfoWithTracks,
  getAlbumInfo,
  getAlbumTracks,
} from '~/lib/getAlbum.ts';
import { fetchAlbumTracks, searchAlbum } from '~/lib/searchYoutube.ts';
import Cover from '~/components/album/Cover.tsx';
import SmallCover from '~/components/album/SmallCover.tsx';
import { Ellipsis, PlayAlt } from '~/components/icon/index.ts';
import { AudioUrlAtom, NowPlayingAtom, PlayingAtom } from '~/store.ts';

async function getYTAlbumTracks(album: Album) {
  const albumId = await searchAlbum(
    album.name,
    album.artists.map((artist) => artist.name)
  );
  const tracks = await fetchAlbumTracks(albumId);

  return tracks;
}

function unformatLyrics(lyrics: string) {
  return lyrics.split('\n').map((lyric) => {
    const [formattedTime, text] = lyric.match(
      /\[([0-9][0-9]:[0-9][0-9].[0-9][0-9][0-9])\](.*)/
    )!;

    const [M, S, MS] = formattedTime
      .match(/([0-9][0-9]):([0-9][0-9]).([0-9][0-9][0-9])/)!
      .slice(1)
      .map(Number);

    return [(M * 60 + S) * 1000 + MS, text] as [number, string];
  });
}

export const data: Data = {
  get: async (_, ctx) => {
    const albumId = Number.parseInt(ctx.params.albumId);

    const [[info, ytTracks], tracks] = await Promise.all([
      (async () => {
        const albumInfo = await getAlbumInfo(albumId);
        const ytTracks = await getYTAlbumTracks(albumInfo);

        return [albumInfo, ytTracks] as [
          Album,
          { videoId: string; title: string; artist: string }[]
        ];
      })(),
      getAlbumTracks(albumId),
    ]);

    return Response.json({ ...info, tracks, ytTracks });
  },
};

function Album() {
  const {
    data: album,
  }: {
    data: AlbumInfoWithTracks & {
      ytTracks: { videoId: string; title: string; artist: string }[];
    };
  } = useData();
  const [audioUrl, setAudioUrl] = useRecoilState(AudioUrlAtom);
  const [nowPlaying, setNowPlaying] = useRecoilState(NowPlayingAtom);
  const [playing, setPlaying] = useRecoilState(PlayingAtom);

  return (
    <div className='w-full flex flex-col items-center justify-center'>
      <Head>
        <title>FlowTube</title>
        <meta name='description' content='냠냠' />
      </Head>
      <div className='max-w-[110rem] w-full px-10 py-8 mx-auto'>
        <section className='flex items-center gap-x-10 py-10'>
          <Cover url={album.cover} />
          <div className='flex flex-col'>
            <h2 className='text-white text-5xl font-bold'>{album.name}</h2>
            {album.artists.map((artist, i) => (
              <Fragment key={i}>
                <Link
                  to={`/artist/${artist.id}`}
                  className='text-rose-500 text-2xl transition-colors duration-300 hover:text-red-400 hover:underline'
                >
                  {artist.name}
                </Link>
                {i !== album.artists.length - 1 && <span>, </span>}
              </Fragment>
            ))}
            <div className='text-white text-lg font-light flex items-center mt-4'>
              {[album.type, album.genre].map((item, i, array) => (
                <Fragment key={i}>
                  <span>{item}</span>
                  {i !== array.length - 1 && (
                    <span className='text-gray-400 font-light mt-px'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth={1}
                        stroke='currentColor'
                        className='w-6 h-6 rotate-90deg'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='M18 12H6'
                        />
                      </svg>
                    </span>
                  )}
                </Fragment>
              ))}
            </div>
            <div className='text-gray-400 text-lg font-light flex items-center'>
              {[
                [
                  album.releaseDate.slice(0, 4),
                  album.releaseDate.slice(4, 6),
                  album.releaseDate.slice(6, 8),
                ].join('.'),
                album.agency,
              ].map((item, i, array) => (
                <Fragment key={i}>
                  <span>{item}</span>
                  {i !== array.length - 1 && (
                    <span className='text-gray-400 font-light mt-px'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth={1}
                        stroke='currentColor'
                        className='w-6 h-6 rotate-90deg'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='M18 12H6'
                        />
                      </svg>
                    </span>
                  )}
                </Fragment>
              ))}
            </div>
          </div>
        </section>
        <section className='py-8'>
          <h2 className='text-white text-2xl font-semibold'>수록곡</h2>
          <div className='w-full bg-dark-900/70 text-gray-200 text-lg mt-3 rounded-xl'>
            {album.tracks.map((track, i, array) => {
              const { bestMatchIndex } = findBestMatch(
                track.name,
                album.ytTracks.map((ytTrack) => ytTrack.title)
              );
              const mappedYtTrack = album.ytTracks[bestMatchIndex];

              return (
                <div
                  className={`grid grid-cols-[1.5rem_1fr_20rem_2.5rem] px-3.5 py-5.5 translate-colors duration-300 hover:bg-dark-800/70 ${
                    i === 0
                      ? 'rounded-t-xl'
                      : (i === array.length - 1 ? 'rounded-b-xl ' : '') +
                        'border-t border-t-dark-400'
                  }`}
                  data-video-id={mappedYtTrack.videoId}
                  key={i}
                >
                  <div className='w-6 text-gray-500 flex items-center justify-center px-2'>
                    {track.trackNum}
                  </div>
                  <div className='flex items-center gap-x-6 px-4'>
                    <div className='relative'>
                      <SmallCover url={track.album.cover} />
                      <div
                        className='h-16 w-16 absolute top-0 transition-colors duration-300 flex items-center justify-center cursor-pointer hover:bg-black/50'
                        onClick={async () => {
                          setPlaying(false);

                          const params = new URLSearchParams();
                          params.append('trackId', track.id.toString());
                          params.append('videoId', mappedYtTrack.videoId);
                          params.append('quality', 'high');

                          const res = await fetch(
                            `/api/getAudioStream?${params.toString()}`
                          );
                          const { data: audioUrl } = await res.json();

                          setNowPlaying(track);
                          setAudioUrl(audioUrl.url);
                          setPlaying(true);
                        }}
                      >
                        <PlayAlt />
                      </div>
                    </div>
                    <Link
                      to={`/track/${track.id}`}
                      className='flex flex-col w-full'
                    >
                      <div className='flex items-center text-lg font-semibold'>
                        {track.isTitle && (
                          <span className='bg-rose-500 bg-opacity-20 text-rose-500 text-sm font-semibold leading-none px-1.5 py-1 rounded-md mr-1.5'>
                            TITLE
                          </span>
                        )}
                        {track.name}
                      </div>
                      <div className='text-[15px] font-light'>
                        {track.album.name}
                      </div>
                    </Link>
                  </div>
                  <div className='flex items-center'>
                    {track.artists.map((artist, i) => (
                      <Fragment key={i}>
                        <Link
                          to={`/artist/${artist.id}`}
                          className='text-rose-500 text-base transition-colors duration-300 hover:text-red-400 hover:underline'
                        >
                          {artist.name}
                        </Link>
                        {i !== album.artists.length - 1 && <span>, </span>}
                      </Fragment>
                    ))}
                  </div>
                  <div className='flex items-center justify-center'>
                    <Ellipsis />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
        <section className='py-8'>
          <h2 className='text-white text-2xl font-semibold'>앨범 소개</h2>
          <div className='text-gray-200 text-lg line-clamp-5 mt-3'>
            {album.description.split('\n').map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Album;
