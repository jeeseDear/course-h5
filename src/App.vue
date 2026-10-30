<template>
	<router-view v-slot="{ Component, route }">
		<keep-alive :include="cachedViews">
			<component :is="Component" :key="route.path" />
		</keep-alive>
	</router-view>
</template>

<script setup>
// 缓存名单统一在路由 meta.keepAlive 中声明，这里直接取用
import { cachedViews } from "./router"
</script>
