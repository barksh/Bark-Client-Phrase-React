/**
 * @author WMXPY
 * @namespace Manager
 * @description Phrase
 */

import { LOCALE } from "@sudoo/locale";
import { PhraseHookManager } from "./hook";

export class PhraseManager {

    public static fromDomains(
        phraseHost: string,
        selfDomain: string,
    ): PhraseManager {

        return new PhraseManager(phraseHost, selfDomain);
    }

    private readonly _phraseHost: string;
    private readonly _selfDomain: string;

    private constructor(
        phraseHost: string,
        selfDomain: string,
    ) {

        this._phraseHost = phraseHost;
        this._selfDomain = selfDomain;
    }

    public forLocale(locale: LOCALE): PhraseHookManager {

        return PhraseHookManager.fromDomainAndLocale(
            this._phraseHost,
            this._selfDomain,
            locale,
        );
    }
}
