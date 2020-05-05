"use strict"
import moment from 'moment';
import { Tree,TreeSelect } from 'antd';
const TreeNode = Tree.TreeNode;
const TreeNodeSel = TreeSelect.TreeNode;
const React = require('react');

window.moment=moment;

function gatherTreeNodesField (data,gatherField,flagName,flagValue) {
    let result=[];

    data.map(item=>{
        if(Boolean(item[flagName])===flagValue){
            result.push(item[gatherField])
        }
        if (item.children&&item.children.length>0) {
            result=result.concat(gatherTreeNodesField (item.children,gatherField,flagName,flagValue));
        }
    });

    return result;

}

function renderTreeNodes (data) {

    return data.map((item) => {
        if (item.children&&item.children.length>0) {
            return (
                <TreeNode title={item.name} key={item.id} dataRef={item} value={item.id}>
                    {renderTreeNodes(item.children)}
                </TreeNode>
            );
        }
        return <TreeNode title={item.name} key={item.id} dataRef={item} value={item.id}></TreeNode>;
    });
}
function renderSelectTreeNodes (data) {

    return data.map((item) => {
        if (item.children&&item.children.length>0) {
            return (
                <TreeNodeSel
                    title={item.name}
                    key={item.id}
                    value={item.id}
                    dataRef={item}
                >
                    {renderSelectTreeNodes(item.children)}
                </TreeNodeSel>
            );
        }
        return (
            <TreeNodeSel
                title={item.name}
                key={item.id}
                value={item.id}
                dataRef={item} />
        )
    });
};

function renderTreeNodesCheckbox (data, flag, flagValue) {
    if (typeof data == 'undefined' || data.length == 0) {
        return;
    }
    return data.map((item) => {
        if (item.children) {
            return (
                <TreeNodeSel title={item.name} disabled={item[flag] == flagValue ? false : true} key={item.id}
                             value={item.id} dataRef={item}>
                    {renderTreeNodesCheckbox(item.children, flag, flagValue)}
                </TreeNodeSel>
            );
        }
        return <TreeNodeSel title={item.name} disabled={item[flag] == flagValue ? false : true} key={item.id}
                            value={item.id} dataRef={item}></TreeNodeSel>
    });
};

function normalizeToCamels(str) {
    //user_id => userId or UserId
    //userId => UserId
    var result = [];
    if (/\_/g.test(str)) {
        var tmp = str.split('_');
        tmp.forEach(function (letters, index) {
            if (index == 0) {
                result.push(letters);
            } else {
                result.push(normalizeToCapitals(letters));
            }
        });
    } else {
        result.push(str);
    }

    return result.join('');
}

function normalizeToCapitals(str) {
    var first = str[0].toUpperCase();
    var last = str.substring(1, str.length);

    return first + last;
}

function checkPrivilege(model,type){
    var result=false;
    if(window.app.privileges && window.app.privileges.length>0){
        window.app.privileges.map(function (privilege) {
            if(privilege[1]==model && privilege[2]==type){
                result=true;
                return;
            }
        });
    }
    return result;
}
var validatePhone = function (rule, value, callback){
    if(value && /^1[0-9]{10}$/.test(value)) {
        callback();
    }else {
        callback(new Error('请输入正确格式的手机'));

    }
};

var validateEmail = function (rule, value, callback){
    if(value && /^[0-9a-zA-Z\-\_]{1,}@[a-z0-9]{1,}\.[a-z]{1,}$/.test(value)) {
        callback();
    }else {
        callback(new Error('请输入正确格式的email'));
    }
};

function normalizeRole(key) {
    var roleMap={
        role_super:'超级管理员',
        role_manager:'通付盾管理员',
        role_inspector:'通付盾业务监测员',
        role_enterprise_manager:'企业管理员',
        role_enterprise_inspector:'企业业务监测员',
    };

    return roleMap[key]||'未知';
}

