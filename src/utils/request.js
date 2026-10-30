// 统一请求封装：拼接环境变量里的接口前缀，带超时与失败提示
import { showToast } from "vant"
import { apiBaseUrl } from "./env"

/**
 * @param {string} path 接口路径，如 /news
 * @param {{ params?: Record<string, any>, timeout?: number }} options
 */
export async function request(path, { params, timeout = 10000 } = {}) {
	const search = new URLSearchParams()
	Object.entries(params || {}).forEach(([key, value]) => {
		if (value === undefined || value === null || value === "") return
		search.append(key, String(value))
	})
	const query = search.toString()
	const url = `${apiBaseUrl}${path}${query ? `?${query}` : ""}`

	const controller = new AbortController()
	const timer = setTimeout(() => controller.abort(), timeout)

	try {
		const res = await fetch(url, { signal: controller.signal })
		if (!res.ok) throw new Error(`HTTP ${res.status}`)
		return await res.json()
	} catch (err) {
		showToast(err.name === "AbortError" ? "请求超时，请稍后重试" : "数据加载失败，请稍后重试")
		throw err
	} finally {
		clearTimeout(timer)
	}
}
