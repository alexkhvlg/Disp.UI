"use restrict";

import { JetView } from "webix-jet";
import { ConfigWindow } from "./ConfigWindow";

export default class HeaderToolBarView extends JetView {
    config() {
        return {
            view: "toolbar",
            // css: "webix_dark",
            elements: [
                {
                    id: "sidebar_toggle",
                    name: "sidebar_toggle",
                    view: "icon",
                    icon: "mdi mdi-menu",
                    click: function () {
                        $$("sidebar").toggle()
                    }
                },
                {
                    view: "label",
                    label: "Электронный журнал",
                    align: "center"
                }, {
                    id: "ConfigButton",
                    view: "button",
                    label: "Настройки",
                    autowidth: true,
                    css:"webix_secondary",
                    click: () => this.OnShowConfigClick()
                }, {
                    id: "LogoutButton",
                    view: "button",
                    label: "Выход",
                    autowidth: true,
                    css:"webix_primary",
                    click: () => this.OnLogoutClick()
                }
            ]
        };
    }

    OnLogoutClick() {
        this.app.getService("user").logout()
        .finally(() => {
            this.show("/login")
        })
    }

    OnShowConfigClick() {
        this.configWin.Show("Настройки");
    }

    init() {
        this.configWin = new ConfigWindow(this, "Config");
    }
}