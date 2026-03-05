import axios from "axios";

var baseURL: string = "";

if (import.meta.env.MODE === "development")
    baseURL = "http://localhost:3136/";
else baseURL = "/";

export const apiClient = axios.create({
    baseURL,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
        "Access-Control-Allow-Origin": "*",
        crossDomain: true,
    },
    transformRequest: (data, _headers) => {
        if (data === null) data = {};

        return JSON.stringify(data);
    },
    transformResponse: (data) => {
        data = JSON.parse(data);

        return data;
    },
});
