import { Link } from 'aleph/react';
import { Fragment } from 'react';

function TrackInfo({
  id,
  name,
  artists,
}: {
  id: number | undefined;
  name: string | undefined;
  artists: { id: number; name: string }[] | undefined;
}) {
  return (
    <div className='flex flex-col w-50 flex-shrink-0'>
      <Link
        to={`/track/${id}`}
        className='overflow-hidden text-ellipsis text-gray-100 text-lg whitespace-nowrap hover:text-white hover:underline'
      >
        {name ?? '재생할 노래를 선택하세요.'}
      </Link>
      <span className='overflow-hidden text-ellipsis text-gray-500 whitespace-nowrap'>
        {artists &&
          artists.map((artist, i) => (
            <Fragment key={i}>
              <Link
                to={`/artist/${artist.id}`}
                className='transition-colors duration-300 hover:text-gray-400 hover:underline'
              >
                {artist.name}
              </Link>
              {i !== artists.length - 1 && <span>, </span>}
            </Fragment>
          ))}
      </span>
    </div>
  );
}

export default TrackInfo;
