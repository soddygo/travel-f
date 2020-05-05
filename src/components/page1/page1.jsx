'use strict';
import { Button } from 'antd';
import { Input } from 'antd';
import {observer,inject} from "mobx-react";
import { Select,DatePicker,Form,message,Layout,Pagination,Popconfirm,Icon,Radio,Table,Row,Col } from 'antd';
import ajax from 'src/components/util/ajax';
import "static/css/common.less";


const { Content, Sider } = Layout;
const Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { Column, ColumnGroup } = Table;
const utils = require('../utils/index');

const React = require('react');
const mobx = require('mobx');

const fromItemCol = 8;
const formItemLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 19 },
};
const defaultModel={
    tableData:[],
    totalItems:0,
    tableLoading:true,
    search:{
        content:"",
        starttime:null,
        endtime:null,
        sendPerson:'',
        tousers:"",
        type:"",
        pageNum:1,
        pageSize:10
    },
    showSearch:'block',
    showSearchIcon:'up'
};

const dateFormat="YYYY-MM-DD HH:mm:ss";

@observer
class NoticeLog extends React.Component {
    componentDidMount () {
        let _this=this;
        let vm = this.props.model;

        _this.search();
    };
    getRuleMgrList = (param) => {
        let _this=this;
        let vm = _this.props.model;

        vm.tableLoading = true;

        ajax(window.app.apiHost +'log/lognotification/page', param, function (data) {
            vm.tableData = data.data.list;
            vm.totalItems = data.data.total;
            vm.tableLoading = false;
        }, null, "post");
    };
    search = () =>{
        let _this=this;
        let vm =  this.props.model;

        _this.getRuleMgrList( {
            content:vm.search.content,
            starttime:vm.search.starttime&&vm.search.starttime.format(dateFormat)||'',
            endtime:vm.search.endtime&&vm.search.endtime.format(dateFormat)||'',
            sendPerson:vm.search.sendPerson,
            tousers:vm.search.tousers,
            type:vm.search.type,
            pageNum:vm.search.pageNum,
            pageSize:vm.search.pageSize
        });
    };
    clearSearch=()=>{
        let _this=this;
        let vm =  this.props.model;
        vm.search=defaultModel.search;
    };
    onStartChange = (value) =>{
        let vm = this.props.model;
        vm.search.starttime = value;
    };

    onEndChange = (value) =>{
        let vm = this.props.model;
        vm.search.endtime = value;
    };

    handlePaginationChange= (page, pageSize)=> {
        let _this=this;
        let vm = this.props.model;

        vm.search.pageNum = page;
        vm.search.pageSize = pageSize;

        _this.search();
    };
    handleShowSearch = () => {
        let vm = this.props.model;
        vm.showSearch = vm.showSearch == "none" ? "block" : "none";
        vm.showSearchIcon = vm.showSearchIcon == "down" ? "up" : "down";
    };

    render() {
        let _this=this;
        let vm = this.props.model;

        return (
            <div className="page-content">
                <div className="text-right">
                    <Icon
                        onClick={this.handleShowSearch}
                        style={{cursor:"pointer"}}
                        type={vm.showSearchIcon}
                    />
                </div>
                <Form
                    className="searchForm mt10"
                    style={{display:vm.showSearch}}
                    layout="inline"
                >
                    <Row>
                        <Col span={fromItemCol}>
                            <FormItem
                                {...formItemLayout}
                                style={{display:"block"}}
                                label="任务描述"
                            >
                                <Input
                                    data-model="search.content"
                                    onChange={(e)=>utils.handleInput(e,null,vm)}
                                    value={vm.search.content}
                                />
                            </FormItem>
                        </Col>
                        <Col span={fromItemCol}>
                            <FormItem
                                {...formItemLayout}
                                style={{display:"block"}}
                                label="发送人"
                            >
                                <Input
                                    data-model="search.sendPerson"
                                    value={vm.search.sendPerson}
                                    onChange={(e)=>utils.handleInput(e,null,vm)}
                                />
                            </FormItem>
                        </Col>
                        <Col span={fromItemCol}>
                            <FormItem
                                {...formItemLayout}
                                style={{display:"block"}}
                                label="接收人"
                            >
                                <Input
                                    data-model="search.tousers"
                                    value={vm.search.tousers}
                                    onChange={(e)=>utils.handleInput(e,null,vm)}
                                />
                            </FormItem>
                        </Col>
                        <Col span={fromItemCol}>
                            <FormItem
                                {...formItemLayout}
                                style={ {display:"block",fontSize:0} }
                                label="发送时间"
                            >
                                <DatePicker
                                    style={ {width:'47%'} }
                                    showTime
                                    format="YYYY-MM-DD HH:mm:ss"
                                    value={vm.search.starttime}
                                    placeholder="开始时间"
                                    onChange={this.onStartChange}
                                />
                                <span
                                    className="text-center"
                                    style={ {width:'6%',display:'inline-block',fontSize:'12px'} }
                                >
                                                        至
                                                    </span>
                                <DatePicker
                                    style={ {width:'47%'} }
                                    showTime
                                    format="YYYY-MM-DD HH:mm:ss"
                                    value={vm.search.endtime}
                                    placeholder="结束时间"
                                    onChange={this.onEndChange}
                                />
                            </FormItem>
                        </Col>
                        <Col span={fromItemCol}>
                            <FormItem
                                {...formItemLayout}
                                style={{display:"block"}}
                                label="类型"
                            >
                                <Select
                                    onChange={(value)=>utils.handleInput(value,'search.type',vm)}
                                    value={vm.search.type}
                                    style={{ width: '100%' }}
                                >
                                    <Option label="全部" value="">全部</Option>
                                    <Option label="短信" value="1">短信</Option>
                                    <Option label="邮件" value="2">邮件</Option>
                                    <Option label="电话" value="3">电话</Option>
                                    <Option label="微信" value="4">微信</Option>
                                    <Option label="叮叮" value="5">叮叮</Option>
                                    <Option label="APP" value="6">APP</Option>
                                    <Option label="工单" value="7">工单</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <FormItem>
                            <Button
                                onClick={ _this.search}
                                type="primary"
                            >
                                查询
                            </Button>
                            <Button
                                className="ml10"
                                onClick={ _this.clearSearch}
                            >
                                清空
                            </Button>
                        </FormItem>
                    </Row>
                </Form>
                <Table
                    pagination={false}
                    loading={vm.tableLoading}
                    className="mt20"
                    rowKey={record => record.id}
                    dataSource={mobx.toJS(vm.tableData)}
                >
                    <Column
                        title="类型"
                        dataIndex="typeName"
                    />
                    <Column
                        title="任务描述"
                        dataIndex="content"
                        render={ (text) => (
                            <p
                                style={ {maxWidth: 400} }
                                className="text-ellipsis"
                                title={ text }
                            >
                                { text }
                            </p>
                        ) }
                    />
                    <Column
                        title="接收人"
                        dataIndex="tousers"
                    />
                    <Column
                        title="发送人"
                        dataIndex="sendPerson"
                    />
                    <Column
                        title="发送时间"
                        dataIndex='sendDate'
                    />
                </Table>
                <div style={{textAlign:'right',padding:'20px 0'}}>
                    <Pagination
                        showQuickJumper
                        defaultCurrent={1}
                        total={vm.totalItems}
                        onChange={this.handlePaginationChange} />
                </div>
            </div>
        );
    }
};

export default utils.HOC(NoticeLog,defaultModel);
