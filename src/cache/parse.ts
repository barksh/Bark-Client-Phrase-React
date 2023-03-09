/**
 * @author WMXPY
 * @namespace Cache
 * @description Parse
 */

import { LOCALE, verifyLocale } from "@sudoo/locale";
import { PhraseCacheMap, PhraseCacheMapLocale, PhraseLocalStorageCache, PhraseLocalStorageCachePhrase } from "./declare";

export const parsePhraseStorageCachePhraseToMap = (
    phrases: PhraseLocalStorageCachePhrase[],
): PhraseCacheMapLocale => {

    const localeMap: PhraseCacheMapLocale = new Map();

    for (const phrase of phrases) {

        localeMap.set(phrase.k, phrase.v);
    }

    return localeMap;
};


export const parsePhraseStorageCacheToMap = (
    cache: PhraseLocalStorageCache,
): PhraseCacheMap => {

    const map: PhraseCacheMap = new Map();

    locale: for (const locale of Object.keys(cache)) {

        if (!verifyLocale(locale)) {
            continue locale;
        }

        const phrases: PhraseLocalStorageCachePhrase[] =
            cache[locale] as PhraseLocalStorageCachePhrase[];

        const localeMap: PhraseCacheMapLocale = parsePhraseStorageCachePhraseToMap(phrases);
        map.set(locale as LOCALE, localeMap);
    }
    return map;
};
