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
  };

  render () {
    const { settings, onChange, highlight_keywords } = this.props;

    return (
      <div>
        <div className='column-settings__section'>
          <span><FormattedMessage id='home.column_settings.highlight_keywords' defaultMessage='Highlight keywords' /></span>
          <a href='/settings/highlight_keywords' className='setting-highlight_keyword__icon'>
            <i className='fa fa-gear' />
          </a>
        </div>
        <div className='column-settings__row setting-highlight_keyword__body'>
          {highlight_keywords.get('keywords').map(keyword => {
            return <span key={keyword.get('id')} className='setting-highlight_keyword__section'>{keyword.get('word')}</span>;
          })}
        </div>

        <span className='column-settings__section'><FormattedMessage id='home.column_settings.basic' defaultMessage='Basic' /></span>

        <div className='column-settings__row'>
          <SettingToggle prefix='home_timeline' settings={settings} settingPath={['shows', 'reblog']} onChange={onChange} label={<FormattedMessage id='home.column_settings.show_reblogs' defaultMessage='Show boosts' />} />
        </div>

        <div className='column-settings__row'>
          <SettingToggle prefix='home_timeline' settings={settings} settingPath={['shows', 'reply']} onChange={onChange} label={<FormattedMessage id='home.column_settings.show_replies' defaultMessage='Show replies' />} />
        </div>
      </div>
    );
  }

}
