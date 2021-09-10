"use restrict";

import { JetView } from "webix-jet";
import { my_fetch } from "../Tools";

export default class Roles extends JetView {
    RolesToCreate = [];
    RolesToRemove = [];
    RoleList = undefined;
    RulesTable = undefined;
    roles = undefined;
    rules = undefined;

    config() {
        return {
            id: "RolesConfig",
            // type: "space",
            rows: [
                {
                    // margin: 5,
                    cols: [
                        {
                            gravity: 1,
                            rows: [
                                {
                                    id: "RolesList",
                                    name: "RolesList",
                                    view: "list",
                                    template: "#name#",
                                    select: true,
                                    autowidth: true,
                                    css: "role_list",
                                    on: {
                                        onSelectChange: async () => {
                                            let role = this.RolesList.getSelectedItem();
                                            await this.ShowRules(role);
                                        }
                                    }
                                },
                                {
                                    cols: [
                                        {
                                            view: "button",
                                            value: "Создать",
                                            autowidth: true,
                                            click: () => this.CreateRole()
                                        },
                                        {},
                                        {
                                            view: "button",
                                            value: "Удалить",
                                            autowidth: true,
                                            click: () => this.RemoveRole()
                                        },
                                    ]
                                }
                            ]
                        },
                        {
                            gravity: 4,
                            id: "RulesTable",
                            name: "RulesTable",
                            view: "datatable",
                            editable: true,
                            checkboxRefresh: true,
                            type: {
                                checkbox: function (obj, common, value, config) {
                                    if (value === true || value === false) {
                                        return "<input class='webix_table_checkbox' type='checkbox' " + (value ? "checked" : "") + " >";
                                    }
                                    return "";
                                }
                            },
                            columns: [
                                {
                                    id: "Code",
                                    header: "Код"
                                },
                                {
                                    id: "Name",
                                    header: "Название",
                                    fillspace: true
                                },
                                {
                                    id: "Create",
                                    header: "Создать",
                                    template: "{common.checkbox()}",
                                    checkValue: true,
                                    uncheckValue: false,
                                },
                                {
                                    id: "Read",
                                    header: "Читать",
                                    template: "{common.checkbox()}",
                                    checkValue: true,
                                    uncheckValue: false,
                                },
                                {
                                    id: "Edit",
                                    template: "{common.checkbox()}",
                                    checkValue: true,
                                    uncheckValue: false,
                                },
                                {
                                    id: "Delete",
                                    template: "{common.checkbox()}",
                                    checkValue: true,
                                    uncheckValue: false,
                                },
                            ],
                        }
                    ]
                },
                {
                    cols: [
                        {

                        },
                        {
                            view: "button",
                            label: "Сохранить",
                            autowidth: true,
                            css: "webix_primary",
                            click: async () => await this.OnSave()
                        }
                    ]
                }
            ]

        };
    }

    ready() {
        this.RolesList = webix.$$("RolesList")
        this.RulesTable = webix.$$("RulesTable");

        this.rules = JSON.parse(localStorage.getItem("Rules"));

        // Fill role list control
        this.roles = JSON.parse(localStorage.getItem("Roles"));
        this.RolesList.parse(this.roles);
        // Select first role
        this.RolesList.select(this.RolesList.getFirstId());
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

    RemoveRole() {
        let item = this.RolesList.getSelectedItem();
        this.webix.confirm({
            text: "Удалить роль '" + item.name + "' ?",
            type: "confirm-warning",
            ok: "Да",
            cancel: "Нет",
            callback: (result) => {
                if (result) {
                    this.RolesList.remove(item.id);
                    this.RolesToRemove.push(item);
                }
            }
        });
    }

    async ShowRules(role) {
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
                    }
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
                    }
                    data.push(item);
                }
            }
        });
        data = data.sort(function (a, b) {
            return a.Code.localeCompare(b.Code, undefined, { numeric: true, sensitivity: 'base' });
        });
        this.RulesTable.clearAll();
        this.RulesTable.parse(data);
    }

    async OnSave() {
        console.log(this.RolesToCreate);
        console.log(this.RolesToRemove);
    }
}