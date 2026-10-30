<template>
	<div class="cover" :style="themeStyle(theme)">
		<span class="cover-blur"></span>
		<NewsIcon class="cover-icon" :type="theme.icon" :size="26" />
	</div>
</template>

<script setup>
import { computed } from "vue"
import NewsIcon from "./NewsIcon.vue"
import { getNewsTheme, themeStyle } from "../utils/newsTheme"

const props = defineProps({
	index: {
		type: Number,
		default: 0
	}
})

const theme = computed(() => getNewsTheme(props.index))
</script>

<style scoped>
.cover {
	position: relative;
	width: 72px;
	height: 72px;
	flex: none;
	border-radius: 10px;
	display: flex;
	align-items: center;
	justify-content: center;
	overflow: hidden;
}

/* 右下角一枚柔光，避免纯色块显得死板 */
.cover-blur {
	position: absolute;
	right: -16px;
	bottom: -20px;
	width: 58px;
	height: 58px;
	border-radius: 50%;
	background: rgba(255, 255, 255, 0.22);
}

.cover-icon {
	position: relative;
	z-index: 1;
}
</style>
