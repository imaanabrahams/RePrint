import { createApp } from "vue";
import { createPinia } from "pinia";
import "./styles/global.css";
import "./styles/staff.css";
import Vue3Toastify, { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import App from "./App.vue";
import router from "./router/indexRouter";

app.use(Vue3Toastify, {
  autoClose: 3000,
  position: 'top-right',
})

createApp(App).use(createPinia()).use(router).mount("#app");
