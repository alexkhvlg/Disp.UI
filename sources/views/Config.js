"use restrict";

import { JetView, plugins } from "webix-jet";

export default class Config extends JetView {
    config() {
        return {
            id: "Config",
            // type: "space",
            rows: [
                {
                    view: "toolbar",
                    css: "webix_dark",
                    cols: [
                        {
                            view: "button",
                            label: "Вернуться",
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
                },
                {
                    cols: [
                        {
                            view: "sidebar",
                            css: "webix_dark",
                            id: "ConfigWindowMenu",
                            localId: "ConfigWindowMenu",
                            data: [
                                {
                                    id: "RolesConfig",
                                    value: "Роли",
                                    view: "button"
                                },
                                {
                                    id: "PositionsConfig",
                                    value: "Должности",
                                    iew: "button"
                                },
                                {
                                    id: "CompaniesConfig",
                                    value: "Организации",
                                    iew: "button"
                                },
                                {
                                    id: "ServiceObjectTypesConfig",
                                    value: "Типы объектов обслуживания",
                                    iew: "button"
                                },
                                {
                                    id: "ServiceObjectsConfig",
                                    value: "Объекты обслуживания",
                                    iew: "button"
                                }
                            ]
                        },
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