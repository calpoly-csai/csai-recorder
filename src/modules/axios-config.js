import axios from "axios";

axios.defaults.baseURL = "https://data-temp.calpolycsai.com:7000";
axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";
