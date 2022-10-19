function Cover({ url }: { url: string | undefined }) {
  return (
    <div
      className='h-20 w-20 bg-dark-800 rounded-lg bg-center bg-contain bg-no-repeat flex-shrink-0'
      style={{
        backgroundImage: `url(${
          url ?? 'https://f4.bcbits.com/img/a4139357031_16.jpg'
        })`,
      }}
    />
  );
}

export default Cover;
