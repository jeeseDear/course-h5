<template>
	<div class="train-page">
		<header class="page-head">
			<div class="nav">
				<button class="nav-back" type="button" aria-label="返回" @click="onBack">
					<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#22262b" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<path d="M14.5 5.5L8 12l6.5 6.5" />
					</svg>
				</button>
				<h1 class="nav-title">修炼场</h1>
				<span class="nav-holder"></span>
			</div>

			<div class="search-row">
				<label class="search-box">
					<svg class="search-icon" viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="#a3aab4" stroke-width="2" stroke-linecap="round" aria-hidden="true">
						<circle cx="10.8" cy="10.8" r="6.6" />
						<path d="M15.6 15.6L20 20" />
					</svg>
					<input v-model="keyword" type="search" class="search-input" placeholder="搜索课程" />
					<button v-if="keyword" class="search-clear" type="button" aria-label="清空" @click="keyword = ''">
						<svg viewBox="0 0 24 24" width="14" height="14" fill="#c2c8d0" aria-hidden="true">
							<path d="M12 2a10 10 0 100 20 10 10 0 000-20zm3.5 12.1l-1.4 1.4L12 13.4l-2.1 2.1-1.4-1.4L10.6 12 8.5 9.9l1.4-1.4L12 10.6l2.1-2.1 1.4 1.4-2.1 2.1z" />
						</svg>
					</button>
				</label>
				<button class="scan-btn" type="button" aria-label="扫一扫" @click="todo('扫码')">
					<svg viewBox="0 0 24 24" width="23" height="23" fill="none" stroke="#2f6bff" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<path d="M3.4 8.6V5.6a2.2 2.2 0 012.2-2.2h3" />
						<path d="M20.6 8.6V5.6a2.2 2.2 0 00-2.2-2.2h-3" />
						<path d="M3.4 15.4v3a2.2 2.2 0 002.2 2.2h3" />
						<path d="M20.6 15.4v3a2.2 2.2 0 01-2.2 2.2h-3" />
						<path d="M3.6 12h16.8" />
					</svg>
				</button>
			</div>
		</header>

		<!-- 活动 banner 轮播 -->
		<TrainingBanner @select="onBannerSelect" />

		<!-- 宫格入口 -->
		<section class="entry-card">
			<button v-for="item in entries" :key="item.key" class="entry" type="button" @click="todo(item.name)">
				<span class="entry-icon" :style="{ background: item.color }">
					<span class="entry-shine"></span>
					<TrainingIcon :type="item.icon" :color="item.color" :size="24" />
				</span>
				<span class="entry-label">{{ item.name }}</span>
			</button>
		</section>

		<!-- 培训报名 -->
		<section class="block">
			<div class="block-head">
				<h2 class="block-title">培训报名</h2>
				<button class="block-more" type="button" @click="todo('培训报名列表')">
					更多
					<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
						<path d="M6 3.2L10.6 8 6 12.8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none" />
					</svg>
				</button>
			</div>

			<article class="enroll" @click="todo('培训详情')">
				<div class="enroll-top">
					<div class="enroll-thumb">
						<span class="thumb-tower"></span>
						<span class="thumb-note">培训火热进行中…</span>
						<span class="thumb-hint">这里报名吧</span>
						<span class="thumb-badge">{{ enroll.status }}</span>
					</div>
					<div class="enroll-info">
						<h3 class="enroll-title">{{ enroll.title }}</h3>
						<p class="enroll-line">
							<span class="line-label">培训时间：</span>
							<span class="line-value">{{ enroll.trainTime }}</span>
						</p>
						<p class="enroll-line">
							<span class="line-label">报名截止：</span>
							<span class="line-value line-value--blue">{{ enroll.deadline }}</span>
						</p>
					</div>
				</div>
				<div class="enroll-foot">
					<p class="quota">
						<span>剩余 <b class="quota-warn">{{ enroll.left }}</b> 个名额</span>
						<i class="quota-divide"></i>
						<span>已有 <b class="quota-num">{{ enroll.joined }}</b> 人报名</span>
					</p>
					<button class="enroll-btn" type="button" @click.stop="onEnroll">立即报名</button>
				</div>
			</article>
		</section>

		<!-- 推荐好课 -->
		<section class="block">
			<div class="block-head">
				<h2 class="block-title">推荐好课</h2>
				<button class="block-more" type="button" @click="goCourseList">
					更多
					<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
						<path d="M6 3.2L10.6 8 6 12.8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none" />
					</svg>
				</button>
			</div>

			<div v-if="filteredCourses.length" class="course-grid">
				<article
					v-for="item in filteredCourses"
					:key="item.id"
					class="course"
					@click="goCourse(item.id)"
				>
					<div class="course-cover" :style="{ background: `linear-gradient(135deg, ${item.from} 0%, ${item.to} 100%)` }">
						<span class="course-glow"></span>
						<span class="course-tag">{{ item.tag }}</span>
						<h3 class="course-name">{{ item.title }}</h3>
					</div>
					<div class="course-meta">
						<span>{{ item.lessons }} 课时 · {{ item.learners }}人学习</span>
						<span class="course-price" :class="{ 'is-free': item.free }">{{ item.free ? "免费" : "会员" }}</span>
					</div>
				</article>
			</div>

			<van-empty v-else image="search" description="没有找到相关课程" />
		</section>
	</div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue"
