import { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { currentTrackIdState } from '../atoms/songAtom'
import useSpotify from './useSpotify'

function useSongInfo() {
  const spotifyApi = useSpotify()
  const [currentIdTrack, setCurrentTrackId] =
    useRecoilState(currentTrackIdState)
  const [songInfo, setSonInfo] = useState(null)

  useEffect(() => {
    const fetchSongInfo = async () => {
      if (currentIdTrack) {
        const trackInfo = await fetch(
          `https://api.spotify.com/v1/track/${currentIdTrack}`,
          {
            headers: {
              Authorization: 'Bearer ${spotifyApi.getAccessToken()}',
            },
          }
        ).then((res) => res.json())
        setSonInfo(trackInfo)
      }
    }
    fetchSongInfo()
  }, [currentIdTrack, spotifyApi])

  return songInfo
}

export default useSongInfo
