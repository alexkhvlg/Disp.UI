"use restrict";

import { JetView } from "webix-jet";

export default class MapWidget extends JetView {
    config() {
        return {
            view: "yandex-map",
            id: "map",
            zoom: 11,
            center: [55.74, 37.64],
            controls: ["zoomControl"],
            apikey: "120aef9a-2e5c-452c-b912-effb5e3b4f90",
            maxZoom: 18
        }
    }
}