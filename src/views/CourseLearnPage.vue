<template>
	<div class="learn-page">
		<header class="page-head">
			<button class="icon-btn" type="button" aria-label="返回" @click="onBack">
				<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
					<path d="M14.5 5.5L8 12l6.5 6.5" />
				</svg>
			</button>
			<h1 class="head-title">课程学习</h1>
			<span class="head-holder"></span>
		</header>

		<template v-if="course">
			<!-- 视频播放器 -->
			<div ref="playerEl" class="player">
				<video
					ref="videoEl"
					class="video"
					:src="videoSrc"
					playsinline
					webkit-playsinline
					preload="metadata"
					@click="togglePlay"
					@loadedmetadata="onLoadedMetadata"
					@timeupdate="onTimeUpdate"
					@play="playing = true"
					@pause="playing = false"
					@seeking="onSeeking"
					@ratechange="onRateChange"
					@ended="onEnded"
				></video>

				<!-- 自定义控制条（原生控制条会与倍速入口抢右下角，故关闭） -->
				<div v-if="started" class="ctrl" @click="togglePlay">
					<button class="ctrl-btn" type="button" :aria-label="playing ? '暂停' : '播放'" @click.stop="togglePlay">
						<svg v-if="playing" viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true">
							<rect x="6.4" y="4.8" width="3.8" height="14.4" rx="1.2" />
							<rect x="13.8" y="4.8" width="3.8" height="14.4" rx="1.2" />
						</svg>
						<svg v-else viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true">
							<path d="M8.4 5.6c0-.9 1-1.5 1.8-1l8.1 5.3c.7.5.7 1.5 0 2l-8.1 5.3c-.8.5-1.8-.1-1.8-1V5.6z" />
						</svg>
					</button>

					<span class="ctrl-time">{{ fmtTime(curTime) }} / {{ fmtTime(durTime) }}</span>

					<div class="ctrl-track"><i :style="{ width: watchedPercent + '%' }"></i></div>

					<button class="ctrl-btn" type="button" aria-label="全屏" @click.stop="toggleFullscreen">
						<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" aria-hidden="true">
							<path d="M4.2 9.2V4.6h4.6M19.8 9.2V4.6h-4.6M4.2 14.8v4.6h4.6M19.8 14.8v4.6h-4.6" />
						</svg>
					</button>

					<!-- 倍速：右下角下拉 -->
					<div class="speed">
						<div v-if="speedOpen" class="speed-mask" @click.stop="speedOpen = false"></div>
						<button class="speed-trigger" type="button" @click.stop="speedOpen = !speedOpen">
							{{ rate.toFixed(1) }}x
							<svg class="speed-caret" viewBox="0 0 12 12" width="10" height="10" aria-hidden="true">
								<path
									d="M3 4.6L6 7.6l3-3"
									stroke="currentColor"
									stroke-width="1.4"
									stroke-linecap="round"
									stroke-linejoin="round"
									fill="none"
								/>
							</svg>
						</button>
						<ul v-if="speedOpen" class="speed-menu" @click.stop>
							<li
								v-for="r in RATES"
								:key="r"
								class="speed-option"
								:class="{ 'is-on': rate === r }"
								@click.stop="chooseRate(r)"
							>
								{{ r.toFixed(1) }}x
							</li>
						</ul>
					</div>
				</div>

				<div v-if="!started" class="player-cover" :style="{ background: `linear-gradient(135deg, ${course.from} 0%, ${course.to} 100%)` }">
					<span class="cover-glow"></span>
					<span class="cover-tag">{{ course.tag }}</span>
					<p class="cover-title">{{ current.title }}</p>
					<button class="cover-play" type="button" aria-label="播放" @click="onCoverPlay">
						<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true">
							<path d="M8.4 5.6c0-.9 1-1.5 1.8-1l8.1 5.3c.7.5.7 1.5 0 2l-8.1 5.3c-.8.5-1.8-.1-1.8-1V5.6z" />
						</svg>
					</button>
					<span class="cover-meta">第 {{ currentIndex + 1 }} 节 · {{ current.duration }}</span>
				</div>
			</div>

			<!-- 课程信息 -->
			<section class="panel info">
				<h2 class="course-name">{{ course.title }}</h2>
				<div class="info-meta">
					<span class="chip">{{ course.tag }}</span>
					<span>{{ course.lessons }} 课时</span>
					<i class="dot"></i>
					<span>{{ course.learners }}人学习</span>
					<span class="price" :class="{ 'is-free': course.free }">{{ course.free ? "免费" : "会员" }}</span>
				</div>
				<p class="lecturer">主讲：{{ course.lecturer }}</p>

				<div class="progress-wrap">
					<div class="progress-bar"><i :style="{ width: percent + '%' }"></i></div>
					<span class="progress-text">已学 {{ doneCount }}/{{ totalChapters }} 节</span>
				</div>
			</section>

			<!-- 课程目录 -->
			<section class="panel">
				<h2 class="panel-title">
					课程目录
					<span class="panel-sub">{{ course.lessons }} 节</span>
				</h2>
				<ul class="chapter-list">
					<li
						v-for="(ch, i) in course.chapters"
						:key="ch.id"
						class="chapter"
						:class="{ 'is-active': i === currentIndex, 'is-done': isDone(ch) }"
						@click="play(i)"
					>
						<span class="chapter-no">
							<svg v-if="i === currentIndex" viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden="true">
								<path d="M8.4 5.6c0-.9 1-1.5 1.8-1l8.1 5.3c.7.5.7 1.5 0 2l-8.1 5.3c-.8.5-1.8-.1-1.8-1V5.6z" />
							</svg>
							<template v-else>{{ String(i + 1).padStart(2, "0") }}</template>
						</span>
						<span class="chapter-title">{{ ch.title }}</span>
						<span class="chapter-time">{{ ch.duration }}</span>
					</li>
				</ul>
			</section>

			<!-- 课程简介 -->
			<section class="panel">
				<h2 class="panel-title">课程简介</h2>
				<p class="intro">{{ course.intro }}</p>
			</section>

			<!-- 底部操作条 -->
			<div class="bottom-bar">
				<span class="bar-badge">{{ String(currentIndex + 1).padStart(2, "0") }}</span>
				<div class="bottom-info">
					<span class="bottom-label">
						<i class="bar-dot"></i>
						正在学习 · 共 {{ totalChapters }} 节
					</span>
					<span class="bottom-name">{{ current.title }}</span>
				</div>
				<button class="bottom-btn" type="button" @click="nextChapter">
					{{ isLast ? "重新学习" : "下一节" }}
					<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
						<path d="M6 3.2L10.6 8 6 12.8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" fill="none" />
					</svg>
				</button>
			</div>
		</template>

		<van-empty v-else description="课程不存在或已下架" />
	</div>
