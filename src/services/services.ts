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
  },
});
