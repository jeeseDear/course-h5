// 记录「主动进入某页面时需要重新加载」的标记
// 用法：跳转前 markRefresh(path)，页面 onActivated 里 consumeRefresh(path) 消费一次
const flags = new Set()

export function markRefresh(path) {
	flags.add(path)
}

export function consumeRefresh(path) {
	if (!flags.has(path)) return false
	flags.delete(path)
	return true
}
