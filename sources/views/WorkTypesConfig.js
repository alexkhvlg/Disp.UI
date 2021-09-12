"use restrict";

import { JetView } from "webix-jet";
// import { my_fetch } from "../Tools";

export default class WorkTypesConfig extends JetView {
    GroupWorkTypesToCreate = []; // group work types to create
    GroupWorkTypesToDelete = []; // group work types to delete
    WorkTypesToCreate = []; // work types to create
    WorkTypesToDelete = []; // work types to delete
    WorkTypesConfig = undefined; // this control
    GroupWorkTypesTree = undefined; // work types tree control
    WorkTypesList = undefined; // work types list control
    groupWorkTypes = undefined; // group work types objects tree
    workTypes = undefined; // work types objects list

    ready() {
        this.WorkTypesConfig = webix.$$("WorkTypesConfig");
        this.GroupWorkTypesTree = webix.$$("GroupWorkTypesTree");
        this.WorkTypesList = webix.$$("WorkTypesList");

        // Fill work types tree control
        this.groupWorkTypes = JSON.parse(localStorage.getItem("GroupWorkTypes"));
        this.GroupWorkTypesTree.parse(this.groupWorkTypes);
        // Select first work type
        this.GroupWorkTypesTree.select(this.GroupWorkTypesTree.getFirstId());
    }
    
    config() {

        const groupWorkTypesTreeLabelUi = {
            view: "label",
            label: "Группы видов работ",
        };

        const groupWorkTypesTreeUi = {
            id: "GroupWorkTypesTree",
            name: "GroupWorkTypesTree",
            view: "tree",
            template: "#name#",
            select: true,
            // autowidth: true,
            // css: "role_list",
            // on: {
            //     onSelectChange: async () => {
            //         let role = this.PositionsList.getSelectedItem();
            //         await this.ShowWorkTypes(role);
            //     }
            // }
        };

        const workTypesListLabelUi = {
            view: "label",
            label: "Виды работ",
        };

        const workTypesListUi = {

        };

        const createDeleteToolbarUi = {
            cols: [
                {
                    view: "button",
                    value: "Создать",
                    autowidth: true,
                    css: "webix_primary",
                    click: () => this.CreatePosition()
                },
                {},
                {
                    view: "button",
                    value: "Удалить",
                    autowidth: true,
                    css: "webix_primary",
                    click: () => this.DeletePosition()
                },
            ]
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
            id: "WorkTypesConfig",
            type: "space",
            cols: [
                {
                    gravity: 1,
                    rows: [
                        groupWorkTypesTreeLabelUi,
                        groupWorkTypesTreeUi,
                        createDeleteToolbarUi
                    ]
                },
                {
                    gravity: 4,
                    rows: [
                        workTypesListLabelUi,
                        workTypesListUi,
                        saveButtonUi
                    ]
                }
            ]
        };
    }

    CreatePosition() {
        webix.prompt({
            text: "Новый вид работ",
            ok: "Да",
            cancel: "Нет",
            input: {
                required: true,
                placeholder: "Введите название",
            }
        }).then((result) => {
            let newItem = {
                id: this.WorkTypesToCreate.length,
                name: result,
            };
            this.GroupWorkTypesTree.add(newItem);
            this.GroupWorkTypesTree.select(newItem.id);
            this.GroupWorkTypesToCreate.push(newItem);
        });
    }

    DeletePosition() {
        let item = this.GroupWorkTypesTree.getSelectedItem();
        this.webix.confirm({
            text: "Удалить вид работ '" + item.name + "' ?",
            type: "confirm-warning",
            ok: "Да",
            cancel: "Нет",
            callback: (result) => {
                if (result) {
                    this.GroupWorkTypesTree.remove(item.id);
                    this.GroupWorkTypesToDelete.push(item);
                }
            }
        });
    }

    async ShowWorkTypes() {
        try {
            webix.extend(this.WorkTypesConfig, webix.ProgressBar);
            this.WorkTypesConfig.showProgress({
                type: "icon",
            });
        }
        catch (e) {
            console.log(e);
        }
        finally {
            this.WorkTypesConfig.hideProgress();
        }
    }

    async OnSave() {
        console.log(this.GroupWorkTypesToCreate);
        console.log(this.GroupWorkTypesToDelete);

        console.log(this.WorkTypesToCreate);
        console.log(this.WorkTypesToDelete);
    }
}