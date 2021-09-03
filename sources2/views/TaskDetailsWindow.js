"use restrict";

import { JetView } from "webix-jet";
import Controller from "Controller";
import { ui, unix_to_date } from "Tools";

export class TaskDetailsWindow extends JetView {
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

    async Show(task_info) {
        // var dict = await Controller.Dict;
        // var priority = dict.priorities.find((item) => { return item.id == task_info.priority_id });
        // var status = dict.statuses.find((item) => { return item.id == task_info.status_id });
        // var organization = dict.organizations.find((item) => { return item.id == task_info.organization_id });
        var user = Controller.UserIdToStr(task_info.user_id);
        var assigned_user = Controller.UserIdToStr(task_info.assigned_user_id);
        var worktype = Controller.TypeIdToStr(task_info.type_id);
        var stage = Controller.StageToStr(task_info.stage);
        var assigned_user_position = Controller.UserIdToPositionStr(task_info.assigned_user_id);


        $$(this.#FormId).setValues({
            TaskId: task_info.id,
            TaskTitle: task_info.title,
            TaskText: task_info.text,
            TaskUser: user,
            TaskWorkType: worktype,
            TaskDate: unix_to_date(task_info.date),
            // TaskPriority: priority.value,
            // TaskStatus: status.value,
            TaskStage: stage,
            TaskAssignedUserPosition: assigned_user_position,
            // TaskAssignedOrganization: task_info.assigned_organization,
            TaskAssignedUser: assigned_user
        });

        // $$("TaskWorkTypeGroup").define("options", WorkTypeGroups);
        // $$("TaskWorkTypeGroup").define("value", SelectedWorkTypeGroup);
        // $$("TaskWorkTypeGroup").refresh();

        // $$("TaskWorkType").define("options", WorkTypes);
        // $$("TaskWorkType").define("value", SelectedWorkType);
        // $$("TaskWorkType").refresh();

        $$(this.#CaptionId).setValue(task_info.title);
        this.getRoot().show();
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
            width: 600,
            height: 800,
            position: "center",
            close: false,
            move: true,
            // modal: true,
            head: {
                view: "toolbar",
                id: this.#ToolBarId,
                css: "webix_dark",
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
                elementsConfig: { labelWidth: 110 },
                elements: [{
                    id: "TaskId",
                    name: "TaskId",
                    view: "text",
                    label: "№",
                    readonly: true
                }, {
                    id: "TaskDate",
                    name: "TaskDate",
                    view: "text",
                    label: "Время",
                    readonly: true
                }, {
                    id: "TaskTitle",
                    name: "TaskTitle",
                    view: "text",
                    label: "Заголовок",
                    readonly: true
                }, {
                    id: "TaskText",
                    name: "TaskText",
                    view: "textarea",
                    label: "Текст",
                    readonly: true,
                    height: 100,
                }, {
                    id: "TaskUser",
                    name: "TaskUser",
                    view: "text",
                    label: "Оператор",
                    readonly: true,
                    icon: "",
                }, {
                    id: "TaskAssignedUser",
                    name: "TaskAssignedUser",
                    view: "text",
                    label: "Исполнитель",
                    readonly: true
                }, {
                    id: "TaskAssignedUserPosition",
                    name: "TaskAssignedUserPosition",
                    view: "text",
                    label: "Должность",
                    readonly: true
                }, {
                    id: "TaskWorkType",
                    name: "TaskWorkType",
                    view: "text",
                    label: "Вид работы",
                    readonly: true,
                }, {
                    //     id: "TaskPriority",
                    //     name: "TaskPriority",
                    //     view: "text",
                    //     label: "Приоритет",
                    //     readonly: true
                    // }, {
                    id: "TaskStage",
                    name: "TaskStage",
                    view: "text",
                    label: "Этап",
                    readonly: true
                    // }, {
                    //     id: "TaskStatus",
                    //     name: "TaskStatus",
                    //     view: "text",
                    //     label: "Статус",
                    //     readonly: true
                    // }, {
                    //     id: "TaskAssignedOrganization",
                    //     name: "TaskAssignedOrganization",
                    //     view: "text",
                    //     label: "Организация",
                    //     readonly: true
                }]
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
    }
}