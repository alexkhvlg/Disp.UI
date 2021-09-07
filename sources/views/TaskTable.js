"use restrict";

import { JetView } from "webix-jet";

export default class TaskTable extends JetView {
    config() {
        return {
            view: "datatable",
            id: "UsersTasksGrid",
            select: "row",
            resizeColumn: true,
            css: "webix_header_border webix_data_border",
            footer: true,
            columns: [
                { id: "number", header: "№", sort: "int"/*, footer: {text: "Всего", colspan:10}*/ },
                { id: "createDate", header: "Дата", sort: "string", format: value => unix_to_date(value) },
                { id: "executorId", header: "Исполнитель", sort: "string", format: value => Controller.UserIdToStr(value) },
                { id: "description", header: "Текст задачи", fillspace: true, sort: "string" },
                { id: "workTypeId", header: "Вид работы", sort: "string", format: value => Controller.TypeIdToStr(value) },
                // { id: "priorityId", header: "Приоритет", sort: "string" },
                // { id: "companyUserExecutorId", header: "Организация", sort: "string" },
                {
                    id: "stageId", header: "Этап", sort: "string", format: value => Controller.StageToStr(value)
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