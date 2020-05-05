/*
对ajax层进行一次封装，便于统一处理请求的成功、失败和登录跳转逻辑
同时也可以统一ajax的用法，不会根据用的什么库修改发送ajax的逻辑，
统一在这里修改就行
*/


/**
 * 新ajax请求方法,之前的ajax方法废弃(不推荐使用)
 * @param url url
 * @param requestParam 请求参数
 * @param successFunc 成功回调函数
 * @param errorFunc 失败回调函数
 */
function fetch(url, requestParam, successFunc, errorFunc) {

    let defaultSuccessFunc = (data) => {
        console.log("默认成功回调函数,data:" + JSON.stringify(data));
    };
    let defaultErrorFunc = (data) => {
        console.log("默认失败回调函数,data:" + JSON.stringify(data));
        // alert("网络异常:"+JSON.stringify(data));
    };

    successFunc = successFunc || defaultSuccessFunc;
    errorFunc = errorFunc || defaultErrorFunc;
    // 拼装post要提交的数据
    let body = _fn.urlEncode(requestParam);
    if (body.length > 0 && "&" === body.substring(0, 1)) {
        body = body.substr(1);
    }

    return  fetch(url, {
        method: "post",     // get/post
        mode: "cors",       // same-origin/no-cors/cors
        cache: "no-cache",  // 不缓存
        credentials: 'include',//傳送cookie
        headers: {
            "Content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "Accept":"application/json; charset=UTF-8",
        },
        body: body,
    })
        .then(function (response) {
            if (response.status === 200) {
                console.log("response:" + response);
                return response.json();
            }
        })
        .then(function (data) {
            //权限统一拦截
            return successFunc(data);
        })
        .catch(function (error) {
            errorFunc(error);
        });
}
/**
 * 下载文件
 * @param url 文件地址
 * @return {Promise<Blob>}
 */
 function fetchDownloadFile(url) {
    return fetch(url, {credentials: 'include'})
        .then(res => res.blob().then(blob => {
            let a = document.createElement('a');
            let url = window.URL.createObjectURL(blob);   // 获取 blob 本地文件连接 (blob 为纯二进制对象，不能够直接保存到磁盘上)
            let disposition = res.headers.get('Content-Disposition');
            let filename = "";
            if (disposition && disposition.match(/attachment/)) {
                filename = disposition.replace(/.*filename=/, '').replace(/"/g, '');

            }

            a.href = url;
            filename = (filename && filename !== '') ? decodeURI(filename) : 'file';
            a.download = filename;
            a.click();
            window.URL.revokeObjectURL(url);
        }));

}
/**
 * 新ajax请求方法,之前的ajax方法废弃(不推荐使用),字节流提交表单
 * @param url url
 * @param requestParam 请求参数
 * @param successFunc 成功回调函数
 * @param errorFunc 失败回调函数
 */
 function  fetchMultipart(url, requestParam, successFunc, errorFunc) {

    let defaultSuccessFunc = (data) => {
        console.log("默认成功回调函数,data:" + JSON.stringify(data));
    };
    let defaultErrorFunc = (data) => {
        console.log("默认失败回调函数,data:" + JSON.stringify(data));
    };

    successFunc = successFunc || defaultSuccessFunc;
    errorFunc = errorFunc || defaultSuccessFunc;
    // 拼装post要提交的数据

    let body = _fn.objectToFormData(requestParam)

    return fetch(url, {
        method: "post",     // get/post
        mode: "cors",       // same-origin/no-cors/cors
        cache: "no-cache",  // 不缓存
        credentials: 'include',//傳送cookie
        body: body,
    })
        .then(function (response) {
            if (response.status === 200) {
                console.log("response:" + response);
                return response.json();
            }
        })
        .then(function (data) {
            //权限统一拦截
            return  successFunc(data);
        })
        .catch(function (error) {
            errorFunc(error);
        });
}
let   _fn = {
    //解决options
    objectToFormData: function (obj, form, namespace) {
        const fd = form || new FormData();

        for (let property in obj) {
            if (obj.hasOwnProperty(property)) {
                let tempItem = obj[property];

                if (Array.isArray(tempItem)) {
                    //数组
                    let length = obj.length;
                    //for循环
                    for (let index in tempItem) {
                        let formKey;
                        let key = "[" + index + "]";
                        if (namespace) {
                            formKey = namespace + key;
                        } else {
                            formKey = property + key;
                        }

                        let indexItem = tempItem[index];

                        // if the property is an object, but not a File, use recursivity.
                        if (typeof indexItem === 'object' && !(indexItem instanceof File)) {
                            _fn.objectToFormData(indexItem, fd, formKey);
                        } else {

                            // if it's a string or a File object
                            fd.append(formKey, indexItem);
                        }

                    }

                } else {
                    //对象

                    let key = "." + property;
                    let formKey;
                    if (namespace) {
                        formKey = namespace + key;
                    } else {
                        formKey = property;
                    }

                    // if the property is an object, but not a File, use recursivity.
                    if (typeof obj[property] === 'object' && !(obj[property] instanceof File)) {
                        _fn.objectToFormData(tempItem, fd, formKey);
                    } else {

                        // if it's a string or a File object
                        fd.append(formKey, tempItem);
                    }
                }


            }
        }

        return fd;

    },
    urlEncode: function (param, key, encode) {
        if (param == null) return '';
        let paramStr = '';
        let t = typeof (param);
        if (t === 'string' || t === 'number' || t === 'boolean') {

            paramStr += '&' + key + '=' + ((encode == null || encode) ? encodeURIComponent(param) : param);
        } else {
            for (let i in param) {
                let k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i)
                paramStr += _fn.urlEncode(param[i], k, encode)
            }
        }
        return paramStr;

    },
    // 装饰参数
    decorateParam: function (param) {
        return param;
    },


}

export default fetch;
