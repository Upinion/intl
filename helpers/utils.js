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
    }
};

module.exports = Utils;
