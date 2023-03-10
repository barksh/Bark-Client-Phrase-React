/**
 * @author WMXPY
 * @namespace Manager
 * @description Hook
 */

import { LOCALE } from "@sudoo/locale";
import * as React from "react";
import { PhraseCache } from "../cache/cache";
import { PhraseCacheResult, PHRASE_CACHE_MISS_SYMBOL, PHRASE_CACHE_NULL_SYMBOL } from "../cache/declare";
import { getPhrasesProxy } from "../proxy/phrase-get";
import { DynamicHandlerStatus, PhraseDynamicHandler } from "./dynamic-handler";

export type UsePhraseHookResult<T extends string = string> = {

    readonly status: Exclude<DynamicHandlerStatus, DynamicHandlerStatus.PENDING>;
    readonly handler: PhraseDynamicHandler<T>;
} | {

    readonly status: DynamicHandlerStatus.PENDING;
    readonly handler: null;
};

export class PhraseHookManager {

    public static fromDomainAndLocale(
        phraseHost: string,
        selfDomain: string,
        locale: LOCALE,
    ): PhraseHookManager {

        return new PhraseHookManager(
            phraseHost,
            selfDomain,
            locale,
        );
    }

    private readonly _phraseHost: string;
    private readonly _selfDomain: string;
    private readonly _locale: LOCALE;

    private constructor(
        phraseHost: string,
        selfDomain: string,
        locale: LOCALE,
    ) {

        this._phraseHost = phraseHost;
        this._selfDomain = selfDomain;
        this._locale = locale;
    }

    public usePhrases<T extends string = string>(): UsePhraseHookResult<T> {

        const handlerRef: React.MutableRefObject<PhraseDynamicHandler<T>> =
            React.useRef<PhraseDynamicHandler<T>>(null as any);

        const [status, setStatus] = React.useState<DynamicHandlerStatus>(DynamicHandlerStatus.PENDING);

        React.useEffect(() => {

            handlerRef.current = PhraseDynamicHandler.create(
                this._locale,
                this._requestPhrases.bind(this),
                setStatus,
            );

            setStatus(DynamicHandlerStatus.IDLE);
        }, []);

        if (!handlerRef.current) {
            return {
                status: DynamicHandlerStatus.PENDING,
                handler: null,
            };
        }

        return {
            status: status as Exclude<DynamicHandlerStatus, DynamicHandlerStatus.PENDING>,
            handler: handlerRef.current,
        };
    }

    public useFixedPhrases<T extends string = string>(
        phrases: T[],
    ): Record<T, string> {

        const [result, setResult] = React.useState<Record<string, string>>({});

        React.useEffect(() => {

            this._getInitialPhrases(phrases)
                .then((phraseResult: PhraseCacheResult) => {

                    const stringResult: Record<string, string> =
                        Object.keys(phraseResult).reduce((
                            previous: Record<string, string>,
                            current: string,
                        ) => {

                            const value: string
                                | typeof PHRASE_CACHE_MISS_SYMBOL
                                | typeof PHRASE_CACHE_NULL_SYMBOL =
                                phraseResult[current];

                            if (typeof value === 'string') {
                                previous[current] = value;
                            } else if (value === PHRASE_CACHE_MISS_SYMBOL) {
                                previous[current] = `[${current}]`;
                            } else if (value === PHRASE_CACHE_NULL_SYMBOL) {
                                previous[current] = `[${current}]`;
                            }
                            return previous;
                        }, {});

                    setResult(stringResult);
                });
        }, [phrases.join(',')]);

        return result;
    }

    private async _getInitialPhrases(
        phrases: string[],
    ): Promise<PhraseCacheResult> {

        const result: PhraseCacheResult = {};

        const cache: PhraseCache = PhraseCache.getInstance();
        const cacheResult: PhraseCacheResult = cache.getPhrases(this._locale, phrases);

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

        return result;
    }

    private async _requestPhrases(
        phrases: string[],
    ): Promise<Record<string, string | null>> {

        console.log('[Bark-Client-Phrase-React] request remote for phrases', phrases);
        const getPhraseResult: Record<string, string> = await getPhrasesProxy(
            this._phraseHost,
            this._selfDomain,
            this._locale,
            phrases,
        );

        return phrases.reduce((
            previous: Record<string, string | null>,
            current: string,
        ) => {

            const phrase: string | null = getPhraseResult[current];
            if (typeof phrase === 'string') {
                return {
                    ...previous,
                    [current]: phrase,
                };
            }
            return {
                ...previous,
                [current]: null,
            };
        }, {});
    }
}
