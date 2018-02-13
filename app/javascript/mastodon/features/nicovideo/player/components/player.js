import React from 'react';
import PropTypes from 'prop-types';
import ToggleButton from './toggle_button';
import Controller from  './controller';

export default class Player extends React.PureComponent {

  static propTypes = {
    visible: PropTypes.bool.isRequired,
    videoId: PropTypes.string,
    input: PropTypes.string,
    onToggle: PropTypes.func.isRequired,
    onNicovideoShare: PropTypes.func.isRequired,
    onNicovideoPlay: PropTypes.func.isRequired,
    onChangeVideoId: PropTypes.func.isRequired,
    multiColumn: PropTypes.bool,
  };

  onClickNicovideoShareButton(videoId) {
    return ((e) => {
      e.preventDefault();
      this.props.onNicovideoShare(videoId);
    });
  }

  handleCopy = () => {
    this.props.onNicovideoShare(this.props.videoId);
  }

  handlePlay = () => {
    this.props.onNicovideoPlay(this.props.input);
  }

  setInput = (c) => {
    this.input = c;
  }

  videoContent(videoId) {
    const url = `https://embed.nicovideo.jp/watch/${videoId}`;
    return (
      <iframe
        title='nico_video_player'
        className='nico-video-player__item__iframe'
        allowFullScreen='allowfullscreen'
        src={url}
        width='320'
        height='180'
        key={videoId}
      />
    );
  }

  render () {
    const { visible, onToggle, input, videoId, onChangeVideoId, multiColumn } = this.props;

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
          if (visible) {
            return (
              <div className='nico-video-player__item'>
                { videoId && this.videoContent(videoId) ||
                  <p>動画リンクをクリックすると再生できます。</p>
                }
                <Controller
                  videoId={videoId}
                  input={input}
                  onChange={onChangeVideoId}
                  onClickPlay={this.handlePlay}
                  onClickCopy={this.handleCopy}
                />
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
