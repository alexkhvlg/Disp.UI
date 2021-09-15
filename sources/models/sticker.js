"use strict";

import { my_fetch } from "../Tools";

export class Sticker {

    static LoadFromStorage() {
        return JSON.parse(localStorage.getItem("Stickers"));
    }

    static SaveToStorage(list) {
        localStorage.removeItem("Stickers");
        localStorage.setItem("Stickers", JSON.stringify(list));
    }

    static CreateInstance() {
        return {
            id: -1,
            name: "",
            isActive: true
        };
    }

    static async Insert(item) {
        let list = this.LoadFromStorage();
        let newItem = await my_fetch("POST", "/api/v1/stickers", item);
        console.log(newItem);
        if (newItem != undefined) {
            list.push(newItem);
            this.SaveToStorage(list);
        }
    }

    static async Update(item) {
        let list = this.LoadFromStorage();
        let foundedIndex = list.findIndex(e => e.id == item.id);
        if (foundedIndex >= 0) {
            let updateItem = await my_fetch("PUT", "/api/v1/stickers/" + item.id, item);
            if (updateItem) {
                list[foundedIndex] = updateItem;
                this.SaveToStorage(list);
            }
        }
    }

    static async Delete(id) {
        let list = this.LoadFromStorage();
        let foundedIndex = list.findIndex(e => e.id == id);
        if (foundedIndex >= 0) {
            await my_fetch("DELETE", "/api/v1/stickers/" + id);
            list.splice(foundedIndex, 1);
            this.SaveToStorage(list);
        }
    }
}
