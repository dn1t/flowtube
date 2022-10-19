export interface Album {
  id: number;
  name: string;
  artists: { id: number; name: string }[];
  cover: string;
  releaseDate: string;
  genre: string;
  type: string;
  description: string;
  agency: string;
}

export interface Track {
  id: number;
  name: string;
  duration: number;
  isTitle: boolean;
  adult: boolean;
  album: { id: number; name: string; cover: string };
  artists: { id: number; name: string }[];
  trackNum: number;
}

export type AlbumInfoWithTracks = Album & { tracks: Track[] };

export async function getAlbumInfo(albumId: number): Promise<Album> {
  const res = await fetch(
    `https://www.music-flo.com/api/meta/v1/album/${albumId}`,
    { method: 'GET', headers: { Accept: 'application/json' } }
  );
  const { data } = await res.json();

  return {
    id: albumId,
    name: data.title,
    artists: data.artistList
      ?.sort(
        (a: { listorder: number }, b: { listorder: number }) =>
          b.listorder - a.listorder
      )
      ?.map(({ id, name }: { id: number; name: string }) => ({ id, name })),
    cover: data.imgList?.sort(
      (a: { size: number }, b: { size: number }) => b.size - a.size
    )[0]?.url,
    releaseDate: data.releaseYmd,
    genre: data.genreStyle,
    type: data.albumTypeStr,
    description: data.albumDesc,
    agency: data.agencyNm,
  };
}

function unformatTime(time: string) {
  const [M, S] = time.split(':').map(Number.parseInt);

  return M * 60 + S;
}

export async function getAlbumTracks(albumId: number): Promise<Track[]> {
  const res = await fetch(
    `https://www.music-flo.com/api/meta/v1/album/${albumId}/track`,
    { method: 'GET', headers: { Accept: 'application/json' } }
  );
  const {
    data: { list },
  } = await res.json();

  return list.map(
    // deno-lint-ignore no-explicit-any
    (track: any) => ({
      id: track.id,
      name: track.name,
      duration: unformatTime(track.playTime),
      isTitle: track.titleYn === 'Y',
      adult: track.adultAuthYn === 'Y',
      album: {
        id: track.album.id,
        name: track.album.title,
        cover: track.album.imgList?.sort(
          (a: { size: number }, b: { size: number }) => b.size - a.size
        )[0]?.url,
      },
      // deno-lint-ignore no-explicit-any
      artists: track.artistList.map((artist: any) => ({
        id: artist.id,
        name: artist.name,
      })),
      trackNum: track.trackNo,
    })
  );
}

export async function getLyrics(trackId: string): Promise<any> {
  console.log(trackId);

  const res = await fetch(
    `https://www.music-flo.com/api/meta/v1/track/${trackId}/lyric`,
    {
      method: 'GET',
      headers: { Accept: 'application/json', 'x-gm-app-version': '6.7.0' },
    }
  );
  const {
    data: { lyrics },
  } = await res.json();

  return lyrics;
}
