"use restrict";

import { JetView } from "webix-jet";

export default class Positions extends JetView {
    config() {
        return {
            id: "PositionsConfig",
            // type: "space",
            rows: [
                // {
                //     view: "label",
                //     label: "Роли"
                // },
                {
                    view: "form",
                    id: "PositionsConfigForm",
                    name: "PositionsConfigForm",
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