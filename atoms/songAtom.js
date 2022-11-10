import { atom } from 'recoil'

export const currentTrackIdState = atom({
  key: 'currentTrackIdState ', // unique ID tell what track i have selected (with respect to other atoms/selectors)
  default: null, //default value (aka initial value)
})
export const isPlayingState = atom({
  key: 'isPlayingState', // if playing 
  default: false,
})
