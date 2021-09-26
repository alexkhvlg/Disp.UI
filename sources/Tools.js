"use strict";

function get_baseUrl(url) {
    return "https://dev2.im-dispatcher.ru" + url;
}

function get_token() {
    return localStorage.getItem("accessToken");
}

function generate_header(method_name, body) {
    let json = null;
    if (body !== null) {
        json = JSON.stringify(body);
    }
    return {
        method: method_name,
        withCredentials: true,
        credentials: "include",
        headers: {
            "Authorization": "Bearer " + get_token(),
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
        body: json
    };
}

function my_fetch(method_name, url, body = null) {
    let response = fetch(get_baseUrl(url), generate_header(method_name, body));
    return response;
}

async function response_ok(response) {
    if (response.status == 200 || response.status == 201) {
        return false;
    }
    let title = "";
    let error = "";
    if (response.status >= 400 && response.status <= 499) {
        let errorJson = await response.json();
        console.log("response_ok ?");
        console.log(errorJson);
        title = errorJson.title;
        error = JSON.stringify(errorJson.errors);
    }
    else if (response.status >= 500 && response.status <= 599) {
        title = "Ошибка сервера";
        error = await response.text();
    }
    else {
        title = "Ошибка";
        error = await response.text();
    }
    webix.alert({
        title: title,
        text: error,
        type: "alert-error"
    });
    return true;
}

class DateISO8601 {
    static parser = webix.Date.strToDate("%c");
    static ToStr(value) {
        return DateISO8601.parser(value).toLocaleString();
    }
}

function PrintDebug(txt, ...args) {
    const newLocal = true;
    if (newLocal) {
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
    return new Date(s * 1e3).toLocaleString("ru-RU", options);
}

export { my_fetch, response_ok, DateISO8601, PrintDebug, SetComboValues, unix_to_date };