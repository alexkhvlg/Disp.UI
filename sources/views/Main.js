"use restrict";

import { JetView } from "webix-jet";
import TaskTableView from "views/TaskTableView";
import { ClearDictionaries } from "../models/dictionaries";

export default class MainView extends JetView {
    TaskTable = undefined;
    taskStages = undefined;

    config() {

        const sidebarUi = {
            localId: "taskStages",
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

        const toolbarUi = {
            view: "toolbar",
            // height: 50,
            paddingX: 10,
            cols: [
                {
                    view: "label",
                    label: "Disp.UI",
                    align: "center"
                },
                {
                    view: "icon",
                    icon: "mdi mdi-cog-outline",
                    tooltip: "Настройки",
                    click: () => this.OnShowConfigClick()
                },
                {
                    view: "icon",
                    icon: "mdi mdi-logout",
                    tooltip: "Выход из системы",
                    click: () => this.OnLogoutClick()
                }
            ]
        };


        // return {
        //     // type: "clean",
        //     cols: [
        //         {
        //             rows: [
        //                 header,
        //                 sidebar
        //             ]
        //         },
        //         {
        //             rows: [
        //                 toolbar,
        //                 TaskTable
        //             ]
        //         }
        //     ]
        // };
        return {
            rows: [
                toolbarUi,
                {
                    cols: [
                        sidebarUi,
                        TaskTableView
                    ]
                }
            ]
        };
    }

    OnLogoutClick() {
        this.app.getService("user").logout()
            .finally(() => {
                ClearDictionaries();
                this.show("/login");
            });
    }

    OnShowConfigClick() {
        this.app.show("/Config/RolesConfig");
    }

    ready() {
        this.TaskTable = this.webix.$$("TaskTable");

        this.taskStages = this.$$("taskStages");
        this.taskStages.select(this.taskStages.getFirstId());
    }
}