<template>
	<svg
		:width="size"
		:height="size"
		viewBox="0 0 24 24"
		fill="none"
		:stroke="stroke"
		:stroke-width="strokeWidth"
		stroke-linecap="round"
		stroke-linejoin="round"
		aria-hidden="true"
	>
		<template v-if="type === 'bus'">
			<rect x="4" y="4.8" width="16" height="12.4" rx="2.6" />
			<path d="M4 11.2h16" />
			<circle cx="8.3" cy="18.4" r="1.5" :fill="stroke" stroke="none" />
			<circle cx="15.7" cy="18.4" r="1.5" :fill="stroke" stroke="none" />
		</template>
		<template v-else-if="type === 'alert'">
			<path d="M12 4.6l8.2 13.6H3.8z" />
			<path d="M12 10.2v3.4" />
			<circle cx="12" cy="16" r="0.95" :fill="stroke" stroke="none" />
		</template>
		<template v-else-if="type === 'helmet'">
			<path d="M4.6 15.4a7.4 7.4 0 0114.8 0" />
			<path d="M3 15.4h18" />
			<path d="M12 8v7.4" />
		</template>
		<template v-else-if="type === 'building'">
			<rect x="4.6" y="4.2" width="6.2" height="15.6" rx="1.4" />
			<rect x="13.2" y="9.4" width="6.2" height="10.4" rx="1.4" />
			<path d="M7 7.6v.1M7 11v.1M7 14.4v.1M10 7.6v.1M10 11v.1M10 14.4v.1M15.6 12.4v.1M15.6 15.6v.1" :stroke-width="strokeWidth + 0.5" />
		</template>
		<template v-else-if="type === 'grid'">
			<rect x="4.4" y="4.4" width="6.4" height="6.4" rx="1.6" />
			<rect x="13.2" y="4.4" width="6.4" height="6.4" rx="1.6" />
			<rect x="4.4" y="13.2" width="6.4" height="6.4" rx="1.6" />
			<rect x="13.2" y="13.2" width="6.4" height="6.4" rx="1.6" />
		</template>
		<template v-else>
			<path d="M4.6 6.8h14.8M4.6 12h14.8M4.6 17.2h8.6" />
			<path d="M17.4 15.4l1.6 1.7 2.4-3" />
		</template>
	</svg>
</template>

<script setup>
defineProps({
	type: {
		type: String,
		default: "check"
	},
	size: {
		type: Number,
		default: 26
	},
	stroke: {
		type: String,
		default: "#fff"
	},
	strokeWidth: {
		type: Number,
		default: 1.7
	}
})
</script>
