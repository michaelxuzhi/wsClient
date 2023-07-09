<template>
    <div>
        Aside
        <template v-for="(item, index) in clientCache" :key="index">
            <div class="client-item">
                {{ item }}
                <button @click="connect(item)">连接</button>
                <span style="margin-right: 100px"></span>
                <button @click="send(item, '消息样式')">发送</button>
                <button @click="close(item)">关闭</button>
                <span id="show_text"></span>
            </div>
        </template>
    </div>
</template>

<script>
export default {
    name: 'HomeAside',
    data() {
        return {
            clientCache: ['client1', 'client2', 'client3'],
            clientList: {},
            // isConnected: false,
        };
    },
    methods: {
        connect(client_id) {
            this.$SocketsMgr.connect(client_id);
            // client1.connect();
        },
        send(client_id, msg) {
            // let msg = { a: '小米', b: '华为' };
            // this.isAvailable(client_id)
            let client = this.$SocketsMgr.getSocketInst(client_id);
            if (!client) {
                console.log('该客户端暂未连接', client_id);
                return;
            }
            client && client.send(msg);
        },
        close(client_id) {
            let client = this.$SocketsMgr.getSocketInst(client_id, 'sockets');
            if (!client) {
                console.log('该客户端暂未连接', client_id);
                return;
            }
            console.log(client);
            client && client.closeSelf();
        },
        onConnected(event) {
            // console.log('页面监听到连接成功--', event.detail);
            let cur_time = new Date().getTime();
            this.clientList[event.detail] = { cur_time, isConnected: true };
            // this.isConnected = true;
            console.log(this.clientList);
        },
        onClosed(event) {
            if (!event.detail) return;
            delete this.clientList[event.detail];
        },
        // 保留接口：页面的前置websocket可用性判断
        isAvailable(client_id) {
            let len = Object.keys(this.clientList).length;
            if (len) {
                return (
                    this.clientList[client_id] &&
                    this.clientList[client_id]['isConnected']
                );
            }
            return false;
        },
    },
    created() {
        this.$listen('connected', this.onConnected.bind(this));
        this.$listen('closed', this.onClosed.bind(this));
    },
    watch: {},
};
</script>

<style>
.btnHide {
    display: None;
}
.btnShow {
    display: block;
}
.client-item {
    border: 1px salmon solid;
    margin-bottom: 10px;
}
</style>
