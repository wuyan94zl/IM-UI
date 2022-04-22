var websocket;
initWebSocket();
wsHeartBeat();
function initWebSocket() {
    let user = localStorage.getItem('_userId');
    if (user !== '' && user !== undefined) { // 在用户未登录的情况下不进行连接
        // 建立连接
        websocket = new WebSocket('ws://localhost:9988/ws?_token='+user);
        // websocket = new WebSocket('ws://chat-ws.wuyan94zl.cn/ws?_token=' + user);
        // 连接成功
        websocket.onopen = onopen
        // 连接关闭
        websocket.onclose = onclose;
        // 接收信息
        websocket.onmessage = onmessage;
    }
}

//连接成功事件
function onopen(e) {
    console.log("连接成功", e)
}

//连接关闭事件
function onclose(e) {
    console.log("关闭", e);
}

// 发送消息
function sendMessage(msg) {
    if (websocket.readyState != 1) {
        initWebSocket()
    } else {
        websocket.send(msg);
    }
}

// 接收服务器返回的数据
function onmessage(e) {
    window.dispatchEvent(new CustomEvent('onmessageWS', {
        detail: {
            data: e.data
        }
    }))
    // let resData = JSON.parse(e.data);
}

function wsHeartBeat(){
    setTimeout( () => {
        // console.log("心跳检测",websocket.readyState);
        if (websocket.readyState != 1){
            initWebSocket()
        }
        wsHeartBeat()
    },5000)
}

export {
    // 暴露出去,方便调用
    initWebSocket,
    sendMessage,
    onmessage
}