// 聚安动态的主题配色，与 api/news.js 中 6 类题材顺序一一对应
export const newsThemes = [
	{ from: "#5b8def", to: "#82abf7", icon: "bus", name: "来访交流" },
	{ from: "#f0a05a", to: "#f8bd88", icon: "alert", name: "应急调研" },
	{ from: "#3fb59f", to: "#68cdba", icon: "helmet", name: "安全生产" },
	{ from: "#7a7de8", to: "#a3a4f3", icon: "building", name: "项目验收" },
	{ from: "#4a9fd8", to: "#77bdea", icon: "grid", name: "平台上线" },
	{ from: "#e0688a", to: "#ef93ad", icon: "check", name: "安全检查" }
]

export function getNewsTheme(index = 0) {
	const len = newsThemes.length
	return newsThemes[((index % len) + len) % len]
}

export function themeStyle(theme) {
	return {
		background: `linear-gradient(135deg, ${theme.from} 0%, ${theme.to} 100%)`
	}
}
