import getAudioUrls from '~/lib/getAudioUrls.ts';
import { getLyrics } from '~/lib/getAlbum.ts';

export const GET = async (req: Request) => {
  const url = new URL(req.url);
  const trackId = url.searchParams.get('trackId');
  const videoId = url.searchParams.get('videoId');
  const quality = url.searchParams.get('quality');

  if (!trackId)
    return Response.json({
      success: false,
      message: 'PARAMETER_NOT_PROVIDED: trackId',
    });
  if (!videoId)
    return Response.json({
      success: false,
      message: 'PARAMETER_NOT_PROVIDED: videoId',
    });
  if (!quality)
    return Response.json({
      success: false,
      message: 'PARAMETER_NOT_PROVIDED: quality',
    });
  if (!['high', 'low'].includes(quality.toLowerCase()))
    return Response.json({
      success: false,
      message:
        "PARAMETER_NOT_VALID: videoId value must match one of the followings: 'high', 'low'",
    });

  const [stream, lyrics] = await Promise.all([
    (async () => {
      const streams = await getAudioUrls(videoId);
      if (!streams)
        return Response.json({ success: false, message: 'STREAM_NOT_FOUND' });

      const stream = (
        quality === 'high'
          ? streams.sort((a, b) => b.bitrate - a.bitrate)
          : streams.sort((a, b) => a.bitrate - b.bitrate)
      )[0];

      return stream;
    })(),
    getLyrics(trackId),
  ]);

  return Response.json({ success: true, data: { ...stream, lyrics } });
};
