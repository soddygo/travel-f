/*
对ajax层进行一次封装，便于统一处理请求的成功、失败和登录跳转逻辑
同时也可以统一ajax的用法，不会根据用的什么库修改发送ajax的逻辑，
统一在这里修改就行
*/
import { message } from 'antd';

var componentAjax = require('component-ajax');
var utils = require('./index');

var successCode="1|200",
	notLoginCode="-99|-1";

function ajax(url,data,successCallback,completeCallback,method,faillCallback,dataType,processData,headers,intercepte){
	var dataType=dataType||"json";
	var method=method||"post";
	var processData=(processData!=undefined||processData!=null)?processData:true;
    var intercepte=(intercepte!=undefined||intercepte!=null)?intercepte:true;

	if(processData){
		if(method=="get" && typeof data != "string"){
			data=utils.urlParamsObjTranslator(data);
		}
	}

    componentAjax({
		url:url,
		data:data,
		dataType:dataType,
        timeout:30*1000,
        contentType:utils.isJSON(data)?'application/json':'application/x-www-form-urlencoded',
		success:function (json) {
		    if(intercepte){
                let status=String(json.status||json.resultcode||json.code);
                //console.log('request succeeded with json response', json);
                if(new RegExp(status).test(successCode)){
                    successCallback&&successCallback(json);
                }else if(new RegExp(status).test(notLoginCode)){
                    if(window.app&&window.app.loginUrl){
                        window.location.href=window.app.loginUrl;
                    }else{
                        message.warning('没有配置window.app.loginUrl，请手动跳转到登录页');
                    }
                }else{
                    if(typeof faillCallback === "function"){
                        faillCallback&&faillCallback(json);
                    }else{
                        message.warning((json.detail||json.message||json.msg).substr(0,100)||"请求失败！");
                    }
                }
            }else{
                successCallback&&successCallback(json);
            }
        },
        complete:function (data) {
            completeCallback&&completeCallback(data);
        },
		type:method,
	});
}

export default ajax;