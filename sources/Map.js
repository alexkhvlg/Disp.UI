import Controller from "Controller";
import { PrintDebug, unix_to_date } from "Tools";

export default class Map {
    #map;
    #PointCollection;
    #LinesCollection;
    #ObjectsCollection;
    #SubwayList;
    #SelectedStation;

    Init(view_id, subway_list) {
        PrintDebug("map.Init", view_id);
        this.#map = webix.$$(view_id).getMap();
        this.#SubwayList = subway_list;
        // Fix map size
        this.FitToViewport();

        var ButtonLayout = ymaps.templateLayoutFactory.createClass([
            '<div class="webix_view webix_control webix_el_button webix_primary" ',
            'style="display: inline-block; vertical-align: top; border-width: 0px; ',
            'margin-top: 2px; margin-left: 4px; width: 80px; height: 38px;">',
            '<div class="webix_el_box" style="width:80px; height:38px">',
            '<button type="button" class="webix_button" style="text-align: center">{{ data.content }}</button>',
            '</div>',
            '</div>',
        ].join(''));

        this.goBackButton = new ymaps.control.Button({
            data: {
                content: "Назад"
            },
            options: {
                float: "left",
                layout: ButtonLayout,
                selectOnClick: false,
                visible: false
            }
        });

        this.goBackButton.events.add("click", () => {
            this.SetCenter();
        });

        this.#map.controls.add(this.goBackButton);

        this.#map.events.add('boundschange', (e) => {
            var newZoom = e.get('newZoom');
            var oldZoom = e.get('oldZoom');
            if (newZoom !== oldZoom) {
                // console.log("map zoom:", newZoom);
                if (newZoom != 10) {
                    this.goBackButton.options.set("visible", true);
                }
                else {
                    this.goBackButton.options.set("visible", false);
                }
            }
        })

        if (this.#PointCollection == undefined) {
            this.#PointCollection = new ymaps.GeoObjectCollection(null, {
                iconLayout: 'default#image',
                iconImageHref: 'img/station.svg',
                iconImageSize: [15, 15],
                iconImageOffset: [-7, -7],
                hintCloseTimeout: null
            });
            this.#PointCollection.events.add(['mouseenter', 'mouseleave'], (e) => {
                if (e.get('target').properties.get('id') != this.#SelectedStation) {
                    if (e.get('type') == 'mouseenter') {
                        e.get('target').options.set('iconImageHref', 'img/station_hover.svg')
                    } else {
                        e.get('target').options.set('iconImageHref', 'img/station.svg')
                    }
                }
            });
        }
        if (this.#LinesCollection == undefined) {
            this.#LinesCollection = new ymaps.GeoObjectCollection();
        }
        if (this.#ObjectsCollection == undefined) {
            this.#ObjectsCollection = new ymaps.Clusterer(
                {
                    gridSize: 48,
                    // groupByCoordinates: false,
                    // clusterHideIconOnBalloonOpen: false
                    zoomMargin: 16
                }
            );
        }
    }

    FitToViewport() {
        PrintDebug("map.FitToViewport");
        this.#map.container.fitToViewport();
    }

    SetCenter() {
        this.#map.setCenter([55.74, 37.64], 11);
    }

    SetSubwayList(list) {
        PrintDebug("map.SetSubwayList");
        this.#SubwayList = list;
    }

    DrawSubwayLines() {
        PrintDebug("map.DrawSubwayLines");
        this.#LinesCollection.removeAll();
        this.#SubwayList.forEach((value) => {
            this.AddSubwayLineOnMap(value, null);
        });
        this.#map.geoObjects.add(this.#LinesCollection);
    }

    DrawAllSubwayLines(OnLineClickHandler, OnStationClickHandler) {
        PrintDebug("map.DrawAllSubwayLines");
        this.#PointCollection?.removeAll();
        this.#LinesCollection?.removeAll();
        this.#ObjectsCollection?.removeAll();

        this.#SubwayList.forEach((line) => {
            this.AddSubwayLineOnMap(line, OnLineClickHandler);

            line.stations.forEach((station) => {
                this.AddSubwayStationOnMap(station, line.color, OnStationClickHandler);
            });
        });

        this.#map.geoObjects.add(this.#LinesCollection);
        this.#map.geoObjects.add(this.#PointCollection);
    }

    DrawOneSubwayLine(line, OnLineClickHandler, OnStationClickHandler) {
        PrintDebug("map.DrawOneSubwayLine");
        this.#LinesCollection?.removeAll();
        this.#PointCollection?.removeAll();
        this.#ObjectsCollection?.removeAll();

        if (line != undefined) {
            this.AddSubwayLineOnMap(line, OnLineClickHandler);
            line.stations.forEach((value) => {
                this.AddSubwayStationOnMap(value, line.color, OnStationClickHandler);
            });
        }
        this.#map.geoObjects.add(this.#LinesCollection);
        this.#map.geoObjects.add(this.#PointCollection);
    }

    AddSubwayLineOnMap(line, event_handler) {
        var polyline = new ymaps.Polyline(
            line.geom,
            {
                hintContent: line.name
            },
            {
                strokeColor: line.color,
                strokeWidth: 7,
                strokeOpacity: 0.9
            }
        );
        if (event_handler != null) {
            polyline.events.add("click", () => {
                event_handler(line.id);
            });
        }
        this.#LinesCollection.add(polyline);
    }

    AddSubwayStationOnMap(station, subway_line_color, event_handler) {
        // var placemark = new ymaps.Placemark([station.lat, station.lng], {
        //     hintContent: station.name
        // }, {
        //     // preset: "islands#circleIcon",
        //     // iconColor: "#" + subway_line_color,

        //     iconLayout: 'default#image',
        //     iconImageHref: 'img/station.svg',
        //     iconImageSize: [15, 15],
        //     iconImageOffset: [-7, -7]
        // });

        var placemark = new ymaps.GeoObject(
            // feature
            {
                // feature.geometry
                geometry: {
                    type: "Point",
                    coordinates: [station.lat, station.lng]
                },
                // feature.properties
                properties: {
                    hintContent: station.name,
                    id: station.id
                }
            },
            // options
            // {
            // iconLayout: 'default#image',
            // iconImageHref: 'img/station.svg',
            // iconImageSize: [15, 15],
            // iconImageOffset: [-7, -7],
            // hintCloseTimeout: null
            // }
        );

        if (this.#SelectedStation == station.id) {
            placemark.options.set('iconImageHref', 'img/station_selected.svg')
        }
        if (event_handler != null) {
            placemark.events.add("click", () => {
                event_handler(station.id);
            });
        }
        this.#PointCollection.add(placemark);
    }

    async ShowUsersOnMap(tasks, event_handler) {
        PrintDebug("map.ShowUsersOnMap");
        // this.#LinesCollection?.removeAll();
        this.#PointCollection?.removeAll();
        this.#ObjectsCollection?.removeAll();
        // this.DrawSubwayLines();

        if (Array.isArray(tasks)) {
            tasks.forEach((task) => {
                var line = this.#SubwayList.get(task.subway_line_id.toString());
                var station = line.stations.get(task.subway_line_id + "." + task.station_id);
                var user = Controller.GetUserInfoById(task.user_id);
                var workTypeStr = "";
                if (Controller.Dict.common_config.BeginWorkTypeId == task.type_id) {
                    workTypeStr = "Начало смены";
                }
                else if (Controller.Dict.common_config.MovedWorkTypeId == task.type_id) {
                    workTypeStr = "Перемещение";
                }
                else if (Controller.Dict.common_config.EndWorkTypeId == task.type_id) {
                    workTypeStr = "Конец смены";
                }
                else {
                    workTypeStr = task.type_id;
                }

                var preset = "islands#blackStretchyIcon";
                var position = Controller.UserIdToPosition(task.user_id);
                if (position.id == 1 || position.id == 4) {
                    preset = "islands#greenStretchyIcon";
                }
                else if (position.id == 2 || position.id == 5) {
                    preset = "islands#blueStretchyIcon";
                }

                var timeline_button =
                    "<div class='webix_view webix_control webix_el_button webix_primary webix_el_box' style='width:90px; height:38px; margin-left: -3px;'>" +
                    "<button type='button' class='webix_button' onclick='$$(\"TimeLineWindow\").$scope.Show(" + JSON.stringify(task) + ")'>История</button>" +
                    "</div>";

                var date_options = {
                    hour12: false,
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    weekday: "short"
                };

                var body =
                    "<div>" +
                    "<b>" + workTypeStr + "</b>.&nbsp;" +
                    "<b>" + unix_to_date(task.date, date_options) + "</b>" +
                    "<br>ФИО: " + user.fio +
                    "<br>Должность: " + user.position +
                    "<br>Телефон: " + user.phone +
                    "<br>Логин: " + user.name +
                    "</div>" + timeline_button;

                var footer =
                    "<span style='color: #777;'>" +
                    "<table cellspacing='0' cellpadding='0'>" +
                    "<tr><td>ш:</td><td>" + station.lat.toFixed(4) + "</td></tr>" +
                    "<tr><td>д:</td><td>" + station.lng.toFixed(4) + "</td></tr>" +
                    "</table>" +
                    "</span>";

                var placemark = new ymaps.GeoObject(
                    // feature
                    {
                        // feature.geometry
                        geometry: {
                            type: "Point",
                            coordinates: [station.lat, station.lng]
                        },

                        // feature.properties
                        properties: {
                            balloonContentHeader: user.fio,
                            balloonContentBody: body,
                            balloonContentFooter: footer,
                            iconContent: user.position,
                            iconCaption: user.position,
                            hintContent: user.fio
                        }
                    },
                    // options
                    {
                        preset: preset,
                        // preset: "islands#glyphIcon",
                        // iconGlyphColor: "#" + line.color,
                        // iconColor: "#" + line.color,
                        // fillColor: "#" + line.color,
                        hintCloseTimeout: null
                    }
                );
                if (event_handler != null) {
                    placemark.events.add("click", () => {
                        event_handler(task);
                    });
                }
                this.#ObjectsCollection.add(placemark);
            });
        }
        this.#map.geoObjects.add(this.#ObjectsCollection);
    }

    async ShowElevatorsOnMap(elevators, event_handler) {
        PrintDebug("map.ShowElevatorsOnMap");
        // this.#LinesCollection?.removeAll();
        this.#PointCollection?.removeAll();
        this.#ObjectsCollection?.removeAll();
        // this.DrawSubwayLines();

        if (Array.isArray(elevators)) {
            elevators.forEach((elevator) => {
                // var line = this.#SubwayList.get(elevator.line_id.toString());

                var footer =
                    "<span style='color: #777;'>" +
                    "<table cellspacing='0' cellpadding='0'>" +
                    "<tr><td>ш:</td><td>" + elevator.lat.toFixed(4) + "</td></tr>" +
                    "<tr><td>д:</td><td>" + elevator.lng.toFixed(4) + "</td></tr>" +
                    "</table>" +
                    "</span>";

                var placemark = new ymaps.GeoObject(
                    // feature
                    {
                        // feature.geometry
                        geometry: {
                            type: "Point",
                            coordinates: [elevator.lat, elevator.lng]
                        },
                        // feature.properties
                        properties: {
                            balloonContentHeader: elevator.name,
                            balloonContentBody: "Серийный номер: " + elevator.serial_number +
                                "<br>Макс. высота: " + elevator.top_height + " м." +
                                "<br>Грузоподъемность: " + elevator.max_weight + " кг." +
                                "<br>Год выпуска: " + elevator.made_year + " г.",
                            balloonContentFooter: footer,
                            // iconContent: elevator.name,
                            iconCaption: elevator.name,
                            hintContent: elevator.name
                        }
                    },
                    // options
                    {
                        preset: "islands#blackIcon",
                        // preset: "islands#glyphIcon",
                        // iconColor: "#" + line.color,
                        hintCloseTimeout: null
                    }
                );
                if (event_handler != null) {
                    placemark.events.add("click", () => {
                        event_handler(elevator);
                    });
                }
                this.#ObjectsCollection.add(placemark);
            });
        }
        this.#map.geoObjects.add(this.#ObjectsCollection);
    }

    async ShowSvcObjsOnMap(tasks, event_handler) {
        PrintDebug("map.ShowSvcObjsOnMap");
        this.#LinesCollection?.removeAll();
        this.#PointCollection?.removeAll();
        this.#ObjectsCollection?.removeAll();
        this.DrawSubwayLines();
    }

    SelectStation(id) {
        PrintDebug("map.SelectStation", id);
        // Сперва убрать выделение на прошлой станции
        this.#PointCollection.each((o) => {
            if (o.properties.get('id') == this.#SelectedStation) {
                o.options.set('iconImageHref', 'img/station.svg')
            }
        });

        // Выделить новую станцию
        this.#SelectedStation = id;
        this.#PointCollection.each((o) => {
            if (o.properties.get('id') == id) {
                o.options.set('iconImageHref', 'img/station_selected.svg')
            }
        });
    }
}