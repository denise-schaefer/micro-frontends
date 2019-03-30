import messagesDe from '../../messages/de.json';
import messagesCs from '../../messages/cs.json';

export default () => {
	if (!global.i18next) {
		throw new Error('No global i18next found');
	}

  global.i18next.addResourceBundle('de', 'dm', messagesDe, true, false);
  global.i18next.addResourceBundle('cs', 'dm', messagesCs, true, false);
};
