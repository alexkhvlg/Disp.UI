"use restrict";

import { JetView } from "webix-jet";
import { Sticker } from "../models/sticker";

export default class StickersConfig extends JetView {

    StickersConfigId = "StickersConfig";
    StickersGridId = "StickersGrid";

    config() {

        const stickersGridHeaderUi = {
            cols: [
                {
                    view: "label",
                    label: "Стикеры"
                },
                {
                    view: "button",
                    value: "Добавить",
                    autowidth: true,
                    css: "webix_primary",
                    click: async () => await this.AddStickerToGridDialog()
                }
            ]
        };

        const stickersGridUi = {
            localId: this.StickersGridId,
            view: "datatable",
            columns: [
                { id: "name", header: "Название", editor: "text", fillspace: true, sort: "string" },
                { id: "actions", header: "Действия" },
            ],
            url: {
                $proxy: true,
                load: Sticker.LoadFromStorage
            },
            // view: "editlist",
            // template: "#name# <span class='webix_icon webix_trash_icon wxi-trash delete_icon'></span>",
            select: true,
            editable: true,
            // editor: "text",
            // editValue: "name",
            editaction: "dblclick",
            // url: {
            //     $proxy: true,
            //     load: Sticker.LoadFromStorage,
            // },
            // save: {
            //     // $proxy: true,
            //     save: (view, update) => {
            //         console.log("operation: " + update.operation);
            //         switch (update.operation) {
            //             case "update":
            //                 return Sticker.Update(update.data);
            //         }
            //     }
            // },
            // onClick: {
            //     delete_icon: async (e, id) => {
            //         await this.RemoveStikerFromGridDialog(this.$$(this.StickersGridId).getItem(id));
            //         return false;
            //     }
            // }
        };
        return {
            localId: this.StickersConfigId,
            type: "space",
            rows: [
                stickersGridHeaderUi,
                stickersGridUi
            ]
        };
    }

    async AddStickerToGridDialog() {
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
                let insertedItem = await Sticker.Insert(newItem);
                if (insertedItem) {
                    this.$$(this.StickersGridId).add(insertedItem);
                }
            }
        }
        catch {
            // supress error
        }
    }

    async RemoveStikerFromGridDialog(selectedItem) {
        try {
            let result = await this.webix.confirm({
                text: "Удалить стикер \"" + selectedItem.name + "\" ?",
                type: "confirm-warning",
                ok: "Да",
                cancel: "Нет"
            });
            if (result != undefined) {
                let deletedItem = await Sticker.Delete(selectedItem.id);
                if (deletedItem) {
                    this.$$(this.StickersGridId).remove(selectedItem.id);
                }
            }
        }
        catch {
            // supress error
        }
    }
}