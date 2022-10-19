function SmallCover({ url }: { url: string }) {
  return (
    <div
      className='h-16 w-16 bg-dark-800 rounded-lg bg-center bg-contain bg-no-repeat flex-shrink-0'
      style={{
        backgroundImage: `url(${url})`,
      }}
    />
  );
}

export default SmallCover;
