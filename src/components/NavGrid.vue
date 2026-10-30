<template>
	<section class="nav-card">
		<van-swipe
			ref="swipeRef"
			class="nav-swipe"
			:loop="false"
			:show-indicators="false"
			:duration="320"
			@change="onChange"
		>
			<van-swipe-item v-for="(page, pi) in pages" :key="pi">
				<div class="nav-grid">
					<div
						v-for="item in page"
						:key="item.key"
						class="nav-item"
						:class="{ 'is-plan': item.plan, 'is-link': item.path }"
						@click="onNavClick(item)"
					>
						<div class="nav-icon" :style="{ background: item.color }">
							<svg v-if="item.icon === 'pen'" viewBox="0 0 24 24" width="21" height="21" aria-hidden="true">
								<rect x="4.2" y="3.2" width="13.6" height="17.6" rx="2.2" fill="#fff" />
								<rect x="7" y="7" width="8" height="1.5" rx="0.75" fill="#3b7bf6" opacity="0.55" />
								<rect x="7" y="10.6" width="6" height="1.5" rx="0.75" fill="#3b7bf6" opacity="0.55" />
								<path d="M15.4 13.1l4.4-4.4 2.1 2.1-4.4 4.4-2.6.5z" fill="#fff" stroke="#3b7bf6" stroke-width="1.1" stroke-linejoin="round" />
							</svg>
							<svg v-else-if="item.icon === 'building'" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
								<path d="M3 21V8.4l6.6-3.8v16.4H3zm8.2 0V11l9.8 4.2V21h-9.8z" fill="#fff" />
							</svg>
							<svg v-else-if="item.icon === 'chart'" viewBox="0 0 24 24" width="21" height="21" aria-hidden="true">
								<rect x="3.4" y="12" width="4" height="8.4" rx="1" fill="#fff" />
								<rect x="10" y="7.6" width="4" height="12.8" rx="1" fill="#fff" />
								<rect x="16.6" y="3.6" width="4" height="16.8" rx="1" fill="#fff" />
							</svg>
							<svg v-else-if="item.icon === 'people'" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
								<circle cx="9" cy="8.4" r="3.4" fill="#fff" />
								<path d="M9 13.2c-3.4 0-6 2-6 4.6 0 .7.5 1.2 1.2 1.2h9.6c.7 0 1.2-.5 1.2-1.2 0-2.6-2.6-4.6-6-4.6z" fill="#fff" />
								<circle cx="17.2" cy="9.2" r="2.6" fill="#fff" opacity="0.8" />
								<path d="M17.2 13c-1.1 0-2.1.4-2.8 1 2 .9 3.4 2.3 3.9 4h3c.7 0 1.2-.5 1.2-1.2 0-2.1-2.3-3.8-5.3-3.8z" fill="#fff" opacity="0.8" />
							</svg>
							<svg v-else-if="item.icon === 'shield'" viewBox="0 0 24 24" width="21" height="21" aria-hidden="true">
								<path d="M12 2.6l7.4 2.9v6.1c0 4.4-3 8.2-7.4 9.8-4.4-1.6-7.4-5.4-7.4-9.8V5.5L12 2.6z" fill="#fff" />
								<path d="M8.4 11.9l2.6 2.6 4.6-4.7" stroke="#2c4a66" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" fill="none" />
							</svg>
							<svg v-else viewBox="0 0 24 24" width="21" height="21" aria-hidden="true">
								<path d="M12 3.2c-2.4 0-4 1.5-4 3.6v1.4H6.6c-.7 0-1.2.5-1.2 1.2v10.4c0 .7.5 1.2 1.2 1.2h10.8c.7 0 1.2-.5 1.2-1.2V9.4c0-.7-.5-1.2-1.2-1.2H16V6.8c0-2.1-1.6-3.6-4-3.6zm0 1.9c1.2 0 2 .7 2 1.7v1.4h-4V6.8c0-1 .8-1.7 2-1.7z" fill="#fff" />
								<circle cx="12" cy="14.4" r="1.7" fill="#2c4a66" />
							</svg>
							<span v-if="item.plan" class="plan-tag">规划中</span>
						</div>
						<span class="nav-label">{{ item.name }}</span>
					</div>
				</div>
			</van-swipe-item>
		</van-swipe>

		<div v-if="pages.length > 1" class="nav-dots">
			<i
				v-for="(page, index) in pages"
				:key="index"
				class="dot"
				:class="{ 'is-active': index === activeIndex }"
				@click="goTo(index)"
			></i>
		</div>
	</section>
