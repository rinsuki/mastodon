import React from 'react';
import PropTypes from 'prop-types';
import ToggleButton from './toggle_button';

export default class Player extends React.PureComponent {

  static propTypes = {
    visible: PropTypes.bool.isRequired,
    videoId: PropTypes.string,
    onToggle: PropTypes.func.isRequired,
    onNicovideoShare: PropTypes.func.isRequired,
    multiColumn: PropTypes.bool,
  };

  onClickNicovideoShareButton(videoId) {
    return ((e) => {
      e.preventDefault();
      this.props.onNicovideoShare(videoId);
    });
  }

  render () {
    const { visible, onToggle, videoId, multiColumn } = this.props;

    if (!multiColumn) {
      return null;
    }

    return (
      <div className='nico-video-player'>
        <div className='compose__extra__header nico-video-player__header'>
          <i className='fa fa-nico' />
          ニコニコ動画プレーヤー
          <ToggleButton onToggle={onToggle} checked={visible} />
        </div>
        {(() => {
          if (videoId && visible) {
            const url = `https://embed.nicovideo.jp/watch/${videoId}`;
            return (
              <div className='nico-video-player__item'>
                <iframe
                   title='nico_video_player'
                   className='nico-video-player__item__iframe'
                   allowFullScreen='allowfullscreen'
                   src={url}
                   width='320'
                   height='180'
                   key={videoId}
                />
                <a
                   href={`#${videoId}`}
                   className='button nico-video-player__item__btn'
                   onClick={this.onClickNicovideoShareButton(videoId)}
                >
                  <span className='fa fa-pencil-square-o' />
                  動画ID
                </a>
              </div>
            );
          } else if (visible) {
            return(
              <div className='nico-video-player__item' >
                <p>動画リンクをクリックすると再生できます。</p>
              </div>
            );
          } else {
            return null;
          }
        })()}
      </div>
    );
  }

};
