/**
 * @author WMXPY
 * @namespace Error
 * @description Panic
 */

import { Panic } from "connor";
import { ERROR_CODE } from "./code";
import { ERROR_LIST } from "./list";

const MODULE_NAME = 'Bark-Client-Phrase-React';

export const panic: Panic<ERROR_CODE> = Panic.withDictionary(MODULE_NAME, ERROR_LIST);
