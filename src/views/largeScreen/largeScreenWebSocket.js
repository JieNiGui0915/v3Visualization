import { BASE_URL } from "@/config/config.js";
import { GlobalStore } from "@/store/index.js";

const globalStore = GlobalStore();
// region WebSocket连接
let ws = null;
let heartbeatTimer = null;
let heartbeatInterval = 60000; // 60秒发送一次心跳
let isReceiveHeartbeat = true; // 是否收到心跳回复

export function initWebSocketAsync(callbackFn = null) {
    return new Promise((resolve, reject) => {
        const url = BASE_URL + "/go-api/vehicle/ws";
        ws = new WebSocket(url + "?token=" + globalStore.token);

        try {
            ws.onopen = function () {
                clearWebSocketTimeout();
                startHeartbeat(); // 开始心跳
                resolve();
            };
            // ws connection closed
            ws.onclose = function () {
                stopHeartbeat(); // 停止心跳
                if (ws) {
                    ws.close();
                    ws = null;
                }
                console.info("WebSocket Server [" + url + "] Connection Closed!");
                lazyInit();
            };
            // ws connection error
            ws.onerror = function () {
                stopHeartbeat(); // 停止心跳
                if (ws) {
                    ws.close();
                    ws = null;
                }
                console.error("WebSocket Server [" + url + "] Connection Error!");
                // lazyInit();
                reject();
            };
            // ws response message.
            ws.onmessage = function (result) {
                if (result.data === "pong") {
                    isReceiveHeartbeat = true; // 收到心跳回复
                    return;
                }
                if (callbackFn && typeof callbackFn === "function") {
                    callbackFn(JSON.parse(result.data));
                }
            };
        } catch (e) {
            alert(e.message);
        }
    })
}

function closeWebSocket() {
    clearWebSocketTimeout();
    stopHeartbeat(); // 停止心跳
    if (ws) {
        ws.close();
        ws = null;
    }
}

let initWebSocketTimeoutId = null;
function clearWebSocketTimeout() {
    if (initWebSocketTimeoutId) {
        clearTimeout(initWebSocketTimeoutId);
        initWebSocketTimeoutId = null;
    }
}

function clearTimeoutInstance() {
    clearInterval(weatherInternalId);
    clearInterval(statisticsIntervalId);
    weatherInternalId = null;
    statisticsIntervalId = null;
}

window.onbeforeunload = function () {
    closeWebSocket();
}

function lazyInit() {
    clearWebSocketTimeout();
    initWebSocketTimeoutId = setTimeout(() => {
        if (initWebSocketTimeoutId) {
            initWebSocketAsync();
        }
    }, 1000)
}


// 开始心跳
function startHeartbeat() {
    stopHeartbeat(); // 先清除之前的定时器
    isReceiveHeartbeat = true;

    heartbeatTimer = setInterval(() => {
        if (ws && ws.readyState === WebSocket.OPEN) {
            if (!isReceiveHeartbeat) {
                // 如果上次心跳没有收到回复，认为连接可能有问题，重连
                console.warn('心跳超时，尝试重连WebSocket');
                closeWebSocket();
                lazyInit();
                return;
            }

            // 发送心跳包
            isReceiveHeartbeat = false;
            try {
                // ws.send(JSON.stringify({ messageType: 'ping', message: 'ping', timestamp: Date.now() }));
                sendPing();
            } catch (e) {
                console.error('发送心跳包失败:', e);
                closeWebSocket();
                lazyInit();
            }
        }
    }, heartbeatInterval);
}

// 停止心跳
function stopHeartbeat() {
    if (heartbeatTimer) {
        clearInterval(heartbeatTimer);
        heartbeatTimer = null;
    }
}

function sendPing() {
    ws.send("ping");
}

// endregion