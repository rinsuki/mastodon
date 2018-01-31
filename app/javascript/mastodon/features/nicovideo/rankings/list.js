import React from 'react';
import PropTypes from 'prop-types';
import LoadingIndicator from '../../../components/loading_indicator';

class RankingItem extends React.PureComponent {

  static propTypes = {
    video: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    onClick: PropTypes.func.isRequired,
  }

  handleClick = () => {
    this.props.onClick(this.props.video.content_id);
  }

  render() {
    const { video, index } = this.props;

    return(
      <li className='video-rankings__item' onMouseDown={this.handleClick}>
        <div className='video-rankings__item__info' >
          <p>{index + 1}</p>
        </div>
        <div className='video-rankings__item__inner' >
          <p>{video.published} 投稿</p>
          <div className='video-rankings__item__inner__content' >
            <img height='60px' src={video.thumbnail} alt='ranking_thumbnail' />
            <p>{ video.title }</p>
          </div>
        </div>
      </li>
    );
  }

};

export default class RankingList extends React.PureComponent {

  static propTypes = {
    videos: PropTypes.array,
    error: PropTypes.object,
    onClick: PropTypes.func.isRequired,
  };

  handleClick = (url) => {
    this.props.onClick(url);
  }

  render() {
    const { videos, error } = this.props;

    if (!videos) {
      if (error && error.response.status === 503) {
        return (
          <div className='error-column'>
            niconicoは現在メンテナンス中です
          </div>
        );
      }
      return (<LoadingIndicator />);
    }

    return (
      <div className='scrollable video-rankings'>
        <ul>
          {videos.map((video, index) => (
            <RankingItem
              key={`rank_${index}`}
              video={video}
              index={index}
              onClick={this.handleClick}
            />
          ))}
        </ul>
      </div>
    );
  }

};
