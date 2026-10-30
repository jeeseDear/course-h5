// 推荐好课接口，数据由 server/main.py 提供
import { request } from "../utils/request"

// 课程视频放在 public 下，路径需带上 vite base 前缀（当前部署在 /course/）
export const VIDEO_SRC = `${import.meta.env.BASE_URL}videos/lesson.mp4`

/** 课程分类（列表页筛选用） */
export const courseTags = ["人工智能", "数智化转型", "安全生产", "应急管理"]

/**
 * 拉取课程详情
 * @param {string|number} id
 * @returns {Promise<object|null>}
 */
export async function fetchCourse(id) {
	try {
		return await request(`/courses/${id}`)
	} catch {
		return null
	}
}

/**
 * 拉取修炼场首屏数据
 * 首屏只展示 4 门推荐课，完整列表走课程列表页
 * @returns {Promise<{ courses: Array }>}
 */
export async function fetchTrainingHome() {
	try {
		return await request("/training/home")
	} catch {
		return { courses: [] }
	}
}

/**
 * 分页查询课程列表
 * @param {{ page?: number, pageSize?: number, keyword?: string, tag?: string }} params
 * @returns {Promise<{ list: Array, total: number, hasMore: boolean }>}
 */
export async function fetchCourseList({ page = 1, pageSize = 8, keyword = "", tag = "" } = {}) {
	try {
		return await request("/courses", { params: { page, pageSize, keyword, tag } })
	} catch {
		return { list: [], total: 0, hasMore: false }
	}
}