</template>

<script setup>
import { computed, nextTick, onMounted, ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import { showToast } from "vant"
import { fetchCourse, VIDEO_SRC } from "../api/course"
import { openLoading, closeLoading } from "../utils/loading"

const route = useRoute()
const router = useRouter()

const videoSrc = VIDEO_SRC
const course = ref(null)

const started = ref(false)
const videoEl = ref(null)
const playerEl = ref(null)
const playing = ref(false)
const curTime = ref(0)
const durTime = ref(0)
// 可选倍速
const RATES = [0.5, 1, 2]
const rate = ref(1)
const speedOpen = ref(false)
// 已观看到的最大时间点，用于拦截快进
const maxWatched = ref(0)
// 已学完的章节 id：初始取接口返回的 done，播完自动追加
const finished = ref(new Set())

// 续学位置：默认第一个未学章节；全部学完则回到第 1 节
const currentIndex = ref(0)

// 进入页面时拉取课程数据，拿到后回填已学章节与续学位置
onMounted(async () => {
	openLoading()
	try {
		const data = await fetchCourse(route.params.id)
		course.value = data
		if (!data) return
		finished.value = new Set((data.chapters || []).filter((ch) => ch.done).map((ch) => ch.id))
		const index = (data.chapters || []).findIndex((ch) => !finished.value.has(ch.id))
		currentIndex.value = index === -1 ? 0 : index
	} finally {
		closeLoading()
	}
})

const totalChapters = computed(() => course.value?.chapters.length || 0)

const current = computed(() => {
	const list = course.value?.chapters || []
	return list[currentIndex.value] || { title: "", duration: "00:00" }
})

const isLast = computed(() => currentIndex.value >= (course.value?.chapters.length || 1) - 1)

const doneCount = computed(() => {
	const list = course.value?.chapters || []
	return list.filter((ch) => finished.value.has(ch.id)).length
})

const percent = computed(() => {
	if (!totalChapters.value) return 0
	return Math.round((doneCount.value / totalChapters.value) * 100)
})

// 当前这一节播放到哪（控制条上的进度）
const watchedPercent = computed(() => {
	if (!durTime.value) return 0
	return Math.min(100, (curTime.value / durTime.value) * 100)
})

function fmtTime(sec) {
	const total = Math.max(0, Math.floor(sec || 0))
	const m = Math.floor(total / 60)
	const s = total % 60
	return `${m}:${String(s).padStart(2, "0")}`
}

function isDone(ch) {
	return finished.value.has(ch.id)
}

function play(index) {
	currentIndex.value = index
	started.value = true
	maxWatched.value = 0
	curTime.value = 0
	nextTick(() => {
		const el = videoEl.value
		if (!el) return
		el.currentTime = 0
		el.playbackRate = rate.value
		el.play().catch(() => {})
	})
}

function togglePlay() {
	const el = videoEl.value
	if (!el) return
	if (el.paused) el.play().catch(() => {})
	else el.pause()
}

function toggleFullscreen() {
	const wrap = playerEl.value
	const el = videoEl.value
	if (document.fullscreenElement) {
		document.exitFullscreen?.()
		return
	}
	if (wrap?.requestFullscreen) {
		wrap.requestFullscreen().catch(() => {})
	} else if (el?.webkitEnterFullscreen) {
		el.webkitEnterFullscreen()
	}
}

function setRate(value) {
	rate.value = value
	if (videoEl.value) videoEl.value.playbackRate = value
}

function chooseRate(value) {
	setRate(value)
	speedOpen.value = false
}

function onLoadedMetadata() {
	const el = videoEl.value
	if (!el) return
	maxWatched.value = el.currentTime || 0
	durTime.value = Number.isFinite(el.duration) ? el.duration : 0
	el.playbackRate = rate.value
}

function onTimeUpdate() {
	const el = videoEl.value
	if (!el || el.seeking) return
	curTime.value = el.currentTime
	if (el.currentTime > maxWatched.value) maxWatched.value = el.currentTime
}

// 只拦截快进，允许回退重看
function onSeeking() {
	const el = videoEl.value
	if (!el) return
	// 播放中 maxWatched 会滞后一点（timeupdate 约 250ms 一次），留 0.8s 容差
	if (el.currentTime > maxWatched.value + 0.8) {
		el.currentTime = maxWatched.value
		showToast("视频不支持快进")
	}
}

// 倍速若被系统/全屏控件改动，保持触发器数字与实际一致
function onRateChange() {
	const el = videoEl.value
	if (el && el.playbackRate !== rate.value) rate.value = el.playbackRate
}

function onCoverPlay() {
	play(currentIndex.value)
}

function onEnded() {
	const id = current.value.id
	if (id) {
		const next = new Set(finished.value)
		next.add(id)
		finished.value = next
	}

	if (isLast.value) {
		showToast("本课程已全部学完")
		return
	}
	play(currentIndex.value + 1)
}

function nextChapter() {
	if (isLast.value) {
		play(0)
		return
	}
	play(currentIndex.value + 1)
}

function onBack() {
	if (window.history.state?.back) {
		router.back()
	} else {
		router.replace("/training")
	}
}
</script>

<style scoped>
.learn-page {
	min-height: 100vh;
	padding-bottom: 86px;
	background: #f2f4f8;
}

/* 顶部导航 */
.page-head {
	position: sticky;
	top: 0;
	z-index: 10;
	display: flex;
	align-items: center;
	justify-content: space-between;
	height: 50px;
	padding: 0 10px;
	background: #fff;
}

.icon-btn {
	display: flex;
	width: 32px;
	height: 32px;
	align-items: center;
	justify-content: center;
	border-radius: 50%;
	color: #1f2329;
	transition: background 0.16s ease;
}

.icon-btn:active {
	background: #f2f4f8;
}

.head-title {
	flex: 1;
	font-size: 17px;
	font-weight: 600;
	color: #1c1f24;
	text-align: center;
	letter-spacing: 0.2px;
}

.head-holder {
	width: 32px;
	height: 32px;
}

/* 播放器 */
.player {
	position: relative;
	width: 100%;
	aspect-ratio: 16 / 9;
	background: #0b0d12;
	overflow: hidden;
}

.video {
	display: block;
	width: 100%;
	height: 100%;
	object-fit: contain;
	background: #0b0d12;
}

.player-cover {
	position: absolute;
	inset: 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 0 22px;
	text-align: center;
}

/* 自定义控制条 */
.ctrl {
	position: absolute;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 3;
	display: flex;
	align-items: center;
	gap: 8px;
	height: 38px;
	padding: 0 8px;
	background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 58%, rgba(0, 0, 0, 0.62) 100%);
}

