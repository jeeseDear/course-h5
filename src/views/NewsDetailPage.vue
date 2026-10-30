<template>
	<div class="detail-page">
		<header class="nav">
			<button class="nav-back" type="button" aria-label="返回" @click="onBack">
				<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#22262b" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
					<path d="M14.5 5.5L8 12l6.5 6.5" />
				</svg>
			</button>
			<h1 class="nav-title">动态详情</h1>
			<button class="nav-share" type="button" aria-label="分享" @click="onShare">
				<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#22262b" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
					<path d="M12 15.4V4.6M12 4.6L8.4 8.2M12 4.6l3.6 3.6" />
					<path d="M5.4 13.4v4.6a1.6 1.6 0 001.6 1.6h10a1.6 1.6 0 001.6-1.6v-4.6" />
				</svg>
			</button>
		</header>

		<div class="content">
			<template v-if="!loading && detail">
				<article class="sheet">
					<div class="hero" :style="themeStyle(theme)">
						<span class="hero-ring"></span>
						<span class="hero-ring hero-ring--sm"></span>
						<span class="hero-tag">{{ detail.category }}</span>
						<NewsIcon class="hero-icon" :type="theme.icon" :size="40" :stroke-width="1.4" />
					</div>

					<div class="sheet-body">
						<h1 class="d-title">{{ detail.title }}</h1>

						<div class="d-meta">
							<span class="d-source">{{ detail.source }}</span>
							<span class="d-dot"></span>
							<span>{{ detail.date }}</span>
							<span class="d-dot"></span>
							<span>{{ detail.views }} 阅读</span>
						</div>

						<p class="d-lead">{{ detail.lead }}</p>

						<div class="d-body">
							<template v-for="(block, index) in detail.blocks" :key="index">
								<p v-if="block.type === 'p'" class="d-p">{{ block.text }}</p>

								<h2 v-else-if="block.type === 'h'" class="d-h">{{ block.text }}</h2>

								<blockquote v-else-if="block.type === 'quote'" class="d-quote">{{ block.text }}</blockquote>

								<ul v-else-if="block.type === 'list'" class="d-list">
									<li v-for="(text, i) in block.items" :key="i">{{ text }}</li>
								</ul>

								<figure v-else-if="block.type === 'figure'" class="d-figure">
									<div class="figure-img" :style="themeStyle(theme)">
										<span class="figure-glow"></span>
										<NewsIcon :type="theme.icon" :size="34" :stroke-width="1.3" />
										<span class="figure-label">{{ block.label }}</span>
									</div>
									<figcaption>{{ block.caption }}</figcaption>
								</figure>
							</template>
						</div>

						<footer class="d-foot">
							<p>供稿：{{ detail.author }}</p>
							<p>审核：{{ detail.auditor }}</p>
						</footer>
					</div>
				</article>

				<section v-if="detail.related.length" class="related">
					<h2 class="related-title">相关动态</h2>
					<ul class="related-list">
						<li v-for="item in detail.related" :key="item.id" class="related-item" @click="goDetail(item.id)">
							<span class="related-cover" :style="themeStyle(getNewsTheme(item.id - 1))">
								<NewsIcon :type="getNewsTheme(item.id - 1).icon" :size="20" :stroke-width="1.6" />
							</span>
							<div class="related-info">
								<p class="related-name">{{ item.title }}</p>
								<span class="related-time">{{ item.time.slice(0, 10) }}</span>
							</div>
							<svg class="related-arrow" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
								<path d="M6 3.2L10.6 8 6 12.8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none" />
							</svg>
						</li>
					</ul>
				</section>
			</template>

			<van-empty v-else-if="!loading" description="该动态不存在或已下线" />
		</div>
	</div>
</template>

