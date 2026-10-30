import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"

export default defineConfig({
	// 部署在 https://host/course/ 下，静态资源统一带该前缀
	base: "/course/",
	plugins: [vue()],
	server: {
		host: "127.0.0.1",
		port: 5173,
		open: false
	}
})
