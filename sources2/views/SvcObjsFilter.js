"use restrict";

import { JetView } from "webix-jet";
import Controller from "Controller";

export default class SvcObjsFilterView extends JetView {
    config() {
        return {
            id: "SvcObjsFilter",
            name: "SvcObjsFilter",
            type: "space",
            rows: [
                {
                    id: "SvcObjType",
                    name: "SvcObjType",
                    view: "richselect",
                    label: "Тип объекта",
                    labelWidth: 250,
                }
            ]
        };
    }
}