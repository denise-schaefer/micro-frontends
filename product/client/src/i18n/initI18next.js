import dmMessagesDe from '../messages/de.json';
import dmMessagesCs from '../messages/cs.json';

// eslint-disable-next-line import/prefer-default-export
export const initI18next = () => {
  if (!global.i18next) {
    throw new Error('No global i18next found');
  }

  global.i18next.addResourceBundle('de', 'dm', dmMessagesDe, true, false);
  global.i18next.addResourceBundle('cs', 'dm', dmMessagesCs, true, false);
};
