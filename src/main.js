import { createApp } from "vue"
import Vant from "vant"
import "vant/lib/index.css"
import App from "./App.vue"
import router from "./router"
import { apiBaseUrl, appEnv, appEnvName } from "./utils/env"
import "./style.css"

if (import.meta.env.DEV) {
	console.log(
		`[env] ${appEnvName}（${appEnv}） base=${import.meta.env.BASE_URL} api=${apiBaseUrl || "-"}`
	)
}

createApp(App).use(router).use(Vant).mount("#app")
