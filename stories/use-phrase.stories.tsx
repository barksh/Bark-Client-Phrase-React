/**
 * @author WMXPY
 * @namespace UsePhrase
 * @description Use Phrase
 * @override Story
 */

import { usePhrase } from "../src";

export default {
  title: "Use Phrase",
};

const Template = () => {

  const phrase: string = usePhrase();

  return (
    <div>
      {phrase}
    </div>);
};

export const Primary = Template.bind({});
