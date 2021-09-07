'use strict';

function status() {
    console.log("https://dev2.im-dispatcher.ru/api/v1/auth/status");
    return new Promise((resolve, reject) => {
        resolve(localStorage.getItem("accessToken"));
    });
}

function login(login, password) {
    let request_body = {
        login: login,
        password: password,
        returnUrl: "/"
    }
    console.log("https://dev2.im-dispatcher.ru/api/v1/auth/token");
    var result = webix.ajax()
        .headers({"Content-type": "application/json"})
        .post("https://dev2.im-dispatcher.ru/api/v1/auth/token", request_body)
        .then((a) => {
            let json = a.json();
            localStorage.setItem("accessToken", json.accessToken);
            return a;
        })
    return result;
}

function logout() {
    console.log("https://dev2.im-dispatcher.ru/api/v1/auth/logout");
    return new Promise((resolve, reject) => {
        localStorage.removeItem("accessToken");
        resolve("ok")
    })
}

export default {
    status, login, logout
}