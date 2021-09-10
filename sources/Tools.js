"use strict";

function header(method_name) {
    let token = localStorage.getItem("accessToken");
    return {
        method: method_name,
        withCredentials: true,
        credentials: 'include',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }
    };
}

async function my_fetch(method_name, url) {
    let response = await fetch(url, header(method_name));
    return await response.json();
}

async function GetRest(url, parameter = null) {
    let _url = url;
    if (parameter !== null) {
        _url = url + "?" + new URLSearchParams(parameter).toString();
    }

    let message = null;
    let waitMessageShowed = false;

    try {
        let timeoutPromise = new Promise((resolve) => setTimeout(resolve, 2500, "timeoutPromise"));
        let fetchPromise = fetch(_url, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        });


        let firstExecutedPromise = await Promise.any([fetchPromise, timeoutPromise]);
        if (firstExecutedPromise == "timeoutPromise") {
            waitMessageShowed = true;
            message = webix.message("Пожалуйста подождите", "info", -1, "waitmessage");
        }

        const response = await fetchPromise;
        if (response.ok) {
            return await response.json();
        }
        else {
            let text = await response.text();
            throw text;
        }
    }
    finally {
        if (waitMessageShowed) {
            webix.message.hide(message);
        }
    }
}

async function PostRest(url, parameter = null) {
    let json = null;
    if (parameter !== null) {
        json = JSON.stringify(parameter);
    }

    let message = null;
    let waitMessageShowed = false;

    try {
        let timeoutPromise = new Promise((resolve) => setTimeout(resolve, 2500, "timeoutPromise"));
        let fetchPromise = fetch(url, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: json
        });

        let firstExecutedPromise = await Promise.any([fetchPromise, timeoutPromise]);
        if (firstExecutedPromise == "timeoutPromise") {
            waitMessageShowed = true;
            message = webix.message("Пожалуйста подождите", "info", -1, "waitmessage");
        }

        const response = await fetchPromise;
        return await response.json();
    }
    finally {
        if (waitMessageShowed) {
            webix.message.hide(message);
        }
    }
}

async function DeleteRest(url, parameter = null) {
    let _url = url;
    if (parameter !== null) {
        _url = url + "?" + new URLSearchParams(parameter).toString();
    }

    let message = null;
    let waitMessageShowed = false;

    try {
        let timeoutPromise = new Promise((resolve) => setTimeout(resolve, 2500, "timeoutPromise"));
        let fetchPromise = fetch(_url, {
            method: "DELETE",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        });


        let firstExecutedPromise = await Promise.any([fetchPromise, timeoutPromise]);
        if (firstExecutedPromise == "timeoutPromise") {
            waitMessageShowed = true;
            message = webix.message("Пожалуйста подождите", "info", -1, "waitmessage");
        }

        const response = await fetchPromise;
        if (response.ok) {
            return await response.json();
        }
        else {
            let text = await response.text();
            throw text;
        }
    }
    finally {
        if (waitMessageShowed) {
            webix.message.hide(message);
        }
    }
}

function ui(name) {
    var w = webix.$$(name);
    if (w == null || w == undefined) {
        var msg = "Элемент " + name + " не найден. Обратитесь к разработчику.";
        throw msg;
    }
    else {
        return w;
    }
}

class DateISO8601 {
    static parser = webix.Date.strToDate("%c");
    static ToStr(value) {
        return DateISO8601.parser(value).toLocaleString();
    }
}

function PrintDebug(txt, ...args) {
    if (true) {
        console.log("DEBUG |", txt, ...args);
    }
}

function SetComboValues(id, values) {
    var combo = ui(id);
    combo.define("options", values);
    if (Array.isArray(values)) {
        if (values.length > 0) {
            combo.setValue(values[0]);
        }
    }
    combo.refresh();
}

function unix_to_date(s, options) {
    return new Date(s * 1e3).toLocaleString('ru-RU', options);
}

async function PerformAsync(id, func) {
    PrintDebug("PerformAsync: ", id);
    let result = null;
    let control = ui(id);
    control.disable();

    webix.extend(control, webix.ProgressBar);
    control.showProgress({
        type: "top",
        hide: false
    });

    try {
        result = await func(control);
        return result;
    }
    catch (err) {
        console.error(err);
        webix.alert({
            title: "Ошибка",
            text: err.length <= 10 ? err : "Подробности в консоли",
            type: "alert-error"
        });
        throw err;
    }
    finally {
        control.enable();
        control.hideProgress();
    }
}

export { my_fetch, GetRest, PostRest, DeleteRest, ui, DateISO8601, PrintDebug, SetComboValues, unix_to_date, PerformAsync };