"use strict";

import { my_fetch } from "../Tools";

export class Sticker {

    static LoadFromStorage() {
        console.log("Load from server");
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
        console.log("Insert to server ");
        let list = this.LoadFromStorage();
        let newItem = await my_fetch("POST", "/api/v1/stickers", item);
        if (newItem != undefined) {
            list.push(newItem);
            this.SaveToStorage(list);
            return newItem;
        }
        return undefined;
    }

    static async Update(item) {
        console.log("Update on server");
        let list = this.LoadFromStorage();
        let foundedIndex = list.findIndex(e => e.id == item.id);
        if (foundedIndex >= 0) {
            let updateItem = await my_fetch("PUT", "/api/v1/stickers/" + item.id, item);
            if (updateItem != undefined) {
                list[foundedIndex] = updateItem;
                this.SaveToStorage(list);
                return updateItem;
            }
        }
        return undefined;
    }

    static async Delete(id) {
        console.log("Delete on server");
        let list = this.LoadFromStorage();
        let foundedIndex = list.findIndex(e => e.id == id);
        if (foundedIndex >= 0) {
            await my_fetch("DELETE", "/api/v1/stickers/" + id);
            list.splice(foundedIndex, 1);
            this.SaveToStorage(list);
            return foundedIndex;
        }
        return undefined;
    }
}
