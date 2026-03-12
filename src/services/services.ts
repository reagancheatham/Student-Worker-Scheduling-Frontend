import axios from "axios";

var baseURL: string = "";

if (import.meta.env.MODE === "development")
    baseURL = "http://localhost/workerscheduling-t6/";
else baseURL = "/workerscheduling-t6/";

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
        try {
            return JSON.parse(data);
        } catch {
            return data;
        }
    },
});
