const _ = require('underscore');
const locales = require('../locales.json');

const fs = require('fs');
const path = require('path');

const indexFilename = path.join(__dirname, '../index.js');
const mobileIndexFilename = path.join(__dirname, '../mobile_index.js');
const file = fs.readFileSync(indexFilename, 'utf8');

let localeDataImport = 'const LocaleData = {};\n';

const languageNames = Object.keys(locales).map(locale => locale.split('_')[0]);

_.uniq(languageNames).forEach((languageName) => {
    localeDataImport += (
        `LocaleData.${languageName} = require('react-native-experimental-intl/locale-data/${languageName}');\n`
    );
});
localeDataImport += process.env.npm_package_name;

const newFile = file.replace(/const LocaleData = {};[\s\S]+\n\nmodule/gi, `${localeDataImport}\nmodule`);

fs.writeFileSync(mobileIndexFilename, newFile);

console.log('Dynamic locale data file successfully generated');
