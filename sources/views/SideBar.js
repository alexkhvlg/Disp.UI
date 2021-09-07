"use restrict";

import { JetView } from "webix-jet";

export default class SideBar extends JetView {
    config() {
        return {
            // css: "webix_dark",
            id: "sidebar_layout",
            name: "sidebar_layout",
            rows: [
                {
                    css: "webix_dark",
                    id: "sidebar",
                    name: "sidebar",
                    position: "left",
                    view: "sidebar",
                    collapsed: false,
                    // activeTitle: true,
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
                }
            ]
        };
    }

    
}