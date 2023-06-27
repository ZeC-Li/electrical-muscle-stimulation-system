/**
 * Created by zhouyi on 2017/5/31.
 */
function CharToHex3(str) {
        var out, i, h;
        out = "";
        i = 0;
        while(i < str.length)
        {
            if(i==str.length-1){
                h = str.charCodeAt(i++).toString(16);
                if(h.length  ==1)
                    h = "0" + h;
                out += h;
            }else{
                h = str.charCodeAt(i++).toString(16);
                if(h.length  ==1)
                    h = "0" + h;
                out += h;
            }
        }
        return out;
    }

function InitWX(WorkFun) {

    wx.config({
        beta: true,                  //坑：这个很重要，必须配置这个为true,才能调用微信的硬件API
        debug: false,               //是否开启调试模式，会自动弹一些消息框显示微信返回的数据
        appId: app_id,        //让后台返回appid
        timestamp: time_stamp,          //让后台返回生成证书时用的时间戳
        nonceStr: nonce_str,        //让后台返回生成证书时用的随机串
        signature: signature,            //让后台返回已当前URL地址生成的证书

        jsApiList: [ //需要调用的接口，都得在这里面写一遍
            "openWXDeviceLib",//初始化设备库（只支持蓝牙设备）
            "closeWXDeviceLib",//关闭设备库（只支持蓝牙设备）
            "getWXDeviceInfos",//获取设备信息（获取当前用户已绑定的蓝牙设备列表）
            "sendDataToWXDevice",//发送数据给设备
            "startScanWXDevice",//扫描设备（获取周围所有的设备列表，无论绑定还是未被绑定的设备都会扫描到）
            "stopScanWXDevice",//停止扫描设备
            "connectWXDevice",//连接设备
            "disconnectWXDevice",//断开设备连接
            "getWXDeviceTicket",//获取操作凭证

            "onWXDeviceBindStateChange",//微信客户端设备绑定状态被改变时触发此事件
            "onWXDeviceStateChange",//监听连接状态，可以监听连接中、连接上、连接断开
            "onReceiveDataFromWXDevice",//接收到来自设备的数据时触发
            "onScanWXDeviceResult",//扫描到某个设备时触发
            "onWXDeviceBluetoothStateChange",//手机蓝牙打开或关闭时触发
        ]
    });

    function append_msg(msg){
        $("#information").append("<p>" + msg + "</p>");
        console.log(msg);
    }

    function begin_scan() {
        wx.invoke('startScanWXDevice', {'btVersion': 'ble'}, function (res) {
            append_msg("begin scan：" + res.err_msg);
        });
    }

    function stop_scan() {
        wx.invoke('stopScanWXDevice', {}, function (res) {
            append_msg("stop scan：" + res.err_msg);
        });
    }

    function connect() {
        wx.invoke('connectWXDevice', {'deviceId': device_id}, function (res) {
            append_msg(JSON.stringify(res));
        });
    }

    function disconnect() {
        wx.invoke('disconnectWXDevice', {'deviceId': device_id}, function (res) {
            append_msg(JSON.stringify(res));
        });
    }

    function get_device_info() {
        wx.invoke('getWXDeviceInfos', {}, function (res) {
            $("#information").append("get my devices:" + res.err_msg);
            // alert(JSON.stringify(res));
        });
    }

    function bind_device() {
        wx.invoke('getWXDeviceTicket', {"deviceId": device_id, "type": 1}, function (res) {
            if (res.err_msg != "getWXDeviceTicket:ok") {
                append_msg("bind failed");
                return;
            } else {
                append_msg("bind ok");
            }
        });
    }

    function unbind_device() {
        wx.invoke('getWXDeviceTicket', {"deviceId": device_id, "type": 2}, function (res) {
            if (res.err_msg != "getWXDeviceTicket:ok") {
                append_msg("unbind failed");
                return;
            } else {
                append_msg("unbind ok");
            }
        });
    }

    function send_data(data) {
        wx.invoke('sendDataToWXDevice', {'deviceId': device_id, "base64Data": base64encode(data)}, function (res) {
            if (res.err_msg == "sendDataToWXDevice:ok") {
                append_msg("send ok");
            } else {
                append_msg("send failed");
            }
        });
    }


    wx.ready(function () {
        //初始化设备库 需填写参数 公众号的原始ID
        wx.invoke('openWXDeviceLib', {'brandUserName': origin_id}, function (res) {
            append_msg(JSON.stringify(res));
        });

        wx.on('onScanWXDeviceResult', function (res) {
            var macid = JSON.stringify(res.devices[0].deviceId).replace(/\"/g, "");
            append_msg("scan:" + macid);
        });

        //手机蓝牙状态改变时触发 （这是监听事件的调用方法，注意，监听事件都没有参数）
        wx.on('onWXDeviceBluetoothStateChange', function (res) {
            append_msg(JSON.stringify(res));
        });

        //设备绑定状态改变事件（解绑成功，绑定成功的瞬间，会触发）
        wx.on('onWXDeviceBindStateChange', function (res) {
            append_msg(JSON.stringify(res));
        });

        //设备连接状态改变
        wx.on('onWXDeviceStateChange', function (res) {
            append_msg(JSON.stringify(res));
        });

        //接收到设备传来的数据
        wx.on('onReceiveDataFromWXDevice', function (res) {
            var data16 = CharToHex3(base64decode(res.base64Data));
            if(2 > data16.length){
                return;
            }
            WorkFun(data16)
        });
    });
}