function getQueryString(name, url) {
    var str = url || document.location.search || document.location.hash,
        result = null;

    if (!name || str === '') {
        return result;
    }

    result = str.match(
        new RegExp('(^|&|[\?#])' + name + '=([^&]*)(&|$)')
    );

    return result === null ? result : decodeURIComponent(result[2]);
}
function getDescendantantProp(obj, desc) {
    var arr = desc.split('.');
    while(arr.length) {
        obj = obj[arr.shift()];
    }
    return obj;
}
// this.write = function(p, d) {
//     p = p.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
//     p = p.replace(/^\./, ''); // strip leading dot
//     // Split the path to an array and assaign the object
//     // to a local variable
//     var ps = p.split(this.seperator), co = this.o;
//
//     // Iterate over the paths, skipping the last one
//     for(var i = 0; i < ps.length - 1; i++)
//     {
//         // Grab the next path's value, creating an empty
//         // object if it does not exist
//         co = (co[ps[i]])? co[ps[i]] : co[ps[i]] = {};
//     }
//
//     // Assign the value to the object's last path
//     co[ps[ps.length - 1]] = d;
// }
// this.read = function(p) {
//     p = p.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
//     p = p.replace(/^\./, ''); // strip leading dot
//     var ps = p.split(this.seperator), co = this.o;
//     /*
//     for(var i = 0; i < ps.length; i++)
//     {
//         co = (co[ps[i]])? co[ps[i]] : co[ps[i]] = {};
//     }
//     */
//     while (ps.length) {
//         var n = ps.shift();
//         if (n in co) {
//             co = co[n];
//         } else {
//             return;
//         }
//     }
//     return co;
// }
function getArrayDescendantProp(obj, desc) {
    desc = desc.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    desc = desc.replace(/^\./, ''); // strip leading dot
    let descArray = desc.split('.');
    while (descArray.length) {
        var key = descArray.shift();
        if (key in obj) {
            obj = obj[key];
        } else {
            return;
        }
    }
    return obj;
}
function setArrayDescendantProp(obj, desc, value) {
    desc = desc.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    desc = desc.replace(/^\./, ''); // strip leading dot
    // Split the path to an array and assaign the object
    // to a local variable
    let  descArray = desc.split('.');

    // Iterate over the paths, skipping the last one
    for(var i = 0; i < descArray.length - 1; i++){
        // Grab the next path's value, creating an empty
        // object if it does not exist
        obj = (obj[descArray[i]])? obj[descArray[i]] : obj[descArray[i]] = {};
    }

    // Assign the value to the object's last path
    obj[descArray[descArray.length - 1]] = value;
}
function setDescendantProp(obj, desc, value) {
    var arr = desc.split('.');
    while (arr.length > 1) {
        obj = obj[arr.shift()];
    }
    obj[arr[0]] = value;
}

function urlParamsObjTranslator(data,type){
    var type=type||'objToUrl';
    var result=null;

    if(type=='urlToObj'){
        //a=1&b=2&c=3  =>  {a:1,b:2,c:3}
        if(typeof data == 'string'){
            var dataArray=data.split('&');
            result={};
            for(var i=0;i<dataArray.length;i++){
                var dataStr=dataArray[i],
                    dataKey=dataStr.split('=')[0],
                    dataValue=dataStr.split('=')[1];

                result[dataKey]=dataValue;
            }
        }else{
            console.log('urlToObj方式，data必须为a=x&b=xx格式字符串');
        }
    }else{
        //objToUrl方式 {a:1,b:2,c:3}  => a=1&b=2&c=3
        result=[];
        if(typeof data == 'object') {
            for (var key in data) {
                if(data[key]){
                    //如果值不存在，则不放在请求参数里，todo 可能需要改
                    //防止发送的参数值有特殊字符导致发送请求的时候丢失，需要encodeURIComponent处理一下
                    var tmpStr=key+'='+encodeURIComponent(data[key]);
                    result.push(tmpStr);
                }
            }
            result=result.join('&');
        }else{
            console.log('objToUrl方式，data必须为对象！');
        }
    }

    return result;
}

let handleInput = (e,attr,vm,callback) => {
    let _this=this;
    let value;

    if(!attr){
        let event = e;
        let elem = event.target;
        value = elem.value;
        if(elem.attributes['data-model'] != null){
            attr = elem.dataset.model;
        }
    }else{//select 直接传值
        value = e;
    }

    if(attr){
        setDescendantProp(vm,attr,value);
    }

    callback&&callback();
};
let handleArrayObjInput = (value,arrayAttr,index,key,vm,callback) => {
    let _this=this;

    if(arrayAttr){
        let arrayObj=getDescendantantProp(vm,arrayAttr);
        arrayObj[index][key]=value;
    }

    callback&&callback();
};

