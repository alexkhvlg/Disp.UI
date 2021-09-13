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
    StickersList = undefined; // stickers list control
    groupWorkTypes = undefined; // group work types objects tree
    workTypes = undefined; // work types objects list
    stickers = undefined; // stickers objects list

    ready() {
        this.WorkTypesConfig = webix.$$("WorkTypesConfig");
        this.GroupWorkTypesTree = webix.$$("GroupWorkTypesTree");
        this.WorkTypesList = webix.$$("WorkTypesList");
        this.StickersList = this.webix.$$("StickersList");

        this.workTypes = JSON.parse(localStorage.getItem("WorkTypes"));
        this.stickers = JSON.parse(localStorage.getItem("Stickers"));
        // console.log(this.stickers);
        // Fill work types tree control
        this.groupWorkTypes = JSON.parse(localStorage.getItem("GroupWorkTypes"));
        this.GroupWorkTypesTree.parse(this.generateTree(this.groupWorkTypes));
        // Select first work type
        this.GroupWorkTypesTree.select(this.GroupWorkTypesTree.getFirstId());
    }

    generateTree(list) {

        const hashTable = Object.create(null);
        const dataTree = [];

        list.forEach(element => hashTable[element.id] = { ...element, data: [] });

        list.forEach(element => {
            if (element.parentGroupWorkTypeId) {
                hashTable[element.parentGroupWorkTypeId].data.push(hashTable[element.id]);
            }
            else {
                dataTree.push(hashTable[element.id]);
            }
        });
        return dataTree;
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
            template: "{common.icon()} {common.folder()} #name#",
            select: true,
            autowidth: true,
            on: {
                onSelectChange: async () => {
                    let selectedGroup = this.GroupWorkTypesTree.getSelectedItem();
                    this.ShowWorkTypes(selectedGroup);
                }
            }
        };

        const workTypesListLabelUi = {
            view: "label",
            label: "Виды работ",
        };

        const workTypesListUi = {
            id: "WorkTypesList",
            name: "WorkTypesList",
            view: "list",
            template: "#name#",
            select: true,
            autowidth: true,
            on: {
                onSelectChange: async () => {
                    let selectedWorkType = this.WorkTypesList.getSelectedItem();
                    this.ShowStickers(selectedWorkType);
                }
            }
        };

        const stickersListLabelUi = {
            view: "label",
            label: "Стикеры"
        };

        const stickersListUi = {
            id: "StickersList",
            name: "StickersList",
            view: "list",
            template: "#name#",
            select: true,
            autowidth: true
        };

        const createDeleteGroupWorkTypesToolbarUi = {
            cols: [
                {
                    view: "menu",
                    select: true,
                    autowidth: true,
                    openAction: "click",
                    subMenuPos: "top",
                    data: [
                        {
                            value: "Создать", data: [
                                {
                                    id: "rootitem",
                                    value: "Корневую группу"
                                },
                                {
                                    id: "subitem",
                                    value: "Дочернюю группу"
                                }
                            ],
                            config: {
                                on: {
                                    onItemClick: (id) => {
                                        switch (id) {
                                            case "rootitem":
                                                this.CreateGroupWorkType();
                                                break;
                                            case "subitem":
                                                this.CreateSubGroupWorkType();
                                                break;
                                        }
                                    }
                                }
                            }
                        }
                    ]
                },
                {
                    view: "button",
                    value: "Удалить",
                    autowidth: true,
                    css: "webix_primary",
                    click: () => this.DeleteGroupWorkType()
                },
            ]
        };

        const createDeleteWorkTypesToolBarUi = {
            cols: [
                {
                    view: "button",
                    value: "Создать",
                    autowidth: true,
                    css: "webix_primary",
                    click: () => this.CreateWorkType()
                },
                {},
                {
                    view: "button",
                    value: "Удалить",
                    autowidth: true,
                    css: "webix_primary",
                    click: () => this.DeleteWorkType()
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
                        createDeleteGroupWorkTypesToolbarUi
                    ]
                },
                {
                    gravity: 2,
                    rows: [
                        workTypesListLabelUi,
                        workTypesListUi,
                        createDeleteWorkTypesToolBarUi
                    ]
                },
                {
                    gravity: 2,
                    rows: [
                        stickersListLabelUi,
                        stickersListUi,
                        saveButtonUi
                    ]
                }
            ]
        };
    }

    CreateGroupWorkType() {
        webix.prompt({
            text: "Новая группа видов работ",
            ok: "Да",
            cancel: "Нет",
            input: {
                required: true,
                placeholder: "Введите название",
            }
        }).then((result) => {
            let newItem = {
                id: this.GroupWorkTypesToCreate.length,
                name: result,
            };
            this.GroupWorkTypesTree.add(newItem, -1);
            this.GroupWorkTypesTree.select(newItem.id);
            this.GroupWorkTypesToCreate.push(newItem);
        });
    }

    CreateSubGroupWorkType() {
        let parentId = this.GroupWorkTypesTree.getSelectedId();
        if (parentId) {
            webix.prompt({
                text: "Новая подгруппа видов работ",
                ok: "Да",
                cancel: "Нет",
                input: {
                    required: true,
                    placeholder: "Введите название",
                }
            }).then((result) => {
                let newItem = {
                    id: this.GroupWorkTypesToCreate.length,
                    parentGroupWorkTypeId: parentId,
                    name: result,
                };
                this.GroupWorkTypesTree.add(newItem, -1, parentId);
                this.GroupWorkTypesTree.open(parentId);
                this.GroupWorkTypesTree.select(newItem.id);
                this.GroupWorkTypesToCreate.push(newItem);
            });
        }
        else {
            webix.alert("Сперва выберете родительский элемент");
        }
    }

    DeleteGroupWorkType() {
        let selectedItem = this.GroupWorkTypesTree.getSelectedItem();
        this.webix.confirm({
            text: "Удалить группу видов работ '" + selectedItem.name + "' ?",
            type: "confirm-warning",
            ok: "Да",
            cancel: "Нет",
            callback: (result) => {
                if (result) {
                    this.GroupWorkTypesTree.remove(selectedItem.id);
                    this.GroupWorkTypesToDelete.push(selectedItem);
                }
            }
        });
    }

    CreateWorkType() {
        webix.prompt({
            text: "Новый вид работ",
            ok: "Да",
            cancel: "Нет",
            input: {
                required: true,
                placeholder: "Введите название",
            }
        }).then((result) => {
            let groupWorkTypeId = this.GroupWorkTypesTree.getSelectedId();
            let newItem = {
                id: this.WorkTypesToCreate.length,
                groupWorkTypeId: groupWorkTypeId,
                name: result,
            };
            this.WorkTypesList.add(newItem);
            this.WorkTypesList.select(newItem.id);
            this.WorkTypesToCreate.push(newItem);
        });
    }

    DeleteWorkType() {
        let item = this.WorkTypesList.getSelectedItem();
        this.webix.confirm({
            text: "Удалить вид работ '" + item.name + "' ?",
            type: "confirm-warning",
            ok: "Да",
            cancel: "Нет",
            callback: (result) => {
                if (result) {
                    this.WorkTypesList.remove(item.id);
                    this.WorkTypesToDelete.push(item);
                }
            }
        });
    }

    ShowWorkTypes(selectedGroupWorkType) {
        this.WorkTypesList.clearAll();
        this.workTypes.forEach((workType) => {
            if (workType.groupWorkTypeId == selectedGroupWorkType.id) {
                this.WorkTypesList.add(workType);
            }
        });
        this.WorkTypesList.select(this.WorkTypesList.getFirstId());
    }

    ShowStickers(selectedWorkType) {
        this.StickersList.clearAll();
        selectedWorkType.stickers.forEach((workTypeSticker) => {
            this.stickers.forEach((sticker) => {
                if (sticker.id == workTypeSticker.stickerId) {
                    this.StickersList.add(sticker);
                }
            });
        });
    }

    async OnSave() {
        console.log(this.GroupWorkTypesToCreate);
        console.log(this.GroupWorkTypesToDelete);

        console.log(this.WorkTypesToCreate);
        console.log(this.WorkTypesToDelete);
    }
}