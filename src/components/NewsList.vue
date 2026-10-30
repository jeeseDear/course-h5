<template>
	<section class="news">
		<div class="news-head">
			<h2 class="news-title">聚安动态</h2>
			<button class="news-more" type="button" @click="goMore">
				更多
				<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
					<path d="M6 3.2L10.6 8 6 12.8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none" />
				</svg>
			</button>
		</div>

		<div class="news-card">
			<ul class="news-list">
				<li v-for="(item, index) in list" :key="item.id" class="news-item" @click="goDetail(item.id)">
					<NewsThumb :variant="index" />
					<div class="news-info">
						<p class="news-name">{{ item.title }}</p>
						<span class="news-time">{{ item.time }}</span>
					</div>
				</li>
			</ul>
		</div>
	</section>
</template>

<script setup>
import { useRouter } from "vue-router"
import NewsThumb from "./NewsThumb.vue"

defineProps({
	list: {
		type: Array,
		default: () => []
	}
})

const router = useRouter()

function goMore() {
	router.push("/news")
}

function goDetail(id) {
	router.push(`/news/${id}`)
}
</script>

<style scoped>
.news {
	padding: 4px 10px 20px;
}

.news-head {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 8px 0 12px;
}

.news-title {
	font-size: 17px;
	line-height: 1.2;
	font-weight: 600;
	color: #1a1d21;
	letter-spacing: 0.2px;
}

/* 设计稿 750 基准：width 64 / height 44 / font-size 32 / line-height 44，此处按 375 折半 */
.news-more {
	display: flex;
	align-items: center;
	gap: 2px;
	height: 22px;
	font-size: 16px;
	font-weight: 600;
	line-height: 22px;
	color: #676767;
	font-family: "PingFang SC", -apple-system, BlinkMacSystemFont, "Helvetica Neue", "Microsoft YaHei", sans-serif;
}

.news-card {
	background: #fff;
	border-radius: 8px;
	padding: 0 11px;
	box-shadow: 0 1px 6px rgba(17, 34, 68, 0.05);
}

.news-item {
	display: flex;
	align-items: center;
	gap: 9px;
	padding: 12px 0;
	border-bottom: 1px solid #eaeaea;
	cursor: pointer;
	transition: opacity 0.18s ease;
}

.news-item:active {
	opacity: 0.6;
}

.news-item:last-child {
	border-bottom: none;
}

.news-info {
	flex: 1;
	min-width: 0;
	display: flex;
	flex-direction: column;
}

/* 设计稿 750 基准：width 520 / height 88 / font-size 32 / line-height 44，此处按 375 折半 */
.news-name {
	flex: 1;
	min-width: 0;
	max-height: 44px;
	font-size: 16px;
	font-weight: 600;
	color: #393939;
	line-height: 22px;
	font-family: "PingFang SC", -apple-system, BlinkMacSystemFont, "Helvetica Neue", "Microsoft YaHei", sans-serif;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
}

/* 设计稿 750 基准：width 487 / height 32 / font-size 28 / line-height 32 / 上边距 4，此处按 375 折半 */
.news-time {
	flex: 1;
	min-width: 0;
	margin-top: 2px;
	height: 16px;
	font-size: 14px;
	font-weight: 400;
	line-height: 16px;
	color: #929292;
	font-family: "PingFang SC", -apple-system, BlinkMacSystemFont, "Helvetica Neue", "Microsoft YaHei", sans-serif;
	letter-spacing: 0.2px;
}
</style>
