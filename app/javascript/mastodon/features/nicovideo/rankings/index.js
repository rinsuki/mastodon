import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Column from '../../../components/column';
import ColumnHeader from '../../../components/column_header';
import RankingList from './list';
import { defineMessages, injectIntl } from 'react-intl';
import { addColumn, removeColumn, moveColumn } from '../../../actions/columns';
import { fetchNicovideoRanking, connectRankingStream } from '../../../actions/nicovideo_rankings';
import { changeSetting } from '../../../actions/settings';
import { openNiconicoVideoLink } from '../../../actions/nicovideo_player';
import Select from 'react-select';
import categories from './categories';

const messages = defineMessages({
  title: { id: 'column.nico_video_rankings', defaultMessage: 'NicoNico Video Rankings' },
});

const mapStateToProps = state => ({
  columns: state.getIn(['settings', 'columns']),
  rankings: state.getIn(['nicovideo_rankings', 'rankings']),
  error: state.getIn(['nicovideo_rankings', 'error']),
});

@connect(mapStateToProps)
@injectIntl
export default class VideoRanking extends React.PureComponent {

  static contextTypes = {
    router: PropTypes.object,
  };

  static propTypes = {
    params: PropTypes.object.isRequired,
    columnId: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    columns: ImmutablePropTypes.list,
    multiColumn: PropTypes.bool,
    onLinkClick: PropTypes.func,
    rankings: ImmutablePropTypes.map,
    error: PropTypes.object,
  };

  handlePin = () => {
    const { columnId, dispatch } = this.props;

    if (columnId) {
      dispatch(removeColumn(columnId));
    } else {
      dispatch(addColumn('NICOVIDEO_RANKINGS', { id: this.props.params.id }));
    }
  }

  handleMove = (dir) => {
    const { columnId, dispatch } = this.props;
    dispatch(moveColumn(columnId, dir));
  }

  handleHeaderClick = () => {
    this.column.scrollTop();
  }

  getTabIndex = () => {
    const { columnId, columns } = this.props;
    if (!columnId) {
      return null;
    }
    return columns.findIndex(t => t.get('uuid') === columnId);
  }

  onVideoClick = (videoId) => {
    const { dispatch } = this.props;
    dispatch(openNiconicoVideoLink(videoId));
  }

  onReloadButtonClick = (e) => {
    const { dispatch } = this.props;
    e.preventDefault();
    e.stopPropagation();

    const refreshButton = e.currentTarget;
    this.rotateRefreshButton(refreshButton);
    dispatch(fetchNicovideoRanking(this.props.params.id));
    this.column.scrollTop();
  }

  rotateRefreshButton(btn) {
    btn.classList.add('refresh-rotate-360');
    btn.addEventListener('transitionend', () => {
      btn.classList.remove('refresh-rotate-360');
    }, false);
  }

  handleChangeCategory = (obj) => {
    const { dispatch, columnId }  = this.props;
    if (columnId) {
      dispatch(changeSetting(['columns', this.getTabIndex(), 'params', 'id'], obj.value));
    } else if (this.context.router) {
      this.context.router.history.push(`/rankings/${obj.value}`);
    }
    this.column.scrollTop();
  }

  componentDidMount() {
    const { dispatch } = this.props;
    this.disconnect = dispatch(connectRankingStream());
  }

  componentWillUnmount () {
    if (this.disconnect) {
      this.disconnect();
      this.disconnect = null;
    }
  }

  setRef = c => {
    this.column = c;
  }

  render () {
    const { intl, columnId, multiColumn, rankings, dispatch, params, error } = this.props;
    const pinned = !!columnId;
    const categoryId = params.id;

    if (!rankings.get(categoryId) && !error) {
      dispatch(fetchNicovideoRanking(categoryId));
    }

    return (
      <Column icon='nico' ref={this.setRef} >
        <ColumnHeader
          icon='nico'
          active={false}
          title={intl.formatMessage(messages.title)}
          onPin={this.handlePin}
          onMove={this.handleMove}
          onClick={this.handleHeaderClick}
          pinned={pinned}
          multiColumn={multiColumn}
        />
        <div className='rankings-category__area'>
          <Select
            className='rankings-category__area__select'
            name='ranking'
            options={categories}
            value={categoryId}
            onChange={this.handleChangeCategory}
            searchable={false}
            clearable={false}
          />
        </div>

        <RankingList
          videos={rankings.get(categoryId)}
          onClick={this.onVideoClick}
          error={error}
        />
      </Column>
    );
  }

};
