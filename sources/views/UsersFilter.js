"use restrict";

import { JetView } from "webix-jet";
import Controller from "Controller";

export default class UsersFilterView extends JetView {
    config() {
        return {
            id: "UsersFilter",
            name: "UsersFilter",
            type: "space",
            rows: [
                {
                    id: "UsersPositions",
                    name: "UsersPositions",
                    view: "richselect",
                    label: "Должность",
                    labelWidth: 250,
                    on: {
                        onChange(newValue) {
                            Controller.OnUsersPositionsChanged(newValue);
                        }
                    }
                }
            ]
        };
    }
}