.ctrl-btn {
	flex: none;
	display: flex;
	width: 24px;
	height: 24px;
	align-items: center;
	justify-content: center;
	color: #fff;
	opacity: 0.94;
}

.ctrl-btn:active {
	opacity: 0.7;
}

.ctrl-time {
	flex: none;
	font-size: 10.5px;
	line-height: 1;
	color: rgba(255, 255, 255, 0.86);
	letter-spacing: 0.2px;
	font-variant-numeric: tabular-nums;
}

.ctrl-track {
	flex: 1;
	min-width: 18px;
	height: 2px;
	border-radius: 1px;
	background: rgba(255, 255, 255, 0.3);
	overflow: hidden;
}

.ctrl-track i {
	display: block;
	height: 100%;
	border-radius: 1px;
	background: #fff;
	transition: width 0.16s linear;
}

/* 倍速下拉：控制条最右侧 */
.speed {
	position: relative;
	z-index: 2;
	flex: none;
}

.speed-mask {
	position: fixed;
	inset: 0;
	z-index: 1;
}

.speed-trigger {
	position: relative;
	z-index: 2;
	display: flex;
	align-items: center;
	gap: 3px;
	height: 21px;
	padding: 0 7px;
	border-radius: 11px;
	background: rgba(255, 255, 255, 0.18);
	font-size: 10.5px;
	line-height: 21px;
	font-weight: 500;
	color: #fff;
	letter-spacing: 0.2px;
	font-variant-numeric: tabular-nums;
}

