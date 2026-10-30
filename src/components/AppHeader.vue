<template>
	<header class="app-header">
		<button class="avatar" type="button" aria-label="我的">
			<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
				<circle cx="12" cy="8.4" r="3.9" fill="#fff" />
				<path d="M12 13.6c-4.2 0-7.2 2.4-7.2 5.4 0 .7.5 1.2 1.2 1.2h12c.7 0 1.2-.5 1.2-1.2 0-3-3-5.4-7.2-5.4z" fill="#fff" />
			</svg>
		</button>
		<h1 class="app-title">首页</h1>
		<span class="header-placeholder"></span>
	</header>
</template>

<style scoped>
.app-header {
	display: grid;
	grid-template-columns: 40px 1fr 40px;
	align-items: center;
	height: 50px;
	padding: 0 15px;
	background: #fff;
}

.avatar {
	width: 36px;
	height: 36px;
	border-radius: 50%;
	background: #2f6bff;
	display: flex;
	align-items: center;
	justify-content: center;
	overflow: hidden;
}

.avatar svg {
	position: relative;
	top: 2px;
}

.app-title {
	font-size: 18px;
	font-weight: 600;
	color: #17181a;
	text-align: center;
	letter-spacing: 0.4px;
}
</style>
