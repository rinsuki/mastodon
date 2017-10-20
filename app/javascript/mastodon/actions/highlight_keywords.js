import api from '../api';
import { getLocale } from '../locales';
import IntlMessageFormat from 'intl-messageformat';

export const HIGHLIGHT_KEYWORDS_SUCCESS = 'HIGHLIGHT_KEYWORDS_SUCCESS';
export const UPDATE_LAST_NOTIFICATION = 'UPDATE_LAST_NOTIFICATION';

const unescapeHTML = (html) => {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = html;
  return wrapper.textContent;
};

const escapeHTML = (string) => {
  if (typeof string !== 'string') {
    return string;
  }
  return string.replace(/[&'`"<>]/g, function(match) {
    return {
      '&': '&amp;',
      '\'': '&#x27;',
      '`': '&#x60;',
      '"': '&quot;',
      '<': '&lt;',
      '>': '&gt;',
    }[match];
  });
};

const sendHighlightNotification = (dispatch, status, intlMessages, intlLocale) => {
  if (typeof window.Notification !== 'undefined') {
    const last_notification_id = status.id;
    const title = new IntlMessageFormat(intlMessages['notification.highlight'], intlLocale).format({ name: status.account.display_name.length > 0 ? status.account.display_name : status.account.username });
    const body  = (status && status.spoiler_text.length > 0) ? status.spoiler_text : unescapeHTML(status ? status.content : '');

    const notify = new Notification(title, { body, icon: status.account.avatar });
    notify.addEventListener('click', () => {
      window.focus();
      notify.close();
    });

    dispatch({
      type: UPDATE_LAST_NOTIFICATION,
      last_notification_id,
    });
  }
};

export function checkHighlightNotification(status) {
  return (dispatch, getState) => {
    const highlightKeywords = getState().get('highlight_keywords');
    if (highlightKeywords && highlightKeywords.get('keywords').size === 0) {
      return;
    };
    const currentAccountId = getState().getIn(['meta', 'me']);
    const locale = getState().getIn(['meta', 'locale']);
    const { messages } = getLocale();
    const lastNotificationId = highlightKeywords.get('last_notification_id');
    let sendNotificationFlag = false;

    if (status.account.id !== currentAccountId && status.id > lastNotificationId) {
      const contentDom = document.createElement('div');
      const spoilerDom = document.createElement('div');
      if (status.enquete) {
        contentDom.innerHTML = addHighlight(JSON.parse(status.enquete).question, highlightKeywords);
      } else {
        contentDom.innerHTML = addHighlight(status.content, highlightKeywords);
      }
      spoilerDom.innerHTML = addHighlight(status.spoilerHtml, highlightKeywords);
      if (contentDom.getElementsByClassName('highlight').length + spoilerDom.getElementsByClassName('highlight').length > 0 ) {
        sendNotificationFlag = true;
      }
    }

    if (sendNotificationFlag) {
      sendHighlightNotification(dispatch, status, messages, locale);
    }
  };
};

export function refreshHighlightKeywords() {
  return (dispatch, getState) => {
    api(getState).get('/api/v1/highlight_keywords').then(response => {
      dispatch(refreshHighlightKeywordsSuccess(response.data));
    });
  };
}

export function refreshHighlightKeywordsSuccess(keywords) {
  return {
    type: HIGHLIGHT_KEYWORDS_SUCCESS,
    keywords,
  };
}

const replaceTextNode = (reg, node) => {
  const span = document.createElement('span');
  span.innerHTML = escapeHTML(node.textContent)
    .replace(reg, '<span class="highlight">$1</span>');
  return Array.from(span.childNodes);
};

const replaceHighlight = (reg, node) => {
  const newNode = node.cloneNode();
  Array.from(node.childNodes).forEach(target => {
    if (target.nodeName === '#text') {
      replaceTextNode(reg, target).forEach(n => newNode.appendChild(n));
    } else {
      newNode.appendChild(replaceHighlight(reg, target));
    }
  });
  return newNode;
};

export function addHighlight (text, keywords) {
  if (keywords && keywords.get('keywords').size !== 0) {
    const reg = new RegExp(`(${keywords.get('keywords').map(keyword => keyword.get('word').replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')).join('|')})`, 'g');

    const dom = document.createElement('div');
    dom.innerHTML = text;
    const newDOM = replaceHighlight(reg, dom);

    return newDOM.innerHTML;
  } else {
    return text;
  }
}
