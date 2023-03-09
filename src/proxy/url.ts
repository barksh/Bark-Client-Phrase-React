/**
 * @author WMXPY
 * @namespace Proxy
 * @description Url
 */

export const fixURL = (url: string): string => {

    if (url.startsWith('http://')
        || url.startsWith('https://')) {
        return url;
    }

    return `https://${url}`;
};
