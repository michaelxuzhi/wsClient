import { createApp } from 'vue';
import App from './App.vue';
import { listen, dispatch } from './utils/eventHandler';
import webSocketInstance from './utils/webSocketInstance';
import SocketsMgr from './utils/socketsHelper';

const app = createApp(App);
app.config.globalProperties.$listen = listen;
app.config.globalProperties.$dispatch = dispatch;
app.config.globalProperties.$socket = webSocketInstance;
app.config.globalProperties.$SocketsMgr = SocketsMgr;

app.mount('#app');
