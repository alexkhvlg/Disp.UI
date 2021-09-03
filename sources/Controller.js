"use restrict";

import RegisterYandexMap from "yandexmap";
import { GetRest, PostRest, DeleteRest, ui, PrintDebug, SetComboValues, PerformAsync, unix_to_date } from "Tools";
import { LoginWindow } from "views/LoginWindow";
import { TasksWindow } from "views/TasksWindow";
import { ConfigWindow } from "views/ConfigWindow";
import { TaskDetailsWindow } from "views/TaskDetailsWindow";
import { NewTaskWindow } from "views/NewTaskWindow";
import { TimeLineWindow } from "views/TimeLineWindow";

import MapClass from "Map";

class Controller {
    #LoginWindowId;
    #TasksWindowId;
    #ConfigWindowId;
    #TaskDetailsWindowId;
    #NewTaskWindowId;

    #SubwayList;
    #IsShowAllSubwayLines;

    #IsOnEveryIntervalBusy;

    constructor() {
        this.#LoginWindowId = "LoginWindow";
        this.#TasksWindowId = "TasksWindow";
        this.#ConfigWindowId = "ConfigWindow";
        this.#TaskDetailsWindowId = "TaskDetailsWindow";
        this.#NewTaskWindowId = "NewTaskWindow";
        this.#IsShowAllSubwayLines = false;
        this.#IsOnEveryIntervalBusy = false;
    }

    AddApp(app) {
        PrintDebug("AddApp");
        this.app = app;
        this.map = new MapClass();
        RegisterYandexMap();
    }

    AddMainView(mainView) {
        PrintDebug("AddMainView");
        this.mainView = mainView;
    }

