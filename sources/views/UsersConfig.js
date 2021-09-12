"use restrict";

import { JetView } from "webix-jet";
import { my_fetch } from "../Tools";

export default class UsersConfig extends JetView {
    CompaniesToCreate = []; // companies list to create
    CompaniesToDelete = []; // companies list to delete
    UsersConfig = undefined; // this control
    CompaniesList = undefined; // companies list control
    MembersList = undefined; // members list control
    companies = undefined; // companies objects list
    members = undefined; // members objects list

    ready() {
        this.UsersConfig = webix.$$("UsersConfig");
        this.CompaniesList = webix.$$("CompaniesList");
        this.MembersList = webix.$$("MembersList");

        this.members = JSON.parse(localStorage.getItem("Members"));
        
        // Fill companies list control
        this.companies = JSON.parse(localStorage.getItem("Companies"));
        this.CompaniesList.parse(this.companies);
        // Select first position
        this.CompaniesList.select(this.CompaniesList.getFirstId());
    }
    
    config() {

        const companyListLabelUi = {
            view: "label",
            label: "Организации",
        };

        const companyListUi = {
            id: "CompaniesList",
            name: "CompaniesList",
            view: "list",
            template: "#name#",
            select: true,
            autowidth: true,
            css: "role_list",
            on: {
                onSelectChange: async () => {
                    let company = this.CompaniesList.getSelectedItem();
                    await this.ShowMembers(company);
                }
            }
        };

        const userListLabelUi = {
            view: "label",
            label: "Пользователи",
        };

        const userListUi = {
            id: "MembersList",
            name: "MembersList",
            view: "list",
            template: "#person.fullName#",
            select: true,
            autowidth: true,
            css: "role_list",
            on: {
                onSelectChange: async () => {
                    let member = this.MembersList.getSelectedItem();
                    this.ShowMemberInfo(member);
                }
            }
        };

        const createDeleteToolbarUi = {
            cols: [
                {
                    view: "button",
                    value: "Создать",
                    autowidth: true,
                    click: () => this.CreateCompany()
                },
                {},
                {
                    view: "button",
                    value: "Удалить",
                    autowidth: true,
                    click: () => this.DeleteCompany()
                },
            ]
        };

        const saveButtonUi = {
            cols: [
                {},
                {
                    view: "button",
                    label: "Сохранить",
                    autowidth: true,
                    css: "webix_primary",
                    click: async () => await this.OnSave()
                }
            ]
        };

        return {
            id: "UsersConfig",
            type: "space",
            cols: [
                {
                    gravity: 1,
                    rows: [
                        companyListLabelUi,
                        companyListUi,
                        createDeleteToolbarUi
                    ]
                },
                {
                    gravity: 4,
                    rows: [
                        userListLabelUi,
                        userListUi,
                        saveButtonUi
                    ]
                }
            ]
        };
    }

    CreateCompany() {
        webix.prompt({
            text: "Новая организация",
            ok: "Да",
            cancel: "Нет",
            input: {
                required: true,
                placeholder: "Введите название",
            }
        }).then((result) => {
            let newItem = {
                id: this.CompaniesToCreate.length,
                name: result,
            };
            this.CompaniesList.add(newItem);
            this.CompaniesList.select(newItem.id);
            this.CompaniesToCreate.push(newItem);
        });
    }

    DeleteCompany() {
        let item = this.CompaniesList.getSelectedItem();
        this.webix.confirm({
            text: "Удалить организацию '" + item.name + "' ?",
            type: "confirm-warning",
            ok: "Да",
            cancel: "Нет",
            callback: (result) => {
                if (result) {
                    this.CompaniesList.remove(item.id);
                    this.CompaniesToDelete.push(item);
                }
            }
        });
    }

    async ShowMembers(company) {
        this.MembersList.clearAll();
        try {
            webix.extend(this.UsersConfig, webix.ProgressBar);
            this.UsersConfig.showProgress({
                type: "icon",
            });
            let companyMembers = await my_fetch("GET", "https://dev2.im-dispatcher.ru/api/v1/companies/" + company.id + "/members");
            this.MembersList.parse(companyMembers);
        }
        catch (e) {
            console.log(e);
        }
        finally {
            this.UsersConfig.hideProgress();
        }
    }

    ShowMemberInfo(userInfo) {

    }

    async OnSave() {
        console.log(this.CompaniesToCreate);
        console.log(this.CompaniesToDelete);
    }
}