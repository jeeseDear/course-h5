import { defineConfig, loadEnv } from "vite"
import vue from "@vitejs/plugin-vue"

export default defineConfig(({ mode }) => {
	// 读取 .env / .env.[mode]（fat、production），第三个参数传 "" 以读取全部变量
	const env = loadEnv(mode, process.cwd(), "")

	return {
		// 部署子路径由环境变量决定，默认 /course/
		base: env.VITE_BASE_PATH || "/course/",
		plugins: [vue()],
		server: {
			host: "127.0.0.1",
			port: 5173,
			open: false,
			// 本地开发把接口前缀代理到 Python 服务，转发时去掉 /course 前缀
			proxy: {
				"/course/api": {
					target: env.VITE_API_PROXY_TARGET || "http://127.0.0.1:8200",
					changeOrigin: true,
					rewrite: (path) => path.replace(/^\/course\/api/, "/api")
				}
			}
		}
	}
})
