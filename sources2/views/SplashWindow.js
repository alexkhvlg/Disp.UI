"use restrict";

import { JetView } from "webix-jet";

export class SplashWindow extends JetView {
    #ViewId;

    constructor(view, name) {
        super(view.app, name);

        this.#ViewId = name;

        view.ui(this);
    }

    Show() {
        $$(this.#ViewId).show();
    }


    config() {
        return {
            view: "window",
            id: this.#ViewId,
            height: 140,
            width: 140,
            position: "center",
            close: false,
            head: false,
            move: true,
            modal: true,

            body: {
                template: "html->loading_gif",
                autoheight: true
            },
        };
    }
}