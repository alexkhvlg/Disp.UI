"use strict";

import { my_fetch, response_ok } from "../Tools";

const DictNames = {
    ClosingDescriptions: "ClosingDescriptions",
    ClosingResults: "ClosingResults",
    ClusterCompanies: "ClusterCompanies",
    Companies: "Companies",
    GroupWorkTypes: "GroupWorkTypes",
    Members: "Members",
    Persons: "Persons",
    Positions: "Positions",
    Priorities: "Priorities",
    Roles: "Roles",
    Rules: "Rules",
    ServiceAttributes: "ServiceAttributes",
    ServiceObjects: "ServiceObjects",
    ServiceObjectTypes: "ServiceObjectTypes",
    Stages: "Stages",
    Stickers: "Stickers",
    TaskTypes: "TaskTypes",
    WorkTypes: "WorkTypes"
};

let DictUrls = {};
DictUrls[DictNames.ClosingDescriptions] = "/api/v1/closingdescriptions";
DictUrls[DictNames.ClosingResults] = "/api/v1/closingresults";
DictUrls[DictNames.ClusterCompanies] = "/api/v1/clustercompanies";
DictUrls[DictNames.Companies] = "/api/v1/companies";
DictUrls[DictNames.GroupWorkTypes] = "/api/v1/groupworktypes";
DictUrls[DictNames.Members] = "/api/v1/members";
DictUrls[DictNames.Persons] = "/api/v1/person";
DictUrls[DictNames.Positions] = "/api/v1/positions";
DictUrls[DictNames.Priorities] = "/api/v1/priorities";
DictUrls[DictNames.Roles] = "/api/v1/roles";
DictUrls[DictNames.Rules] = "/api/v1/rules";
DictUrls[DictNames.ServiceAttributes] = "/api/v1/serviceattributes";
DictUrls[DictNames.ServiceObjects] = "/api/v1/serviceobjects";
DictUrls[DictNames.ServiceObjectTypes] = "/api/v1/serviceobjecttypes";
DictUrls[DictNames.Stages] = "/api/v1/stages";
DictUrls[DictNames.Stickers] = "/api/v1/stickers";
DictUrls[DictNames.TaskTypes] = "/api/v1/tasktypes";
DictUrls[DictNames.WorkTypes] = "/api/v1/worktypes";

async function LoadDictionary(name) {
    let response = await my_fetch("GET", DictUrls[name]);
    if (!await response_ok(response)) {
        let json = await response.json();
        let result = JSON.stringify(json);
        localStorage.setItem(name, result);
    }
}

async function LoadDictionaries() {
    console.log("LoadDictionaries");
    for (const key in DictNames) {
        const name = DictNames[key];
        await LoadDictionary(name);
    }
    console.log("ok");
}

function ClearDictionary(name) {
    localStorage.removeItem(name);
}

function ClearDictionaries() {
    for (const key in DictNames) {
        if (Object.hasOwnProperty.call(DictNames, key)) {
            const name = DictNames[key];
            ClearDictionary(name);
        }
    }
}

function SaveDict(name, list) {
    localStorage.removeItem(name);
    localStorage.setItem(name, JSON.stringify(list));
}

function GetDict(name) {
    console.log("GetDict: " + name);
    return localStorage.getItem(name);
}

export { LoadDictionaries, ClearDictionaries, DictNames, SaveDict, GetDict, DictUrls };