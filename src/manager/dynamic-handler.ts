/**
 * @author WMXPY
 * @namespace Manager
 * @description Dynamic Handler
 */

import { LOCALE } from "@sudoo/locale";
import { PhraseCache } from "../cache/cache";
import { PhraseCacheResult, PhraseCacheResultValue, PHRASE_CACHE_MISS_SYMBOL, PHRASE_CACHE_NULL_SYMBOL } from "../cache/declare";

export enum DynamicHandlerStatus {

    PENDING = "PENDING",
    IDLE = "IDLE",
    QUEUEING = "QUEUEING",
    REQUESTING = "REQUESTING",
}

export class PhraseDynamicHandler<T extends string = string> {

    public static create<T extends string = string>(
        locale: LOCALE,
        requestPhrases: (phrases: string[]) => Promise<Record<string, string | null>>,
        setStatus: (status: DynamicHandlerStatus) => void,
    ): PhraseDynamicHandler<T> {

        return new PhraseDynamicHandler<T>(locale, requestPhrases, setStatus);
    }

    private readonly _locale: LOCALE;
    private readonly _requestPhrases: (phrases: string[]) => Promise<Record<string, string | null>>;
    private readonly _setStatus: (status: DynamicHandlerStatus) => void;

    private _timer: any;
    private _queueing: boolean;

    private readonly _phrases: Map<T, string | typeof PHRASE_CACHE_NULL_SYMBOL>;
    private readonly _phraseQueue: Set<T>;

    private constructor(
        locale: LOCALE,
        requestPhrases: (phrases: string[]) => Promise<Record<string, string | null>>,
        setStatus: (status: DynamicHandlerStatus) => void,
    ) {

        this._locale = locale;
        this._requestPhrases = requestPhrases;
        this._setStatus = setStatus;

        this._timer = null;
        this._queueing = false;

        this._phrases = new Map<T, string | typeof PHRASE_CACHE_NULL_SYMBOL>();
        this._phraseQueue = new Set<T>();
    }

    public get(identifier: T): string {

        if (this._phrases.has(identifier)) {

            const phrase: string
                | typeof PHRASE_CACHE_NULL_SYMBOL =
                this._phrases.get(identifier) as string
                | typeof PHRASE_CACHE_NULL_SYMBOL;

            if (phrase === PHRASE_CACHE_NULL_SYMBOL) {
                return `[${identifier}]`;
            }

            return phrase;
        }

        this._queuePhrase(identifier);
        return `[${identifier}]`;
    }

    private _queuePhrase(identifier: T): void {

        if (this._phraseQueue.has(identifier)) {
            return;
        }

        if (this._phrases.has(identifier)) {
            return;
        }

        this._phraseQueue.add(identifier);
        this._scheduleRequest();
    }

    private _scheduleRequest(): void {

        if (this._queueing) {
            return;
        }

        this._setStatus(DynamicHandlerStatus.QUEUEING);

        clearTimeout(this._timer);

        const timeoutMethod = async () => {

            this._setStatus(DynamicHandlerStatus.REQUESTING);

            const result: PhraseCacheResult = {};

            const requestQueue: string[] = [...this._phraseQueue];

            const cache: PhraseCache = PhraseCache.getInstance();
            const cacheResult: PhraseCacheResult =
                cache.getPhrases(this._locale, requestQueue);


            const toBeFetched: string[] = [];
            for (const key of Object.keys(cacheResult)) {

                const value: string
                    | typeof PHRASE_CACHE_MISS_SYMBOL
                    | typeof PHRASE_CACHE_NULL_SYMBOL =
                    cacheResult[key];

                result[key] = value;

                if (value === PHRASE_CACHE_MISS_SYMBOL) {
                    toBeFetched.push(key);
                }
            }

            if (toBeFetched.length > 0) {

                const requestPhrases: Record<string, string | null> =
                    await this._requestPhrases(toBeFetched);
                cache.putPhrases(this._locale, requestPhrases);

                for (const key of Object.keys(requestPhrases)) {

                    const value: string | null = requestPhrases[key];
                    if (value) {
                        result[key] = value;
                    } else {
                        result[key] = PHRASE_CACHE_NULL_SYMBOL;
                    }
                }
            }

            this._phraseQueue.clear();

            for (const key of Object.keys(result)) {

                const phrase: PhraseCacheResultValue = result[key];

                if (typeof phrase === 'string') {
                    this._phrases.set(key as T, phrase);
                } else if (phrase === PHRASE_CACHE_MISS_SYMBOL) {
                    this._phrases.set(key as T, `[${key}]`);
                } else if (phrase === PHRASE_CACHE_NULL_SYMBOL) {
                    this._phrases.set(key as T, `[${key}]`);
                }
            }

            this._setStatus(DynamicHandlerStatus.IDLE);
            this._queueing = false;
        };

        this._timer = setTimeout(() => {

            this._queueing = true;
            timeoutMethod();
        }, 256);
    }
}
