/* eslint-disable import/no-dynamic-require, global-require */

const locales = require('./locales.json');
const callingCodes = require('./callingCodes.json');
const countryNames = require('./countryNames.json');
const languageNames = require('./languageNames.json');
const utils = require('./helpers/utils');

const LocaleData = {};
Object.keys(locales).forEach((locale) => {
    const languageName = locale.split('_')[0];
    try {
        LocaleData[languageName] = require(`react-intl/locale-data/${languageName}`);
    } catch (error) {
        console.info(`skip ${locale}`);
    }
});

module.exports = {
    callingCodes,
    countryNames,
    languageNames,
    locales,
    localeData: LocaleData,
    localeUtils: utils
};
