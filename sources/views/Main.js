"use restrict";

import { JetView, plugins } from "webix-jet";
import TaskTable from "views/TaskTable";
// import { ConfigWindow } from "./ConfigWindow";

export default class MainView extends JetView {
    config() {

        const header = {
            type: "header",
            css: "custom_dark",
            height: 40,
            template: "Задания"
        };

        const sidebar = {
            localId: "menu",
            view: "sidebar",
            css: "webix_dark",
            width: 200,
            data: [
                {
                    value: "Новые"
                },
                {
                    value: "Прочитанные",
                },
                {
                    value: "Назначенные",
                },
                {
                    value: "В работе",
                },
                {
                    value: "В ожидании",
                },
                {
                    value: "Отклоненные",
                },
                {
                    value: "Закрытые",
                }
            ]
        };

        const toolbar = {
            view: "toolbar",
            padding: 9,
            height: 40,
            cols: [
                {},
                {
                },
                {
                    view: "icon",
                    icon: "mdi mdi-cog-outline",
                    click: () => this.OnShowConfigClick()
                },
                {
                    view: "icon",
                    icon: "mdi mdi-logout",
                    click: () => this.OnLogoutClick()
                }
            ]
        };


        return {
            type: "clean",
            cols: [
                {
                    rows: [
                        header,
                        sidebar
                    ]
                },
                {
                    rows: [
                        toolbar,
                        TaskTable
                    ]
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
        // this.configWin.Show("Настройки");
        this.app.show("/Config/RolesConfig");
    }

    init() {
        // this.configWin = new ConfigWindow(this, "Config");
    }
}