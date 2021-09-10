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

async function my_fetch(method_name, url) {
    let response = await fetch(url, header(method_name));
    return await response.json();
}

async function Dictionaries(name) {
    let result = "";
    switch (name) {
        case "ClosingDescriptions":
            result = await my_fetch("GET", "https://dev2.im-dispatcher.ru/api/v1/closingdescriptions");
            break;
        case "ClosingResults":
            result = await my_fetch("GET", "https://dev2.im-dispatcher.ru/api/v1/closingresults");
            break;
        case "ClusterCompanies":
            result = await my_fetch("GET", "https://dev2.im-dispatcher.ru/api/v1/clustercompanies");
            break;
        case "Companies":
            result = await my_fetch("GET", "https://dev2.im-dispatcher.ru/api/v1/companies");
            break;
        case "GroupWorkTypes":
            result = await my_fetch("GET", "https://dev2.im-dispatcher.ru/api/v1/groupworktypes");
            break;
        case "Members":
            result = await my_fetch("GET", "https://dev2.im-dispatcher.ru/api/v1/members");
            break;
        case "Person":
            result = await my_fetch("GET", "https://dev2.im-dispatcher.ru/api/v1/person");
            break;
        case "Positions":
            result = await my_fetch("GET", "https://dev2.im-dispatcher.ru/api/v1/positions");
            break;
        case "Priorities":
            result = await my_fetch("GET", "https://dev2.im-dispatcher.ru/api/v1/priorities");
            break;
        case "Roles":
            result = await my_fetch("GET", "https://dev2.im-dispatcher.ru/api/v1/roles");
            break;
        case "Rules":
            result = await my_fetch("GET", "https://dev2.im-dispatcher.ru/api/v1/rules");
            break;
        case "ServiceAttributes":
            result = await my_fetch("GET", "https://dev2.im-dispatcher.ru/api/v1/serviceattributes");
            break;
        case "ServiceObjects":
            result = await my_fetch("GET", "https://dev2.im-dispatcher.ru/api/v1/serviceobjects");
            break;
        case "ServiceObjectTypes":
            result = await my_fetch("GET", "https://dev2.im-dispatcher.ru/api/v1/serviceobjecttypes");
            break;
        case "Stages":
            result = await my_fetch("GET", "https://dev2.im-dispatcher.ru/api/v1/stages");
            break;
        case "Stickers":
            result = await my_fetch("GET", "https://dev2.im-dispatcher.ru/api/v1/stickers");
            break;
        case "Tasks":
            result = await my_fetch("GET", "https://dev2.im-dispatcher.ru/api/v1/tasks");
            break;
        case "TaskTypes":
            result = await my_fetch("GET", "https://dev2.im-dispatcher.ru/api/v1/tasktypes");
            break;
        case "WorkTypes":
            result = await my_fetch("GET", "https://dev2.im-dispatcher.ru/api/v1/worktypes");
            break;
    }
    localStorage.setItem(name, JSON.stringify(result));
    return result;
}

export async function LoadDictionaries() {
    console.log("Loading dictionaries..");
    let ClusterCompanies = await Dictionaries("ClusterCompanies");
    let Companies = await Dictionaries("Companies");
    let GroupWorkTypes = await Dictionaries("GroupWorkTypes");
    let Members = await Dictionaries("Members");
    let Person = await Dictionaries("Person");
    let Positions = await Dictionaries("Positions");
    let Priorities = await Dictionaries("Priorities");
    let Roles = await Dictionaries("Roles");
    let Rules = await Dictionaries("Rules");
    let ServiceAttributes = await Dictionaries("ServiceAttributes");
    let ServiceObjects = await Dictionaries("ServiceObjects");
    let ServiceObjectTypes = await Dictionaries("ServiceObjectTypes");
    let Stages = await Dictionaries("Stages");
    let Stickers = await Dictionaries("Stickers");
    let TaskTypes = await Dictionaries("TaskTypes");
    let WorkTypes = await Dictionaries("WorkTypes");
    console.log("done");
}