    async OnAppMainViewInit() {
        PrintDebug("OnAppMainViewInit");
        this.loginWindow = new LoginWindow(this.mainView, this.#LoginWindowId);
        this.tasksWindow = new TasksWindow(this.mainView, this.#TasksWindowId);
        this.configWindow = new ConfigWindow(this.mainView, this.#ConfigWindowId);
        this.taskDetailsWindow = new TaskDetailsWindow(this.mainView, this.#TaskDetailsWindowId);
        this.newTaskWindow = new NewTaskWindow(this.mainView, this.#NewTaskWindowId);
        this.timeLineWindow = new TimeLineWindow(this.mainView);
    }

    IsAuthorized() {
        var result = webix.storage.session.get("IsAuthorized");
        PrintDebug("IsAuthorized: ", result);
        return result;
    }

    async OnAppLoaded() {
        PrintDebug("OnAppLoaded");

        // Wait for yandex map widget
        await ymaps.ready(async () => {
            this.map.Init("map", this.#SubwayList);

            try {
                this.#SubwayList = await this.LoadSubways();
                this.map.SetSubwayList(this.#SubwayList);
            }
            catch (err) {
                console.error(err);
            }

            this.map.DrawSubwayLines();

            if (this.IsAuthorized()) {
                this.AfterLogin();
            }
            else {
                // this.loginWindow.Show("Вход в МосМетро");
            }
        });
    }

    ShowHideControls(isShow) {
        PrintDebug("ShowHideControls: ", isShow);
        const widgets = ["LogoutButton", "sidebar_layout", "sidebar_toggle"];
        if (webix.storage.session.get("RoleId") == 8) {
            widgets.push("ConfigButton");
        }

        widgets.forEach(widget => {
            var w = ui(widget);
            if (w != null) {
                if (isShow) {
                    w.show();
                }
                else {
                    w.hide();
                }
            }
        });
        const anti_widgets = ["LoginButton"];
        anti_widgets.forEach(widget => {
            var w = ui(widget);
            if (w != null) {
                if (isShow) {
                    w.hide();
                }
                else {
                    w.show();
                }
            }
        });
    }

    ShowLoginWindow() {
        PrintDebug("ShowLoginWindow");
        this.loginWindow.Show("Вход");
    }

    // async OnLoginClick() {
    //     PrintDebug("OnLoginClick");
    //     let login_form = this.loginWindow.GetLoginForm();
    //     if (login_form.validate()) {
    //         await PerformAsync(this.#LoginWindowId, async (control) => {
    //             let loginData = { login: login_form.getValues().username, password: login_form.getValues().password };
    //             let authResult = await PostRest("api/auth", loginData);
    //             if (authResult.token == null) {
    //                 webix.alert({
    //                     title: "Внимание",
    //                     text: authResult.error_msg,
    //                     type: "alert-error"
    //                 });
    //             } else {
    //                 webix.storage.session.put("IsAuthorized", true);
    //                 webix.storage.session.put("Token", authResult.token);
    //                 webix.storage.session.put("UserId", authResult.id);
    //                 webix.storage.session.put("Login", authResult.login);
    //                 webix.storage.session.put("RoleId", authResult.role_id);
    //                 webix.storage.session.put("DepartmentId", authResult.department_id);
    //                 control.hide();
    //                 await this.AfterLogin();
    //             }
    //         });
    //     }
    // }

    async AfterLogin() {
        PrintDebug("AfterLogin");

        this.ShowHideControls(true);

        this.map.FitToViewport();

        await PerformAsync("app", async () => this.Dict = await this.LoadData());

        this.IntervalId = setInterval(() => {
            this.OnEveryInterval();
        }, 1000 * 60);

        this.ChangeLayer(webix.storage.session.get("CurrentLayer") ?? "users-type-all-menu-item");
        // this.CurrentTab = webix.storage.session.get("CurrentTab") ?? "SubwayFilter";

        // Set 'show_all_subways' toggle
        // this.#IsShowAllSubwayLines = webix.storage.session.get("show_all_subways") ?? true;
        // if (this.#IsShowAllSubwayLines) {
        //     var toggle = ui("show_all_subways");
        //     toggle.setValue(this.#IsShowAllSubwayLines ? 1 : 0);
        // }
        // else {
        //     this.OnShowAllSubwaysToggle(0);
        // }

        // ui("tabbar").setValue(this.CurrentTab);
        // // this.OnTabChanged(this.CurrentTab);

        // SetComboValues("UsersPositions", this.Dict.positions.map(function (item) {
        //     return {
        //         id: item.id,
        //         value: item.name
        //     }
        // }));
        // this.CurrentUserPositionId = this.Dict.positions[0].id;

        // SetComboValues("SvcObjType", this.Dict.svc_types.map(function (item) {
        //     return {
        //         id: item.id,
        //         value: item.name
        //     }
        // }));
    }

    ChangeLayer(layer_id) {
        PrintDebug("ChangeLayer: ", layer_id);
        ui("sidebar").select(layer_id);
    }

    OnLayerChanged(id) {
        var layer_id = ui("sidebar").getSelectedId();
        PrintDebug("OnLayerChanged: ", id, layer_id);

        this.CurrentLayer = layer_id;
        webix.storage.session.put("CurrentLayer", this.CurrentLayer);
        this.map.SetCenter();
        this.OnEveryInterval();
    }

    AfterLogout() {
        clearInterval(this.IntervalId);
        PrintDebug("AfterLogout");
        this.ShowHideControls(false);
        location.reload();
    }

    async LoadSubways() {
        PrintDebug("LoadSubways");
        var result = new Map();
        var subways = await GetRest("api/subways");
        subways.forEach(line => {
            var stations = new Map();
            line.Stations.forEach(station => {
                stations.set(station.Id, {
                    id: station.Id,
                    name: station.Name,
                    lat: station.Lat,
                    lng: station.Lng
                });
            });
            result.set(line.Id, {
                id: line.Id,
                name: line.Name,
                color: line.Color,
                geom: line.Geom,
                stations: stations
            });
        });

        return result;
    }

    SetComboItems(id, values) {
        PrintDebug("SetComboItems: ", id);
        if (values == null) {
            values = [];
        }
        var combo = ui(id);
        combo.define("options", values);
        if (values.length > 0) {
            var item_id;
            if (id == "subway_lines") {
                item_id = webix.storage.session.get("current_subway_line_id");
            }
            else if (id == "subway_stantions") {
                item_id = webix.storage.session.get("current_subway_station_id");
            }
            if (item_id == null) {
                item_id = values[0].id;
            }
            combo.setValue(item_id);
        }
        combo.refresh();
    }

    async SetSubwayLines() {
        PrintDebug("SetSubwayLines");
        var lines = [...this.#SubwayList].map(([, value]) => {
            return {
                id: value.id,
                value: value.name,
                color: value.color
            };
        })
            .sort((a, b) => {
                return a.value.localeCompare(b.value);
            });

        this.SetComboItems("subway_lines", lines);

        if (this.#IsShowAllSubwayLines) {
            this.map.DrawAllSubwayLines((id) => this.OnSubwayLineClick(id), (id) => this.OnStationClick(id));
        }
        else {
            var line = this.#SubwayList.get(webix.storage.session.get("current_subway_line_id"));
            this.map.DrawOneSubwayLine(line, (id) => this.OnSubwayLineClick(id), (id) => this.OnStationClick(id));
        }
    }

    OnSubwayLineChanged(line_id) {
        PrintDebug("OnSubwayLineChanged: ", line_id);
        webix.storage.session.put("current_subway_line_id", line_id);

        var line = this.#SubwayList.get(line_id);
        if (line != undefined) {
            var stations = [...line.stations].map(([, value]) => {
                return {
                    id: value.id,
                    value: value.name
                };
            });
            this.SetComboItems("subway_stantions", stations);
        }
        else {
            this.SetComboItems("subway_stantions", null);
        }

        if (!this.#IsShowAllSubwayLines) {
            this.map.DrawOneSubwayLine(line, (id) => this.OnSubwayLineClick(id), (id) => this.OnStationClick(id));
        }

    }

    OnSubwayStantionChanged(line_and_station) {
        PrintDebug("OnSubwayStantionChanged: ", line_and_station);

        webix.storage.session.put("current_subway_station_id", line_and_station);

        // var line_id = line_and_station.split(".")[0];
        // var line = this.#SubwayList.get(line_id);
        // var station = line.stations.get(line_and_station);
        this.map.SelectStation(line_and_station);
    }

    OnSubwayLineClick(line) {
        PrintDebug("OnSubwayLineClick");
        var combo = ui("subway_lines");
        combo.setValue(line);
    }

    OnStationClick(line_and_station) {
        PrintDebug("OnStationClick");

        var line_id = line_and_station.split(".")[0];
        var combo1 = ui("subway_lines");
        combo1.setValue(line_id);

        var combo2 = ui("subway_stantions");
        combo2.setValue(line_and_station);

        var line = this.#SubwayList.get(line_id);
        var station = line.stations.get(line_and_station);
        PrintDebug("station: ", station);
    }

    OnShowAllSubwaysToggle(value) {
        PrintDebug("OnShowAllSubwaysToggle: ", value);
        this.#IsShowAllSubwayLines = value == 1 ? true : false;
        webix.storage.session.put("show_all_subways", this.#IsShowAllSubwayLines);

        if (this.CurrentTab == "SubwayFilter") {
            if (this.#IsShowAllSubwayLines) {
                this.SetSubwayLines();
            }
            else {
                this.SetSubwayLines();
                this.OnSubwayLineChanged(webix.storage.session.get("current_subway_line_id"));
            }
        }
    }

    OnPointClick() {
        PrintDebug("OnShowTasksClick");
        var line_and_station = ui("subway_stantions").getValue();

        var line_id = line_and_station.split(".")[0];
        var line = this.#SubwayList.get(line_id);
        var station = line.stations.get(line_and_station);

        this.tasksWindow.Show("Задачи " + line.name + " линия. Станция " + station.name);
    }

    async OnShowConfigClick() {
        PrintDebug("OnShowConfigClick");
        await this.configWindow.Show("Настройки");
    }

    async SaveCommonConfig(common_config) {
        PrintDebug("SaveCommonConfig");
        await PostRest("api/config/common", common_config);
        webix.message({
            type: "success",
            text: "Сохранено",
            expire: 1000
        });
    }

    async LoadData() {
        PrintDebug("LoadData");
        let params = { token: webix.storage.session.get("Token") };
        return {
            svc_types: await GetRest("api/get_service_objects_types", params),
            positions: await GetRest("api/get_positions", params),
            positions_for_users: await GetRest("api/get_positions_for_users", params),
            work_types: await GetRest("api/dictionaries/work_types", params),
            users: await GetRest("api/dictionaries/users", params),
            organizations: await GetRest("api/dictionaries/organizations", params),
            priorities: await GetRest("api/dictionaries/priorities", params),
            statuses: await GetRest("api/dictionaries/statuses", params),
            common_config: await GetRest("api/config/common", params),
        };
    }

    async OnEveryInterval() {
        PrintDebug("OnEveryInterval: ", this.CurrentLayer);
        if (this.IsAuthorized()) {
            if (!this.#IsOnEveryIntervalBusy) {
                this.#IsOnEveryIntervalBusy = true;

                try {
                    // var now = new Date();
                    // console.log("Date now:", now);

                    switch (this.CurrentLayer) {
                        case "users-type-all-menu-item":
                            this.UsersTasks = await GetRest("api/tasks/get_last_task_per_user?token=" + webix.storage.session.get("Token"));
                            this.map.ShowUsersOnMap(this.UsersTasks.filter(i => i.type_id != this.Dict.common_config.EndWorkTypeId), (id) => this.OnPointClick(id));
                            break;

                        case "users-type1-menu-item":
                            this.UsersTasks = await GetRest("api/tasks/get_last_task_per_user?token=" + webix.storage.session.get("Token"));
                            this.UsersTasks = this.UsersTasks.filter((task) => {
                                // var user = this.GetUserInfoById(task.user_id);
                                // var task_date = new Date(task.date * 1e3);
                                // console.log(user.name, "-", task_date);

                                var position = this.UserIdToPosition(task.assigned_user_id);
                                return (task.type_id != this.Dict.common_config.EndWorkTypeId) && (position.id == 1 || position.id == 4);
                            });
                            this.map.ShowUsersOnMap(this.UsersTasks, (id) => this.OnPointClick(id));
                            break;

                        case "users-type2-menu-item":
                            this.UsersTasks = await GetRest("api/tasks/get_last_task_per_user?token=" + webix.storage.session.get("Token"));
                            this.UsersTasks = this.UsersTasks.filter((task) => {
                                var position = this.UserIdToPosition(task.assigned_user_id);
                                return (task.type_id != this.Dict.common_config.EndWorkTypeId) && (position.id == 2 || position.id == 5);
                            });
                            this.map.ShowUsersOnMap(this.UsersTasks, (id) => this.OnPointClick(id));
                            break;

                        case "elevators-menu-item":
                            this.Elevators = await GetRest("api/get_elevators?token=" + webix.storage.session.get("Token"));
                            this.map.ShowElevatorsOnMap(this.Elevators, (id) => this.OnElevatorClick(id));
                            break;

                        default:
                            this.map.ShowElevatorsOnMap([], null);
                            throw "ERROR | this.CurrentLayer invalid value: " + this.CurrentLayer;
                            break;
                    }
                }
                catch (err) {
                    console.error(err);
                }

                this.#IsOnEveryIntervalBusy = false;
            }
        }
    }

    OnPointClick(task) {
        PrintDebug("OnPointClick: ", task);
        // this.taskDetailsWindow.Show(task);
    }

    OnElevatorClick(elevator) {
        PrintDebug("OnElevatorClick: ", elevator);
    }

    async OnTabChanged(tab_id) {
        PrintDebug("OnTabChanged: ", tab_id);
        this.CurrentTab = tab_id;
        webix.storage.session.put("CurrentTab", this.CurrentTab);

        var grid = ui("UsersTasksGrid");
        grid.clearAll();

        if (this.CurrentTab == "SubwayFilter") {
            // Set comboboxes and draw on map
            await this.SetSubwayLines();
        }
        else if (this.CurrentTab == "UsersFilter") {
            if (this.UsersTasks != null) {
                this.map.ShowUsersOnMap(this.UsersTasks, (id) => this.OnPointClick(id));
            }
            else {
                await this.OnEveryInterval();
            }
        } else if (this.CurrentTab == "SvcObjsFilter") {
            this.map.ShowSvcObjsOnMap();
        }
    }

    async OnNewTaskClick() {
        PrintDebug("OnNewTaskClick: ", this.CurrentTab);
        if (this.CurrentTab == "SubwayFilter") {
            webix.alert({
                title: "Информация",
                text: "В разработке"
            });
        }
        else if (this.CurrentTab == "UsersFilter") {
            webix.alert({
                title: "Информация",
                text: "В разработке"
            });
        } else if (this.CurrentTab == "SvcObjsFilter") {
            webix.alert({
                title: "Информация",
                text: "В разработке"
            });
        }

        // this.newTaskWindow.Show("Новая задача");
    }

    async OnSearchTasksClick() {
        PrintDebug("OnSearchTasksClick: ", this.CurrentTab);
        if (this.CurrentTab == "SubwayFilter") {
            webix.alert({
                title: "Информация",
                text: "В разработке"
            });
        }
        else if (this.CurrentTab == "UsersFilter") {
            await PerformAsync("sidebar", async (control) => {
                var tasks = await GetRest("api/tasks/get_tasks_by_user_position?token=" + webix.storage.session.get("Token") + "&userPosition=" + this.CurrentUserPositionId);
                this.FillTaskGrid(tasks);
            })
        } else if (this.CurrentTab == "SvcObjsFilter") {
            webix.alert({
                title: "Информация",
                text: "В разработке"
            });
        }
    }

    async OnUsersPositionsChanged(position_id) {
        PrintDebug("OnUsersPositionsChanged: ", position_id);
        this.CurrentUserPositionId = position_id;
        var grid = ui("UsersTasksGrid");
        grid.clearAll();
    }

    FillTaskGrid(task_list) {
        var grid = ui("UsersTasksGrid");
        grid.clearAll();
        grid.parse(task_list);
    }

    StageToStr(stage) {
        switch (stage) {
            case 0: return "новая";
            case 1: return "в работе";
            case 2: return "завершена";
            default: return stage;
        }
    }

    UserIdToStr(user_id) {
        var user = this.Dict.users.find((item) => { return item.id == user_id });
        return user.fio;
    }

    TypeIdToStr(type_id) {
        var work_type = this.Dict.work_types.find((item) => { return item.id == type_id });
        return work_type.value;
    }

    UserIdToPosition(user_id) {
        var position_for_user = this.Dict.positions_for_users.find((item) => { return item.user_id == user_id });
        var position = this.Dict.positions.find((item) => { return item.id == position_for_user?.position_id });
        return position;
    }

    UserIdToPositionStr(user_id) {
        var position_for_user = this.Dict.positions_for_users.find((item) => { return item.user_id == user_id });
        var position = this.Dict.positions.find((item) => { return item.id == position_for_user?.position_id });
        return position.name;
    }

    GetUserInfoById(user_id) {
        var user = this.Dict.users.find((item) => { return item.id == user_id });
        var position_for_user = this.Dict.positions_for_users.find((item) => { return item.user_id == user_id });
        var position = this.Dict.positions.find((item) => { return item.id == position_for_user.position_id });
        return {
            name: user.name,
            fio: user.fio,
            phone: user.phone,
            position: position.name
        };
    }

    GetStation(line_id, station_id) {
        var line = this.#SubwayList.get(line_id + "");
        var line_and_station = line_id + "." + station_id
        var station = line.stations.get(line_and_station);
        return station;
    }
}

export default (new Controller);