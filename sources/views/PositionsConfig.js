"use restrict";

import { JetView } from "webix-jet";
// import { my_fetch } from "../Tools";

export default class PositionsConfig extends JetView {
    PositionsToCreate = []; // positions list to create
    PositionsToDelete = []; // positions list to delete
    PositionsConfig = undefined; // this control
    PositionsList = undefined; // positions list control
    WorkTypesList = undefined // work type list control
    positions = undefined; // position objects list
    workTypes = undefined; // work types object list

    ready() {
        this.PositionsConfig = webix.$$("PositionsConfig");
        this.PositionsList = webix.$$("PositionsList");
        this.WorkTypesList = webix.$$("WorkTypesList");

        this.workTypes = JSON.parse(localStorage.getItem("WorkTypes"));
        
        // Fill positions list control
        this.positions = JSON.parse(localStorage.getItem("Positions"));
        this.PositionsList.parse(this.positions);
        // Select first position
        this.PositionsList.select(this.PositionsList.getFirstId());
    }
    
    config() {

        const positionsListLabelUi = {
            view: "label",
            label: "Должности",
        };

        const positionsListUi = {
            id: "PositionsList",
            name: "PositionsList",
            view: "list",
            template: "#name#",
            select: true,
            autowidth: true,
            css: "role_list",
            on: {
                onSelectChange: async () => {
                    let position = this.PositionsList.getSelectedItem();
                    this.ShowWorkTypes(position);
                }
            }
        };

        const workTypesListLabelUi = {
            view: "label",
            label: "Виды работ",
        };

        const workTypesListUi = {
            view: "list",
            id: "WorkTypesList",
            name: "WorkTypesList",
            template: "#name#",
            select: true,
            autowidth: true,
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
            id: "PositionsConfig",
            type: "space",
            cols: [
                {
                    gravity: 1,
                    rows: [
                        positionsListLabelUi,
                        positionsListUi,
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
            text: "Новая должность",
            ok: "Да",
            cancel: "Нет",
            input: {
                required: true,
                placeholder: "Введите название",
            }
        }).then((result) => {
            let newItem = {
                id: this.PositionsToCreate.length,
                name: result,
            };
            this.PositionsList.add(newItem);
            this.PositionsList.select(newItem.id);
            this.PositionsToCreate.push(newItem);
        });
    }

    DeletePosition() {
        let item = this.PositionsList.getSelectedItem();
        this.webix.confirm({
            text: "Удалить должность '" + item.name + "' ?",
            type: "confirm-warning",
            ok: "Да",
            cancel: "Нет",
            callback: (result) => {
                if (result) {
                    this.PositionsList.remove(item.id);
                    this.PositionsToDelete.push(item);
                }
            }
        });
    }

    ShowWorkTypes(position) {
        this.WorkTypesList.clearAll();

        position.worktypes.forEach((workType) => {
            let fullWorkType = this.workTypes.find((element) => {
                return element.id == workType.workTypeId;
            });
            this.WorkTypesList.add(fullWorkType);
        });
    }

    async OnSave() {
        console.log(this.PositionsToCreate);
        console.log(this.PositionsToDelete);
    }
}