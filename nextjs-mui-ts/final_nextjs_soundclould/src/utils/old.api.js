import queryString from 'query-string';

export const sendRequestJS = async (props) => {
    let {
        url,
        method,
        body,
        queryParams = {},
        useCredentials = false,
        headers = {},
        nextOption = {}
    } = props;

    const options = {
        method: method,
        // by default setting the content-type to be json type
        headers: new Headers({ 'content-type': 'application/json', ...headers }),
        body: body ? JSON.stringify(body) : null,
        ...nextOption
    };



    if (useCredentials) options.credentials = "include";  // useCredentials là để gửi cookie từ clien lên phía server, và server có thể đọc được cookie


    if (queryParams) {
        url = `${url}?${queryString.stringify(queryParams)}`; // dòng này là để nối tham só trên thanh url (để có được đấu ? và dấu &) users?current=2&pageSize=1
    }

    return fetch(url, options).then(res => {
        if (res.ok) {
            return res.json();
        } else {
            return res.json().then(function (json) {
                // to be able to access error status when you catch the error 
                return {
                    statusCode: res.status,
                    message: json?.message ?? "",
                    error: json?.error ?? ""
                };
            });
        }
    });
};