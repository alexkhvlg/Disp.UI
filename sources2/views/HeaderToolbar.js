"use restrict";

import { JetView } from "webix-jet";
import Controller from "Controller";
import { PrintDebug, DeleteRest } from "Tools";

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
                    hidden: true,
                    click: function () {
                        $$("sidebar").toggle()
                    }
                },
                {
                    view: "label",
                    label: "Московский метрополитен",
                    align: "center"
                }, {
                    id: "ConfigButton",
                    view: "button",
                    label: "Настройки",
                    autowidth: true,
                    css:"webix_secondary",
                    hidden: true,
                    click: async () => await Controller.OnShowConfigClick()
                }, {
                    id: "LoginButton",
                    view: "button",
                    label: "Вход",
                    autowidth: true,
                    css:"webix_primary",
                    hidden: false,
                    click: async () => await Controller.ShowLoginWindow()
                }, {
                    id: "LogoutButton",
                    view: "button",
                    label: "Выход",
                    autowidth: true,
                    css:"webix_primary",
                    hidden: true,
                    click: async () => await this.OnLogoutClick()
                }
            ]
        };
    }

    async OnLogoutClick() {
        PrintDebug("OnLogoutClick");
        let params = { token: webix.storage.session.get("Token") };
        await DeleteRest("api/auth", params);
        webix.storage.session.put("IsAuthorized", false);
        webix.storage.session.put("Token", null);
        Controller.AfterLogout();
    }
}