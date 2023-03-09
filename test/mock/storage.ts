/**
 * @author WMXPY
 * @namespace Mock
 * @description Storage
 * @override Mock
 */

export type MockStorage = Storage & {

    getSavedRecords: () => Array<{ key: string; value: string }>;
};

export const createMockStorage = (): MockStorage => {

    const savedRecords: Array<{ key: string; value: string }> = [];
    const map: Map<string, string> = new Map();

    return {

        get length(): number {
            return map.size;
        },

        clear: (): void => {
            map.clear();
        },

        getItem: (key: string): string | null => {

            return map.get(key) || null;
        },
        key: (index: number): string | null => {

            return Array.from(map.keys())[index] || null;
        },
        removeItem: (key: string): void => {

            map.delete(key);
        },
        setItem: (key: string, value: string): void => {

            map.set(key, value);
            savedRecords.push({
                key,
                value,
            });
        },
        getSavedRecords: (): Array<{ key: string; value: string }> => {

            return savedRecords;
        },
    };
};
