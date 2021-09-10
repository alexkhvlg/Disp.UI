"use restrict";

import { validate } from "schema-utils";
import { JetView } from "webix-jet";
import { MyWindow } from "./MyWindow";

export class ConfigWindow extends MyWindow {
    MyBody() {
        return {
            cols: [
                {
                    view: "sidebar",
                    data: [
                        {
                            value: "Роли"
                        },
                        {
                            value: "Должности"
                        },
                        {
                            value: "Кластеры организации"
                        },
                        {
                            value: "Организации"
                        },
                        {
                            value: "Типы объектов обслуживания"
                        },
                        {
                            value: "Объекты обслуживания"
                        }
                    ]
                }, {

                }
            ]
        };
    }
}