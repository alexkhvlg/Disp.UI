"use restrict";

import { JetView } from "webix-jet";
// import { my_fetch } from "../Tools";
import { Sticker } from "../models/sticker";

export default class StickersConfig extends JetView {

    StickersConfigId = "StickersConfig";
    StickersListId = "StickersList";

    config() {

        const stickersListLabelUi = {
            view: "label",
            label: "Стикеры"
        };

        const stickersListUi = {
            id: this.StickersListId,
            name: this.StickersListId,
            view: "editlist",
            template: "#name#  <span class='webix_icon webix_trash_icon wxi-trash delete_icon'></span>",
            select: true,
            autowidth: true,
            editable: true,
            editor: "text",
            editValue: "name",
            editaction: "dblclick",
            url: {
                $proxy: true,
                load: Sticker.LoadFromStorage,
            },
            save: {
                $proxy: true,
                save: (view, update) => {
                    switch (update.operation) {
                        case "insert":
                            Sticker.Insert(update.data);
                            break;
                        case "update":
                            Sticker.Update(update.data);
                            break;
                        case "delete":
                            Sticker.Delete(update.data.id);
                            break;
                    }
                }
            },
            onClick: {
                delete_icon: async (e, id) => {
                    await this.RemoveStikerFromListDialog(this.webix.$$(this.StickersListId).getItem(id));
                    return false;
                }
            }
        };

        const createDeleteWorkTypesToolBarUi = {
            cols: [
                {
                    view: "button",
                    value: "Создать",
                    autowidth: true,
                    css: "webix_primary",
                    click: async () => await this.AddStickerToListDialog()
                },
                {},
                {
                    view: "button",
                    value: "Удалить",
                    autowidth: true,
                    css: "webix_primary",
                    click: async () => await this.RemoveStikerFromListDialog(this.webix.$$(this.StickersListId).getSelectedItem())
                },
            ]
        };

        return {
            id: this.StickersConfigId,
            type: "space",
            rows: [
                stickersListLabelUi,
                stickersListUi,
                createDeleteWorkTypesToolBarUi
            ]
        };
    }

    async AddStickerToListDialog() {
        try {
            let result = await webix.prompt({
                text: "Новый стикер",
                ok: "Да",
                cancel: "Нет",
                input: {
                    required: true,
                    placeholder: "Введите название",
                }
            });
            if (result) {
                let newItem = Sticker.CreateInstance();
                newItem.name = result;
                this.webix.$$(this.StickersListId).add(newItem);
            }
        }
        catch {
            // supress error
        }
    }

    async RemoveStikerFromListDialog(selectedItem) {
        try {
            let result = await this.webix.confirm({
                text: "Удалить стикер '" + selectedItem.name + "' ?",
                type: "confirm-warning",
                ok: "Да",
                cancel: "Нет"
            });
            if (result != undefined) {
                this.webix.$$(this.StickersListId).remove(selectedItem.id);
            }
        }
        catch {
            // supress error
        }
    }
}