"use strict";

import { my_fetch, response_ok } from "../Tools";
import { DictNames, SaveDict, GetDict } from "./dictionaries";

export class Sticker {

    static LoadFromStorage() {
        console.log("Load Sticker from storage");
        return JSON.parse(GetDict(DictNames.Stickers));
    }

    static CreateInstance() {
        return {
            id: -1,
            name: "",
            isActive: true
        };
    }

    static async Insert(item) {
        console.log("Insert Sticker to server ");
        let list = this.LoadFromStorage();
        let response = await my_fetch("POST", "/api/v1/stickers", item);
        if (!await response_ok(response)) {
            let newItem = await response.json();
            list.push(newItem);
            SaveDict(DictNames.Stickers, list);
            return newItem;
        }
        return undefined;
    }

    static async Update(item) {
        console.log("Update Sticker on server");
        let list = this.LoadFromStorage();
        let foundedIndex = list.findIndex(e => e.id == item.id);
        if (foundedIndex >= 0) {
            let response = await my_fetch("PUT", "/api/v1/stickers/" + item.id, item);
            if (!await response_ok(response)) {
                let updateItem = await response.json();
                list[foundedIndex] = updateItem;
                SaveDict(DictNames.Stickers, list);
                return updateItem;
            }
        }
        return undefined;
    }

    static async Delete(id) {
        console.log("Delete Sticker from server");
        let list = this.LoadFromStorage();
        let foundedIndex = list.findIndex(e => e.id == id);
        if (foundedIndex >= 0) {
            await my_fetch("DELETE", "/api/v1/stickers/" + id);
            list.splice(foundedIndex, 1);
            SaveDict(DictNames.Stickers, list);
            return foundedIndex;
        }
        return undefined;
    }
}
