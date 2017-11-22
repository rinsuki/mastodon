import { changeSetting } from './settings';
import { isMobile } from '../is_mobile';

export const COMPOSE_NICOVIDEO_ID_INSERT = 'COMPOSE_NICOVIDEO_ID_INSERT';
export const PLAY_NICONICO_VIDEO = 'PLAY_NICONICO_VIDEO';
export const UPDATE_NICONICO_VIDEO_INPUT = 'UPDATE_NICONICO_VIDEO_INPUT';

export function openNiconicoVideoLink(videoId) {
  return (dispatch, getState) => {
    const mobile = isMobile(window.innerWidth);

    if (!mobile && getState().getIn(['settings', 'friends', 'videoplayer'])) {
      dispatch({
        type: PLAY_NICONICO_VIDEO,
        videoId,
      });
    } else {
      window.open(`https://nico.ms/${videoId}`);
    }
  };
};

export function toggleNiconicoVideoPlayer() {
  return (dispatch, getState) => {
    const visible = getState().getIn(['settings', 'friends', 'videoplayer']);

    dispatch(changeSetting(['friends', 'videoplayer'], !visible));
  };
};

export function updateNiconicoVideoInput(videoId) {
  return {
    type: UPDATE_NICONICO_VIDEO_INPUT,
    videoId,
  };
}

export function onNicovideoShare(videoId) {
  return {
    type: COMPOSE_NICOVIDEO_ID_INSERT,
    videoId,
  };
};
