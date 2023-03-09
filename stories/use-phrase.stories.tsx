/**
 * @author WMXPY
 * @namespace UsePhrase
 * @description Use Phrase
 * @override Story
 */

import { LOCALE } from "@sudoo/locale";
import { PhraseManager } from "../src";

export default {
  title: "Use Phrase",
};

const phraseManager: PhraseManager = PhraseManager.fromDomains(
  "phrase.module.bark.sh",
  "intersection.bark.sh",
);

const hooks = phraseManager.forLocale(LOCALE.ENGLISH_UNITED_STATES);

const Template = () => {

  const phrase: Record<string, string> = hooks.usePhrases([
    "test",
    "test2",
  ]);

  return (
    <div>
      {JSON.stringify(phrase, null, 2)}
    </div>);
};

export const Primary = Template.bind({});
