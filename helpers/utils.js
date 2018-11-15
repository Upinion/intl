const locales = require('../locales.json');
const translations = require('@upinion/intl-translations');

const Utils = {
    /**
     * Some of our functions expect an array with all locales, where each object in the array has 'locale' as one
     * of the properties.
     *
     * @returns {Array}
     */
    getLocalesAsArray() {
        const localeArray = [];
        Object.keys(locales).forEach((localeName) => {
            const localeProperties = locales[localeName];
            localeProperties.locale = localeName;
            localeArray.push(localeProperties);
        });
        return localeArray;
    },

    /**
     * Get the closest locale when there is no full match. By default it tries to match the country first and then
     * the language, but that order can be reversed with the searchLanguageFirst parameter
     *
     * @param locale
     * @param availableLocales
     * @param searchLanguageFirst When set to true the language is more important than the country
     * @returns {*}
     */
    tryFallbackLocales(locale, searchLanguageFirst = false, availableLocales) {
        const language = locale.split(/[-_]/)[0];
        const country = locale.split(/[-_]/)[1];
        let fallbackLocale = null;

        const findLocale = (searchTerm, searchIndex) => {
            availableLocales.forEach((availableLocale) => {
                if (fallbackLocale === null && availableLocale.split('_')[searchIndex] === searchTerm) {
                    fallbackLocale = availableLocale;
                }
            });
            return fallbackLocale;
        };

        if (searchLanguageFirst) {
            fallbackLocale = findLocale(language, 0);
            if (fallbackLocale === null) fallbackLocale = findLocale(country, 1);
        } else {
            fallbackLocale = findLocale(country, 1);
            if (fallbackLocale === null) fallbackLocale = findLocale(language, 0);
        }
        return fallbackLocale;
    },

    /**
     * When a new locale is set we want to make sure it matches one of the available locales. When it doesn't we
     * want to choose to most similar one, based on the alias, country and language.
     *
     * @param locale
     * @param array availableLocales Only pick locales from this array. If not passed just use the whole list
     * @returns {*}
     */
    getLocaleWithFallback(localeToFind, searchLanguageFirst = false, availableLocales = Object.keys(locales)) {
        // Make sure the locale uses an underscore as seperator
        const locale = localeToFind.replace('-', '_');

        // First check if there is a matching locale
        if (availableLocales.indexOf(locale) !== -1) return locale;

        let fallbackLocale = null;

        // Then check if there is a locale with a matching alias
        availableLocales.forEach((availableLocale) => {
            if (locales[availableLocale].alias && locale.indexOf(locales[availableLocale].alias) === 0) {
                fallbackLocale = availableLocale;
            }
        });
        if (fallbackLocale !== null) return fallbackLocale;

        // If we don't have a match yet we will try the fallbacks with the current locale
        if (locale.length === 5) {
            fallbackLocale = this.tryFallbackLocales(locale, searchLanguageFirst, availableLocales);
        }
        if (fallbackLocale !== null) return fallbackLocale;

        /**
         * In some cases the locale is just 2 characters (for example just nl). Then we first try nl_NL and then
         * we try nl_ to see if there is a locale which matches the language.
         */
        if (locale.length === 2) {
            if (availableLocales.indexOf(`${locale}_${locale.toUpperCase()}`) !== -1) {
                return `${locale}_${locale.toUpperCase()}`;
            }

            fallbackLocale = this.tryFallbackLocales(`${locale}_`, searchLanguageFirst, availableLocales);
            if (fallbackLocale !== null) return fallbackLocale;
        }

        // If everything failed return the default or the first available one
        return availableLocales.indexOf('en_US') !== -1 ? 'en_US' : availableLocales[0];
    },

    /**
     * Get the translation files for a certain part of the system, for example mobapp/webapp/bots.
     * A sector can include multiple repositories who share their, for example the bots-service,
     * facebook-service and whatsapp-service have the same translations.
     *
     * @param sector
     * @returns {*}
     */
    getTranslations(sector) {
        return translations[sector];
    }
};

module.exports = Utils;
