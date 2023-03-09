/**
 * @author WMXPY
 * @namespace Proxy
 * @description Phrase Get
 */

import { LOCALE } from "@sudoo/locale";
import { HTTP_RESPONSE_CODE } from "@sudoo/magic";
import { ERROR_CODE } from "../error/code";
import { panic } from "../error/panic";

export const postInquiryV1Proxy = async (
    phraseHost: string,
    selfDomain: string,
    locale: LOCALE,
    identifiers: string[],
): Promise<Record<string, string>> => {

    const url: URL = new URL(`${phraseHost}/phrase`);
    url.searchParams.append('locale', locale);
    url.searchParams.append('domain', selfDomain);

    identifiers.forEach((identifier: string) => {
        url.searchParams.append('id', identifier);
    });

    const path: string = url.toString();

    const response: Response = await fetch(path, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (response.status !== HTTP_RESPONSE_CODE.OK) {
        throw panic.code(
            ERROR_CODE.REQUEST_FAILED_1,
            await response.json(),
        );
    }

    return await response.json();
};
