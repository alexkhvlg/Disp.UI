"use restrict";

import { JetView } from "webix-jet";
import { Sticker } from "../models/sticker";

export default class StickersConfig extends JetView {

    StickersConfigId = "StickersConfig";
    StickersGridId = "StickersGrid";

    ready() {
        // webix.UIManager.addHotKey("enter", function (view) {
        //     var pos = view.getSelectedId();
        //     view.edit(pos);
        // }, this.$$(this.StickersGridId));
        this.LoadStickers();
    }

    config() {

        const stickersGridHeaderUi = {
            cols: [
                {
                    view: "label",
                    label: "Стикеры"
                },
                {
                    view: "button",
                    value: "Создать",
                    autowidth: true,
                    css: "webix_primary",
                    click: async () => await this.AddStickerToGridDialog()
                }
            ]
        };

        const stickersGridUi = {
            id: this.StickersGridId,
            localId: this.StickersGridId,
            view: "datatable",
            columns: [
                // { id: "id", header: "header" },
                { id: "name", header: "Название", editor: "text", fillspace: true, sort: "string" },
                { template: "{common.editIcon()}", width: 40 },
                { template: "{common.trashIcon()}", width: 40 },
            ],
            // select: true,
            resizeColumn: true,
            // resizeRow: true,
            // autoupdate: true,
            onClick: {
                "wxi-trash": async (event, id) => {
                    await this.RemoveStikerFromGridDialog(id);
                },
                "wxi-pencil": async (event,id) => {
                    await this.UpdateStickerInGridDialog(id);
                }
            },
            on: {
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

    async LoadStickers(){
        let table = this.$$(this.StickersGridId);
        table.parse(Sticker.LoadFromStorage());
    }

    async UpdateStickerInGridDialog(id){
        try{
            let table = this.$$(this.StickersGridId);
            let itemToUpdate = table.getItem(id);
            let result = await webix.prompt({
                text: "Стикер",
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
                let updateItem = await Sticker.Update(itemToUpdate);
                if (updateItem) {
                    table.updateItem(itemToUpdate.id, itemToUpdate);
                }
            }
        }
        catch{
            // supress error
        }
    }

    async RemoveStikerFromGridDialog(id) {
        try {
            let table = this.$$(this.StickersGridId);
            let itemToRemove = table.getItem(id);
            let result = await this.webix.confirm({
                text: "Удалить стикер \"" + itemToRemove.name + "\" ?",
                type: "confirm-error",
                ok: "Да",
                cancel: "Нет"
            });
            if (result) {
                let deletedItem = await Sticker.Delete(itemToRemove.id);
                if (deletedItem) {
                    table.remove(itemToRemove.id);
                }
            }
        }
        catch {
            // supress error
        }
    }
}