/**
 * @author WMXPY
 * @namespace Placeholder
 * @description Placeholder
 * @override Unit Test
 */

import { render, screen } from "@testing-library/react";
import { expect } from "chai";
import * as Chance from "chance";
import * as React from "react";

describe("Placeholder", (): void => {

    const chance: Chance.Chance = new Chance("placeholder");

    it("Placeholder", async (): Promise<void> => {

        render(<div>
            123
        </div>);

        expect(screen.getByText("123"));

        expect(chance.string()).to.be.not.equal(chance.string());
    });
});
