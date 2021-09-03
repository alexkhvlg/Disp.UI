"use restrict";

import { JetView } from "webix-jet";
import Controller from "Controller";
import { ui } from "Tools";

export class ConfigWindow extends JetView {
    #ViewId;
    #CaptionId;
    #MinMaxWindowButtonId;
    #ToolBarId;

    #normalLeft;
    #normalTop;
    #normalWidth;
    #normalHeight;

    constructor(view, name) {
        super(view.app, name);

        this.#ViewId = name;
        this.#CaptionId = name + "Caption";
        this.#MinMaxWindowButtonId = name + "MixMaxButton";
        this.#ToolBarId = name + "Toolbar";

        view.ui(this);

        webix.event($$(this.#ToolBarId).$view, "dblclick", () => {
            this.MinMaxWindow();
        });
    }

    async Show(caption) {
        $$(this.#CaptionId).setValue(caption);
        this.getRoot().show();

        var dict = await Controller.Dict;
        this.SetComboBoxValues("BeginWorkTypeId", dict.work_types);
        this.SetComboBoxValues("MovedWorkTypeId", dict.work_types);
        this.SetComboBoxValues("EndWorkTypeId", dict.work_types);
        ui("BeginWorkTypeId").setValue(dict.common_config.BeginWorkTypeId);
        ui("MovedWorkTypeId").setValue(dict.common_config.MovedWorkTypeId);
        ui("EndWorkTypeId").setValue(dict.common_config.EndWorkTypeId);
        ui("AllowedWorkTypeIds").setValue(dict.common_config.AllowedWorkTypeIds.join("; "));
    }

    MinMaxWindow() {
        let win = $$(this.#ViewId);
        let button = $$(this.#MinMaxWindowButtonId);
        if (!win.config.fullscreen) {
            this.#normalLeft = win.config.left;
            this.#normalTop = win.config.top;
            this.#normalWidth = win.config.width;
            this.#normalHeight = win.config.height;
        }
        win.config.fullscreen = !win.config.fullscreen;
        if (win.config.fullscreen) {
            win.config.left = 0;
            win.config.top = 0;
            button.setValue("&#128471;&#xFE0E;");
        }
        else {
            win.config.left = this.#normalLeft;
            win.config.top = this.#normalTop;
            win.config.width = this.#normalWidth;
            win.config.height = this.#normalHeight;
            button.setValue("&#128470;&#xFE0E;");
        }
        button.refresh();
        win.resize();
    }

    config() {
        return {
            view: "window",
            id: this.#ViewId,
            width: 800,
            height: 600,
            position: "center",
            close: false,
            move: true,
            modal: true,
            head: {
                view: "toolbar",
                id: this.#ToolBarId,
                css:"webix_dark",
                elements: [{
                    view: "label",
                    id: this.#CaptionId,
                    label: "Вход",
                    align: "center"
                }, {
                    view: "button",
                    id: this.#MinMaxWindowButtonId,
                    value: "&#128470;&#xFE0E;",
                    width: 36,
                    // css: "webix_primary",
                    click: () => this.MinMaxWindow()
                },
                {
                    view: "button",
                    value: "&#128473;&#xFE0E;",
                    width: 36,
                    // css: "webix_danger",
                    click: () => {
                        $$(this.#ViewId).hide();
                    }
                }]
            },

            body: {
                view: "form",
                borderless: true,
                id: "CommonConfigForm",
                name: "CommonConfigForm",
                elements: [
                    // { view: "label", label: "Вид работы исполнителя" },
                    {
                        view: "combo",
                        id: "BeginWorkTypeId",
                        name: "BeginWorkTypeId",
                        label: "Начало смены",
                    },
                    {
                        view: "combo",
                        id: "MovedWorkTypeId",
                        name: "MovedWorkTypeId",
                        label: "Пришёл на станцию",
                    },
                    {
                        view: "combo",
                        id: "EndWorkTypeId",
                        name: "EndWorkTypeId",
                        label: "Конец смены",
                    },
                    // { view: "label", label: "Вид работы оператора" },
                    {
                        view: "text",
                        id: "AllowedWorkTypeIds",
                        name: "AllowedWorkTypeIds",
                        label: "Доступные оператору виды работ (номера через ';')"
                    },
                    {},
                    {
                        cols: [
                            {},
                            {
                                view: "button",
                                label: "Сохранить",
                                css: "webix_primary",
                                autowidth: true,
                                click: async () => await this.Apply()
                            }
                        ]
                    }
                ],
                elementsConfig: {
                    labelPosition: "top",
                }
            },

            on: {
                onViewMove: () => {
                    console.log("onViewMove");
                    let win = $$(this.#ViewId);
                    if (win.config.fullscreen) {
                        this.MinMaxWindow();
                    }
                },
            }
        };
    }

    SetComboBoxValues(id, values) {
        let combo = ui(id);
        combo.define("options", values);
        combo.refresh();
    }

    async Apply() {
        var allowedStr = ui("AllowedWorkTypeIds").getValue();
        var allowedArray = [];
        if (allowedStr.indexOf(';') < 0) {
            var i = parseInt(allowedStr);
            if (!isNaN(i)) {
                allowedArray.push(i);
            }
        } else {
            allowedStr.split(';').forEach(element => {
                try {
                    var i = parseInt(element);
                    if (!isNaN(i)) {
                        allowedArray.push(i);
                    }
                }
                catch {

                }
            });
        }
        let common_config = {
            "BeginWorkTypeId": parseInt(ui("BeginWorkTypeId").getValue()),
            "MovedWorkTypeId": parseInt(ui("MovedWorkTypeId").getValue()),
            "EndWorkTypeId": parseInt(ui("EndWorkTypeId").getValue()),
            "AllowedWorkTypeIds": allowedArray
        };

        var dict = await Controller.Dict;
        dict.common_config.AllowedWorkTypeIds = allowedArray;
        await Controller.SaveCommonConfig(common_config);
    }
}