<template>
	<div class="banner-wrap">
		<van-swipe
			ref="swipeRef"
			class="banner-swipe"
			:autoplay="4500"
			:duration="450"
			:loop="true"
			:show-indicators="false"
			@change="onChange"
		>
			<van-swipe-item v-for="item in banners" :key="item.id">
				<div class="banner" :class="`banner--${item.theme}`" @click="$emit('select', item)">
					<span class="banner-glow"></span>
					<span class="banner-grid"></span>
					<span class="banner-beam"></span>

					<!-- 品牌 -->
					<div class="brand">
						<svg class="brand-mark" viewBox="0 0 32 32" aria-hidden="true">
							<defs>
								<linearGradient :id="`enn-g-${item.id}`" x1="0" y1="1" x2="1" y2="0">
									<stop offset="0" stop-color="#2fbf6a" />
									<stop offset="0.55" stop-color="#a6d94c" />
									<stop offset="1" stop-color="#4fa6ef" />
								</linearGradient>
							</defs>
							<circle cx="16" cy="16" r="15" :fill="`url(#enn-g-${item.id})`" />
							<path d="M16 3.4c7 0 12.6 5.6 12.6 12.6 0 2.1-.5 4-1.4 5.8" stroke="rgba(255,255,255,0.9)" stroke-width="2.2" stroke-linecap="round" fill="none" />
							<path d="M16 28.6C9 28.6 3.4 23 3.4 16c0-2.1.5-4 1.4-5.8" stroke="rgba(255,255,255,0.55)" stroke-width="2.2" stroke-linecap="round" fill="none" />
						</svg>
						<span class="brand-text">
							<em class="brand-cn">新奥集团</em>
							<em class="brand-en">ENN GROUP</em>
						</span>
					</div>

					<!-- 左侧装饰：地球 + 光环 + 盾牌 -->
					<div class="art">
						<span class="art-glow"></span>
						<span class="art-globe"></span>
						<span class="art-ring"></span>
						<span class="art-ring art-ring--sm"></span>
						<span class="art-shield">
							<svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true">
								<path d="M12 2.6l7.4 2.7v6.1c0 4.6-3.1 8.6-7.4 9.9-4.3-1.3-7.4-5.3-7.4-9.9V5.3L12 2.6z" fill="rgba(255,255,255,0.16)" stroke="rgba(255,255,255,0.62)" stroke-width="1.3" />
								<path d="M8.6 11.8l2.4 2.4 4.4-4.6" stroke="rgba(255,255,255,0.9)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none" />
							</svg>
						</span>
						<span class="spark spark--a"></span>
						<span class="spark spark--b"></span>
						<span class="spark spark--c"></span>
					</div>

					<!-- 文案 -->
					<div class="main">
						<p class="kicker"><i></i>{{ item.kicker }}<i></i></p>
						<h2 class="title">{{ item.t1 }}<em>{{ item.accent }}</em>{{ item.t2 }}</h2>
						<p class="sub">{{ item.sub }}</p>
					</div>

					<!-- 右下角说明 -->
					<div class="foot">
						<p v-for="line in item.foot" :key="line">{{ line }}</p>
					</div>
				</div>
			</van-swipe-item>
		</van-swipe>

		<div class="dots">
			<i
				v-for="(item, i) in banners"
				:key="item.id"
				:class="{ 'is-active': i === active }"
				@click="goTo(i)"
			></i>
		</div>
	</div>
</template>

<script setup>
import { ref } from "vue"

defineEmits(["select"])

const active = ref(0)
const swipeRef = ref(null)

const banners = [
	{
		id: 1,
		theme: "blue",
		kicker: "新奥产智安全学习月",
		t1: "产智",
		accent: "安全",
		t2: "轻松学",
		sub: "产智安全靠大家 安全互联你我他",
		foot: ["学习时间：5月5日-5月31日", "学习路径：iCome修炼场-我的任务-产智安全轻松学"]
	},
	{
		id: 2,
		theme: "teal",
		kicker: "安全生产月专题",
		t1: "全员",
		accent: "应急",
		t2: "大练兵",
		sub: "人人讲安全 个个会应急",
		foot: ["活动时间：6月1日-6月30日", "参与入口：iCome修炼场-公开课-应急演练专区"]
	},
	{
		id: 3,
		theme: "violet",
		kicker: "工匠成长计划",
		t1: "技能",
		accent: "认证",
		t2: "闯关季",
		sub: "以赛促学 以练促用 争当岗位能手",
		foot: ["报名时间：即日起至9月30日", "成长通道：iCome修炼场-工匠成长-技能认证"]
	}
]

