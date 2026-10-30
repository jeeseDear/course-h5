<template>
	<div class="course-page">
		<header class="page-head">
			<div class="nav">
				<button class="nav-back" type="button" aria-label="返回" @click="onBack">
					<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#22262b" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<path d="M14.5 5.5L8 12l6.5 6.5" />
					</svg>
				</button>
				<h1 class="nav-title">推荐好课</h1>
				<span class="nav-holder"></span>
			</div>

			<div class="search-wrap">
				<van-search
					v-model="keyword"
					shape="round"
					background="transparent"
					placeholder="搜索课程名称 / 主讲人"
					@search="onSearch"
					@clear="onSearch"
				/>
			</div>

			<div class="tabs">
				<button
					v-for="t in tabs"
					:key="t.value"
					type="button"
					class="tab"
					:class="{ 'is-on': tag === t.value }"
					@click="selectTag(t.value)"
				>
					{{ t.label }}
				</button>
			</div>
		</header>

		<main class="content">
			<p v-if="list.length" class="summary">共 {{ total }} 门课程</p>

			<van-list
				v-model:loading="loading"
				:finished="finished"
				:finished-text="list.length ? '没有更多了' : ''"
				:immediate-check="false"
				@load="onLoad"
			>
				<template #loading>
					<div class="list-loading">
						<van-loading size="16px" color="#2f6bff" />
						<span>加载中...</span>
					</div>
				</template>

				<article v-for="item in list" :key="item.id" class="card" @click="goCourse(item.id)">
					<div class="cover" :style="{ background: `linear-gradient(135deg, ${item.from} 0%, ${item.to} 100%)` }">
						<span class="cover-glow"></span>

						<svg v-if="item.tag === '人工智能'" class="cover-icon" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.94)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
							<rect x="7" y="7" width="10" height="10" rx="2.4" />
							<path d="M10.4 3.4v3.2M13.6 3.4v3.2M10.4 17.4v3.2M13.6 17.4v3.2M3.4 10.4h3.2M3.4 13.6h3.2M17.4 10.4h3.2M17.4 13.6h3.2" />
						</svg>

						<svg v-else-if="item.tag === '数智化转型'" class="cover-icon" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.94)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
							<path d="M4.6 9.2A8 8 0 0119 7.2" />
							<path d="M19.4 14.8A8 8 0 015 16.8" />
							<path d="M19.6 3.6v3.8h-3.8M4.4 20.4v-3.8h3.8" />
						</svg>

						<svg v-else-if="item.tag === '安全生产'" class="cover-icon" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.94)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
							<path d="M12 3l7.2 2.9v5.7c0 4.1-2.8 7.3-7.2 9-4.4-1.7-7.2-4.9-7.2-9V5.9L12 3z" />
							<path d="M9 11.8l2.2 2.2 4-4.2" />
						</svg>

						<svg v-else class="cover-icon" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.94)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
							<path d="M12 3.6l8.4 15.2H3.6L12 3.6z" />
							<path d="M12 9.4v4.2" />
							<circle cx="12" cy="16.2" r="0.9" fill="rgba(255,255,255,.94)" stroke="none" />
						</svg>
					</div>

					<div class="body">
						<h2 class="title">{{ item.title }}</h2>
						<p class="lecturer">{{ item.lecturer }}</p>
						<div class="meta">
							<span>{{ item.lessons }} 课时 · {{ item.learners }}人学过</span>
							<span class="price" :class="{ 'is-free': item.free }">{{ item.free ? "免费" : "会员" }}</span>
						</div>
					</div>
				</article>
			</van-list>

			<van-empty v-if="finished && !list.length" image="search" description="没有找到相关课程" />
		</main>
	</div>
</template>

