const locales = require('../locales.json');

const Utils = {
    getLocalesAsArray() {
        const localeArray = [];
        Object.keys(locales).forEach((localeName) => {
            const localeProperties = locales[localeName];
            localeProperties.locale = localeName;
            localeArray.push(localeProperties);
        });
        return localeArray;
    },

    tryFallbackLocales(locale) {
        // If those still didn't match we try to find a locale with the correct country code
        const country = locale.split('_')[1];

        let fallbackLocale = null;

        Object.keys(locales).forEach((availableLocale) => {
            if (fallbackLocale === null && availableLocale.split('_')[1] === country) {
                fallbackLocale = availableLocale;
            }
        });
        if (fallbackLocale !== null) return fallbackLocale;

        // If even that fails we try to find a locale with the same language
        const language = locale.split('_')[0];
        Object.keys(locales).forEach((availableLocale) => {
            if (fallbackLocale === null && availableLocale.split('_')[0] === language) {
                fallbackLocale = availableLocale;
            }
        });
        if (fallbackLocale !== null) return fallbackLocale;

        return null;
    },

    /**
     * When a new locale is set we want to make sure it matches one of the available locales. When it doesn't we
     * want to choose to most similar one, based on the alias, country and language.
     *
     * @param locale
     * @returns {*}
     */
    getLocaleWithFallback(localeToFind) {
        // Make sure the locale uses an underscore as seperator
        const locale = localeToFind.replace('-', '_');

        // First check if there is a matching locale
        if (locales.hasOwnProperty(locale)) return locale;

        let fallbackLocale = null;

        // Then check if there is a locale with a matching alias
        Object.keys(locales).forEach((availableLocale) => {
            if (locales[availableLocale].alias && locale.indexOf(locales[availableLocale].alias) === 0) {
                fallbackLocale = availableLocale;
            }
        });
        if (fallbackLocale !== null) return fallbackLocale;

        // If we don't have a match yet we will try the fallbacks with the current locale
        if (locale.length === 5) fallbackLocale = this.tryFallbackLocales(locale);
        if (fallbackLocale !== null) return fallbackLocale;

        /**
         * In some cases the locale is just 2 characters (for example just nl). Then we first try nl_NL and then
         * we try nl_ to see if there is a locale which matches the language.
         */
        if (locale.length === 2) {
            if (locales.hasOwnProperty(`${locale}_${locale.toUpperCase()}`)) return locale;

            fallbackLocale = this.tryFallbackLocales(`${locale}_`);
            if (fallbackLocale !== null) return fallbackLocale;
        }

        // If everything failed return the default
        return 'en_US';
    }
};

module.exports = Utils;
