/**
 * @author WMXPY
 * @namespace Cache
 * @description Declare
 */

import { LOCALE } from "@sudoo/locale";

export type PhraseLocalStorageCachePhrase = {

    readonly k: string;
    readonly v: string | null;
    readonly e: number;
};

export type PhraseLocalStorageCache = Partial<Record<LOCALE, PhraseLocalStorageCachePhrase[]>>;

export type PhraseCacheMapLocale = Map<string, string | null>;
export type PhraseCacheMap = Map<LOCALE, PhraseCacheMapLocale>;

export const PHRASE_CACHE_MISS_SYMBOL = Symbol('phrase-cache-miss');
export const PHRASE_CACHE_NULL_SYMBOL = Symbol('phrase-cache-null');

export type PhraseCacheResultValue = string | typeof PHRASE_CACHE_MISS_SYMBOL | typeof PHRASE_CACHE_NULL_SYMBOL;
export type PhraseCacheResult = Record<string, PhraseCacheResultValue>;
