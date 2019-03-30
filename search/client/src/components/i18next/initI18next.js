import messagesDe from '../../bundles/messages/de.json';
import messagesCs from '../../bundles/messages/cs.json';
import messagesHu from '../../bundles/messages/hu.json';
import messagesSk from '../../bundles/messages/sk.json';

export default () => {
	if (!global.i18next) {
		throw new Error('No global i18next found');
	}

	global.i18next.addResourceBundle('de', 'dm', messagesDe, true, false);
	global.i18next.addResourceBundle('hu', 'dm', messagesHu, true, false);
	global.i18next.addResourceBundle('sk', 'dm', messagesSk, true, false);
	global.i18next.addResourceBundle('cs', 'dm', messagesCs, true, false);
};