.speed-caret {
	opacity: 0.8;
}

.speed-menu {
	position: absolute;
	right: 0;
	bottom: calc(100% + 6px);
	z-index: 2;
	min-width: 66px;
	margin: 0;
	padding: 4px;
	list-style: none;
	border-radius: 9px;
	background: rgba(20, 24, 32, 0.86);
	box-shadow: 0 8px 20px rgba(0, 0, 0, 0.34);
	backdrop-filter: blur(8px);
}

.speed-option {
	height: 27px;
	padding: 0 10px;
	border-radius: 6px;
	font-size: 11.5px;
	line-height: 27px;
	color: rgba(255, 255, 255, 0.78);
	text-align: center;
	white-space: nowrap;
	cursor: pointer;
	font-variant-numeric: tabular-nums;
}

.speed-option.is-on {
	background: rgba(255, 255, 255, 0.14);
	font-weight: 600;
	color: #fff;
}

.cover-glow {
	position: absolute;
	right: -40px;
	top: -50px;
	width: 160px;
	height: 160px;
	border-radius: 50%;
	background: radial-gradient(circle, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0) 70%);
}

.cover-tag {
	position: relative;
	padding: 2px 8px;
	border-radius: 9px;
	background: rgba(255, 255, 255, 0.16);
	font-size: 10.5px;
	line-height: 15px;
	color: rgba(255, 255, 255, 0.9);
	letter-spacing: 0.3px;
}

