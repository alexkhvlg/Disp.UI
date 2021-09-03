"use restrict";

import { JetView } from "webix-jet";
import Controller from "Controller";
import { PrintDebug, PerformAsync, PostRest } from "Tools";

export class LoginWindow extends JetView {
    #ViewId;
    #CaptionId;
    #FormId;

    constructor(view, name) {
        super(view.app, name);

        this.#ViewId = name;
        this.#FormId = name + "Form";
        this.#CaptionId = name + "Caption";

        view.ui(this);
    }

    Show(caption) {
        $$(this.#CaptionId).setValue(caption);
        this.getRoot().show();
        this.$$("username").focus();
    }

    GetLoginForm() {
        return $$(this.#FormId);
    }

    config() {
        return {
            view: "window",
            id: this.#ViewId,
            height: 250,
            width: 300,
            position: "center",
            close: false,
            move: true,
            head: {
                view: "toolbar",
                elements: [{
                    view: "label",
                    id: this.#CaptionId,
                    label: "Вход",
                    align: "center"
                }, {
                    view: "icon",
                    icon: "wxi-close",
                    click: () => {
                        this.getRoot().hide();
                    }
                }]
            },
            modal: true,

            body: {
                view: "form",
                id: this.#FormId,
                elements: [{
                    view: "text",
                    label: "Имя",
                    localId: "username",
                    name: "username"
                }, {
                    view: "text",
                    label: "Пароль",
                    name: "password",
                    localId: "password",
                    type: "password"
                }, {
                    view: "button",
                    value: "Войти",
                    css: "webix_primary",
                    click: async () => {
                        await this.OnLoginClick();
                    }

                }],
                rules: {
                    "username": webix.rules.isNotEmpty,
                    "password": webix.rules.isNotEmpty
                },
            }
        };
    }

    async OnLoginClick() {
        PrintDebug("OnLoginClick");
        let login_form = this.GetLoginForm();
        if (login_form.validate()) {
            await PerformAsync(this.#ViewId, async (control) => {
                let loginData = { login: login_form.getValues().username, password: login_form.getValues().password };
                let authResult = await PostRest("api/auth", loginData);
                if (authResult.token == null) {
                    webix.alert({
                        title: "Внимание",
                        text: authResult.error_msg,
                        type: "alert-error"
                    });
                } else {
                    webix.storage.session.put("IsAuthorized", true);
                    webix.storage.session.put("Token", authResult.token);
                    webix.storage.session.put("UserId", authResult.id);
                    webix.storage.session.put("Login", authResult.login);
                    webix.storage.session.put("RoleId", authResult.role_id);
                    webix.storage.session.put("DepartmentId", authResult.department_id);
                    control.hide();
                    await Controller.AfterLogin();
                }
            });
        }
    }
}