import { connect } from 'react-redux';
import Player from '../components/player';
import { toggleNiconicoVideoPlayer, onNicovideoShare } from '../../../../actions/nicovideo_player';

const mapStateToProps = (state) => ({
  visible: state.getIn(['settings', 'friends', 'videoplayer']),
  videoId: state.getIn(['nicovideo_player', 'videoId']),
});

const mapDispatchToProps = (dispatch) => ({

  onToggle() {
    dispatch(toggleNiconicoVideoPlayer());
  },

  onNicovideoShare(videoId) {
    dispatch(onNicovideoShare(videoId));
  },

});

export default connect(mapStateToProps, mapDispatchToProps)(Player);
