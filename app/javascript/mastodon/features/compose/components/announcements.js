import React from 'react';
import Immutable from 'immutable';
import IconButton from '../../../components/icon_button';

const announcements = Immutable.fromJS([
  {
    id: 1,
    body: 'friends.nico のアプリができました!',
    links: [
      {
        href: 'https://itunes.apple.com/jp/app/friends-nico/id1230158182?l=ja&ls=1&mt=8',
        body: 'iOS版',
      },
      {
        href: 'https://play.google.com/store/apps/details?id=nico.friends.android',
        body: 'Android版',
      },
    ],
    nicotta: false,
  },
  {
    id: 2,
    body: '利用時のお困りごとなどは @friends_nico へ Mention か DM でご連絡ください',
    links: [],
    nicotta: false,
  },
]);

const Announcements = React.createClass({
  getInitialState () {
    return { nicotta: [] };
  },
  handleNicoru (id) {
    return () => {
      if (this.state.nicotta.includes(id))
        return ;
      this.setState({ nicotta: [].concat(this.state.nicotta, id) });
    };
  },

  render () {
    const { nicotta } = this.state;
    return (
      <ul className='announcements'>
        {announcements.map((announcement, idx) => (
          <li key={idx}>
            <div className='announcements__icon'>
              <IconButton
                 active={nicotta.includes(announcement.get('id'))}
                 animate
                 icon='nicoru--status'
                 title='announcement-icon'
                 onClick={this.handleNicoru(announcement.get('id'))}
                 activeStyle={{ color: '#ca8f04' }}
              />
            </div>
            <div className='announcements__body'>
              <p>{announcement.get('body')}</p>
              <div className='links'>
                {announcement.get('links').map(link => (
                  <a href={link.get('href')} target='_blank'>
                    {link.get('body')}
                  </a>
                ))}
              </div>
            </div>
          </li>
        ))}
      </ul>
    );
  },
});

export default Announcements;
