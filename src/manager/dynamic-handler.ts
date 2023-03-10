/**
 * @author WMXPY
 * @namespace Manager
 * @description Dynamic Handler
 */

import { PHRASE_CACHE_NULL_SYMBOL } from "../cache/declare";

export enum DynamicHandlerStatus {
    IDLE = "IDLE",
    QUEUEING = "QUEUEING",
    REQUESTING = "REQUESTING",
}

export class PhraseDynamicHandler<T extends string = string> {

    public static create<T extends string = string>(
        requestPhrases: (phrases: string[]) => Promise<Record<string, string | null>>,
        setStatus: (status: DynamicHandlerStatus) => void,
    ): PhraseDynamicHandler<T> {

        return new PhraseDynamicHandler<T>(requestPhrases, setStatus);
    }

    private readonly _requestPhrases: (phrases: string[]) => Promise<Record<string, string | null>>;
    private readonly _setStatus: (status: DynamicHandlerStatus) => void;

    private _timer: any;

    private readonly _phrases: Map<T, string | typeof PHRASE_CACHE_NULL_SYMBOL>;
    private readonly _phraseQueue: Set<T>;

    private constructor(
        requestPhrases: (phrases: string[]) => Promise<Record<string, string | null>>,
        setStatus: (status: DynamicHandlerStatus) => void,
    ) {

        this._requestPhrases = requestPhrases;
        this._setStatus = setStatus;

        this._phrases = new Map<T, string | typeof PHRASE_CACHE_NULL_SYMBOL>();
        this._phraseQueue = new Set<T>();
    }

    public get(identifier: T): string {

        if (this._phrases.has(identifier)) {

            const phrase: string | typeof PHRASE_CACHE_NULL_SYMBOL =
                this._phrases.get(identifier) as string | typeof PHRASE_CACHE_NULL_SYMBOL;

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

        this._setStatus(DynamicHandlerStatus.QUEUEING);

        clearTimeout(this._timer);

        const timeoutMethod = async () => {

            this._setStatus(DynamicHandlerStatus.REQUESTING);

            const result: Record<string, string | null> = await this._requestPhrases([...this._phraseQueue]);

            this._phraseQueue.clear();

            for (const key of Object.keys(result)) {

                const phrase: string | null = result[key];

                if (phrase) {
                    this._phrases.set(key as T, phrase);
                } else {
                    this._phrases.set(key as T, PHRASE_CACHE_NULL_SYMBOL);
                }
            }

            this._setStatus(DynamicHandlerStatus.IDLE);
        };

        this._timer = setTimeout(() => {
            timeoutMethod();
        }, 256);
    }
}
