<?php

namespace UpinionIntl;

/**
 * Class Utils
 * @package UpinionIntl
 *
 * Functions to use the Intl in PHP/Hack projects.
 */
class Utils {

    protected $locales;

    /**
     * Utils constructor.
     *
     * Retrieve the locales from the JSON file and store them in an object, to be used in this class.
     */
    function __construct() {
        $intlRoot = dirname(dirname(dirname(__FILE__)));
        $localesJson = file_get_contents($intlRoot.'/locales.json');
        $this->locales = json_decode($localesJson, true);
    }

    /**
     * Get all locales
     *
     * @return array locales
     */
    public function getLocales() {
        return $this->locales;
    }

    /**
     * @param $locale
     * @param bool $searchLanguageFirst
     * @param array|null $availableLocales
     * @return string Found locale
     */
    public function getLocaleWithFallback($locale, $searchLanguageFirst = false, $availableLocales = null) {
        if (!$availableLocales) $availableLocales = array_keys($this->locales);

        // Make sure the locale uses an underscore as seperator and has the correct casing
        $locale = str_replace('-', '_', $locale);
        if (strlen($locale) === 5) {
            $locale = strtolower(substr($locale, 0, 2)) . substr($locale, 2, 1) . strtoupper(substr($locale, 3, 2));
        }

        // First check if there is a matching locale
        if (in_array($locale, $availableLocales)) return $locale;

        $fallbackLocale = null;

        // Then check if there is a locale with a matching alias
        foreach ($availableLocales as $availableLocale) {
            if (
                array_key_exists('alias', $this->locales[$availableLocale]) &&
                stripos($locale, $this->locales[$availableLocale]['alias']) === 0
            ) return $availableLocale;
        }

        // Try to find a locale with the same country or language
        if (strlen($locale) === 5) {
            $fallbackLocale = $this->_tryFallbackLocales($locale, $searchLanguageFirst, $availableLocales);
            if ($fallbackLocale !== null) return $fallbackLocale;
        }

        /**
         * In some cases the locale is just 2 characters (for example just nl). Then we first try nl_NL and then
         * we try nl_ to see if there is a locale which matches the language.
         */
        if (strlen($locale) === 2) {
            $doubleLocale = strtolower($locale).'_'.strtoupper($locale);
            if (in_array($doubleLocale, $availableLocales)) return $doubleLocale;

            $fallbackLocale = $this->_tryFallbackLocales(strtolower($locale).'_', $searchLanguageFirst, $availableLocales);
            if ($fallbackLocale !== null) return $fallbackLocale;
        }

        // If everything failed return the default or the first available one
        return in_array('en_US', $availableLocales) ? 'en_US' : $availableLocales[0];
    }

    /**
     * Try to find a locale with the same country or language. The order is based on the searchLanguageFirst param.
     *
     * @param $locale
     * @param bool $searchLanguageFirst
     * @param array|null $availableLocales
     * @return string|null
     */
    private function _tryFallbackLocales($locale, $searchLanguageFirst = false, $availableLocales) {
        $language = explode('_', $locale)[0];
        $country = explode('_', $locale)[1];
        $fallbackLocale = null;

        if ($searchLanguageFirst) {
            $fallbackLocale = $this->_findLocale($availableLocales, $language, 0);
            if ($fallbackLocale === null) $fallbackLocale = $this->_findLocale($availableLocales, $country, 1);
        } else {
            $fallbackLocale = $this->_findLocale($availableLocales, $country, 1);
            if ($fallbackLocale === null) $fallbackLocale = $this->_findLocale($availableLocales, $language, 0);
        }

        return $fallbackLocale;
    }

    /**
     * Check if the searchTerm matches the part before or after the underscore (based on the searchIndex)
     *
     * @param array $availableLocales
     * @param string $searchTerm country or language part of the locale, for example nl or US.
     * @param int $searchIndex Index where to search, must be 0 (before the underscore) or 1 (after).
     * @return null
     */
    private function _findLocale($availableLocales, $searchTerm, $searchIndex) {
        foreach ($availableLocales as $availableLocale) {
            if (explode('_', $availableLocale)[$searchIndex] === $searchTerm) return $availableLocale;
        }
        return null;
    }
}
