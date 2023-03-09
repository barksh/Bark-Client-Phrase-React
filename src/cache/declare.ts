/**
 * @author WMXPY
 * @namespace Cache
 * @description Declare
 */

import { LOCALE } from "@sudoo/locale";

export type PhraseLocalStorageCachePhrase = {

    readonly k: string;
    readonly v: string;
    readonly e: number;
};

export type PhraseLocalStorageCache = Partial<Record<LOCALE, PhraseLocalStorageCachePhrase[]>>;

export type PhraseCacheMap = Map<LOCALE, Map<string, string>>;
