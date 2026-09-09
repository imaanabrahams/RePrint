import { createApp } from "vue";
import { createPinia } from "pinia";
import "./styles/global.css";
import "./styles/staff.css";
import App from "./App.vue";
import router from "./router/indexRouter";

createApp(App).use(createPinia()).use(router).mount("#app");
