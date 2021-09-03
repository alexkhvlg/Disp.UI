"use restrict";

import { JetView } from "webix-jet";
import Controller from "Controller";
import { ui, SetComboValues } from "Tools";

export class NewTaskWindow extends JetView {
    #ViewId;
    #CaptionId;
    #MinMaxWindowButtonId;
    #ToolBarId;
    #FormId;

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
        this.#FormId = name + "Form";

        view.ui(this);

        webix.event($$(this.#ToolBarId).$view, "dblclick", () => {
            this.MinMaxWindow();
        });
    }

    async Show(caption) {
        $$(this.#CaptionId).setValue(caption);
        $$(this.#ViewId).show();

        var dict = await Controller.Dict;
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
                id: this.#FormId,
                name: this.#FormId,
                elements: [
                    {},
                    {
                        cols: [
                            {},
                            {
                                view: "button",
                                label: "Создать",
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

    async Apply() {
    }
}