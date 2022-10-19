import { RecoilRoot } from 'recoil';
import Header from '~/components/Header.tsx';
import Player from '~/components/player/Player.tsx';

export default function App({ children }: { children: React.ReactNode }) {
  return (
    <RecoilRoot>
      <div className='bg-black min-h-screen w-full pb-32'>
        <Header />
        <div className='flex'>
          <main className='h-full w-full flex flex-col'>
            <section className='h-full' children={children} />
          </main>
        </div>
        <Player />
      </div>
    </RecoilRoot>
  );
}
