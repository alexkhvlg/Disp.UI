"use restrict";

import { JetView } from "webix-jet";
import Controller from "Controller";

export default class SubwayFilterView extends JetView {
    config() {
        return {
            id: "SubwayFilter",
            name: "SubwayFilter",
            // width: 250,
            type: "space",
            rows: [
                {
                    id: "show_all_subways",
                    view: "switch",
                    value: 0,
                    label: "Отображать все линии метро",
                    labelWidth: 250,
                    // labelPosition: "top",
                    on: {
                        onChange(newValue) {
                            Controller.OnShowAllSubwaysToggle(newValue);
                        }
                    }
                },
                {
                    id: "subway_lines",
                    view: "select",
                    label: "Линии метро",
                    labelWidth: 250,
                    // labelPosition: "top",
                    options: [],
                    on: {
                        onChange(newValue) {
                            Controller.OnSubwayLineChanged(newValue);
                        }
                    }
                },
                {
                    id: "subway_stantions",
                    view: "select",
                    label: "Станции",
                    labelWidth: 250,
                    // labelPosition: "top",
                    options: [],
                    on: {
                        onChange(newValue) {
                            Controller.OnSubwayStantionChanged(newValue);
                        }
                    }
                },
                {
                    id: "SvcObjType",
                    name: "SvcObjType",
                    view: "richselect",
                    label: "Тип объекта",
                    labelWidth: 250,
                }
                // {
                //     view: "button",
                //     label: "Задачи",
                //     css:"webix_primary", 
                //     click: async () => Controller.OnShowTasksClick()
                // },
            ]
        };
    }
}