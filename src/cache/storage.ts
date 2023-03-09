/**
 * @author WMXPY
 * @namespace Cache
 * @description Storage
 */

import { verifyLocale } from "@sudoo/locale";
import { PhraseLocalStorageCache, PhraseLocalStorageCachePhrase } from "./declare";

const localStorageKey: string = '_bark-client-phrase-react-cache';

export const writeStoragePhraseLocalStorageCache = (
    cache: PhraseLocalStorageCache,
    storage: Storage = localStorage,
): void => {

    storage.setItem(localStorageKey, JSON.stringify(cache));
};

export const readStoragePhraseCache = (
    currentDate: Date = new Date(),
    storage: Storage = localStorage,
): PhraseLocalStorageCache => {

    const cache: string | null = storage.getItem(localStorageKey);

    if (cache === null) {
        return {};
    }

    const parsed: PhraseLocalStorageCache = JSON.parse(cache);
    const newCache: PhraseLocalStorageCache = {};

    let mutated: boolean = false;

    locale: for (const locale of Object.keys(parsed)) {

        if (!verifyLocale(locale)) {

            mutated = true;
            continue locale;
        }

        const phrases: PhraseLocalStorageCachePhrase[] =
            parsed[locale] as PhraseLocalStorageCachePhrase[];

        const newCachePhrases: PhraseLocalStorageCachePhrase[] = [];

        phrase: for (const phrase of phrases) {

            if (phrase.e < currentDate.getTime()) {

                mutated = true;
                continue phrase;
            }

            newCachePhrases.push(phrase);
        }

        newCache[locale] = newCachePhrases;
    }

    if (mutated) {
        writeStoragePhraseLocalStorageCache(newCache, storage);
    }
    return newCache;
};
