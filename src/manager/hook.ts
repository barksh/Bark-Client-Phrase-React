/**
 * @author WMXPY
 * @namespace Manager
 * @description Hook
 */

import { LOCALE } from "@sudoo/locale";
import { getPhrasesProxy } from "../proxy/phrase-get";

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

    public usePhrases(
        phrases: string[],
    ): Record<string, string> {

        this._requestPhrases(phrases);

        return {};
    }

    private async _requestPhrases(
        phrases: string[],
    ): Promise<Record<string, string>> {

        const getPhraseResult = await getPhrasesProxy(
            this._phraseHost,
            this._selfDomain,
            this._locale,
            phrases,
        );

        console.log(getPhraseResult);

        return {};
    }
}
