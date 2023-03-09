/**
 * @author WMXPY
 * @namespace Cache
 * @description Cache
 */

import { LOCALE } from "@sudoo/locale";

export class PhraseCache {

    private static _instance: PhraseCache;

    public static getInstance(): PhraseCache {

        if (!this._instance) {
            this._instance = new PhraseCache();
        }
        return this._instance;
    }

    private readonly _cache: Map<LOCALE, Map<string, string>>;

    private constructor() {

        this._cache = new Map<LOCALE, Map<string, string>>();
    }
}