<script setup>
import { onActivated, onDeactivated, onMounted, ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import { fetchCourseList } from "../api/course"
import { openLoading, closeLoading } from "../utils/loading"
import { consumeRefresh } from "../utils/pageRefresh"

// 供 keep-alive 的 include 匹配，返回时不重建页面
defineOptions({ name: "CourseListPage" })

const PAGE_SIZE = 8

const route = useRoute()
const router = useRouter()
const keyword = ref("")
const tag = ref("")
const list = ref([])
const total = ref(0)
const loading = ref(false)
const finished = ref(false)
const page = ref(1)

const tabs = [
	{ label: "全部", value: "" },
	{ label: "人工智能", value: "人工智能" },
	{ label: "数智化转型", value: "数智化转型" },
	{ label: "安全生产", value: "安全生产" },
	{ label: "应急管理", value: "应急管理" }
]

async function loadPage({ reset = false, toast = true } = {}) {
	if (reset) {
		page.value = 1
		list.value = []
		total.value = 0
		finished.value = false
	}

	loading.value = true
	if (toast) openLoading()

	try {
		const res = await fetchCourseList({
			page: page.value,
			pageSize: PAGE_SIZE,
			keyword: keyword.value,
			tag: tag.value
		})
		list.value.push(...res.list)
		total.value = res.total
		finished.value = !res.hasMore
		page.value += 1
	} finally {
		loading.value = false
		if (toast) closeLoading()
	}
}

// 滚动到底部加载更多：用底部小 loading，不弹 Toast
function onLoad() {
	loadPage({ toast: false })
}

function onSearch() {
	loadPage({ reset: true })
}

function selectTag(value) {
	if (tag.value === value) return
	tag.value = value
	loadPage({ reset: true })
}

function goCourse(id) {
	router.push(`/training/course/${id}`)
}

function onBack() {
	if (window.history.state?.back) {
		router.back()
	} else {
		router.replace("/training")
	}
}

// keep-alive 下首次进入与返回都走 activated，据此区分「重新进入」和「回退」
let firstActivated = true
let lastScrollTop = 0

// 首屏加载放在 mounted，保证即使未被缓存也能正常拉数据
onMounted(() => {
	loadPage({ reset: true })
})

onActivated(() => {
	// 首次挂载后紧跟的 activated：数据已由 mounted 拉取，这里只清掉标记
	if (firstActivated) {
		firstActivated = false
		consumeRefresh(route.path)
		return
	}

	// 从修炼场「更多」再次进入：清空筛选与分页，重新拉取
	if (consumeRefresh(route.path)) {
		keyword.value = ""
		tag.value = ""
		lastScrollTop = 0
		window.scrollTo({ top: 0 })
		loadPage({ reset: true })
		return
	}

	// 从课程页返回：保留数据，仅还原滚动位置
	if (lastScrollTop) window.scrollTo({ top: lastScrollTop })
})

onDeactivated(() => {
	lastScrollTop = window.scrollY
})
</script>

<style scoped>
.course-page {
	min-height: 100vh;
	background: #f2f4f8;
}

/* 顶部：导航 + 搜索 + 分类 */
.page-head {
	position: sticky;
	top: 0;
	z-index: 10;
	background: #fff;
	box-shadow: 0 1px 0 rgba(20, 38, 70, 0.05);
}

.nav {
	display: flex;
	align-items: center;
	justify-content: space-between;
	height: 50px;
	padding: 0 6px;
}

.nav-back {
	display: flex;
	width: 36px;
	height: 36px;
	align-items: center;
	justify-content: center;
	border-radius: 50%;
	transition: background 0.16s ease;
}

.nav-back:active {
	background: #f2f4f8;
}

.nav-title {
	flex: 1;
	font-size: 16px;
	font-weight: 600;
	line-height: 22px;
	color: #1c1f24;
	text-align: center;
	letter-spacing: 0.2px;
}

.nav-holder {
	width: 36px;
}

.search-wrap {
	padding: 0 4px;
}

.search-wrap :deep(.van-search) {
	padding: 6px 8px;
}

.search-wrap :deep(.van-search__content) {
	background: #f2f4f8;
}

.search-wrap :deep(.van-field__control) {
	font-size: 13px;
}

.tabs {
	display: flex;
	gap: 8px;
	padding: 2px 12px 10px;
	overflow-x: auto;
	scrollbar-width: none;
}

.tabs::-webkit-scrollbar {
	display: none;
}

.tab {
	flex: none;
	height: 28px;
	padding: 0 13px;
	border-radius: 14px;
	background: #f2f4f8;
	font-size: 12.5px;
	line-height: 28px;
	color: #5b626d;
	white-space: nowrap;
	transition: background 0.16s ease, color 0.16s ease;
}

.tab.is-on {
	background: #2f6bff;
	color: #fff;
	font-weight: 500;
	box-shadow: 0 3px 8px rgba(47, 107, 255, 0.24);
}

/* 列表 */
.content {
	padding: 12px;
}

.summary {
	padding: 0 2px 9px;
	font-size: 12px;
	line-height: 16px;
	color: #9aa1a9;
}

.card {
	display: flex;
	gap: 12px;
	padding: 12px;
	margin-bottom: 10px;
	background: #fff;
	border-radius: 12px;
	box-shadow: 0 2px 10px rgba(20, 38, 70, 0.05);
	transition: transform 0.18s ease;
}

.card:active {
	transform: scale(0.985);
}

.cover {
	position: relative;
	flex: none;
	display: flex;
	width: 96px;
	height: 72px;
	align-items: center;
	justify-content: center;
	border-radius: 9px;
	overflow: hidden;
}

.cover-glow {
	position: absolute;
	right: -14px;
	bottom: -18px;
	width: 56px;
	height: 56px;
	border-radius: 50%;
	background: rgba(255, 255, 255, 0.14);
}

.cover-icon {
	position: relative;
	width: 28px;
	height: 28px;
}

.body {
	flex: 1;
	min-width: 0;
	display: flex;
	flex-direction: column;
}

.title {
	font-size: 15px;
	line-height: 21px;
	font-weight: 600;
	color: #1c1f24;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
}

.lecturer {
	margin-top: 3px;
	font-size: 11.5px;
	line-height: 16px;
	color: #9aa1a9;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.meta {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 8px;
	margin-top: auto;
	padding-top: 6px;
	font-size: 11.5px;
	line-height: 16px;
	color: #a5acb4;
}

.price {
	flex: none;
	padding: 0 7px;
	height: 18px;
	border-radius: 4px;
	background: #fdf3e0;
	font-size: 10.5px;
	line-height: 18px;
	font-weight: 500;
	color: #b8832a;
}

.price.is-free {
	background: #e8f7ee;
	color: #2f9e5b;
}

/* 加载与空态 */
.list-loading {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 6px;
	padding: 4px 0 2px;
	font-size: 12.5px;
	color: #a5acb4;
}

.course-page :deep(.van-list__finished-text) {
	font-size: 12.5px;
	color: #a5acb4;
}
</style>