function onChange(index) {
	active.value = index
}

function goTo(index) {
	swipeRef.value?.swipeTo(index)
}
</script>

<style scoped>
.banner-wrap {
	position: relative;
	margin: 12px 10px 0;
	border-radius: 8px;
	overflow: hidden;
}

.banner-swipe {
	width: 100%;
	aspect-ratio: 583 / 231;
}

.banner {
	position: relative;
	height: 100%;
	overflow: hidden;
	color: #fff;
	cursor: pointer;
}

.banner--blue {
	background: linear-gradient(112deg, #1e3a75 0%, #2b5497 46%, #17356f 100%);
}

.banner--teal {
	background: linear-gradient(112deg, #123c60 0%, #14607f 48%, #0f3352 100%);
}

.banner--violet {
	background: linear-gradient(112deg, #26265f 0%, #3f3187 48%, #1e2058 100%);
}

.banner-glow {
	position: absolute;
	top: -60%;
	right: -8%;
	width: 58%;
	height: 160%;
	border-radius: 50%;
	background: radial-gradient(circle, rgba(120, 188, 255, 0.34) 0%, rgba(120, 188, 255, 0) 68%);
}

.banner-grid {
	position: absolute;
	inset: 0;
	background-image: linear-gradient(rgba(150, 200, 255, 0.13) 1px, transparent 1px),
		linear-gradient(90deg, rgba(150, 200, 255, 0.13) 1px, transparent 1px);
	background-size: 20px 20px;
	-webkit-mask-image: radial-gradient(120% 90% at 62% 46%, #000 26%, transparent 78%);
	mask-image: radial-gradient(120% 90% at 62% 46%, #000 26%, transparent 78%);
}

/* 斜向光带 */
.banner-beam {
	position: absolute;
	top: -40%;
	left: 34%;
	width: 74px;
	height: 180%;
	background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.13) 50%, rgba(255, 255, 255, 0) 100%);
	transform: rotate(24deg);
	filter: blur(1px);
}

/* 品牌 */
.brand {
	position: absolute;
	top: 9px;
	left: 11px;
	z-index: 3;
	display: flex;
	align-items: center;
	gap: 4px;
}

.brand-mark {
	width: 16px;
	height: 16px;
	flex: none;
}

.brand-text {
	display: flex;
	flex-direction: column;
	line-height: 1;
}

.brand-cn {
	font-size: 8px;
	font-style: normal;
	font-weight: 500;
	color: #fff;
	letter-spacing: 0.6px;
}

.brand-en {
	margin-top: 2px;
	font-size: 4.5px;
	font-style: normal;
	font-weight: 400;
	color: rgba(255, 255, 255, 0.72);
	letter-spacing: 0.5px;
}

/* 左侧装饰 */
.art {
	position: absolute;
	left: 10px;
	top: 18px;
	width: 130px;
	height: 106px;
	pointer-events: none;
}

.art-glow {
	position: absolute;
	left: -10px;
	top: 4px;
	width: 92px;
	height: 92px;
	border-radius: 50%;
	background: radial-gradient(circle, rgba(146, 214, 255, 0.42) 0%, rgba(110, 180, 255, 0) 68%);
}

/* 地球 */
.art-globe {
	position: absolute;
	left: 10px;
	top: 12px;
	width: 74px;
	height: 74px;
	border-radius: 50%;
	background: radial-gradient(circle at 34% 30%, rgba(178, 226, 255, 0.92) 0%, rgba(96, 168, 245, 0.55) 42%, rgba(30, 74, 156, 0.35) 72%, rgba(16, 42, 100, 0.2) 100%);
	box-shadow: inset -6px -8px 18px rgba(8, 30, 78, 0.55), inset 4px 4px 14px rgba(196, 234, 255, 0.32), 0 0 22px rgba(96, 176, 255, 0.36);
}

/* 地球经纬线 */
.art-globe::after {
	content: "";
	position: absolute;
	inset: 0;
	border-radius: 50%;
	background-image: repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.14) 0 1px, transparent 1px 9px),
		repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.1) 0 1px, transparent 1px 9px);
	-webkit-mask-image: radial-gradient(circle at 36% 32%, #000 40%, transparent 76%);
	mask-image: radial-gradient(circle at 36% 32%, #000 40%, transparent 76%);
}

/* 环绕光环 */
.art-ring {
	position: absolute;
	left: 3px;
	top: 34px;
	width: 88px;
	height: 48px;
	border: 1px solid rgba(160, 214, 255, 0.42);
	border-radius: 50%;
	transform: rotate(-16deg);
}

.art-ring--sm {
	left: 18px;
	top: 52px;
	width: 60px;
	height: 30px;
	border-color: rgba(160, 214, 255, 0.24);
	transform: rotate(10deg);
}

/* 盾牌 */
.art-shield {
	position: absolute;
	left: 62px;
	top: 44px;
	width: 34px;
	height: 34px;
	filter: drop-shadow(0 3px 8px rgba(8, 26, 64, 0.45));
}

/* 光点 */
.spark {
	position: absolute;
	border-radius: 50%;
	background: rgba(214, 240, 255, 0.9);
	box-shadow: 0 0 6px rgba(150, 210, 255, 0.9);
}

.spark--a {
	left: 4px;
	top: 6px;
	width: 3px;
	height: 3px;
}

.spark--b {
	left: 96px;
	top: 18px;
	width: 2px;
	height: 2px;
	opacity: 0.8;
}

.spark--c {
	left: 30px;
	top: 92px;
	width: 2px;
	height: 2px;
	opacity: 0.65;
}

/* 文案 */
.main {
	position: absolute;
	left: 47%;
	right: 24px;
	top: 44%;
	z-index: 2;
	text-align: center;
	transform: translateY(-50%);
}

.kicker {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 5px;
	font-size: 9px;
	line-height: 1;
	color: rgba(219, 236, 255, 0.9);
	letter-spacing: 0.8px;
	white-space: nowrap;
}

.kicker i {
	flex: none;
	width: 13px;
	height: 1px;
	background: rgba(190, 220, 255, 0.6);
}

.title {
	margin-top: 7px;
	font-size: 19px;
	line-height: 1.08;
	font-weight: 800;
	color: #fff;
	letter-spacing: 1px;
	white-space: nowrap;
	text-shadow: 0 2px 12px rgba(6, 22, 58, 0.5);
}

.title em {
	font-style: normal;
	font-size: 26px;
	letter-spacing: 0.5px;
}

.sub {
	margin-top: 6px;
	font-size: 11px;
	line-height: 1.2;
	font-weight: 500;
	color: rgba(224, 239, 255, 0.9);
	letter-spacing: 0.4px;
	white-space: nowrap;
}

/* 右下角说明 */
.foot {
	position: absolute;
	right: 22px;
	bottom: 8px;
	z-index: 2;
	text-align: left;
	font-size: 8px;
	line-height: 1.75;
	color: rgba(182, 208, 246, 0.66);
	letter-spacing: 0.2px;
}

/* 指示器 */
.dots {
	position: absolute;
	left: 50%;
	bottom: 10px;
	z-index: 4;
	display: flex;
	align-items: center;
	gap: 5px;
	transform: translateX(-50%);
}

.dots i {
	width: 5px;
	height: 5px;
	border-radius: 2.5px;
	background: rgba(255, 255, 255, 0.42);
	box-shadow: 0 1px 3px rgba(6, 26, 60, 0.28);
	cursor: pointer;
	transition: width 0.24s ease, background 0.24s ease;
}

.dots i.is-active {
	width: 13px;
	background: #fff;
}
</style>
