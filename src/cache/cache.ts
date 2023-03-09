/**
 * @author WMXPY
 * @namespace Cache
 * @description Cache
 */

import { LOCALE } from "@sudoo/locale";
import { PhraseCacheMap, PhraseCacheMapLocale, PhraseCacheResult, PhraseLocalStorageCache, PhraseLocalStorageCachePhrase, PHRASE_CACHE_MISS_SYMBOL, PHRASE_CACHE_NULL_SYMBOL } from "./declare";
import { parsePhraseStorageCachePhraseToMap, parsePhraseStorageCacheToMap } from "./parse";
import { readStoragePhraseCache, writeStoragePhraseLocalStorageCache } from "./storage";

export class PhraseCache {

    private static _instance: PhraseCache | null = null;

    public static getInstance(
        currentDate: Date = new Date(),
        storage: Storage = localStorage,
    ): PhraseCache {

        if (!this._instance) {

            const cache: PhraseLocalStorageCache = readStoragePhraseCache(currentDate, storage);
            this._instance = new PhraseCache(cache, currentDate, storage);
        }
        return this._instance;
    }

    public static clearInstance(): void {
        this._instance = null;
    }

    private readonly _rawCache: PhraseLocalStorageCache;
    private readonly _cacheMap: PhraseCacheMap;

    private readonly _currentDate: Date;
    private readonly _storage: Storage;

    private constructor(
        rawCache: PhraseLocalStorageCache,
        currentDate: Date,
        storage: Storage,
    ) {

        this._rawCache = rawCache;
        this._cacheMap = parsePhraseStorageCacheToMap(rawCache);

        this._currentDate = currentDate;
        this._storage = storage;
    }

    public getPhrases(
        locale: LOCALE,
        phrases: string[],
    ): PhraseCacheResult {

        const map: PhraseCacheMapLocale = this._cacheMap.has(locale)
            ? this._cacheMap.get(locale) as PhraseCacheMapLocale
            : new Map();

        const result: PhraseCacheResult = {};

        for (const phrase of phrases) {

            if (!map.has(phrase)) {
                result[phrase] = PHRASE_CACHE_MISS_SYMBOL;
                continue;
            }

            const value: string | null = map.get(phrase) as string | null;

            if (value === null) {
                result[phrase] = PHRASE_CACHE_NULL_SYMBOL;
                continue;
            }
            result[phrase] = value;
        }
        return result;
    }

    public putPhrases(
        locale: LOCALE,
        phrases: Record<string, string | null>,
        currentDate: Date = this._currentDate,
    ): void {

        if (!this._rawCache[locale]) {
            this._rawCache[locale] = [];
        }

        const rawPhrases: PhraseLocalStorageCachePhrase[] =
            this._rawCache[locale] as PhraseLocalStorageCachePhrase[];

        for (const key of Object.keys(phrases)) {

            const value: string | null = phrases[key];

            const index: number = rawPhrases.findIndex(
                (phrase: PhraseLocalStorageCachePhrase) => phrase.k === key,
            );

            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            const thirtyDays: number = 1000 * 60 * 60 * 24 * 30;
            const expire: number = currentDate.getTime() + thirtyDays;

            if (index >= 0) {
                (rawPhrases[index] as any).v = value;
                (rawPhrases[index] as any).e = expire;
            } else {
                rawPhrases.push({
                    k: key,
                    v: value,
                    e: expire,
                });
            }
        }

        writeStoragePhraseLocalStorageCache(this._rawCache, this._storage);
        this._cacheMap.set(locale, parsePhraseStorageCachePhraseToMap(rawPhrases));
    }
}
