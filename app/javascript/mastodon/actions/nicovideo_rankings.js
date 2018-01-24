import api from '../api';
import { connectStream } from '../stream';

export const NICOVIDEO_RANKING_FETCH_SUCCESS = 'NICOVIDEO_RANKING_FETCH_SUCCESS';
export const NICOVIDEO_RANKING_FETCH_FAIL = 'NICOVIDEO_RANKING_FETCH_FAIL';

export function connectRankingStream(pollingRefresh = null) {
  return connectStream('nicovideo:ranking', pollingRefresh, (dispatch) => ({
    onConnect() {},
    onDisconnect () {},
    onReceive (data) {
      dispatch(fetchNicovideoRankingSuccess(JSON.parse(data.payload)));
    },
  }));
}

export function fetchNicovideoRanking(categoryId) {
  return (dispatch, getState) => {
    api(getState).get(`/api/v1/nicovideo_rankings/${categoryId}`).then(response => {
      const data = { [categoryId]: response.data };
      dispatch(fetchNicovideoRankingSuccess(data));
    }).catch(error => {
      dispatch(fetchNicovideoRankingsFail(error));
    });
  };
};

export function fetchNicovideoRankingSuccess(data) {
  return {
    type: NICOVIDEO_RANKING_FETCH_SUCCESS,
    data,
  };
};

export function fetchNicovideoRankingsFail(error) {
  return {
    type : NICOVIDEO_RANKING_FETCH_FAIL,
    error: error,
  };
};
