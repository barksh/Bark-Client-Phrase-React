/**
 * @author WMXPY
 * @namespace Manager
 * @description Phrases Handler
 */

export class PhrasePhrasesHandler {

    public static create(): PhrasePhrasesHandler {

        return new PhrasePhrasesHandler();
    }

    private readonly _phrases: string[];

    private constructor() {

        this._phrases = [];
    }

    public get(): string[] {

        return this._phrases;
    }
}
