import { LeftArrow, RightArrow } from '~/components/icon/index.ts';

export default function Header() {
  return (
    <header className='bg-dark-900/90 backdrop-blur-sm sticky top-0 w-full z-50'>
      <div className='max-w-[110rem] flex items-center px-10 py-3.5 mx-auto'>
        <div className='flex items-center gap-x-2'>
          <button className='bg-dark-500/70 rounded-lg p-2'>
            <LeftArrow />
          </button>
          <button className='bg-dark-500/70 rounded-lg p-2'>
            <RightArrow />
          </button>
        </div>
        <input
          placeholder='검색'
          className='bg-dark-300/70 text-white w-60 px-3 py-1.5 rounded-lg outline-none mx-4'
        />
      </div>
    </header>
  );
}
