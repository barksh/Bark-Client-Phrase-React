/**
 * @author WMXPY
 * @namespace Stories
 * @description Use Fixed Phrases
 * @override Story
 */

import { StoryFn } from "@storybook/react";
import { LOCALE } from "@sudoo/locale";
import { PhraseManager } from "../src";

const localStorageKey: string = '_bark-client-phrase-react-cache';

export default {
  title: "Use Fixed Phrases",
};

const phraseManager: PhraseManager = PhraseManager.fromDomains(
  "phrase.module.bark.sh",
  "react.phrase.client.bark.sh",
);

const hooks = phraseManager.forLocale(LOCALE.ENGLISH_UNITED_STATES);

const Template: StoryFn<any> = (args: any) => {

  const phrase: Record<string, string> = hooks.useFixedPhrases(
    args.phrases,
  );

  return (
    <div>
      {JSON.stringify(phrase, null, 2)}
      <div>Storage: {JSON.stringify(localStorage.getItem(localStorageKey))}</div>
    </div>);
};

export const Primary = Template.bind({});

Primary.args = {
  phrases: ["test", "test2"],
};
