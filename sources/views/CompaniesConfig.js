"use restrict";

import { JetView } from "webix-jet";
// import { my_fetch } from "../Tools";

export default class CompaniesConfig extends JetView {
    ClusterCompaniesToCreate = [] // cluster companies list to create
    ClusterCompaniesToDelete = [] // cluster companies list to delete
    CompaniesToCreate = []; // companies list to create
    CompaniesToDelete = []; // companies list to delete
    CompaniesConfig = undefined; // this control
    ClusterCompaniesList = undefined; // companies companies list control
    CompaniesList = undefined; // members list control
    clusterCompanies = undefined; // companies objects list
    companies = undefined; // members objects list

    ready() {
        this.CompaniesConfig = webix.$$("CompaniesConfig");
        this.ClusterCompaniesList = webix.$$("ClusterCompaniesList");
        this.CompaniesList = webix.$$("CompaniesList");

        this.companies = JSON.parse(localStorage.getItem("Companies"));
        
        // Fill cluster companies list control
        this.clusterCompanies = JSON.parse(localStorage.getItem("ClusterCompanies"));
        this.ClusterCompaniesList.parse(this.clusterCompanies);
        // Select first position
        this.ClusterCompaniesList.select(this.ClusterCompaniesList.getFirstId());
    }
    
    config() {

        const clusterCompaniesListLabelUi = {
            view: "label",
            label: "Кластеры организаций",
        };

        const clusterCompaniesListUi = {
            id: "ClusterCompaniesList",
            name: "ClusterCompaniesList",
            view: "list",
            template: "#name#",
            select: true,
            autowidth: true,
            css: "role_list",
            on: {
                onSelectChange: async () => {
                    let clusterCompany = this.ClusterCompaniesList.getSelectedItem();
                    await this.ShowClusterCompanies(clusterCompany);
                }
            }
        };

        const companiesListLabelUi = {
            view: "label",
            label: "Организации",
        };

        const companiesListUi = {
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
                    this.ShowCompanyInfo(company);
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
            id: "CompaniesConfig",
            type: "space",
            cols: [
                {
                    gravity: 1,
                    rows: [
                        clusterCompaniesListLabelUi,
                        clusterCompaniesListUi,
                        createDeleteToolbarUi
                    ]
                },
                {
                    gravity: 4,
                    rows: [
                        companiesListLabelUi,
                        companiesListUi,
                        saveButtonUi
                    ]
                }
            ]
        };
    }

    CreateCompany() {
        webix.prompt({
            text: "Новый кластер организаций",
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
            this.ClusterCompaniesList.add(newItem);
            this.ClusterCompaniesList.select(newItem.id);
            this.CompaniesToCreate.push(newItem);
        });
    }

    DeleteCompany() {
        let item = this.ClusterCompaniesList.getSelectedItem();
        this.webix.confirm({
            text: "Удалить кластер организаций '" + item.name + "' ?",
            type: "confirm-warning",
            ok: "Да",
            cancel: "Нет",
            callback: (result) => {
                if (result) {
                    this.ClusterCompaniesList.remove(item.id);
                    this.CompaniesToDelete.push(item);
                }
            }
        });
    }

    ShowClusterCompanies(clusterCompany) {
        this.CompaniesList.clearAll();
        this.companies.forEach((company) => {
            if (company.clusterCompanyId == clusterCompany.id){
                console.log(company);
                this.CompaniesList.add(company);
            }
        });
    }

    ShowCompanyInfo(company) {

    }

    async OnSave() {
        console.log(this.CompaniesToCreate);
        console.log(this.CompaniesToDelete);
    }
}