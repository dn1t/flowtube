function getVideoId(url: string): string | null {
  if (/youtu\.?be/.test(url)) {
    const patterns = [
      /youtu\.be\/([^#\&\?]{11})/,
      /\?v=([^#\&\?]{11})/,
      /\&v=([^#\&\?]{11})/,
      /embed\/([^#\&\?]{11})/,
      /\/v\/([^#\&\?]{11})/,
    ];

    for (const pattern of patterns) {
      if (pattern.test(url)) {
        const res = pattern.exec(url);
        return res !== null ? res[1] : res;
      }
    }
  }

  return null;
}

export default getVideoId;
