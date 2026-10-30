import { showLoadingToast, closeToast } from "vant"

// 多个请求可能同时发生，用计数保证最后一个结束时才关闭
let count = 0

export function openLoading(message = "加载中...") {
	if (count === 0) {
		showLoadingToast({
			message,
			forbidClick: true,
			duration: 0
		})
	}
	count += 1
}

export function closeLoading() {
	count = Math.max(0, count - 1)
	if (count === 0) {
		closeToast()
	}
}
