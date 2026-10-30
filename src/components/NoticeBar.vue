<template>
	<section class="notice">
		<div class="notice-label">
			<span class="label-msg">消息</span>
			<span class="label-notice">通知</span>
		</div>
		<span class="notice-divider"></span>
		<p class="notice-text">请大家在5月31日之前完成新奥产智学习考试</p>
		<div class="notice-action">
			<svg viewBox="0 0 20 18" width="17" height="15" aria-hidden="true">
				<rect x="0" y="1" width="12.6" height="4.6" rx="1.1" fill="#b9bfc7" />
				<rect x="0" y="8" width="17" height="1.7" rx="0.85" fill="#c7ccd3" />
				<rect x="0" y="12.4" width="17" height="1.7" rx="0.85" fill="#c7ccd3" />
				<rect x="0" y="16.8" width="11" height="1.7" rx="0.85" fill="#c7ccd3" />
			</svg>
			<span class="notice-badge">5</span>
		</div>
	</section>
</template>

<style scoped>
.notice {
	display: flex;
	align-items: center;
	gap: 10px;
	margin: 0 8px 10px;
	padding: 13px 14px;
	background: #fff;
	border-radius: 8px;
	box-shadow: 0 1px 6px rgba(17, 34, 68, 0.05);
}

.notice-label {
	display: flex;
	flex-direction: column;
	flex: none;
	font-size: 13px;
	line-height: 1.42;
	font-weight: 500;
	letter-spacing: 0.3px;
}

.label-msg {
	color: #3582e0;
}

.label-notice {
	color: #111214;
}

.notice-divider {
	flex: none;
	width: 1px;
	height: 22px;
	background: #e5e8ed;
}

.notice-text {
	flex: 1;
	min-width: 0;
	font-size: 13px;
	line-height: 1.5;
	color: #33373d;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
}

.notice-action {
	position: relative;
	flex: none;
	display: flex;
	align-items: center;
	padding: 4px 0 4px 2px;
}

.notice-badge {
	position: absolute;
	top: -4px;
	right: -6px;
	min-width: 15px;
	height: 15px;
	padding: 0 4px;
	border-radius: 8px;
	background: #f2463c;
	color: #fff;
	font-size: 10px;
	line-height: 15px;
	text-align: center;
	font-weight: 500;
}
</style>
