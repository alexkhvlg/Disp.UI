"use restrict";

import { JetView, plugins } from "webix-jet";
import HeaderToolBar from "views/HeaderToolbar";
import SideBar from "views/SideBar";
import TaskTable from "views/TaskTable";
import { Dictionaries } from "../models/dictionaries";

export default class MainView extends JetView {
    config() {

        var ui = {
            rows: [
                HeaderToolBar,
                {
                    cols: [
                        SideBar,
                        TaskTable
                    ]
                }
            ]
        };


        return ui;
    }

    async LoadDictionaries() {
        console.log("Loading dictionaries..");
        let ClusterCompanies = await Dictionaries("ClusterCompanies");
        let Companies = await Dictionaries("Companies");
        let GroupWorkTypes = await Dictionaries("GroupWorkTypes");
        let Members = await Dictionaries("Members");
        let Person = await Dictionaries("Person");
        let Positions = await Dictionaries("Positions");
        let Priorities = await Dictionaries("Priorities");
        let Roles = await Dictionaries("Roles");
        let Rules = await Dictionaries("Rules");
        let ServiceAttributes = await Dictionaries("ServiceAttributes");
        let ServiceObjects = await Dictionaries("ServiceObjects");
        let ServiceObjectTypes = await Dictionaries("ServiceObjectTypes");
        let Stages = await Dictionaries("Stages");
        let Stickers = await Dictionaries("Stickers");
        let TaskTypes = await Dictionaries("TaskTypes");
        let WorkTypes = await Dictionaries("WorkTypes");
        console.log("done");
    }

    async ready() {
        await this.LoadDictionaries();
    }
}