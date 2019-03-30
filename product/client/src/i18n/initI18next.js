import dmMessagesDe from '../bundles/messages/de.json';
import dmMessagesCs from '../bundles/messages/cs.json';

// eslint-disable-next-line import/prefer-default-export
export const dmProductSearchInitI18next = () => {
	if (!global.i18next) {
		throw new Error('No global i18next found');
	}

	global.i18next.addResourceBundle('de', 'dm', dmMessagesDe, true, false);
	global.i18next.addResourceBundle('cs', 'dm', dmMessagesCs, true, false);
};
