/**
 * @author WMXPY
 * @namespace UsePhrase
 * @description Use Phrase
 * @override Story
 */

import { ComponentStory } from "@storybook/react";
import { LOCALE } from "@sudoo/locale";
import { PhraseManager } from "../src";

export default {
  title: "Use Phrase",
};

const phraseManager: PhraseManager = PhraseManager.fromDomains(
  "phrase.module.bark.sh",
  "react.phrase.client.bark.sh",
);

const hooks = phraseManager.forLocale(LOCALE.ENGLISH_UNITED_STATES);

const Template: ComponentStory<any> = (args: any) => {

  const phrase: Record<string, string> = hooks.usePhrases(
    args.phrases,
  );

  return (
    <div>
      {JSON.stringify(phrase, null, 2)}
    </div>);
};

export const Primary = Template.bind({});

Primary.args = {
  phrases: ["test", "test2"],
};
