"use restrict";

import { JetView } from "webix-jet";

export default class ServiceObjects extends JetView {
    config() {
        return {
            id: "ServiceObjectsConfig",
            // type: "space",
            rows: [
                // {
                //     view: "label",
                //     label: "Роли"
                // },
                {
                    view: "form",
                    id: "ServiceObjectsConfigForm",
                    name: "ServiceObjectsConfigForm",
                    elements: [
                        {
                        },
                        {},
                        {
                            cols: [
                                {},
                                {
                                    view: "button",
                                    label: "Сохранить",
                                    autowidth: true,
                                    css: "webix_primary",
                                    click: async () => await this.onSave()
                                }
                            ]
                        }
                    ],
                    elementsConfig: {
                        labelPosition: "top",
                    }
                }
            ]
        };
    }

    ready() {
    }

    async OnSave() {
    }
}