let handleArrayInput = (value,arrayAttr,index,vm,callback) => {
    let _this=this;

    if(arrayAttr){
        let arrayObj=getDescendantantProp(vm,arrayAttr);
        arrayObj[index]=value;
    }

    callback&&callback();
};
let handleBlur = (e, attr,vm) => {
    let _this = this;
    let value;
    if (!attr) {
        let event = e;
        let elem = event.target;
        value = elem.value;
        if (elem.attributes['data-model'] != null) {
            attr = elem.dataset.model;
        }
    } else {
        value = e;
    }

    if (attr && value) {
        let tmpObj = {};
        let model=attr.split('.')[0];
        attr = attr.split('.')[1];
        tmpObj[attr] = value;
        vm[model+'Validator'].validate(tmpObj, (errors, fields) => {
            if (fields&&fields[attr]) {
                vm[model+'Errors'][attr] = fields[attr];


                return;
            }
            // validation passed
            vm[model+'Errors'][attr] = [];
        });

        vm[model+'Dirtys'][attr]=true;
    }else if(attr){
        let model=attr.split('.')[0];
        attr = attr.split('.')[1];

        vm[model+'Dirtys'][attr]=false;
    }
};
let handleHelp = (attr,vm) => {
    let _this=this;
    let model=attr.split('.')[0];
    let field=attr.split('.')[1];

    return vm[model+'Errors'][field].length>0?vm[model+'Errors'][field][0].message:''
};
let handleValidateStatus = (attr,vm) => {
    let _this = this;
    let model=attr.split('.')[0];
    let field=attr.split('.')[1];
    let successFlag=vm[model+'Dirtys'][field]?'success':'';

    return vm[model+'Errors'][field].length > 0 ? 'error' : successFlag;
};

const schema = require('async-validator');

function initForm (form,modelName){
    var result={};

    result[modelName]={};
    result[modelName+'Default']={};
    result[modelName+'Errors']={};
    result[modelName+'Dirtys']={};
    var validator={};

    Object.keys(form).map((key)=>{
        result[modelName][key]=form[key].value;
        result[modelName+'Default'][key]=form[key].value;
        result[modelName+'Dirtys'][key]=false;

        if(form[key].rules&&form[key].rules.length>0){
            result[modelName+'Errors'][key]=[];
            validator[key]=form[key].rules;
        }
    });

    if(Object.keys(validator).length>0){
        result[modelName+'Validator']=new schema(validator);
    }

    return result;
};

function resetForm (vm,modelName){
    Object.keys(vm[modelName]).map((key)=>{
        vm[modelName][key]=vm[modelName+'Default'][key];
        vm[modelName+'Dirtys'][key]=false;
    });
};
function validateFields (vm,modelName,callback){
    vm[modelName+'Validator'].validate(mobx.toJS(vm[modelName]), (errors, fields) => {
        if (errors) {
            for (let key in fields) {
                vm[modelName+'Errors'][key] = fields[key];
            }
            return;
        }
        //reset form validate
        Object.keys(vm[modelName]).map((key)=>{
            vm[modelName+'Errors'][key]=[];
        });

        callback&&callback(errors, fields);
    });
};
function isJSON(str) {
    if (typeof str == 'string') {
        try {
            var obj=JSON.parse(str);
            if(str.indexOf('{')>-1){
                return true;
            }else{
                return false;
            }

        } catch(e) {
            //console.log(e);
            return false;
        }
    }
    return false;
}


function revertValue(value,type) {

    if (!isNaN(Number(value))) {
        let exp='interval';
        let operators='';
        let result='';

        if(type&&type==='point'){
            value=Math.abs(new Date().getTime()-value);
            operators='-';
            exp='now';
        }
        result=exp+"("+operators+value/1000+",'s')";

        //todo 这里如果换算成min以上的单位，会导致计算不准，因为js的精确计算不准
        // if( value>=1000 ){//value>=1000 && value<1000*60
        //     //interval(1,'s')
        //
        // }
        // else if( value>=1000*60 && value<1000*60*60 ){
        //     //interval(1,'m')
        //     result=exp+"("+operators+value/1000/60+",'m')";
        // }
        // else if( value>=1000*60*60 ){//value>=1000*60*60 && value<1000*60*60*24
        //     //interval(1,'h')
        //     result=exp+"("+operators+value/1000/60/60+",'h')";
        // }
        // else if( value>=1000*60*60*24 && value<1000*60*60*24*30 ){
        //     //interval(1,'d') todo 默认最大间距一天，如果变大这里也要改
        //     result=exp+"("+operators+value/1000/60/60/24+",'d')";
        // }
        return result;
    } else {
        return value;
    }
};

