"use restrict";

import { JetView } from "webix-jet";
import { Role } from "../models/role";
import { Rule } from "../models/rule";
import { RoleRule } from "../models/rolerule";

export default class Roles extends JetView {

    RolesConfigId = "RolesConfig";
    RolesGridId = "RolesGrid";
    RulesGridId = "RulesGrid";

    ready() {
        this.LoadRoles();
        this.rules = Rule.LoadFromStorage();
    }

    config() {

        const roleSGridLabelUi = {
            cols: [
                {
                    view: "label",
                    label: "Роли",
                },
                {
                    view: "button",
                    value: "Создать",
                    autowidth: true,
                    css: "webix_primary",
                    click: async () => await this.AddRoleToGridDialog()
                },
            ]
        };

        const rolesGridUi = {
            id: this.RolesGridId,
            localId: this.RolesGridId,
            view: "datatable",
            columns: [
                // { id: "id", header: "header" },
                { id: "name", header: "Название", editor: "text", fillspace: true, sort: "string" },
                { template: "{common.editIcon()}", width: 40 },
                { template: "{common.trashIcon()}", width: 40 },
            ],
            resizeColumn: true,
            select: true,
            onClick: {
                "wxi-trash": async (event, id) => {
                    await this.RemoveRoleFromGridDialog(id);
                },
                "wxi-pencil": async (event, id) => {
                    await this.UpdateRoleInGridDialog(id);
                }
            },
            on: {
                onSelectChange: async () => {
                    await this.ShowRules();
                },

                onBeforeLoad: function () {
                    this.showOverlay("Загрузка...");
                },

                onAfterLoad: function () {
                    this.hideOverlay();
                    if (!this.count())
                        this.showOverlay("Данных нет");
                    else
                        this.hideOverlay();
                },
            }
        };


        const rulesGridLabelUi = {
            view: "label",
            label: "Права",
        };

        const rulesGridUi = {
            id: this.RulesGridId,
            localId: this.RulesGridId,
            view: "datatable",
            editable: true,
            checkboxRefresh: true,
            tooltip: true,
            type: {
                checkbox: function (obj, common, value) {
                    if (value === true || value === false) {
                        return "<input class='webix_table_checkbox' type='checkbox' " + (value ? "checked" : "") + " >";
                    }
                    return "";
                }
            },
            columns: [
                {
                    id: "Code", header: "Код",
                    adjust: true
                },
                {
                    id: "Name", header: "Название",
                    fillspace: true
                },
                {
                    id: "Create", header: "Создать",
                    checkValue: true, uncheckValue: false,
                    template: "{common.checkbox()}"
                },
                {
                    id: "Read", header: "Читать",
                    checkValue: true, uncheckValue: false,
                    template: "{common.checkbox()}",
                },
                {
                    id: "Edit", header: "Изменить",
                    checkValue: true, uncheckValue: false,
                    template: "{common.checkbox()}",
                },
                {
                    id: "Delete", header: "Удалить",
                    checkValue: true, uncheckValue: false,
                    template: "{common.checkbox()}",
                },
            ],
        };

        return {
            id: "RolesConfig",
            type: "space",
            cols: [
                {
                    gravity: 1,
                    rows: [
                        roleSGridLabelUi,
                        rolesGridUi
                    ]
                },
                {
                    gravity: 2,
                    rows: [
                        rulesGridLabelUi,
                        rulesGridUi
                    ]
                }
            ]
        };
    }

    async AddRoleToGridDialog() {
        try {
            let result = await webix.prompt({
                text: "Новая роль",
                ok: "Да",
                cancel: "Нет",
                input: {
                    required: true,
                    placeholder: "Введите название",
                }
            });
            if (result) {
                let newItem = Role.CreateInstance(result, this.rules);
                let createdRole = await Role.Insert(newItem);
                if (createdRole) {
                    let table = this.$$(this.RolesGridId);
                    table.add(createdRole);
                    table.select(createdRole.id);
                }
            }
        }
        catch {
            // supress error
        }
    }

    async LoadRoles() {
        let table = this.$$(this.RolesGridId);
        table.parse(Role.LoadFromStorage());

        // Select first role
        table.select(table.getFirstId());
    }

    async UpdateRoleInGridDialog(id) {
        try {
            let table = this.$$(this.RolesGridId);
            let itemToUpdate = table.getItem(id);
            let result = await webix.prompt({
                text: "Роль",
                ok: "Да",
                cancel: "Нет",
                input: {
                    required: true,
                    placeholder: "Введите название",
                    value: itemToUpdate.name
                }
            });
            if (result) {
                itemToUpdate.name = result;
                let updateItem = await Role.Update(itemToUpdate);
                if (updateItem) {
                    table.updateItem(itemToUpdate.id, itemToUpdate);
                }
            }
        }
        catch {
            // supress error
        }
    }

    async RemoveRoleFromGridDialog(id) {
        try {
            let table = this.$$(this.RolesGridId);
            let itemToRemove = table.getItem(id);
            let result = await this.webix.confirm({
                text: "Удалить роль \"" + itemToRemove.name + "\" ?",
                type: "confirm-error",
                ok: "Да",
                cancel: "Нет"
            });
            if (result) {
                let deletedItem = await Role.Delete(itemToRemove.id);
                if (deletedItem) {
                    table.remove(itemToRemove.id);
                    // Select first role
                    table.select(table.getFirstId());
                }
            }
        }
        catch {
            // supress error
        }
    }

    GenerateRoleRuleData(roleRules) {
        let data = [];
        this.rules.forEach(rule => {
            let roleRule = roleRules.find(rr => rr.ruleCode == rule.code);
            if (roleRule !== undefined) {
                let item = null;
                if (rule.isCrudOpererationRule) {
                    item = {
                        Code: rule.code,
                        Name: rule.name,
                        Edit: rule.allowChangeFlagCanEdit ? roleRule.canEdit : undefined,
                    };
                }
                else {
                    item = {
                        Code: rule.code,
                        Name: rule.name,
                        Create: rule.allowChangeFlagCanCreate ? roleRule.canCreate : undefined,
                        Read: rule.allowChangeFlagCanRead ? roleRule.canRead : undefined,
                        Edit: rule.allowChangeFlagCanEdit ? roleRule.canEdit : undefined,
                        Delete: rule.allowChangeFlagCanDelete ? roleRule.canDelete : undefined,
                    };
                }
                data.push(item);
            }
        });
        data = data.sort(function (a, b) {
            return a.Code.localeCompare(b.Code, undefined, { numeric: true, sensitivity: "base" });
        });
        return data;
    }

    async ShowRules() {
        let thisConfig = this.$$(this.RolesConfigId);
        let role = this.$$(this.RolesGridId).getSelectedItem();
        let rulesTable = this.$$(this.RulesGridId);
        rulesTable.clearAll();
        try {
            webix.extend(thisConfig, webix.ProgressBar);
            thisConfig.showProgress({
                type: "icon",
            });
            let roleRules = await RoleRule.Load(role.id);
            let data = this.GenerateRoleRuleData(roleRules);
            rulesTable.parse(data);
        }
        catch (e) {
            console.log(e);
        }
        finally {
            thisConfig.hideProgress();
        }
    }
}
