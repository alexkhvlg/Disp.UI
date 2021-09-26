"use strict";

import { DictNames, GetDict } from "./dictionaries";

export class Rule {

    static LoadFromStorage() {
        console.log("Load Rule from storage");
        return JSON.parse(GetDict(DictNames.Rules));
    }
}