<script setup>
import { computed, ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import { showToast } from "vant"
import { fetchNewsDetail } from "../api/news"
import { openLoading, closeLoading } from "../utils/loading"
import NewsIcon from "../components/NewsIcon.vue"
import { getNewsTheme, themeStyle } from "../utils/newsTheme"

const route = useRoute()
const router = useRouter()

const detail = ref(null)
const loading = ref(true)

const theme = computed(() => getNewsTheme((detail.value?.id || 1) - 1))

async function load(id) {
	loading.value = true
	detail.value = null
	openLoading()
	try {
		detail.value = await fetchNewsDetail(id)
	} finally {
		loading.value = false
		closeLoading()
	}
}

// 用 immediate 监听，从「相关动态」跳到另一条时同一路由内也能重新拉取
watch(
	() => route.params.id,
	(id) => {
		if (route.name === "news-detail") load(id)
	},
	{ immediate: true }
)

function onBack() {
	if (window.history.state?.back) {
		router.back()
	} else {
		router.replace("/news")
	}
}

async function onShare() {
	const link = window.location.href
	try {
		await navigator.clipboard.writeText(link)
		showToast("链接已复制")
	} catch {
		showToast("可复制浏览器地址栏链接分享")
	}
}

function goDetail(id) {
	router.push(`/news/${id}`)
}
</script>

<style scoped>
.detail-page {
	min-height: 100vh;
	padding-bottom: 28px;
	background: #f2f4f8;
}

.nav {
	position: sticky;
	top: 0;
	z-index: 10;
	display: flex;
	align-items: center;
	height: 48px;
	padding: 0 6px;
	background: #fff;
}

.nav-back,
.nav-share {
	width: 34px;
	height: 34px;
	flex: none;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 50%;
	transition: background 0.18s ease;
}

.nav-back:active,
.nav-share:active {
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

.content {
	padding: 12px;
}

.sheet {
	background: #fff;
	border-radius: 12px;
	overflow: hidden;
	box-shadow: 0 2px 10px rgba(20, 38, 70, 0.05);
}

/* 封面：与列表页同一套主题渐变，作为文章头图 */
.hero {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	height: 168px;
	overflow: hidden;
}

.hero-ring {
	position: absolute;
	top: -52px;
	right: -46px;
	width: 148px;
	height: 148px;
	border-radius: 50%;
	background: rgba(255, 255, 255, 0.16);
}

.hero-ring--sm {
	top: auto;
	right: auto;
	left: -30px;
	bottom: -56px;
	width: 108px;
	height: 108px;
	background: rgba(255, 255, 255, 0.12);
}

.hero-tag {
	position: absolute;
	top: 14px;
	left: 14px;
	height: 24px;
	padding: 0 10px;
	display: inline-flex;
	align-items: center;
	border-radius: 12px;
	background: rgba(255, 255, 255, 0.24);
	font-size: 12px;
	font-weight: 500;
	color: #fff;
	letter-spacing: 0.3px;
	backdrop-filter: blur(2px);
}

.hero-icon {
	position: relative;
	z-index: 1;
	opacity: 0.94;
}

.sheet-body {
	padding: 18px 16px 16px;
}

.d-title {
	font-size: 20px;
	line-height: 30px;
	font-weight: 700;
	color: #17181a;
	letter-spacing: 0.2px;
}

.d-meta {
	display: flex;
	align-items: center;
	gap: 7px;
	margin-top: 10px;
	font-size: 12px;
	line-height: 1;
	color: #9aa1a9;
}

.d-source {
	color: #5b8def;
	font-weight: 500;
}

.d-dot {
	width: 2.5px;
	height: 2.5px;
	border-radius: 50%;
	background: #cfd5dc;
}

.d-lead {
	margin-top: 16px;
	padding: 12px 14px;
	border-radius: 8px;
	background: #f5f8ff;
	font-size: 14px;
	line-height: 24px;
	font-weight: 500;
	color: #445063;
}

.d-body {
	margin-top: 6px;
}

.d-p {
	margin-top: 14px;
	font-size: 15px;
	line-height: 27px;
	color: #33373d;
	text-align: justify;
}

.d-h {
	position: relative;
	margin-top: 22px;
	padding-left: 10px;
	font-size: 16px;
	line-height: 24px;
	font-weight: 600;
	color: #1c1f24;
}

.d-h::before {
	content: "";
	position: absolute;
	left: 0;
	top: 4px;
	width: 3px;
	height: 16px;
	border-radius: 2px;
	background: #5b8def;
}

.d-quote {
	margin-top: 16px;
	padding: 12px 14px;
	border-left: 3px solid #5b8def;
	border-radius: 0 8px 8px 0;
	background: #f6f8fa;
	font-size: 14px;
	line-height: 25px;
	color: #4a5058;
}

.d-list {
	margin-top: 12px;
	padding: 0;
	list-style: none;
}

.d-list li {
	position: relative;
	padding-left: 15px;
	margin-top: 8px;
	font-size: 15px;
	line-height: 26px;
	color: #33373d;
	text-align: justify;
}

.d-list li::before {
	content: "";
	position: absolute;
	left: 2px;
	top: 10px;
	width: 4px;
	height: 4px;
	border-radius: 50%;
	background: #9dbaf5;
}

.d-figure {
	margin: 18px 0 4px;
}

.figure-img {
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 8px;
	height: 148px;
	border-radius: 10px;
	overflow: hidden;
}

.figure-glow {
	position: absolute;
	right: -34px;
	bottom: -44px;
	width: 128px;
	height: 128px;
	border-radius: 50%;
	background: rgba(255, 255, 255, 0.18);
}

.figure-label {
	position: relative;
	z-index: 1;
	font-size: 13px;
	font-weight: 500;
	color: rgba(255, 255, 255, 0.92);
	letter-spacing: 0.4px;
}

.d-figure figcaption {
	margin-top: 8px;
	text-align: center;
	font-size: 12.5px;
	line-height: 18px;
	color: #a5acb4;
}

.d-foot {
	margin-top: 24px;
	padding-top: 14px;
	border-top: 1px solid #eff1f4;
	display: flex;
	flex-wrap: wrap;
	gap: 4px 16px;
	font-size: 12.5px;
	line-height: 20px;
	color: #a5acb4;
}

.related {
	margin-top: 12px;
	padding: 14px 14px 6px;
	background: #fff;
	border-radius: 12px;
	box-shadow: 0 2px 10px rgba(20, 38, 70, 0.05);
}

.related-title {
	font-size: 15px;
	font-weight: 600;
	color: #1c1f24;
}

.related-list {
	margin-top: 4px;
	padding: 0;
	list-style: none;
}

.related-item {
	display: flex;
	align-items: center;
	gap: 10px;
	padding: 10px 0;
	border-bottom: 1px solid #f0f2f5;
	transition: opacity 0.18s ease;
}

.related-item:last-child {
	border-bottom: none;
}

.related-item:active {
	opacity: 0.6;
}

.related-cover {
	width: 46px;
	height: 46px;
	flex: none;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 9px;
}

.related-info {
	flex: 1;
	min-width: 0;
}

.related-name {
	font-size: 14px;
	line-height: 20px;
	font-weight: 500;
	color: #2b3038;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
}

.related-time {
	display: block;
	margin-top: 3px;
	font-size: 11.5px;
	line-height: 16px;
	color: #a5acb4;
}

.related-arrow {
	flex: none;
	color: #c8ced6;
}
</style>
