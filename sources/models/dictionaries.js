"use strict";

import { my_fetch } from "../Tools";

async function LoadDictionary(name) {
    let result = "";
    switch (name) {
        case "ClosingDescriptions":
            result = await my_fetch("GET", "/api/v1/closingdescriptions");
            break;
        case "ClosingResults":
            result = await my_fetch("GET", "/api/v1/closingresults");
            break;
        case "ClusterCompanies":
            result = await my_fetch("GET", "/api/v1/clustercompanies");
            break;
        case "Companies":
            result = await my_fetch("GET", "/api/v1/companies");
            break;
        case "GroupWorkTypes":
            result = await my_fetch("GET", "/api/v1/groupworktypes");
            break;
        case "Members":
            result = await my_fetch("GET", "/api/v1/members");
            break;
        case "Person":
            result = await my_fetch("GET", "/api/v1/person");
            break;
        case "Positions":
            result = await my_fetch("GET", "/api/v1/positions");
            break;
        case "Priorities":
            result = await my_fetch("GET", "/api/v1/priorities");
            break;
        case "Roles":
            result = await my_fetch("GET", "/api/v1/roles");
            break;
        case "Rules":
            result = await my_fetch("GET", "/api/v1/rules");
            break;
        case "ServiceAttributes":
            result = await my_fetch("GET", "/api/v1/serviceattributes");
            break;
        case "ServiceObjects":
            result = await my_fetch("GET", "/api/v1/serviceobjects");
            break;
        case "ServiceObjectTypes":
            result = await my_fetch("GET", "/api/v1/serviceobjecttypes");
            break;
        case "Stages":
            result = await my_fetch("GET", "/api/v1/stages");
            break;
        case "Stickers":
            result = await my_fetch("GET", "/api/v1/stickers");
            break;
        case "Tasks":
            result = await my_fetch("GET", "/api/v1/tasks");
            break;
        case "TaskTypes":
            result = await my_fetch("GET", "/api/v1/tasktypes");
            break;
        case "WorkTypes":
            result = await my_fetch("GET", "/api/v1/worktypes");
            break;
    }
    localStorage.setItem(name, JSON.stringify(result));
    return result;
}

async function LoadDictionaries() {
    await LoadDictionary("ClusterCompanies");
    await LoadDictionary("Companies");
    await LoadDictionary("GroupWorkTypes");
    await LoadDictionary("Members");
    await LoadDictionary("Person");
    await LoadDictionary("Positions");
    await LoadDictionary("Priorities");
    await LoadDictionary("Roles");
    await LoadDictionary("Rules");
    await LoadDictionary("ServiceAttributes");
    await LoadDictionary("ServiceObjects");
    await LoadDictionary("ServiceObjectTypes");
    await LoadDictionary("Stages");
    await LoadDictionary("Stickers");
    await LoadDictionary("TaskTypes");
    await LoadDictionary("WorkTypes");
}

function ClearDictionary(name) {
    localStorage.removeItem(name);
}

function ClearDictionaries() {
    ClearDictionary("ClusterCompanies");
    ClearDictionary("Companies");
    ClearDictionary("GroupWorkTypes");
    ClearDictionary("Members");
    ClearDictionary("Person");
    ClearDictionary("Positions");
    ClearDictionary("Priorities");
    ClearDictionary("Roles");
    ClearDictionary("Rules");
    ClearDictionary("ServiceAttributes");
    ClearDictionary("ServiceObjects");
    ClearDictionary("ServiceObjectTypes");
    ClearDictionary("Stages");
    ClearDictionary("Stickers");
    ClearDictionary("TaskTypes");
    ClearDictionary("WorkTypes");
}

export { LoadDictionaries, ClearDictionaries };