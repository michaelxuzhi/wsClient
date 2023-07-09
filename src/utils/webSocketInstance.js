import config from './config';
import eventHandler from './eventHandler';
// import SocketsMgr from './socketsHelper';
class webSocketInstance {
    constructor(socket_id) {
        this.url = config.URL;
        this.socket = null;
        this.socket_id = socket_id;
    }

    // 连接
    connect() {
        this.socket = new WebSocket(this.url);
        // console.log('准备连接', this.socket);
        this.socket.addEventListener('open', this.onOpen.bind(this));
        this.socket.addEventListener('message', this.onMessage.bind(this));
        this.socket.addEventListener('close', this.onClose.bind(this));
        this.socket.addEventListener('error', this.onError.bind(this));
    }

    // 发送消息
    sendMsg(msg) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(msg);
        }
    }

    // 事件监听回调
    onOpen(event) {
        console.log('websocket 连接成功!');
        console.log('websocket 连接成功2!', this.socket);
        this.socket.socket_id = this.socket_id;
        eventHandler.dispatch('connected', this.socket_id);
    }
    onMessage(event) {
        console.log('websocket 接收到消息', event.data);
    }
    onClose(event) {
        console.log('websocket 关闭!');
        eventHandler.dispatch('closed', this.socket.socket_id);
    }
    onError(event) {
        console.log('websocket 连接错误!');
    }
    // 主动关闭
    closeSelf() {
        this.socket.close();
    }
}

export default webSocketInstance;
