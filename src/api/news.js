// 聚安动态接口，数据由 server/main.py 提供
import { request } from "../utils/request"

/**
 * 分页查询聚安动态
 * @param {{ page?: number, pageSize?: number, keyword?: string }} params
 * @returns {Promise<{ list: Array, total: number, hasMore: boolean }>}
 */
export async function fetchNews({ page = 1, pageSize = 10, keyword = "" } = {}) {
	try {
		return await request("/news", { params: { page, pageSize, keyword } })
	} catch {
		// 失败时返回空结构，页面按空态渲染
		return { list: [], total: 0, hasMore: false }
	}
}

/**
 * 查询聚安动态详情
 * @param {number|string} id
 * @returns {Promise<object|null>}
 */
export async function fetchNewsDetail(id) {
	try {
		return await request(`/news/${id}`)
	} catch {
		return null
	}
}
