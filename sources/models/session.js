import { log } from "debug";

function status() {
    console.log("https://dev2.im-dispatcher.ru/api/v1/auth/status");
    return new Promise((resolve, reject) => {
        resolve("ok")
    })
}

function login(login, password) {
    let request_body = {
        login: login,
        password: password,
        returnUrl: "/"
    }
    console.log("https://dev2.im-dispatcher.ru/api/v1/auth/token");
    return webix.ajax()
        .headers({"Content-type": "application/json"})
        .post("https://dev2.im-dispatcher.ru/api/v1/auth/token", request_body)
}

function logout() {
    console.log("https://dev2.im-dispatcher.ru/api/v1/auth/logout");
    return new Promise((resolve, reject) => {
        resolve("ok")
    })
}

export default {
    status, login, logout
}