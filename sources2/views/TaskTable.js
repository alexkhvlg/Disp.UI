"use restrict";

import { JetView } from "webix-jet";
import Controller from "Controller";
import { unix_to_date } from "Tools";

export default class TaskTable extends JetView {
    config() {
        return {
            view: "datatable",
            id: "UsersTasksGrid",
            select: "row",
            resizeColumn: true,
            css: "webix_header_border webix_data_border",
            // footer: true,
            columns: [
                { id: "id", header: "№", sort: "int"/*, footer: {text: "Всего", colspan:10}*/ },
                // { id: "client_name", header: "Заявитель", sort: "string" },
                // { id: "client_phone", header: "Телефон", sort: "int" },
                { id: "date", header: "Дата", sort: "string", format: value => unix_to_date(value) },
                { id: "assigned_user_id", header: "Исполнитель", sort: "string", format: value => Controller.UserIdToStr(value) },
                { id: "title", header: "Заголовок", sort: "string" },
                // { id: "text", header: "Текст задачи", fillspace: true, sort: "string" },
                { id: "type_id", header: "Вид работы", sort: "string", format: value => Controller.TypeIdToStr(value) },
                // { id: "priority", header: "Приоритет", sort: "string" },
                // { id: "status", header: "Статус", sort: "string" },
                // { id: "assigned_organization", header: "Организация", sort: "string" },
                {
                    id: "stage", header: "Этап", sort: "string", format: value => Controller.StageToStr(value)
                },
            ],
            on: {
                onItemClick: (id, e, node) => this.ShowDetailWindow(id, e, node),
                onItemDblClick: (id, e, node) => this.ShowDetailWindow(id, e, node)
            }
        };
    }

    ShowDetailWindow(id) {
        let task_info = $$("UsersTasksGrid").getItem(id.row);
        Controller.taskDetailsWindow.Show(task_info);
    }
}