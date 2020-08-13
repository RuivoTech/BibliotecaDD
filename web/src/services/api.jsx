import axios from "axios";

const api = axios.create({
    baseURL: "https://api.ruivotech.com.br"
});

export default api;