"use strict";

import { LoadDictionaries } from "./dictionaries";

function status() {
    return new Promise((resolve) => {
        resolve(localStorage.getItem("accessToken"));
    });
}

async function login(login, password) {
    let request_body = {
        login: login,
        password: password,
        returnUrl: "/"
    };
    var response = await webix.ajax()
        .headers({"Content-type": "application/json"})
        .post("https://dev2.im-dispatcher.ru/api/v1/auth/token", request_body);
    var json = await response.json();
    localStorage.setItem("accessToken", json.accessToken);

    await LoadDictionaries();

    return json;
}

function logout() {
    return new Promise((resolve) => {
        localStorage.removeItem("accessToken");
        resolve("ok");
    });
}

export default {
    status, login, logout
};