</template>

<script setup>
import { computed, ref } from "vue"
import { useRouter } from "vue-router"

// 8 个为一行宫格（4 列 × 2 行），超过则自动分页
const PER_PAGE = 8

const router = useRouter()

const navs = [
	{ key: "train", name: "修炼场", color: "#3b7bf6", icon: "pen", plan: false, path: "/training" },
	{ key: "supervise", name: "监督检查", color: "#3e5b52", icon: "building", plan: true },
	{ key: "hidden", name: "隐患跟踪", color: "#7b4a33", icon: "building", plan: true },
	{ key: "annual", name: "年度统计", color: "#586a7a", icon: "chart", plan: true },
	{ key: "enterprise", name: "企业管理", color: "#2c4a66", icon: "building", plan: true },
	{ key: "staff", name: "从业人员", color: "#2c4a66", icon: "people", plan: true },
	{ key: "assess", name: "安全评价", color: "#2c4a66", icon: "shield", plan: true },
	{ key: "law", name: "安全法规", color: "#2c4a66", icon: "lock", plan: true },
	{ key: "drill", name: "应急演练", color: "#2f5a56", icon: "shield", plan: true },
	{ key: "warning", name: "风险预警", color: "#7b4a33", icon: "chart", plan: true },
	{ key: "accident", name: "事故管理", color: "#3c4a63", icon: "building", plan: true },
	{ key: "training", name: "培训档案", color: "#3e5b52", icon: "pen", plan: true },
	{ key: "inspect", name: "检查计划", color: "#586a7a", icon: "people", plan: true },
	{ key: "rectify", name: "整改跟踪", color: "#2c4a66", icon: "shield", plan: true },
	{ key: "license", name: "证照管理", color: "#34506b", icon: "lock", plan: true },
	{ key: "board", name: "数据看板", color: "#4a4438", icon: "chart", plan: true }
]

const pages = computed(() => {
	const result = []
	for (let i = 0; i < navs.length; i += PER_PAGE) {
		result.push(navs.slice(i, i + PER_PAGE))
	}
	return result
})

const activeIndex = ref(0)
const swipeRef = ref(null)

function onChange(index) {
	activeIndex.value = index
}

function goTo(index) {
	swipeRef.value?.swipeTo(index)
}

function onNavClick(item) {
	if (!item.path || item.plan) return
	router.push(item.path)
}
</script>

<style scoped>
.nav-card {
	margin: 0 8px 8px;
	padding: 18px 4px 12px;
	background: #fff;
	border-radius: 8px;
	box-shadow: 0 1px 6px rgba(17, 34, 68, 0.05);
	overflow: hidden;
}

.nav-swipe {
	height: 139px;
}

.nav-grid {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	grid-auto-rows: 61.5px;
	row-gap: 16px;
	align-content: start;
}

.nav-item {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.nav-item.is-link {
	cursor: pointer;
	transition: transform 0.16s ease;
}

.nav-item.is-link:active {
	transform: scale(0.92);
}

.nav-icon {
	position: relative;
	width: 42px;
	height: 42px;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	overflow: hidden;
}

.nav-item.is-plan .nav-icon svg {
	opacity: 0.22;
}

.plan-tag {
	position: absolute;
	left: 0;
	right: 0;
	top: 50%;
	transform: translateY(-50%);
	text-align: center;
	font-size: 9.5px;
	line-height: 1;
	color: #fff;
	opacity: 0.62;
	letter-spacing: 0.2px;
	pointer-events: none;
}

.nav-label {
	margin-top: 8px;
	font-size: 11.5px;
	line-height: 1;
	color: #2b2f36;
	white-space: nowrap;
}

.nav-item.is-plan .nav-label {
	color: #b2b7be;
}

.nav-dots {
	display: flex;
	align-items: stretch;
	justify-content: center;
	width: fit-content;
	height: 5px;
	margin: 8px auto 0;
	border-radius: 2.5px;
	overflow: hidden;
	background: #e6e6e6;
}

.dot {
	width: 25px;
	height: 5px;
	background: #e6e6e6;
	transition: background 0.25s ease;
	cursor: pointer;
}

.dot.is-active {
	background: #0e5fae;
}
</style>
