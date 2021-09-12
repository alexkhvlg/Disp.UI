"use restrict";

import { JetView } from "webix-jet";
import TaskTableView from "views/TaskTableView";

export default class MainView extends JetView {
    TaskTable = undefined;
    taskStages = undefined;

    config() {

        const headerUi = {
            view: "label",
            label: "Задания"
        };

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
            padding: 9,
            height: 40,
            cols: [
                {},
                headerUi,
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