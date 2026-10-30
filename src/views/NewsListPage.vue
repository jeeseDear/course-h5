<template>
	<div class="news-page">
		<header class="page-head">
			<div class="nav">
				<button class="nav-back" type="button" aria-label="返回" @click="onBack">
					<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#22262b" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<path d="M14.5 5.5L8 12l6.5 6.5" />
					</svg>
				</button>
				<h1 class="nav-title">聚安动态</h1>
				<span class="nav-holder"></span>
			</div>
			<div class="search-wrap">
				<van-search
					v-model="keyword"
					shape="round"
					background="transparent"
					placeholder="搜索聚安动态标题"
					@search="onSearch"
					@clear="onSearch"
				/>
			</div>
		</header>

		<main class="content">
			<p v-if="list.length" class="summary">共 {{ total }} 条动态</p>

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

				<article v-for="item in list" :key="item.id" class="card" @click="goDetail(item.id)">
					<NewsCover :index="item.id - 1" />
					<div class="card-body">
						<h2 class="card-title">{{ item.title }}</h2>
						<div class="card-meta">
							<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
								<circle cx="12" cy="12" r="8.4" />
								<path d="M12 7.4V12l3.2 2" stroke-linecap="round" />
							</svg>
							<span>{{ item.time }}</span>
						</div>
					</div>
				</article>
			</van-list>

			<van-empty v-if="finished && !list.length" image="search" description="没有找到相关动态" />
		</main>
	</div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import { fetchNews } from "../api/news"
import { openLoading, closeLoading } from "../utils/loading"
import NewsCover from "../components/NewsCover.vue"

const PAGE_SIZE = 10

const router = useRouter()
const keyword = ref("")
const list = ref([])
const total = ref(0)
const loading = ref(false)
const finished = ref(false)
const page = ref(1)

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
		const res = await fetchNews({
			page: page.value,
			pageSize: PAGE_SIZE,
			keyword: keyword.value
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

// 滚动到底部加载更多：用列表底部的小 loading，不弹 Toast
function onLoad() {
	loadPage({ toast: false })
}

function onSearch() {
	loadPage({ reset: true })
}

function onBack() {
	if (window.history.state?.back) {
		router.back()
	} else {
		router.replace("/")
	}
}

function goDetail(id) {
	router.push(`/news/${id}`)
}

onMounted(() => {
	loadPage()
})
</script>

<style scoped>
.news-page {
	min-height: 100vh;
	padding-bottom: 24px;
	background: #f2f4f8;
}

.page-head {
	position: sticky;
	top: 0;
	z-index: 10;
	background: #fff;
}

.nav {
	display: flex;
	align-items: center;
	height: 48px;
	padding: 0 6px;
}

.nav-back {
	width: 34px;
	height: 34px;
	flex: none;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 50%;
	transition: background 0.18s ease;
}

.nav-back:active {
	background: #f2f4f8;
}

.nav-title {
	flex: 1;
	text-align: center;
	font-size: 17px;
	font-weight: 600;
	color: #17181a;
	letter-spacing: 0.2px;
}

.nav-holder {
	width: 34px;
	flex: none;
}

.search-wrap {
	padding: 0 12px 12px;
}

.news-page :deep(.van-search) {
	padding: 0;
	background: transparent;
}

.news-page :deep(.van-search__content) {
	height: 38px;
	padding-left: 12px;
	border-radius: 19px;
	background: #f2f4f8;
	align-items: center;
}

.news-page :deep(.van-field__left-icon) {
	color: #a8b0b9;
	margin-right: 6px;
}

.news-page :deep(.van-field__control) {
	font-size: 14px;
	color: #1c1f24;
}

.news-page :deep(.van-list__finished-text) {
	padding: 16px 0 4px;
	font-size: 12.5px;
	color: #a5acb4;
}

.news-page :deep(.van-list__loading) {
	padding: 0;
}

.content {
	padding: 12px;
}

.list-loading {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 6px;
	padding: 14px 0 4px;
	font-size: 12.5px;
	color: #a5acb4;
}

.summary {
	margin: 0 2px 10px;
	font-size: 12px;
	line-height: 1;
	color: #98a0a8;
}

.card {
	display: flex;
	gap: 12px;
	padding: 12px;
	background: #fff;
	border-radius: 12px;
	box-shadow: 0 2px 10px rgba(20, 38, 70, 0.05);
	transition: transform 0.18s ease;
	cursor: pointer;
}

.card + .card {
	margin-top: 10px;
}

.card:active {
	transform: scale(0.985);
}

.card-body {
	flex: 1;
	min-width: 0;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	padding: 1px 0;
}

.card-title {
	font-size: 15px;
	line-height: 21px;
	font-weight: 500;
	color: #1c1f24;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
}

.card-meta {
	display: flex;
	align-items: center;
	gap: 4px;
	margin-top: 8px;
	font-size: 12px;
	line-height: 1;
	color: #9aa1a9;
}
</style>
