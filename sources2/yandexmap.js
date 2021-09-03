export default function RegisterYandexMap() {
    webix.protoUI({
        name: "yandex-map",
        defaults: {
            zoom: 5,
            center: [55.76, 37.64],
            mapType: "yandex#map",
            controls: ["default"],
            version: "2.1",
            lang: "ru-RU",
            load: ["package.full"],
            minZoom: 0,
            maxZoom: 23,
            apikey: false
        },
        $init: function () {
            this.$view.innerHTML = "<div class='webix_map_content' style='width:100%;height:100%'></div>";
            this._contentobj = this.$view.firstChild;

            this._waitMap = webix.promise.defer();
            this.$ready.push(this.render);
        },
        getMap: function (waitMap) {
            return waitMap ? this._waitMap : this._map;
        },
        render: function () {

            if (typeof ymaps !== "undefined" || this.config.cdn === false) {
                this._initMap();
                return;
            }

            console.log("yandex map rendered");

            var cfg = this.config;
            var cdn = cfg.cdn ? cfg.cdn : "https://api-maps.yandex.ru/";

            // configuring request
            var requireMap = cdn + cfg.version + "/?lang=" + cfg.lang;
            requireMap += "&load=" + cfg.load.join(",");
            if (cfg.apikey) {
                requireMap += "&apikey=" + cfg.apikey;
            }

            webix.require([requireMap])
                .then(webix.bind(this._initMap, this))
                .catch(function (e) {
                    console.error(e);
                });
        },
        _initMap: function () {

            var c = this.config;

            ymaps.ready(
                webix.bind(function () {
                    this._map = new ymaps.Map(this._contentobj, {
                        center: c.center,
                        zoom: c.zoom,
                        type: c.mapType,
                        controls: c.controls
                    }, {
                        minZoom: c.minZoom,
                        maxZoom: c.maxZoom
                    });
                    this._waitMap.resolve(this._map);
                    webix._ldYMap = null;
                }, this)
            );
        },
        center_setter: function (config) {
            if (this._map) {
                this._map.setCenter(config);
            }

            return config;
        },
        mapType_setter: function (config) {
            //yadex#map, yadex#satellite, yadex#hybrid, yadex#publicMap
            if (this._map) {
                this._map.setType(config);
            }

            return config;
        },
        zoom_setter: function (config) {
            if (this._map) {
                this._map.setZoom(config);
            }

            return config;
        }
    }, webix.ui.view);
}