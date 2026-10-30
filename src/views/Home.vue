<template>
	<div class="home">
		<div class="topbar">
			<AppHeader />
		</div>

		<div class="banner-wrap">
			<img class="banner" :src="bannerSvg" alt="城市安全感知" />
		</div>

		<NoticeBar />
		<NavGrid />
		<NewsList v-if="loaded" :list="newsList" />
	</div>
</template>

<script setup>
import { onMounted, ref } from "vue"
import AppHeader from "../components/AppHeader.vue"
import NoticeBar from "../components/NoticeBar.vue"
import NavGrid from "../components/NavGrid.vue"
import NewsList from "../components/NewsList.vue"
import bannerSvg from "../assets/banner.svg"
import { fetchNews } from "../api/news"
import { openLoading, closeLoading } from "../utils/loading"

const newsList = ref([])
const loaded = ref(false)

onMounted(async () => {
	openLoading()
	try {
		const res = await fetchNews({ page: 1, pageSize: 10 })
		newsList.value = res.list
	} finally {
		closeLoading()
		loaded.value = true
	}
})
</script>

<style scoped>
.home {
	min-height: 100vh;
	background: #f2f4f8;
}

.topbar {
	position: sticky;
	top: 0;
	z-index: 20;
	background: #fff;
}

.banner-wrap {
	padding: 8px;
	background: transparent;
}

.banner {
	width: 100%;
	height: 156px;
	border-radius: 6px;
	object-fit: cover;
}
</style>
