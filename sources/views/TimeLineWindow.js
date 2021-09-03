"use restrict";

import { JetView } from "webix-jet";
import Controller from "Controller";
import { unix_to_date, PerformAsync, GetRest } from "Tools";

export class TimeLineWindow extends JetView {
    #normalLeft;
    #normalTop;
    #normalWidth;
    #normalHeight;

    constructor(view) {
        super(view.app, "TimeLineWindow");

        view.ui(this);

        webix.event(this.$$("toolbar").$view, "dblclick", () => {
            this.MinMaxWindow();
        });
    }

    async Show(task) {
        var assigned_user = Controller.UserIdToStr(task.assigned_user_id);
        this.$$("caption").setValue(assigned_user);
        this.$$("timeline").clearAll();
        this.getRoot().show();
        await PerformAsync("timeline", async () => {
            let params = {
                token: webix.storage.session.get("Token"),
                userId: task.assigned_user_id
            };
            var lastSession = await GetRest("api/tasks/get_user_last_session", params);
            if (lastSession != null) {
                lastSession.sort(function (a, b) {
                    return a.date - b.date;
                });
                var timeline = lastSession.map((t) => {
                    return {
                        date: t.date,
                        value: Controller.TypeIdToStr(t.type_id),
                        details: Controller.GetStation(t.subway_line_id, t.station_id).name
                    }
                });
                this.$$("timeline").parse(timeline);
            }
        });
    }

    MinMaxWindow() {
        let win = this.getRoot();
        let button = this.$$("minmaxbutton");
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
            id: "TimeLineWindow",
            view: "window",
            width: 500,
            height: 600,
            position: "center",
            close: false,
            move: true,
            modal: true,
            head: {
                view: "toolbar",
                localId: "toolbar",
                css: "webix_dark",
                elements: [{
                    view: "label",
                    localId: "caption",
                    label: "Вход",
                    align: "center"
                }, {
                    view: "button",
                    localId: "minmaxbutton",
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
                        this.getRoot().hide();
                    }
                }]
            },

            body: {
                id: "timeline",
                localId: "timeline",
                name: "timeline",
                view: "timeline",
                hidden: true,
                type: {
                    // type: "alternate",
                    templateDate: function (obj) {
                        return unix_to_date(obj.date);
                    }
                }
            },

            on: {
                onViewMove: () => {
                    let win = this.getRoot();
                    if (win.config.fullscreen) {
                        this.MinMaxWindow();
                    }
                },
            }
        }
    }
}