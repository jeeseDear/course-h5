<template>
	<svg class="news-thumb" viewBox="0 0 63 63" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
		<rect width="63" height="63" :fill="palette.wall" />
		<rect width="63" height="34" :fill="palette.upper" />
		<rect y="46" width="63" height="17" :fill="palette.floor" />

		<!-- 背景人群 -->
		<g :fill="palette.back" opacity="0.42">
			<circle cx="9" cy="21" r="3.8" />
			<path d="M2 63c0-8 3-12 7-12s7 4 7 12z" />
			<circle cx="57" cy="20" r="3.6" />
			<path d="M50 63c0-7.6 3.2-11 7-11s7 3.4 7 11z" />
			<circle cx="37" cy="24" r="3.2" />
			<path d="M31 63c0-6.6 2.6-9.6 6-9.6s6 3 6 9.6z" />
		</g>

		<!-- 前景人物 -->
		<g :fill="palette.suit">
			<path d="M11 63c0-9.8 5.6-14.8 13-14.8S37 53.2 37 63z" />
			<circle cx="24" cy="36.6" r="6.4" :fill="palette.skin" />
			<path d="M17.6 33.6c0-4.4 2.8-7 6.4-7s6.4 2.6 6.4 7c-2-.9-3.9-1.4-6.4-1.4s-4.4.5-6.4 1.4z" :fill="palette.suit" />
		</g>
		<g>
			<path d="M34.4 63c0-9 5.2-13.6 12.2-13.6S58.8 54 58.8 63z" :fill="palette.shirt" />
			<circle cx="46.6" cy="39.6" r="5.6" :fill="palette.skin" />
			<path d="M41 36.8c0-3.9 2.5-6.2 5.6-6.2s5.6 2.3 5.6 6.2c-1.7-.8-3.5-1.2-5.6-1.2s-3.9.4-5.6 1.2z" :fill="palette.suit" />
		</g>
	</svg>
</template>

<script setup>
import { computed } from "vue"

const props = defineProps({
	variant: {
		type: Number,
		default: 0
	}
})

const palettes = [
	{ wall: "#d7dde3", upper: "#e6ebef", floor: "#c2cbd4", back: "#8792a0", suit: "#3c4652", skin: "#e2c3a4", shirt: "#f4f7fa" },
	{ wall: "#dbdbd6", upper: "#e9e9e4", floor: "#c9c6bc", back: "#8b8b80", suit: "#333a42", skin: "#e6c9a8", shirt: "#f6f4ef" },
	{ wall: "#d5dde0", upper: "#e4ecee", floor: "#bfcace", back: "#84919a", suit: "#3a4850", skin: "#dfc0a0", shirt: "#f2f7f9" }
]

const palette = computed(() => palettes[props.variant % palettes.length])
</script>

<style scoped>
.news-thumb {
	width: 63px;
	height: 63px;
	flex: none;
	border-radius: 6px;
	overflow: hidden;
	background: #e9edf1;
}
</style>
