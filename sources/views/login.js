"use strict";

import { JetView } from "webix-jet";

export default class LoginView extends JetView {
    config() {
        const label = {
            view: "label",
            label: "<span class='app_name_label'>Disp.UI</span>",
            align: "center",
            height: 200
        };

        const login_form = {
            view: "form",
            localId: "login:form",
            width: 400,
            borderless: true,
            // margin:10,
            rows: [
                {
                    localId: "login:form:login",
                    view: "text",
                    name: "login",
                    label: "Имя",
                    labelPosition: "top",
                    value: "root@info-city.ru"
                },
                {
                    localId: "login:form:password",
                    view: "text",
                    type: "password",
                    name: "pass",
                    label: "Пароль",
                    labelPosition: "top",
                    value: "root"
                },
                {
                    localId: "login:form:submit",
                    view: "button",
                    value: "Вход",
                    click: async () => await this.do_login(),
                    hotkey: "enter"
                }
            ],
            rules: {
                login: webix.rules.isNotEmpty,
                pass: webix.rules.isNotEmpty
            }
        };

        return {
            cols: [
                {},
                {
                    rows: [
                        // {},
                        label,
                        // {},
                        login_form,
                        {}]
                },
                {}]
        };
    }

    init(view) {
        view.$view.querySelector("input").focus();
    }

    async do_login() {
        const user = this.app.getService("user");
        const form = this.$$("login:form");

        if (form.validate()) {
            webix.extend(form, webix.ProgressBar);
            const data = form.getValues();
            let loginInput = this.$$("login:form:login");
            let passwordInput = this.$$("login:form:password");
            let button = this.$$("login:form:submit");
            try {
                form.showProgress({
                    type: "icon",
                });
                loginInput.disable();
                passwordInput.disable();
                button.disable();
                button.setValue("Вход..");
                await user.login(data.login, data.pass);
            }
            catch {
                webix.html.removeCss(form.$view, "invalid_login");
                form.elements.pass.focus();
                webix.delay(function () {
                    webix.html.addCss(form.$view, "invalid_login");
                });
            }
            finally {
                button.setValue("Вход");
                loginInput.enable();
                passwordInput.enable();
                button.enable();
                form.hideProgress();
            }
        }
    }
}