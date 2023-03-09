/**
 * @author WMXPY
 * @namespace Placeholder
 * @description Placeholder
 * @override Unit Test
 */

import { LOCALE } from "@sudoo/locale";
import { expect } from "chai";
import * as Chance from "chance";
import { PhraseCache, PHRASE_CACHE_MISS_SYMBOL } from "../../../src";
import { createMockStorage, MockStorage } from "../../mock/storage";

const storageIdentifier: string = '_bark-client-phrase-react-cache';
// eslint-disable-next-line @typescript-eslint/no-magic-numbers
const thirtyDays: number = 1000 * 60 * 60 * 24 * 30;

describe("Given {PhraseCache} Class", (): void => {

    const chance: Chance.Chance = new Chance("placeholder");

    const currentDate: Date = new Date();

    afterEach(() => {
        PhraseCache.clearInstance();
    });

    it("Should be able to load cache from storage", (): void => {

        const identifier: string = chance.word();

        const storage: MockStorage = createMockStorage();
        const cache: PhraseCache = PhraseCache.getInstance(currentDate, storage);

        const result = cache.getPhrases(LOCALE.ENGLISH_UNITED_STATES, [identifier]);

        expect(result).to.be.deep.equal({
            [identifier]: PHRASE_CACHE_MISS_SYMBOL,
        });
    });

    it("Should be able to load cache from storage with locale", (): void => {

        const identifier: string = chance.word();

        const storage: MockStorage = createMockStorage();
        storage.setItem(storageIdentifier, JSON.stringify({
            [LOCALE.ENGLISH_UNITED_STATES]: [],
        }));

        const cache: PhraseCache = PhraseCache.getInstance(currentDate, storage);

        const result = cache.getPhrases(LOCALE.ENGLISH_UNITED_STATES, [identifier]);

        expect(result).to.be.deep.equal({
            [identifier]: PHRASE_CACHE_MISS_SYMBOL,
        });
    });

    it("Should be able to load cache from storage with locale and value", (): void => {

        const identifier: string = chance.word();
        const value: string = chance.word();

        const storage: MockStorage = createMockStorage();
        storage.setItem(storageIdentifier, JSON.stringify({
            [LOCALE.ENGLISH_UNITED_STATES]: [{
                k: identifier,
                v: value,
                e: currentDate.getTime() + 1000,
            }],
        }));

        const cache: PhraseCache = PhraseCache.getInstance(currentDate, storage);

        const result = cache.getPhrases(LOCALE.ENGLISH_UNITED_STATES, [identifier]);

        expect(result).to.be.deep.equal({
            [identifier]: value,
        });
    });

    it("Should be able to load cache from storage with locale and value - expired", (): void => {

        const identifier: string = chance.word();
        const value: string = chance.word();

        const storage: MockStorage = createMockStorage();
        storage.setItem(storageIdentifier, JSON.stringify({
            [LOCALE.ENGLISH_UNITED_STATES]: [{
                k: identifier,
                v: value,
                e: currentDate.getTime() - 1000,
            }],
        }));

        const cache: PhraseCache = PhraseCache.getInstance(currentDate, storage);

        const result = cache.getPhrases(LOCALE.ENGLISH_UNITED_STATES, [identifier]);

        expect(result).to.be.deep.equal({
            [identifier]: PHRASE_CACHE_MISS_SYMBOL,
        });
        expect(storage.getSavedRecords()).to.be.lengthOf(2);
        expect(storage.getSavedRecords()[1]).deep.equal({
            key: storageIdentifier,
            value: JSON.stringify({
                [LOCALE.ENGLISH_UNITED_STATES]: [],
            }),
        });
    });

    it("Should be able to put cache to empty locale", (): void => {

        const identifier: string = chance.word();
        const value: string = chance.word();

        const storage: MockStorage = createMockStorage();
        const cache: PhraseCache = PhraseCache.getInstance(currentDate, storage);

        cache.putPhrases(LOCALE.ENGLISH_UNITED_STATES, {
            [identifier]: value,
        });

        expect(storage.getSavedRecords()).to.be.lengthOf(1);
        expect(storage.getSavedRecords()[0]).deep.equal({
            key: storageIdentifier,
            value: JSON.stringify({
                [LOCALE.ENGLISH_UNITED_STATES]: [{
                    k: identifier,
                    v: value,
                    e: currentDate.getTime() + thirtyDays,
                }],
            }),
        });
    });

    it("Should be able to put cache to existing locale", (): void => {

        const identifier1: string = chance.word();
        const value1: string = chance.word();

        const identifier2: string = chance.word();
        const value2: string = chance.word();

        const storage: MockStorage = createMockStorage();
        const cache: PhraseCache = PhraseCache.getInstance(currentDate, storage);

        cache.putPhrases(LOCALE.ENGLISH_UNITED_STATES, {
            [identifier1]: value1,
        });

        cache.putPhrases(LOCALE.ENGLISH_UNITED_STATES, {
            [identifier2]: value2,
        });

        expect(storage.getSavedRecords()).to.be.lengthOf(2);
        expect(storage.getSavedRecords()[1]).deep.equal({
            key: storageIdentifier,
            value: JSON.stringify({
                [LOCALE.ENGLISH_UNITED_STATES]: [{
                    k: identifier1,
                    v: value1,
                    e: currentDate.getTime() + thirtyDays,
                }, {
                    k: identifier2,
                    v: value2,
                    e: currentDate.getTime() + thirtyDays,
                }],
            }),
        });
    });

    it("Should be able to put cache to existing locale - override", (): void => {

        const identifier1: string = chance.word();
        const value1: string = chance.word();

        const value2: string = chance.word();

        const storage: MockStorage = createMockStorage();
        const cache: PhraseCache = PhraseCache.getInstance(currentDate, storage);

        cache.putPhrases(LOCALE.ENGLISH_UNITED_STATES, {
            [identifier1]: value1,
        });

        cache.putPhrases(LOCALE.ENGLISH_UNITED_STATES, {
            [identifier1]: value2,
        });

        expect(storage.getSavedRecords()).to.be.lengthOf(2);
        expect(storage.getSavedRecords()[1]).deep.equal({
            key: storageIdentifier,
            value: JSON.stringify({
                [LOCALE.ENGLISH_UNITED_STATES]: [{
                    k: identifier1,
                    v: value2,
                    e: currentDate.getTime() + thirtyDays,
                }],
            }),
        });
    });

    it("Should be able to put cache to existing locale - already in storage", (): void => {

        const identifier1: string = chance.word();
        const value1: string = chance.word();

        const identifier2: string = chance.word();
        const value2: string = chance.word();

        const storage: MockStorage = createMockStorage();
        storage.setItem(storageIdentifier, JSON.stringify({
            [LOCALE.ENGLISH_UNITED_STATES]: [{
                k: identifier1,
                v: value1,
                e: currentDate.getTime() + thirtyDays,
            }],
        }));

        const cache: PhraseCache = PhraseCache.getInstance(currentDate, storage);

        cache.putPhrases(LOCALE.ENGLISH_UNITED_STATES, {
            [identifier2]: value2,
        });

        expect(storage.getSavedRecords()).to.be.lengthOf(2);
        expect(storage.getSavedRecords()[1]).deep.equal({
            key: storageIdentifier,
            value: JSON.stringify({
                [LOCALE.ENGLISH_UNITED_STATES]: [{
                    k: identifier1,
                    v: value1,
                    e: currentDate.getTime() + thirtyDays,
                }, {
                    k: identifier2,
                    v: value2,
                    e: currentDate.getTime() + thirtyDays,
                }],
            }),
        });
    });
});
