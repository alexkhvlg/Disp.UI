"use restrict";

import { JetView } from "webix-jet";

export default class Companies extends JetView {
    config() {
        return {
            id: "CompaniesConfig",
            // type: "space",
            rows: [
                // {
                //     view: "label",
                //     label: "Роли"
                // },
                {
                    view: "form",
                    id: "CompaniesConfigForm",
                    name: "CompaniesConfigForm",
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