function formatter(d, f) {
    if (isUndefined(f)) {
        return d;
    } else {
        return moment(d).format(f);
    }
};

//todo 参数转换，和下面的chartParamTransform功能一样，但是图表设计还在用，后面优化图表设计再删除
function previewChartParamTranform (paramArr){
    let result=null,isHasFilter=false,isHasExp=false;
    result=paramArr.map((item)=>{
        if(item.col&&!item.aggregate_type){
            item.columnName=item.col;
            delete item.col;
        }
        if(item.col&&item.aggregate_type){
            item.column=item.col;
            delete item.col;
        }
        if(item.type){
            item.filterType=item.type;
            delete item.type;
        }
        if(item.aggregate_type){
            item.aggType=item.aggregate_type;
            delete item.aggregate_type;
        }
        if(item.filters&&item.filters.length>0){
            isHasFilter=true;
            item.filters=item.filters.map((filter)=>{
                if(filter.col){
                    filter.columnName=filter.col;
                    delete filter.col;
                }
                if(filter.type){
                    filter.filterType=filter.type;
                    delete filter.type;
                }
                return filter;
            });
        }
        if(item.exp){
            isHasExp=true;
        }

        return item;
    });

    if(isHasFilter){
        let allFilters=[];
        result=result.filter((item)=>{
            if(item.filters&&item.filters.length>0){
                allFilters=allFilters.concat(item.filters);
                return false;
            }
            return true;
        });

        result=result.concat(allFilters);
    }

    if(isHasExp){
        //todo 这里只考虑正确的exp，如果exp的字符串格式有错误，这里有可能就会有隐藏bug，后面应该加exp的格式校验
        let allExps=[];
        let expReg = /([a-z]*)\(([a-z]*)\)/g;

        result=result.filter((item)=>{
            if(item.exp){
                let expItem;
                while ((expItem = expReg.exec(item.exp)) != null)  {
                    let newItem={
                        column:expItem[2],
                        aggType:expItem[1]
                    };
                    allExps.push(newItem);
                    //console.log(result);
                }
                return false;
            }
            return true;
        });

        result=result.concat(allExps);
    }

    return result;
};

function iiHOC(WrappedComponent) {
    return class HOC extends WrappedComponent {
        render() {
            return super.render()
        }
    }
}

const mobx = require('mobx');

let getDisplayName=(wrappedComponent)=>{
    return wrappedComponent.displayName ||wrappedComponent.name ||'Component';
};
function HOC(WrappedComponent,defaultModel) {
    return class HOC extends React.Component {

        static displayName = `HOC(${getDisplayName(WrappedComponent)})`;

        constructor(props) {
            super(props);

            this.model=mobx.observable(defaultModel||{});
        }

        componentDidMount() {
            this.wrappedInstance = this.refs.child;
        }

        render() {
            return (
                <div className={this.props.className||''}>
                    <WrappedComponent {...this.props} ref="child" model={this.model}/>
                </div>
            )
        }
    };
}

function ppHOC(WrappedComponent,extendProp) {
    return class ppHOC extends React.Component {
        constructor(props) {
            super(props);
            this.wrappedInstance = this.refs.child;

            //let defaultModel=extendProp.previewFilterParams;
        }
        render() {
            return <WrappedComponent ref="child" {...this.props} {...extendProp}/>
        }
    }
}

function isUndefined(obj) {
    return obj === void 0;
}

function getFlattenMenu(data){
    let _this=this;
    let result=[];

    data.map((item) => {

        result.push(item);

        if (item.children&&item.children.length>0) {
            result= result.concat(_this.getFlattenMenu(item.children))
        }
    });

    return result;
}


function handlePaginationChange(page, pageSize, attr ,vm, callback) {
    let _this=this;
    vm[attr]['pageNum'] = page;
    vm[attr]['pageSize'] = pageSize;
    callback && callback();
}
const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

function readFile(that,fileReg,fileSize,callback){
    let file=that.files[0];
    if(!fileReg.test(file.name)){
        alert("请确保文件为图像类型");
        return false;
    }
    const isLt2M = file.size / 1024 / 1024 < fileSize;
    if (!isLt2M) {
        alert("图片最大为2M");
        return false;
    }
    let reader=new FileReader();
    reader.readAsDataURL(file);
    reader.onload=function(){
        callback && callback(this);
    }
}

