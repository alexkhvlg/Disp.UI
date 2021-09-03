"use restrict";

import { JetView } from "webix-jet";

export class TasksWindow extends JetView {
    #ViewId;
    #CaptionId;
    #MinMaxWindowButtonId;
    #ToolBarId;

    #normalLeft;
    #normalTop;
    #normalWidth;
    #normalHeight;

    OnLoginClick() { }

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

    Show(caption) {
        $$(this.#CaptionId).setValue(caption);
        $$(this.#ViewId).show();
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
                css:"webix_dark",
                id: this.#ToolBarId,
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
                    click: () => this.MinMaxWindow()
                },
                {
                    view: "button",
                    value: "&#128473;&#xFE0E;",
                    width: 36,
                    click: () => {
                        $$(this.#ViewId).hide();
                    }
                }]
            },

            body: {
            },

            on: {
                onViewMove: () => {
                    console.log("onViewMove");
                    let win = $$(this.#ViewId);
                    if (win.config.fullscreen) {
                        this.MinMaxWindow();
                    }
                }
            }
        };
    }

    async ready() {
        // let common_config = await Controller.LoadCommonConfig();
        // ui("ThreadCount").setValue(donwload_config.ThreadCount);
    }

    async Apply() {
        // await Controller.SaveCommonConfig(common_config);
    }
}