import api from '../api';

export const NICOVIDEO_RANKING_FETCH_SUCCESS = 'NICOVIDEO_RANKING_FETCH_SUCCESS';
export const NICOVIDEO_RANKING_FETCH_FAIL = 'NICOVIDEO_RANKING_FETCH_FAIL';

export function fetchNicovideoRanking(categoryId) {
  return (dispatch, getState) => {
    api(getState).get(`/api/v1/nicovideo_rankings/${categoryId}`).then(response => {
      dispatch(fetchNicovideoRankingSuccess(response.data, categoryId));
    }).catch(error => {
      dispatch(fetchNicovideoRankingsFail(error));
    });
  };
};

export function fetchNicovideoRankingSuccess(data, categoryId) {
  return {
    type: NICOVIDEO_RANKING_FETCH_SUCCESS,
    categoryId,
    data,
  };
};

export function fetchNicovideoRankingsFail(error) {
  return {
    type : NICOVIDEO_RANKING_FETCH_FAIL,
    error: error,
  };
};
