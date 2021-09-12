"use restrict";

import { JetView } from "webix-jet";

export default class ServiceObjectTypes extends JetView {

    ready() {
    }
    
    config() {
        return {
            id: "ServiceObjectTypesConfig",
            // type: "space",
            rows: [
                // {
                //     view: "label",
                //     label: "Роли"
                // },
                {
                    view: "form",
                    id: "ServiceObjectTypesConfigForm",
                    name: "ServiceObjectTypesConfigForm",
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

    async OnSave() {
    }
}