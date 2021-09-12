"use restrict";

import { JetView, plugins } from "webix-jet";

export default class Config extends JetView {
    config() {
        const toolbarUi = {
            view: "toolbar",
            css: "webix_dark",
            cols: [
                {
                    view: "button",
                    label: "Назад",
                    autowidth: true,
                    click: () => this.app.show("/Main")
                },
                {},
                {
                    view: "label",
                    label: "Настройки",
                    align: "center"
                },
                {}
            ]
        };

        const sidebarUi = {
            view: "sidebar",
            css: "webix_dark",
            id: "ConfigWindowMenu",
            localId: "ConfigWindowMenu",
            data: [
                {
                    id: "WorkTypesConfig",
                    value: "Виды работ"
                },
                {
                    id: "RolesConfig",
                    value: "Роли",
                },
                {
                    id: "PositionsConfig",
                    value: "Должности",
                },
                {
                    value: "Организации и сотрудники",
                    data: [
                        {
                            id: "CompaniesConfig",
                            value: "Организации"
                        },
                        {
                            id: "UsersConfig",
                            value: "Cотрудники"
                        },
                    ]
                },
                {
                    value: "Объекты обслуживания",
                    data: [
                        {
                            id: "ServiceObjectTypesConfig",
                            value: "Типы объектов обслуживания",
                        },
                        {
                            id: "ServiceObjectsConfig",
                            value: "Объекты обслуживания",
                        }
                    ]
                },
                
            ]
        };

        return {
            rows: [
                toolbarUi ,
                {
                    // type: "space",
                    cols: [
                        sidebarUi,
                        {
                            $subview: true
                        }
                    ]
                }
            ]
        };
    }

    init() {
        this.use(plugins.Menu, "ConfigWindowMenu");
    }
}