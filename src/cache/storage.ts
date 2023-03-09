/**
 * @author WMXPY
 * @namespace Cache
 * @description Storage
 */

import { LOCALE, verifyLocale } from "@sudoo/locale";
import { PhraseCacheMap, PhraseLocalStorageCache, PhraseLocalStorageCachePhrase } from "./declare";

const localStorageKey: string = '_bark-client-phrase-react-cache';

export const writeStoragePhraseLocalStorageCache = (
    cache: PhraseLocalStorageCache,
    storage: Storage = localStorage,
): void => {

    storage.setItem(localStorageKey, JSON.stringify(cache));
};

export const writeStoragePhraseCacheMap = (
    cache: PhraseCacheMap,
    storage: Storage = localStorage,
): void => {

    const map: PhraseLocalStorageCache = {};

    for (const [locale, phrases] of cache.entries()) {

        const phrasesArray: PhraseLocalStorageCachePhrase[] = [];

        for (const [key, value] of phrases.entries()) {

            phrasesArray.push({
                k: key,
                v: value,
                e: Infinity,
            });
        }
        map[locale] = phrasesArray;
    }

    writeStoragePhraseLocalStorageCache(map, storage);
};

export const readStoragePhraseCache = (
    currentDate: Date = new Date(),
    storage: Storage = localStorage,
): PhraseCacheMap => {

    const cache: string | null = storage.getItem(localStorageKey);

    const map: PhraseCacheMap = new Map<LOCALE, Map<string, string>>();

    if (cache === null) {
        return map;
    }

    const parsed: PhraseLocalStorageCache = JSON.parse(cache);
    const newCache: PhraseLocalStorageCache = {};

    locale: for (const locale of Object.keys(parsed)) {

        if (!verifyLocale(locale)) {
            continue locale;
        }

        const phrases: PhraseLocalStorageCachePhrase[] =
            parsed[locale] as PhraseLocalStorageCachePhrase[];
        const newCachePhrases: PhraseLocalStorageCachePhrase[] = [];

        const localeMap: Map<string, string> = new Map<string, string>();

        phrase: for (const phrase of phrases) {

            if (phrase.e < currentDate.getTime()) {
                continue phrase;
            }

            localeMap.set(phrase.k, phrase.v);
            newCachePhrases.push(phrase);
        }

        map.set(locale as LOCALE, localeMap);
        newCache[locale] = newCachePhrases;
    }

    return map;
};
