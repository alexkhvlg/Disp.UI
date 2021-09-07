'use strict';

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

async function my_fetch(url, method_name) {
    let response = await fetch(url, header(method_name));
    return await response.json();
}

export async function Dictionaries(name) {
    switch (name) {
        case "ClosingDescriptions":
            return await my_fetch("https://dev2.im-dispatcher.ru/api/v1/closingresults", 'GET');
        case "ClosingResults":
            return await my_fetch("https://dev2.im-dispatcher.ru/api/v1/closingresults", 'GET');
        case "ClusterCompanies":
            return await my_fetch("https://dev2.im-dispatcher.ru/api/v1/clustercompanies", 'GET');
        case "Companies":
            return await my_fetch("https://dev2.im-dispatcher.ru/api/v1/companies", 'GET');
        case "Files":
            return await my_fetch("/https://dev2.im-dispatcher.ru/api/v1/files", 'GET');
        case "GroupWorkTypes":
            return await my_fetch("https://dev2.im-dispatcher.ru/api/v1/groupworktypes", 'GET');
        case "Members":
            return await my_fetch("https://dev2.im-dispatcher.ru/api/v1/members", 'GET');
        case "Person":
            return await my_fetch("https://dev2.im-dispatcher.ru/api/v1/person", 'GET');
        case "Positions":
            return await my_fetch("https://dev2.im-dispatcher.ru/api/v1/positions", 'GET');
        case "Priorities":
            return await my_fetch("https://dev2.im-dispatcher.ru/api/v1/priorities", 'GET');
        case "Roles":
            return await my_fetch("https://dev2.im-dispatcher.ru/api/v1/roles", 'GET');
        case "Rules":
            return await my_fetch("https://dev2.im-dispatcher.ru/api/v1/rules", 'GET');
        case "ServiceAttributes":
            return await my_fetch("https://dev2.im-dispatcher.ru/api/v1/serviceattributes", 'GET');
        case "ServiceObjects":
            return await my_fetch("https://dev2.im-dispatcher.ru/api/v1/serviceobjects", 'GET');
        case "ServiceObjectTypes":
            return await my_fetch("https://dev2.im-dispatcher.ru/api/v1/serviceobjecttypes", 'GET');
        case "Stages":
            return await my_fetch("https://dev2.im-dispatcher.ru/api/v1/stages", 'GET');
        case "Stickers":
            return await my_fetch("https://dev2.im-dispatcher.ru/api/v1/stickers", 'GET');
        case "Tasks":
            return await my_fetch("https://dev2.im-dispatcher.ru/api/v1/tasks", 'GET');
        case "TaskTypes":
            return await my_fetch("https://dev2.im-dispatcher.ru/api/v1/tasktypes", 'GET');
        case "WorkTypes":
            return await my_fetch("https://dev2.im-dispatcher.ru/api/v1/worktypes", 'GET');
        default:
            return new Promise((reslove) => {
                reslove(null);
            });
    }
}