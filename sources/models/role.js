"use strict";

import { my_fetch, response_ok } from "../Tools";
import { DictNames, SaveDict, GetDict } from "./dictionaries";

export class Role {

    static LoadFromStorage() {
        console.log("Load Role from storage");
        return JSON.parse(GetDict(DictNames.Roles));
    }

    static CreateInstance(name, rules) {
        let roleRules = [];
        rules.forEach(rule => {
            let roleRule = {
                roleId: rule.id,
                ruleId: rule.id,
                ruleCode: rule.code,
                canCreate: false,
                canRead: false,
                canEdit: false,
                canDelete: false,
                isCrudOperationRule: rule.isCrudOperationRule ? true : false
            };
            roleRules.push(roleRule);
        });
        return {
            id: -1,
            name: name,
            isActive: true,
            rules: roleRules
        };
    }

    static async Insert(item) {
        console.log("Insert role to server ");
        let list = this.LoadFromStorage();
        let response = await my_fetch("POST", "/api/v1/roles", item);
        if (!await response_ok(response)) {
            let newItem = await response.json();
            list.push(newItem);
            SaveDict(DictNames.Roles, list);
            return newItem;
        }
        return undefined;
    }

    static async Update(item) {
        console.log("Update role on server");
        let list = this.LoadFromStorage();
        let foundedIndex = list.findIndex(e => e.id == item.id);
        if (foundedIndex >= 0) {
            let response = await my_fetch("PUT", "/api/v1/roles/" + item.id, item);
            if (!await response_ok(response)) {
                let updateItem = await response.json();
                list[foundedIndex] = updateItem;
                SaveDict(DictNames.Roles, list);
                return updateItem;
            }
        }
        return undefined;
    }

    static async Delete(id) {
        console.log("Delete role from server");
        let list = this.LoadFromStorage();
        let foundedIndex = list.findIndex(e => e.id == id);
        if (foundedIndex >= 0) {
            await my_fetch("DELETE", "/api/v1/roles/" + id);
            list.splice(foundedIndex, 1);
            SaveDict(DictNames.Roles, list);
            return foundedIndex;
        }
        return undefined;
    }
}
