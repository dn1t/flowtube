import { useEffect, useState } from 'react';

function getElementDimensions<T extends HTMLElement>(ref: React.RefObject<T>) {
  if (!ref.current) return { width: 0, height: 0 };

  const { offsetWidth: width, offsetHeight: height } = ref.current;
  return {
    width,
    height,
  };
}

function useElementDimensions<T extends HTMLElement>(ref: React.RefObject<T>) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!ref.current) return;

    function handleResize() {
      setDimensions(getElementDimensions(ref));
    }

    const resizeObserver = new ResizeObserver(handleResize);

    resizeObserver.observe(ref.current);
    handleResize();
    return () => void (ref.current && resizeObserver.unobserve(ref.current));
  }, [ref]);

  return dimensions;
}

export default useElementDimensions;
