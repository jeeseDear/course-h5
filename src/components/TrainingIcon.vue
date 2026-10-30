<template>
	<svg :width="size" :height="size" viewBox="0 0 24 24" fill="none" aria-hidden="true">
		<!-- 我的任务：剪贴板 -->
		<template v-if="type === 'task'">
			<rect x="4.6" y="4.4" width="14.8" height="16.2" rx="2.6" fill="#fff" />
			<rect x="8.6" y="2.6" width="6.8" height="3.6" rx="1.5" fill="#fff" stroke="rgba(0,0,0,0.10)" stroke-width="0.8" />
			<path d="M8.2 9.8h7.6M8.2 13.2h7.6M8.2 16.6h4.6" :stroke="color" stroke-width="1.7" stroke-linecap="round" />
		</template>

		<!-- 我的报名：清单打勾 -->
		<template v-else-if="type === 'signup'">
			<rect x="4.2" y="3.4" width="15.6" height="17.2" rx="2.6" fill="#fff" />
			<path d="M7.6 9.4l1.4 1.4 2.4-2.5" :stroke="color" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
			<path d="M14 9.9h3" :stroke="color" stroke-width="1.6" stroke-linecap="round" />
			<path d="M7.6 14.8l1.4 1.4 2.4-2.5" :stroke="color" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
			<path d="M14 15.3h3" :stroke="color" stroke-width="1.6" stroke-linecap="round" />
		</template>

		<!-- 我的消息：对话气泡 -->
		<template v-else-if="type === 'message'">
			<rect x="3.4" y="4.4" width="17.2" height="12.2" rx="3" fill="#fff" />
			<path d="M7.6 16.2v4.2l4.6-4.2z" fill="#fff" />
			<path d="M7.8 8.8h8.4M7.8 11.9h5.4" :stroke="color" stroke-width="1.7" stroke-linecap="round" />
		</template>

		<!-- 学习记录：文档 + 时钟 -->
		<template v-else-if="type === 'record'">
			<rect x="3.6" y="3.2" width="12.4" height="17.4" rx="2.4" fill="#fff" />
			<path d="M6.8 7.4h6M6.8 10.6h6M6.8 13.8h4" :stroke="color" stroke-width="1.6" stroke-linecap="round" />
			<circle cx="17" cy="16.4" r="4.4" fill="#fff" :stroke="color" stroke-width="1.5" />
			<path d="M17 14v2.6l1.8 1.1" :stroke="color" stroke-width="1.4" stroke-linecap="round" />
		</template>

		<!-- 公开课：播放器 -->
		<template v-else-if="type === 'open'">
			<rect x="3.4" y="4.2" width="17.2" height="13.4" rx="2.6" fill="#fff" />
			<path d="M10.4 8.2l4.6 2.7-4.6 2.7z" :fill="color" />
			<path d="M9.6 20.2h4.8" stroke="#fff" stroke-width="1.8" stroke-linecap="round" />
			<path d="M12 17.6v2.6" stroke="#fff" stroke-width="1.8" stroke-linecap="round" />
		</template>

		<!-- 专区课：文件夹 -->
		<template v-else-if="type === 'zone'">
			<path d="M3.4 7.4a2.2 2.2 0 012.2-2.2h3.2l2.1 2.4h7.5a2.2 2.2 0 012.2 2.2v7.6a2.2 2.2 0 01-2.2 2.2H5.6a2.2 2.2 0 01-2.2-2.2z" fill="#fff" />
			<path d="M7.4 12.6h9.2M7.4 15.4h6" :stroke="color" stroke-width="1.6" stroke-linecap="round" />
		</template>

		<!-- 直播频道：摄像机 -->
		<template v-else-if="type === 'live'">
			<rect x="2.8" y="6.2" width="12.8" height="11.6" rx="2.6" fill="#fff" />
			<path d="M16.8 11.2l4.2-2.6v6.8l-4.2-2.6z" fill="#fff" />
			<circle cx="9.2" cy="12" r="2.2" :fill="color" opacity="0.28" />
		</template>

		<!-- 工匠成长：荣誉人物 -->
		<template v-else>
			<circle cx="11" cy="7.6" r="4" fill="#fff" />
			<path d="M3.2 20.8c0-4.1 3.5-6.8 7.8-6.8s7.8 2.7 7.8 6.8z" fill="#fff" />
			<path d="M18.6 3.2l.95 1.95 2.15.31-1.56 1.52.37 2.15-1.91-1.02-1.91 1.02.37-2.15L16.5 5.46l2.15-.31z" fill="#fff" />
		</template>
	</svg>
</template>

<script setup>
defineProps({
	type: {
		type: String,
		default: "task"
	},
	color: {
		type: String,
		default: "#3b7bf6"
	},
	size: {
		type: Number,
		default: 24
	}
})
</script>
