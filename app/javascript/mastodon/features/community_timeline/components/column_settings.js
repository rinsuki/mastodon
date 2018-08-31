import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { injectIntl, FormattedMessage } from 'react-intl';
import SettingToggle from '../../notifications/components/setting_toggle';

@injectIntl
export default class ColumnSettings extends React.PureComponent {

  static propTypes = {
    settings: ImmutablePropTypes.map.isRequired,
    onChange: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    highlight_keywords: ImmutablePropTypes.map.isRequired,
    columnId: PropTypes.string,
  };

  render () {
    const { settings, onChange, highlight_keywords } = this.props;

    return (
      <div>

        <div className='column-settings__section'>
          <span><FormattedMessage id='home.column_settings.highlight_keywords' defaultMessage='Highlight Keywords' /></span>
          <a href='/settings/highlight_keywords' className='setting-highlight_keyword__icon'>
            <i className='fa fa-gear' />
          </a>
        </div>
        <div className='column-settings__row setting-highlight_keyword__body'>
          {highlight_keywords.get('keywords').map(keyword => {
            return <span key={keyword.get('id')} className='setting-highlight_keyword__section'>{keyword.get('word')}</span>;
          })}
        </div>
        <div className='column-settings__row'>
          <SettingToggle settings={settings} settingPath={['other', 'onlyMedia']} onChange={onChange} label={<FormattedMessage id='community.column_settings.media_only' defaultMessage='Media Only' />} />
        </div>
      </div>
    );
  }

}