import { useRouter } from "vue-router"
import { showToast } from "vant"
import TrainingIcon from "../components/TrainingIcon.vue"
import TrainingBanner from "../components/TrainingBanner.vue"
import { fetchTrainingHome } from "../api/course"
import { openLoading, closeLoading } from "../utils/loading"
import { markRefresh } from "../utils/pageRefresh"

const router = useRouter()

const keyword = ref("")
// 首页课程数据（由接口返回）
const courseList = ref([])

// 进入页面时拉取首屏数据
onMounted(async () => {
	openLoading()
	try {
		const res = await fetchTrainingHome()
		courseList.value = res.courses
	} finally {
		closeLoading()
	}
})

// 宫格入口
const entries = [
	{ key: "task", name: "我的任务", color: "#3b7bf6", icon: "task" },
	{ key: "signup", name: "我的报名", color: "#4bc07a", icon: "signup" },
	{ key: "message", name: "我的消息", color: "#f0913f", icon: "message" },
	{ key: "record", name: "学习记录", color: "#3ec4c9", icon: "record" },
	{ key: "open", name: "公开课", color: "#9b6ce8", icon: "open" },
	{ key: "zone", name: "专区课", color: "#f0bd2b", icon: "zone" },
	{ key: "live", name: "直播频道", color: "#ef5b5b", icon: "live" },
	{ key: "grow", name: "工匠成长", color: "#f09a41", icon: "grow" }
]

// 培训报名（mock）
const enroll = {
	id: 1,
	status: "进行中",
	title: "新业务设计及市场开拓能力提升培训",
	trainTime: "2023-05-23~2023-06-15",
	deadline: "2023-05-26 18:00",
	left: 951,
	joined: 49
}

// 推荐好课（mock，数据见 api/course.js）
const filteredCourses = computed(() => {
	const kw = keyword.value.trim()
	if (!kw) return courseList.value
	return courseList.value.filter((item) => (item.tag + item.title).includes(kw))
})

function onBack() {
	if (window.history.state?.back) {
		router.back()
	} else {
		router.replace("/")
	}
}

function todo(name) {
	showToast(`${name}功能开发中`)
}

function onBannerSelect(item) {
	showToast(`${item.kicker}活动详情开发中`)
}

function goCourse(id) {
	router.push(`/training/course/${id}`)
}

// 从「更多」进入课程列表：每次都是新的一次浏览，需要重新加载
function goCourseList() {
	markRefresh("/training/courses")
	router.push("/training/courses")
}

function onEnroll() {
	showToast("报名成功，可在「我的报名」查看")
}
</script>

