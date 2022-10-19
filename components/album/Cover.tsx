function Cover({ url }: { url: string }) {
  return (
    <div
      className='h-60 w-60 bg-dark-800 rounded-lg bg-center bg-contain bg-no-repeat flex-shrink-0'
      style={{
        backgroundImage: `url(${url})`,
      }}
    />
  );
}

export default Cover;
