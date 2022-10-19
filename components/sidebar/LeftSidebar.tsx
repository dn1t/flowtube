import React from 'react';

const LeftSidebar = React.forwardRef<HTMLElement>((props, ref) => (
  <section
    className='bg-dark-900 h-full w-80 flex-shrink-0'
    ref={ref}
  ></section>
));

export default LeftSidebar;
