"use restrict";

import { JetView } from "webix-jet";
import HeaderToolBar from "views/HeaderToolbar";
import Controller from "Controller";
import SideBar from "views/SideBar";
import MapWidget from "views/MapWidget";

export default class MainView extends JetView {
    config() {
        return {
            id: "app",
            rows: [
                HeaderToolBar,
                {
                    cols: [
                        SideBar,
                        MapWidget
                    ]
                }
            ]
        };
    }

    async init() {
        Controller.AddMainView(this);
        await Controller.OnAppMainViewInit();
    }

    async ready() {
        await Controller.OnAppLoaded();
    }
}