<style scoped>
.train-page {
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

.search-row {
	display: flex;
	align-items: center;
	gap: 10px;
	padding: 0 12px 12px;
}

.search-box {
	flex: 1;
	min-width: 0;
	display: flex;
	align-items: center;
	gap: 6px;
	height: 40px;
	padding: 0 12px;
	border-radius: 20px;
	background: #f4f6fa;
}

.search-icon {
	flex: none;
}

.search-input {
	flex: 1;
	min-width: 0;
	height: 100%;
	border: none;
	background: transparent;
	font-size: 14px;
	color: #1c1f24;
	outline: none;
	-webkit-appearance: none;
}

.search-input::placeholder {
	color: #a8b0b9;
}

.search-input::-webkit-search-cancel-button {
	display: none;
}

.search-clear {
	flex: none;
	display: flex;
	align-items: center;
}

.scan-btn {
	flex: none;
	width: 34px;
	height: 34px;
	display: flex;
	align-items: center;
	justify-content: center;
}

/* ---------------- 宫格 ---------------- */
.entry-card {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	row-gap: 16px;
	margin: 10px 10px 0;
	padding: 18px 6px 16px;
	background: #fff;
	border-radius: 10px;
	box-shadow: 0 1px 6px rgba(17, 34, 68, 0.05);
}

.entry {
	display: flex;
	flex-direction: column;
	align-items: center;
	transition: transform 0.16s ease;
}

.entry:active {
	transform: scale(0.93);
}

.entry-icon {
	position: relative;
	width: 48px;
	height: 48px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 50%;
	overflow: hidden;
	box-shadow: inset 0 -4px 8px rgba(0, 0, 0, 0.14), 0 3px 8px rgba(23, 52, 110, 0.14);
}

.entry-shine {
	position: absolute;
	left: -6px;
	top: -14px;
	width: 44px;
	height: 34px;
	border-radius: 50%;
	background: rgba(255, 255, 255, 0.22);
}

.entry-label {
	margin-top: 8px;
	font-size: 12px;
	line-height: 1;
	color: #2b2f36;
	white-space: nowrap;
}

/* ---------------- 区块 ---------------- */
.block {
	margin: 14px 10px 0;
}

.block-head {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 2px 12px;
}

.block-title {
	font-size: 17px;
	line-height: 1.2;
	font-weight: 600;
	color: #17181a;
	letter-spacing: 0.2px;
}

.block-more {
	display: flex;
	align-items: center;
	gap: 2px;
	padding: 2px 0;
	font-size: 15px;
	color: #9aa1a9;
}

.block-more:active {
	opacity: 0.6;
}

/* 培训报名卡片 */
.enroll {
	padding: 14px 15px;
	background: #fff;
	border-radius: 12px;
	box-shadow: 0 1px 6px rgba(17, 34, 68, 0.05);
	cursor: pointer;
	transition: transform 0.16s ease;
}

.enroll:active {
	transform: scale(0.99);
}

.enroll-top {
	display: flex;
	gap: 13px;
}

/* 设计稿 750 基准：缩略图 204×114，此处按 375 折半 */
.enroll-thumb {
	position: relative;
	width: 102px;
	height: 57px;
	flex: none;
	border-radius: 6px;
	overflow: hidden;
	background: linear-gradient(150deg, #dceafd 0%, #bcd9fb 55%, #9fd0f8 100%);
}

/* 中间那张米黄色便签 */
.thumb-note {
	position: absolute;
	left: 15px;
	top: 19px;
	width: 68px;
	height: 21px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 2px;
	background: #fdf0c6;
	font-size: 6.5px;
	line-height: 1;
	color: #3f7fd0;
	letter-spacing: 0.2px;
	white-space: nowrap;
}

/* 便签下方的红色提示语 */
.thumb-hint {
	position: absolute;
	left: 22px;
	top: 43px;
	font-size: 5.5px;
	line-height: 1;
	color: #e46863;
	letter-spacing: 0.2px;
}

/* 右上角小塔装饰 */
.thumb-tower {
	position: absolute;
	right: 8px;
	top: 13px;
	width: 0;
	height: 0;
	border-left: 4px solid transparent;
	border-right: 4px solid transparent;
	border-bottom: 15px solid #f6d98a;
	opacity: 0.92;
}

/* 左上角状态角标：深色半透明底 + 白字 */
.thumb-badge {
	position: absolute;
	top: 0;
	left: 0;
	padding: 3px 6px 4px;
	border-radius: 6px 0 0 0;
	background: rgba(38, 42, 48, 0.6);
	font-size: 9.5px;
	line-height: 1;
	color: #fff;
	letter-spacing: 0.3px;
}

.enroll-info {
	flex: 1;
	min-width: 0;
}

.enroll-title {
	font-size: 16px;
	line-height: 21px;
	font-weight: 600;
	color: #1c1c1d;
	letter-spacing: 0.2px;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
}

.enroll-line {
	display: flex;
	align-items: center;
	min-width: 0;
	margin-top: 0;
	font-size: 13px;
	line-height: 21px;
}

/* 标题与第一条信息之间的留白 */
.enroll-title + .enroll-line {
	margin-top: 8px;
}

.line-label {
	flex: none;
	color: #99a0aa;
}

.line-value {
	flex: 1;
	min-width: 0;
	color: #555b66;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.line-value--blue {
	color: #5579f6;
}

.enroll-foot {
	display: flex;
	align-items: center;
	gap: 9px;
	margin-top: 14px;
}

/* 名额信息右对齐贴住按钮，与设计稿一致 */
.quota {
	margin-left: auto;
	min-width: 0;
	display: flex;
	align-items: center;
	gap: 7px;
	overflow: hidden;
	font-size: 12px;
	line-height: 1;
	color: #b4b7c0;
	white-space: nowrap;
}

/* 剩余名额用红色强调 */
.quota-warn {
	font-weight: 500;
	color: #e46863;
}

/* 报名人数不强调，与标签同色同字重 */
.quota-num {
	font-weight: 400;
	color: #b4b7c0;
}

.quota-divide {
	flex: none;
	width: 1px;
	height: 11px;
	background: #bdc0c9;
}

.enroll-btn {
	flex: none;
	height: 33px;
	padding: 0 15px;
	border-radius: 17px;
	font-size: 15px;
	font-weight: 500;
	color: #fff;
	letter-spacing: 0.3px;
	background: linear-gradient(135deg, #7e9bfb 0%, #4a6ef5 100%);
	box-shadow: 0 4px 10px rgba(74, 110, 245, 0.32);
	transition: transform 0.16s ease;
}

.enroll-btn:active {
	transform: scale(0.96);
}

/* 推荐好课 */
.course-grid {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 10px;
}

.course {
	background: #fff;
	border-radius: 10px;
	overflow: hidden;
	box-shadow: 0 1px 6px rgba(17, 34, 68, 0.05);
	cursor: pointer;
	transition: transform 0.16s ease;
}

.course:active {
	transform: scale(0.98);
}

.course-cover {
	position: relative;
	height: 98px;
	padding: 0 12px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	overflow: hidden;
	color: #fff;
}

.course-glow {
	position: absolute;
	right: -26px;
	top: -26px;
	width: 82px;
	height: 82px;
	border-radius: 50%;
	background: radial-gradient(circle, rgba(140, 205, 255, 0.45) 0%, rgba(140, 205, 255, 0) 70%);
}

.course-tag {
	position: relative;
	font-size: 10px;
	line-height: 1;
	color: rgba(255, 255, 255, 0.68);
	letter-spacing: 0.4px;
}

.course-name {
	position: relative;
	margin-top: 6px;
	font-size: 14px;
	line-height: 19px;
	font-weight: 700;
	letter-spacing: 0.3px;
	text-shadow: 0 1px 8px rgba(0, 0, 0, 0.34);
}

.course-meta {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 6px;
	padding: 8px 10px 9px;
	font-size: 10.5px;
	line-height: 1;
	color: #98a0a8;
}

.course-price {
	flex: none;
	font-weight: 500;
	color: #c99a3b;
}

.course-price.is-free {
	color: #2f9e6b;
}
</style>
