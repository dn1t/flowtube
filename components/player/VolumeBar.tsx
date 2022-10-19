import { Range, getTrackBackground } from 'react-range';

function VolumeBar({
  muted,
  volume,
  onVolumeChange,
}: {
  muted: boolean;
  volume: number;
  onVolumeChange: (volume: number) => void;
}) {
  return (
    <Range
      step={1}
      min={0}
      max={100}
      values={[muted ? 0 : volume]}
      renderTrack={({ props, children }) => {
        return (
          <div
            onMouseDown={props.onMouseDown}
            onTouchStart={props.onTouchStart}
            className='w-full h-max'
          >
            <div
              ref={props.ref}
              className='h-2 rounded-full'
              style={{
                background: getTrackBackground({
                  values: [muted ? 0 : volume],
                  colors: ['rgb(244, 63, 94)', 'rgb(24, 24, 24)'],
                  min: 0,
                  max: 100,
                }),
              }}
            >
              {children}
            </div>
          </div>
        );
      }}
      renderThumb={({ props }) => {
        return (
          <div
            {...props}
            className={`${
              muted || volume === 0 ? '' : 'bg-rose-500'
            } h-2 w-2 outline-none rounded-full`}
          />
        );
      }}
      onChange={(values) => onVolumeChange(values[0])}
    />
  );
}

export default VolumeBar;
