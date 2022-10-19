import React from 'react';

const RightSidebar = React.forwardRef<HTMLElement>((props, ref) => (
  <section
    className='bg-dark-900 h-full w-100 flex-shrink-0'
    ref={ref}
  ></section>
));

export default RightSidebar;
