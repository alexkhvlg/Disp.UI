import { log } from "debug";

function status() {
    console.log("status");
    return webix.ajax()
        .headers({"Content-type": "application/json"})
        .get("https://dev2.im-dispatcher.ru/swagger/v1/swagger.json")
}

function login(login, password) {
    let request_body = {
        login: login,
        password: password,
        returnUrl: "/"
    }
    return webix.ajax()
        .headers({"Content-type": "application/json"})
        .post("https://dev2.im-dispatcher.ru/api/v1/auth/token", request_body)
}

function logout() {
    return webix.ajax()
        .headers({"Content-type": "application/json"})
        .get("https://dev2.im-dispatcher.ru/swagger/v1/swagger.json")
}

export default {
    status, login, logout
}