.cover-title {
	position: relative;
	margin-top: 8px;
	font-size: 15px;
	line-height: 21px;
	font-weight: 600;
	color: #fff;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
}

.cover-play {
	position: relative;
	display: flex;
	width: 46px;
	height: 46px;
	margin-top: 12px;
	align-items: center;
	justify-content: center;
	border-radius: 50%;
	color: #2f6bff;
	background: rgba(255, 255, 255, 0.94);
	box-shadow: 0 6px 18px rgba(4, 12, 32, 0.35);
	transition: transform 0.16s ease;
}

.cover-play svg {
	margin-left: 2px;
}

.cover-play:active {
	transform: scale(0.94);
}

.cover-meta {
	position: relative;
	margin-top: 8px;
	font-size: 11px;
	line-height: 16px;
	color: rgba(255, 255, 255, 0.72);
}

/* 卡片 */
.panel {
	margin: 10px 10px 0;
	padding: 14px;
	background: #fff;
	border-radius: 12px;
	box-shadow: 0 2px 10px rgba(20, 38, 70, 0.05);
}

.course-name {
	font-size: 18px;
	line-height: 25px;
	font-weight: 600;
	color: #1c1f24;
	letter-spacing: 0.2px;
}

.info-meta {
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	gap: 6px;
	margin-top: 9px;
	font-size: 12px;
	line-height: 17px;
	color: #9aa1a9;
}

.chip {
	padding: 1px 7px;
	border-radius: 3px;
	background: #eef3ff;
	font-size: 11px;
	line-height: 16px;
	color: #3f6ff6;
}

.dot {
	width: 2px;
	height: 2px;
	border-radius: 50%;
	background: #c8ced6;
}

.price {
	margin-left: auto;
	padding: 1px 7px;
	border-radius: 3px;
	background: #fdf3e2;
	font-size: 11px;
	line-height: 16px;
	color: #c58a2b;
}

.price.is-free {
	background: #eaf7ee;
	color: #34a45b;
}

.lecturer {
	margin-top: 8px;
	font-size: 12.5px;
	line-height: 18px;
	color: #6f7783;
}

.progress-wrap {
	display: flex;
	align-items: center;
	gap: 10px;
	margin-top: 12px;
	padding-top: 12px;
	border-top: 1px solid #f0f2f5;
}

.progress-bar {
	flex: 1;
	height: 4px;
	border-radius: 2px;
	background: #eceff4;
	overflow: hidden;
}

