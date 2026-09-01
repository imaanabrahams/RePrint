import { createApp } from "vue";
import { createPinia } from "pinia";
import "./style.css";
import App from "./AppReprint.vue";
import router from "./router/indexRouter";

createApp(App).use(createPinia()).use(router).mount("#app");
