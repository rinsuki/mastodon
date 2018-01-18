import { autoPlayGif } from '../../initial_state';
import unicodeMapping from './emoji_unicode_mapping_light';
import Trie from 'substring-trie';
import NicoruImages from '../../nicoru';

const trie = new Trie(Object.keys(unicodeMapping));

const assetHost = process.env.CDN_HOST || '';

const nicoru_re = /:nicoru(-?\d+)?:/;

const emojify = (str, customEmojis = {}) => {
  const tagCharsWithoutEmojis = '<&';
  const tagCharsWithEmojis = true || Object.keys(customEmojis).length ? '<&:' : '<&';
  let rtn = '', tagChars = tagCharsWithEmojis, invisible = 0;
  for (;;) {
    let match, i = 0, tag;
    while (i < str.length && (tag = tagChars.indexOf(str[i])) === -1 && (invisible || !(match = trie.search(str.slice(i))))) {
      i += str.codePointAt(i) < 65536 ? 1 : 2;
    }
    let rend, replacement = '';
    if (i === str.length) {
      break;
    } else if (str[i] === ':') {
      if (!(() => {
        rend = str.indexOf(':', i + 1) + 1;
        if (!rend) return false; // no pair of ':'
        const lt = str.indexOf('<', i + 1);
        if (!(lt === -1 || lt >= rend)) return false; // tag appeared before closing ':'
        const shortname = str.slice(i, rend);
        // now got a replacee as ':shortname:'
        // if you want additional emoji handler, add statements below which set replacement and return true.
        if (shortname in customEmojis) {
          const filename = autoPlayGif ? customEmojis[shortname].url : customEmojis[shortname].static_url;
          replacement = `<img draggable="false" class="emojione" alt="${shortname}" title="${shortname}" src="${filename}" />`;
          return true;
        } else if (shortname.match(nicoru_re)) {
          replacement = nicoruToImage(shortname);
          return true;
        }
        return false;
      })()) rend = ++i;
    } else if (tag >= 0) { // <, &
      rend = str.indexOf('>;'[tag], i + 1) + 1;
      if (!rend) {
        break;
      }
      if (tag === 0) {
        if (invisible) {
          if (str[i + 1] === '/') { // closing tag
            if (!--invisible) {
              tagChars = tagCharsWithEmojis;
            }
          } else if (str[rend - 2] !== '/') { // opening tag
            invisible++;
          }
        } else {
          if (str.startsWith('<span class="invisible">', i)) {
            // avoid emojifying on invisible text
            invisible = 1;
            tagChars = tagCharsWithoutEmojis;
          }
        }
      }
      i = rend;
    } else { // matched to unicode emoji
      const { filename, shortCode } = unicodeMapping[match];
      const title = shortCode ? `:${shortCode}:` : '';
      replacement = `<img draggable="false" class="emojione" alt="${match}" title="${title}" src="${assetHost}/emoji/${filename}.svg" />`;
      rend = i + match.length;
    }
    rtn += str.slice(0, i) + replacement;
    str = str.slice(rend);
  }
  return rtn + str;
};

export const buildCustomEmojis = (customEmojis) => {
  const emojis = [];

  customEmojis.forEach(emoji => {
    const shortcode = emoji.get('shortcode');
    const url       = autoPlayGif ? emoji.get('url') : emoji.get('static_url');
    const name      = shortcode.replace(':', '');

    emojis.push({
      id: name,
      name,
      short_names: [name],
      text: '',
      emoticons: [],
      keywords: [name],
      imageUrl: url,
      custom: true,
    });
  });

  return emojis;
};


const profileEmojify = (str, profileEmojiMap = {}) => {
  // Replace custom emoji string, ignoring any tags and spaces
  // e.g. ':@foo:' -> '<img alt="foo.png" />'
  // e.g. ':<span><a>@<span>foo</span> </a></span>:' -> '<img alt="foo.png" />'
  // Reference: https://github.com/tootsuite/mastodon/pull/4988
  let i = -1;
  let insideTag = false;
  let insideColon = false;
  let shortname = '';
  let shortnameStartIndex = -1;

  while (++i < str.length) {
    const char = str.charAt(i);
    if (char === '<') {
      insideTag = true;
    } else if (insideTag && char === '>') {
      insideTag = false;
    } else if (!insideTag) {
      if (!insideColon && char === ':') {
        insideColon = true;
        shortname = '';
        shortnameStartIndex = i;
      } else if (insideColon && char === ':') {
        insideColon = false;
        if (shortname in profileEmojiMap) {
          const { url, account_url } = profileEmojiMap[shortname];
          const replacement = `<a href="${account_url}" class="profile-emoji" data-account-name="${shortname}">`
                            +   `<img draggable="false" class="emojione" alt=":${shortname}:" title=":${shortname}:" src="${url}" />`
                  + '</a>';
          str = str.substring(0, shortnameStartIndex) + replacement + str.substring(i + 1);
          i = shortnameStartIndex + replacement.length - 1; // jump ahead the length we've added to the string
        } else {
          i--;
        }
      } else if (insideColon && char ) {
        if (char !== ' ') {
          shortname += char;
        }
      }
    }
  }
  return str;
};

const nicoruToImage = str => {
  let [match, deg] = str.match(nicoru_re);
  deg = deg ? deg : 0;
  return `<img draggable="false" class="emojione" alt="${match}" src="${NicoruImages.main}" style="transform:rotate(${deg}deg);" />`;
};

export default (str, emojiMap = {}) => profileEmojify(emojify(str, emojiMap), emojiMap);
