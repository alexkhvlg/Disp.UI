"use restrict";

import { JetView } from "webix-jet";
import Controller from "Controller";

export default class SideBar extends JetView {
    config() {
        return {
            id: "sidebar_layout",
            name: "sidebar_layout",
            hidden: true,
            rows: [
                {
                    id: "sidebar",
                    name: "sidebar",
                    position: "left",
                    view: "sidebar",
                    collapsed: true,
                    activeTitle: true,
                    on: {
                        onSelectChange: () => Controller.OnLayerChanged()
                    },
                    data: [
                        {
                            id: "users-menu-item",
                            icon: "mdi mdi-account-check",
                            value: "Работники",
                            data: [
                                {
                                    id: "users-type-all-menu-item",
                                    value: "Все",
                                },
                                {
                                    id: "users-type1-menu-item",
                                    value: "Лифтёры",
                                },
                                {
                                    id: "users-type2-menu-item",
                                    value: "Техники",
                                }
                            ]
                        },
                        {
                            id: "elevators-menu-item",
                            icon: "mdi mdi-elevator-passenger",
                            value: "Лифты",
                        }
                    ]
                }
            ]
        };
    }
}