function tableToExcel(table, name, filename) {
    let uri = 'data:application/vnd.ms-excel;base64,';
    let template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta charset="UTF-8"></head><body><table>{table}</table></body></html>';
    let base64 = function (s) {
        return window.btoa(unescape(encodeURIComponent(s)))
    };
    let format = function (s, c) {
        return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; })
    };

    // $(table).find("tr").each(function (i,e) {
    //     $(this).find("th,td").eq(2).prevAll().remove();
    //     let w = $(this).find("th").width();
    //     $(this).find("th").width(w+40);
    // });

    if(table){
        var ctx = { worksheet: name || 'Worksheet', table: table.innerHTML };

        let tableToExcelLink=document.createElement('A');

        tableToExcelLink.id="tableToExcelLink";
        tableToExcelLink.href = uri + base64(format(template, ctx));
        tableToExcelLink.download = filename||'myfile.xls';//这里是关键所在,当点击之后,设置a标签的属性,这样就可以更改标签的标题了

        document.body.appendChild(tableToExcelLink);
        document.getElementById("tableToExcelLink").click();
    }

}

// 把image 转换为 canvas对象
function convertImageToCanvas(image) {
    // 创建canvas DOM元素，并设置其宽高和图片一样
    var canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    // 坐标(0,0) 表示从此处开始绘制，相当于偏移。
    canvas.getContext("2d").drawImage(image, 0, 0);
    return canvas;
}

// 从 canvas 提取图片 image
function convertCanvasToImage(canvas) {
    //新Image对象，可以理解为DOM
    var image = new Image();
    // canvas.toDataURL 返回的是一串Base64编码的URL，当然,浏览器自己肯定支持
    // 指定格式 PNG
    image.src = canvas.toDataURL("image/png");
    return image;
}

const parse = require('parse-color');

function normalizeColorToHexObj(color) {
    if(/rgba|RGBA/.test(color)){
        return {hex:parse(color).hex,alpha:parse(color).rgba[3]*100};
    }else if(/rgb|RGB/.test(color)){
        return {hex:parse(color).hex,alpha:100};
    }else{
        return {hex:color,alpha:100};
    }
}

function normalizeColorToRgba(color,alpha) {
    return `rgba(${parse(color).rgb[0]},${parse(color).rgb[1]},${parse(color).rgb[2]},${parseInt(alpha)/100})`;
}

exports.normalizeColorToHexObj=normalizeColorToHexObj;
exports.normalizeColorToRgba=normalizeColorToRgba;

exports.convertImageToCanvas=convertImageToCanvas;
exports.convertCanvasToImage=convertCanvasToImage;

exports.readFile=readFile;
exports.tableToExcel=tableToExcel;

exports.deepClone=deepClone;
exports.gatherTreeNodesField=gatherTreeNodesField;

exports.renderTreeNodesCheckbox=renderTreeNodesCheckbox;
exports.renderTreeNodes=renderTreeNodes;
exports.renderSelectTreeNodes=renderSelectTreeNodes;
exports.handlePaginationChange=handlePaginationChange;

exports.getFlattenMenu=getFlattenMenu;

exports.getFlattenMenu=getFlattenMenu;
exports.isUndefined=isUndefined;

exports.iiHOC=iiHOC;
exports.ppHOC=ppHOC;
exports.HOC=HOC;

exports.previewChartParamTranform=normalizeColorToHexObj;

exports.formatter=formatter;
exports.revertValue=revertValue;

exports.isJSON=isJSON;
exports.initForm=initForm;
exports.resetForm=resetForm;
exports.validateFields=validateFields;

exports.handleArrayObjInput=handleArrayObjInput;
exports.handleArrayInput=handleArrayInput;
exports.handleInput=handleInput;
exports.handleBlur=handleBlur;
exports.handleHelp=handleHelp;
exports.handleValidateStatus=handleValidateStatus;

exports.urlParamsObjTranslator=urlParamsObjTranslator;
exports.getDescendantantProp=getDescendantantProp;
exports.setDescendantProp=setDescendantProp;

exports.setArrayDescendantProp=setArrayDescendantProp;
exports.getArrayDescendantProp=getArrayDescendantProp;

exports.getQueryString=getQueryString;
exports.normalizeRole=normalizeRole;
exports.normalizeToCamels=normalizeToCamels;
exports.normalizeToCapitals=normalizeToCapitals;
exports.checkPrivilege=checkPrivilege;
exports.validatePhone=validatePhone;
exports.validateEmail=validateEmail;
