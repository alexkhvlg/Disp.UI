"use restrict";

import { JetView } from "webix-jet";
import { my_fetch } from "../Tools";

export default class Roles extends JetView {
    RolesToCreate = []; // roles list to create
    RolesToDelete = []; // roles list to delete
    RolesConfig = undefined; // this control
    RolesList = undefined; // roles list control
    RulesTable = undefined; // rules table control
    roles = undefined; // role objects list
    rules = undefined; // rule objects list

    ready() {
        this.RolesConfig = webix.$$("RolesConfig");
        this.RolesList = webix.$$("RolesList");
        this.RulesTable = webix.$$("RulesTable");

        this.rules = JSON.parse(localStorage.getItem("Rules"));

        // Fill role list control
        this.roles = JSON.parse(localStorage.getItem("Roles"));
        this.RolesList.parse(this.roles);
        // Select first role
        this.RolesList.select(this.RolesList.getFirstId());
    }
    
    config() {

        const rolesListLabelUi = {
            view: "label",
            label: "Роли",
        };

        const rolesListUi = {
            id: "RolesList",
            name: "RolesList",
            view: "list",
            template: "#name#",
            select: true,
            // autowidth: true,
            css: "role_list",
            on: {
                onSelectChange: async () => {
                    let role = this.RolesList.getSelectedItem();
                    await this.ShowRules(role);
                }
            }
        };

        const createDeleteToolbarUi = {
            cols: [
                {
                    view: "button",
                    value: "Создать",
                    autowidth: true,
                    css: "webix_primary",
                    click: () => this.CreateRole()
                },
                {},
                {
                    view: "button",
                    value: "Удалить",
                    autowidth: true,
                    css: "webix_primary",
                    click: () => this.DeleteRole()
                },
            ]
        };

        const rulesTableLabelUi = {
            view: "label",
            label: "Права",
        };

        const rulesTableUi = {
            id: "RulesTable",
            name: "RulesTable",
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

        const saveButtonUi = {
            cols: [
                {},
                {
                    view: "button",
                    label: "Сохранить",
                    autowidth: true,
                    css: "webix_primary",
                    click: async () => await this.OnSave()
                }
            ]
        };

        return {
            id: "RolesConfig",
            type: "space",
            cols: [
                {
                    gravity: 1,
                    rows: [
                        rolesListLabelUi,
                        rolesListUi,
                        createDeleteToolbarUi
                    ]
                },
                {
                    gravity: 4,
                    rows: [
                        rulesTableLabelUi,
                        rulesTableUi,
                        saveButtonUi
                    ]
                }
            ]
        };
    }

    CreateRole() {
        webix.prompt({
            text: "Новая роль",
            ok: "Да",
            cancel: "Нет",
            input: {
                required: true,
                placeholder: "Введите название",
            }
        }).then((result) => {
            let newItem = {
                id: this.RolesToCreate.length,
                name: result,
            };
            this.RolesList.add(newItem);
            this.RolesList.select(newItem.id);
            this.RolesToCreate.push(newItem);
        });
    }

    DeleteRole() {
        let item = this.RolesList.getSelectedItem();
        this.webix.confirm({
            text: "Удалить роль '" + item.name + "' ?",
            type: "confirm-warning",
            ok: "Да",
            cancel: "Нет",
            callback: (result) => {
                if (result) {
                    this.RolesList.remove(item.id);
                    this.RolesToDelete.push(item);
                }
            }
        });
    }

    async ShowRules(role) {
        this.RulesTable.clearAll();
        try {
            webix.extend(this.RolesConfig, webix.ProgressBar);
            this.RolesConfig.showProgress({
                type: "icon",
            });
            let roleRules = await my_fetch("GET", "https://dev2.im-dispatcher.ru/api/v1/roles/" + role.id + "/rules");

            let data = [];
            this.rules.forEach(rule => {
                let roleRule = roleRules.find(rr => rr.ruleCode == rule.code);
                if (roleRule !== undefined) {
                    if (rule.isCrudOpererationRule) {
                        let item = {
                            Code: rule.code,
                            Name: rule.name,
                            Edit: rule.allowChangeFlagCanEdit ? roleRule.canEdit : undefined,
                        };
                        data.push(item);
                    }
                    else {
                        let item = {
                            Code: rule.code,
                            Name: rule.name,
                            Create: rule.allowChangeFlagCanCreate ? roleRule.canCreate : undefined,
                            Read: rule.allowChangeFlagCanRead ? roleRule.canRead : undefined,
                            Edit: rule.allowChangeFlagCanEdit ? roleRule.canEdit : undefined,
                            Delete: rule.allowChangeFlagCanDelete ? roleRule.canDelete : undefined,
                        };
                        data.push(item);
                    }
                }
            });
            data = data.sort(function (a, b) {
                return a.Code.localeCompare(b.Code, undefined, { numeric: true, sensitivity: "base" });
            });
            this.RulesTable.parse(data);
        }
        catch (e) {
            console.log(e);
        }
        finally {
            this.RolesConfig.hideProgress();
        }
    }

    async OnSave() {
        console.log(this.RolesToCreate);
        console.log(this.RolesToDelete);
    }
}