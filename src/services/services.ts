import axios from "axios";

var baseURL: string = "";

if (import.meta.env.MODE === "development")
  baseURL = "http://localhost/tracker-t6/";
else baseURL = "/tracker-t6/";

export const apiClient = axios.create({
  baseURL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});
