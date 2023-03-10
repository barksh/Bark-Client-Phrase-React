/**
 * @author WMXPY
 * @namespace Stories
 * @description Use Phrases
 * @override Story
 */

import { ComponentStory } from "@storybook/react";
import { LOCALE } from "@sudoo/locale";
import { PhraseManager } from "../src";
import { DynamicHandlerStatus } from "../src/manager/dynamic-handler";

export default {
    title: "Use Phrases",
};

const phraseManager: PhraseManager = PhraseManager.fromDomains(
    "phrase.module.bark.sh",
    "react.phrase.client.bark.sh",
);

const hooks = phraseManager.forLocale(LOCALE.ENGLISH_UNITED_STATES);

const Template: ComponentStory<any> = (args: any) => {

    const phrase = hooks.usePhrases();

    if (phrase.status === DynamicHandlerStatus.PENDING) {
        return (<div>Loading...</div>);
    }

    return (
        <div>
            {args.phrases.map((phraseKey: string) => {

                return (<div key={phraseKey}>
                    {phraseKey}: {phrase.handler.get(phraseKey)}
                </div>);
            })}
            <div>Status: {phrase.status}</div>
            <div>Phrases: {JSON.stringify([...(phrase.handler as any)._phrases.keys()])}</div>
        </div>);
};

export const Primary = Template.bind({});

Primary.args = {
    phrases: ["test", "test2"],
};