.progress-bar i {
	display: block;
	height: 100%;
	border-radius: 2px;
	background: linear-gradient(90deg, #7e9bfb 0%, #4a6ef5 100%);
	transition: width 0.3s ease;
}

.progress-text {
	flex: none;
	font-size: 11.5px;
	line-height: 16px;
	color: #9aa1a9;
}

/* 目录 */
.panel-title {
	display: flex;
	align-items: center;
	justify-content: space-between;
	font-size: 15px;
	font-weight: 600;
	color: #1c1f24;
}

.panel-sub {
	font-size: 11.5px;
	font-weight: 400;
	color: #a5acb4;
}

.chapter-list {
	margin-top: 4px;
}

.chapter {
	display: flex;
	align-items: center;
	gap: 10px;
	padding: 11px 0;
	border-bottom: 1px solid #f0f2f5;
	cursor: pointer;
}

.chapter:last-child {
	border-bottom: none;
	padding-bottom: 2px;
}

.chapter-no {
	position: relative;
	flex: none;
	display: flex;
	width: 22px;
	height: 22px;
	align-items: center;
	justify-content: center;
	border-radius: 50%;
	background: #f4f6fa;
	font-size: 11px;
	line-height: 1;
	color: #9aa1a9;
}

.chapter-title {
	flex: 1;
	min-width: 0;
	font-size: 14px;
	line-height: 20px;
	color: #33373d;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.chapter-time {
	flex: none;
	font-size: 11.5px;
	line-height: 16px;
	color: #b0b6bf;
	font-variant-numeric: tabular-nums;
}

.chapter.is-active .chapter-no {
	background: #4a6ef5;
	color: #fff;
	box-shadow: 0 3px 8px rgba(74, 110, 245, 0.32);
}

.chapter.is-active .chapter-title {
	font-weight: 600;
	color: #2f5df0;
}

.chapter.is-active .chapter-time {
	color: #7a9bf7;
}

.chapter.is-done:not(.is-active) .chapter-no {
	background: #eaf7ee;
	color: #34a45b;
}

/* 当前正在学的章节如果已经学过，序号右下角保留一枚绿色已学标记 */
.chapter.is-done.is-active .chapter-no::after {
	content: "";
	position: absolute;
	right: -2px;
	bottom: -2px;
	width: 9px;
	height: 9px;
	border-radius: 50%;
	background: #34a45b;
	box-shadow: 0 0 0 1.5px #fff;
}

/* 简介 */
.intro {
	margin-top: 8px;
	font-size: 13px;
	line-height: 21px;
	color: #5b626d;
	text-align: justify;
}

/* 底部操作条 */
.bottom-bar {
	position: fixed;
	bottom: 0;
	left: 50%;
	z-index: 20;
	display: flex;
	width: 100%;
	max-width: 480px;
	align-items: center;
	gap: 10px;
	padding: 10px 14px calc(10px + env(safe-area-inset-bottom));
	background: rgba(255, 255, 255, 0.98);
	border-top: 1px solid rgba(20, 38, 70, 0.06);
	box-shadow: 0 -6px 18px rgba(20, 38, 70, 0.06);
	transform: translateX(-50%);
	backdrop-filter: blur(10px);
}

/* 当前章节序号 */
.bar-badge {
	flex: none;
	display: flex;
	width: 36px;
	height: 36px;
	align-items: center;
	justify-content: center;
	border-radius: 11px;
	background: linear-gradient(150deg, #eef4ff 0%, #e1ebff 100%);
	font-size: 13px;
	line-height: 1;
	font-weight: 600;
	color: #2f6bff;
	letter-spacing: 0.2px;
	font-variant-numeric: tabular-nums;
}

.bottom-info {
	flex: 1;
	min-width: 0;
	display: flex;
	flex-direction: column;
	gap: 2px;
}

.bottom-label {
	display: flex;
	align-items: center;
	gap: 4px;
	font-size: 10.5px;
	line-height: 14px;
	color: #9aa1a9;
	letter-spacing: 0.2px;
}

/* 学习中呼吸点 */
.bar-dot {
	position: relative;
	width: 5px;
	height: 5px;
	border-radius: 50%;
	background: #2f6bff;
}

.bar-dot::after {
	content: "";
	position: absolute;
	inset: -3px;
	border-radius: 50%;
	background: rgba(47, 107, 255, 0.3);
	animation: barPulse 1.7s ease-out infinite;
}

@keyframes barPulse {
	0% {
		transform: scale(0.45);
		opacity: 0.9;
	}
	70% {
		transform: scale(1);
		opacity: 0;
	}
	100% {
		opacity: 0;
	}
}

.bottom-name {
	font-size: 13px;
	line-height: 18px;
	font-weight: 500;
	color: #2b3038;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.bottom-btn {
	flex: none;
	display: flex;
	height: 36px;
	align-items: center;
	gap: 3px;
	padding: 0 18px;
	border-radius: 18px;
	font-size: 14px;
	font-weight: 600;
	color: #fff;
	letter-spacing: 0.3px;
	background: linear-gradient(135deg, #3f7dff 0%, #2456f0 100%);
	box-shadow: 0 6px 14px rgba(36, 86, 240, 0.26);
	transition: transform 0.16s ease, box-shadow 0.16s ease;
}

.bottom-btn:active {
	transform: scale(0.96);
	box-shadow: 0 3px 8px rgba(36, 86, 240, 0.22);
}
</style>
