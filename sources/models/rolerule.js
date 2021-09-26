"use strict";

import { my_fetch, response_ok } from "../Tools";

export class RoleRule {
    static async Load(roleId) {
        console.log("Load RoleRule from server");
        let response = await my_fetch("GET", "/api/v1/roles/" + roleId + "/rules");
        if (!await response_ok(response)) {
            let roleRules = await response.json();
            return roleRules;
        }
        return undefined;
    }

    static CreateInstance(roleId, rules) {
        console.log("CreateInstance RoleRule");
        let roleRules = [];
        rules.forEach(rule => {
            let roleRule = {
                roleId: roleId,
                ruleId: rule.Id,
                ruleCode: rule.code,
                canCreate: rule.allowChangeFlagCanCreate,
                canRead: rule.allowChangeFlagCanRead,
                canEdit: rule.allowChangeFlagCanEdit,
                canDelete: rule.allowChangeFlagCanDelete,
                isCrudOperationRule: rule.isCrudOperationRule
            };
            roleRules.push(roleRule);
        });
        return roleRules;
    }

    // static async Insert(roleId, item) {
    //     let list = this.LoadFromStorage();
    //     console.log("Insert RoleRule to server ");
    //     let response = await my_fetch("POST", "/api/v1/roles/" + roleId + "/rules", item);
    //     if (!await response_ok(response)) {
    //         let newItem = await response.json();
    //         list.push(newItem);
    //         SaveDict(DictNames.Roles, list);
    //         return newItem;
    //     }
    //     return undefined;
    // }

    static async Update(roleId, item) {
        console.log("Update RoleRule on server");
        let response = await my_fetch("PUT", "/api/v1/roles/" + roleId + "/rules", item);
        console.log(response);
        if (!await response_ok(response)) {
            let updateItem = await response.json();
            return updateItem;
        }
        return undefined;
    }

    // static async Delete(id) {
    //     console.log("Delete item on server");
    //     let list = this.LoadFromStorage();
    //     let foundedIndex = list.findIndex(e => e.id == id);
    //     if (foundedIndex >= 0) {
    //         await my_fetch("DELETE", "/api/v1/roles/" + id);
    //         list.splice(foundedIndex, 1);
    //         SaveDict(DictNames.Roles, list);
    //         return foundedIndex;
    //     }
    //     return undefined;
    // }
}