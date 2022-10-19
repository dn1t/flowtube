import { useEffect, useState } from 'react';
import { Range, getTrackBackground } from 'react-range';

function returnZeroIfNaN(x: number) {
  return Number.isNaN(x) ? 0 : x;
}

function Bar({
  currentTime,
  duration,
  setClickedTime,
}: {
  currentTime: number;
  duration: number;
  setClickedTime: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [values, setValues] = useState([
    returnZeroIfNaN((currentTime / duration) * 100),
  ]);

  useEffect(() => {
    const time = Math.round(returnZeroIfNaN((currentTime / duration) * 100));
    if (values[0] === time) return;

    setValues([time]);
  }, [currentTime, duration]);

  return (
    <Range
      step={0.1}
      min={0}
      max={100}
      values={values}
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
                  values,
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
            className='bg-rose-500 h-2 w-2 outline-none rounded-full'
          />
        );
      }}
      onChange={(values) => setClickedTime((values[0] / 100) * duration)}
    />
  );
}

export default Bar;
