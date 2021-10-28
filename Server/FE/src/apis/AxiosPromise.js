import axios from 'axios';
import {url} from '../utils/urls';


function createInstance() {
    const token = localStorage.getItem('access_token');
    return axios.create({
        baseURL: url,
        headers: {common: {"Authorization": `Bearer ${token}`}}
    });
}

/**
 * Fetch api helper
 * @param method GET,POST,PUT,PATCH,DELETE
 * @param url
 * @param arg is query if GET,DELETE, otherwise body
 * @returns {Promise<*>} Promise result:
 *
 *      If error network then null;
 *      Else : {error, status, origin}
 *          error: error text with \n
 *          status: code <can be null>
 *          origin: data receiver
 */
export async function fetchApi(method, url, arg) {


    const instance = createInstance();

    let result = null
    switch (method.toLowerCase()) {
        case "get":
            result = instance.get(url, {params: arg});
            break;
        case "post":
            result = instance.post(url, arg);
            break;
        case "put":
            result = instance.put(url, arg);
            break;
        case "patch":
            result = instance.patch(url, arg);
            break;
        case "delete":
            result = instance.delete(url, {params: arg});
            break;
        default:
            throw new Error("Support only GET,POST,PUT,PATCH,DELETE method");
    }

    return result
        .then(resp => {
          return resp.data
        })
        .catch(err => {
            if (!err.response)
                throw null;
            if (err.response.data) {
                let tmp = err.response.data;
                if (Array.isArray(tmp)) {
                    let tmpText = "";
                    tmp.forEach(x => tmpText += x.message + "\n");
                    tmp = tmpText;
                } else {
                    tmp = tmp.message;
                }
                throw {error: tmp, status: err.response.status, origin: err.response.data}
            }
            throw {error: ["Error axios"]};
        })
}