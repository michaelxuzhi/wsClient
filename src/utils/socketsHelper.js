import eventHandler from './eventHandler';
import webSocketInstance from './webSocketInstance';
class SocketsHelper {
    constructor() {
        this.len = 0;
        this.sockets = [];
        this.socketsCache = [];
    }
    init() {
        this.watch();
        this.eventListen();
    }
    watch() {
        let that = this;
        let proxyHandler = {
            get: function (target, property) {
                return target[property];
            },
            set(target, property, val) {
                console.log('property', property, val);
                target[property] = val;
                if (property == 'length') {
                    that.onSocketsChange(val);
                }
                return target[property];
            },
        };
        this.sockets = new Proxy(this.sockets, proxyHandler);
    }
    isExist(socket_id, arr_Name) {
        // 特殊的返回值:存在返回idx->str,不存在返回false
        let len = this[arr_Name].length;
        if (len) {
            for (let i = 0; i < len; i++) {
                if (this[arr_Name][i].socket_id == socket_id) {
                    return String(i);
                }
            }
        }
        return false;
    }
    getSocketInst(socket_id, arr_Name) {
        let res = this.isExist(socket_id, arr_Name);
        if (res) {
            return this[arr_Name][Number(res)];
        }
        return null;
    }
    eventListen() {
        eventHandler.listen('connected', this.addSocketInst.bind(this));
        eventHandler.listen('closed', this.delSocketInst.bind(this));
    }
    addSocketInst(event) {
        let socket_id = event.detail;
        let res1 = this.getSocketInst(socket_id, 'sockets');
        let res2 = this.getSocketInst(socket_id, 'socketsCache');
        !res1 && res2 && this.sockets.push(res2);
        console.log(this.sockets, this.socketsCache);
        console.log('调用到addSocketInst', event);
    }
    delSocketInst(event) {
        let socket_id = event.detail;
        if (!socket_id) return;
        let res = this.getSocketInst(socket_id, 'sockets');
        !res && this.sockets.splice(Number(res), 1);
    }
    delSocketInstFromCache(socket) {
        let res = this.getSocketInst(socket.socket_id, 'socketsCache');
        res && this.socketsCache.splice(Number(res), 1);
    }
    clearSocketInst() {
        this.sockets = [];
    }
    connect(socket_id) {
        let res1 = this.getSocketInst(socket_id, 'sockets');
        let res2 = this.getSocketInst(socket_id, 'socketsCache');
        if (!res1 && !res2) {
            let client = new webSocketInstance(socket_id);
            this.socketsCache.push(client);
            console.log('准备连接', JSON.stringify(client), this.socketsCache);
            client.connect();
        }
    }
    onSocketsChange(val) {
        // eventHandler.dispatch('SocketsLenChanged', val);
        this.len < val && this.delSocketInstFromCache(this.socketsCache[0]);
        this.len = val;
    }
}
let SocketsMgr = new SocketsHelper();
SocketsMgr.init();
export default SocketsMgr;
