import { createRouter, createWebHistory } from "vue-router"
import Home from "../views/Home.vue"

const routes = [
	{
		path: "/",
		name: "home",
		component: Home,
		meta: { title: "首页" }
	},
	{
		path: "/news",
		name: "news",
		component: () => import("../views/NewsListPage.vue"),
		meta: { title: "聚安动态" }
	},
	{
		path: "/news/:id",
		name: "news-detail",
		component: () => import("../views/NewsDetailPage.vue"),
		meta: { title: "动态详情" }
	},
	{
		path: "/training",
		name: "training",
		component: () => import("../views/TrainingPage.vue"),
		meta: { title: "修炼场" }
	},
	{
		path: "/training/courses",
		name: "course-list",
		component: () => import("../views/CourseListPage.vue"),
		// meta.keepAlive 填组件 name（须与组件内 defineOptions({ name }) 一致），
		// 声明后该页面会被 <keep-alive> 缓存，返回时不刷新、保留滚动位置
		meta: { title: "推荐好课", keepAlive: "CourseListPage" }
	},
	{
		path: "/training/course/:id",
		name: "course-learn",
		component: () => import("../views/CourseLearnPage.vue"),
		meta: { title: "课程学习" }
	}
]

const router = createRouter({
	// 与 vite base 保持一致，部署在子路径下路由才能正常匹配
	history: createWebHistory(import.meta.env.BASE_URL),
	routes,
	scrollBehavior(to, from, savedPosition) {
		return savedPosition || { top: 0 }
	}
})

// 递归收集路由 meta.keepAlive 声明的组件名，支持嵌套路由
export function collectCachedViews(list, acc = []) {
	list.forEach((item) => {
		const name = item.meta && item.meta.keepAlive
		if (typeof name === "string" && !acc.includes(name)) acc.push(name)
		if (item.children && item.children.length) collectCachedViews(item.children, acc)
	})
	return acc
}

// 所有需要缓存的页面组件名，供 <keep-alive :include> 等场景统一取用
export const cachedViews = collectCachedViews(routes)

export default router
