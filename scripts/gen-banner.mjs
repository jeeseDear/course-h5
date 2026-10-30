import { writeFileSync, mkdirSync } from "node:fs"

// 固定种子伪随机，保证每次生成一致
let seed = 20260531
function rnd() {
	seed = (seed * 1103515245 + 12345) & 0x7fffffff
	return seed / 0x7fffffff
}
function pick(min, max) {
	return min + rnd() * (max - min)
}

const W = 375
const H = 160

// 分层建筑：远景 / 中景 / 近景
const layers = [
	{ base: 128, color: "#17395c", op: 0.9, top: [62, 96], w: [10, 26], win: 0.16 },
	{ base: 134, color: "#102842", op: 1, top: [48, 100], w: [12, 30], win: 0.3 },
	{ base: 160, color: "#071322", op: 1, top: [88, 124], w: [16, 38], win: 0.42 }
]

let shapes = ""
layers.forEach((layer, li) => {
	let x = -14
	while (x < W + 14) {
		const w = pick(layer.w[0], layer.w[1])
		const top = pick(layer.top[0], layer.top[1])
		const h = layer.base - top
		const r = 1.5
		shapes += `<rect x="${x.toFixed(1)}" y="${top.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" rx="${r}" fill="${layer.color}" opacity="${layer.op}"/>`
		// 楼顶结构
		if (li === 1 && rnd() > 0.6) {
			shapes += `<rect x="${(x + w * 0.35).toFixed(1)}" y="${(top - 8).toFixed(1)}" width="${(w * 0.3).toFixed(1)}" height="8" fill="${layer.color}"/>`
		}
		if (li === 2 && rnd() > 0.72) {
			shapes += `<rect x="${(x + w * 0.28).toFixed(1)}" y="${(top - 12).toFixed(1)}" width="${(w * 0.44).toFixed(1)}" height="12" rx="1" fill="#0a1a2c"/>`
			shapes += `<rect x="${(x + w * 0.44).toFixed(1)}" y="${(top - 19).toFixed(1)}" width="1.4" height="7" fill="#20405f"/>`
		}
		shapes += `<rect x="${x.toFixed(1)}" y="${top.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" rx="${r}" fill="url(#win${li})" opacity="${layer.win}"/>`
		x += w + pick(1.5, 6)
	}
})

// 中央地标塔
const tower = `
	<g>
		<rect x="168" y="34" width="26" height="112" rx="2" fill="#1d4b78"/>
		<rect x="168" y="34" width="26" height="112" rx="2" fill="url(#winT)" opacity="0.5"/>
		<rect x="176" y="18" width="10" height="17" rx="1" fill="#275d8f"/>
		<rect x="180.6" y="6" width="1.6" height="13" fill="#5aa8e0"/>
		<rect x="164" y="96" width="34" height="50" rx="2" fill="#22547f" opacity="0.9"/>
		<rect x="164" y="96" width="34" height="50" rx="2" fill="url(#winT)" opacity="0.55"/>
	</g>
`

// 两侧副塔
const sideTowers = `
	<g opacity="0.92">
		<rect x="132" y="66" width="20" height="72" rx="2" fill="#1a3f66"/>
		<rect x="132" y="66" width="20" height="72" rx="2" fill="url(#winT)" opacity="0.4"/>
		<rect x="208" y="58" width="22" height="80" rx="2" fill="#1b4269"/>
		<rect x="208" y="58" width="22" height="80" rx="2" fill="url(#winT)" opacity="0.4"/>
	</g>
`

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" preserveAspectRatio="xMidYMid slice">
	<defs>
		<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
			<stop offset="0" stop-color="#03080f"/>
			<stop offset="0.42" stop-color="#08152b"/>
			<stop offset="0.78" stop-color="#10314f"/>
			<stop offset="1" stop-color="#1b4a70"/>
		</linearGradient>
		<radialGradient id="halo" cx="0.5" cy="0.95" r="0.72">
			<stop offset="0" stop-color="#5fc0ff" stop-opacity="0.55"/>
			<stop offset="0.45" stop-color="#2f7fc4" stop-opacity="0.22"/>
			<stop offset="1" stop-color="#0b1c30" stop-opacity="0"/>
		</radialGradient>
		<linearGradient id="road" x1="0" y1="0" x2="1" y2="0">
			<stop offset="0" stop-color="#57b6f0" stop-opacity="0"/>
			<stop offset="0.2" stop-color="#8fe0ff" stop-opacity="0.95"/>
			<stop offset="0.62" stop-color="#6fd0ff" stop-opacity="0.85"/>
			<stop offset="1" stop-color="#3f9ad4" stop-opacity="0"/>
		</linearGradient>
		<linearGradient id="fadeTop" x1="0" y1="0" x2="0" y2="1">
			<stop offset="0" stop-color="#040c18" stop-opacity="0.85"/>
			<stop offset="0.45" stop-color="#040c18" stop-opacity="0"/>
		</linearGradient>
		<pattern id="win0" width="4" height="6" patternUnits="userSpaceOnUse">
			<rect x="1" y="1.6" width="1.5" height="1.9" fill="#8fd0ff"/>
		</pattern>
		<pattern id="win1" width="5" height="7" patternUnits="userSpaceOnUse">
			<rect x="1.2" y="1.8" width="2" height="2.4" fill="#9ad9ff"/>
		</pattern>
		<pattern id="win2" width="6" height="8" patternUnits="userSpaceOnUse">
			<rect x="1.4" y="2" width="2.4" height="2.8" fill="#bfe8ff"/>
		</pattern>
		<pattern id="winT" width="5" height="6" patternUnits="userSpaceOnUse">
			<rect x="1.2" y="1.4" width="2.2" height="2.2" fill="#cdeeff"/>
		</pattern>
		<filter id="blur1"><feGaussianBlur stdDeviation="0.8"/></filter>
		<filter id="blur2"><feGaussianBlur stdDeviation="3.2"/></filter>
	</defs>

	<rect width="${W}" height="${H}" fill="url(#sky)"/>
	<ellipse cx="187" cy="150" rx="210" ry="86" fill="url(#halo)"/>

	<g>${shapes}</g>
	${sideTowers}
	${tower}

	<!-- 地面与环形道路 -->
	<rect x="0" y="138" width="${W}" height="22" fill="#050e19"/>
	<path d="M-10 150 C 70 132, 150 128, 200 134 S 320 148, 385 128" stroke="url(#road)" stroke-width="3" fill="none" filter="url(#blur1)"/>
	<path d="M-10 150 C 70 132, 150 128, 200 134 S 320 148, 385 128" stroke="url(#road)" stroke-width="7" fill="none" opacity="0.35" filter="url(#blur2)"/>
	<path d="M-10 164 C 90 146, 170 142, 220 150 S 330 160, 385 144" stroke="url(#road)" stroke-width="2" fill="none" opacity="0.5" filter="url(#blur1)"/>
	<ellipse cx="188" cy="140" rx="70" ry="10" fill="#7fd8ff" opacity="0.16" filter="url(#blur2)"/>

	<rect width="${W}" height="${H}" fill="url(#fadeTop)"/>
</svg>
`

mkdirSync("src/assets", { recursive: true })
writeFileSync("src/assets/banner.svg", svg, "utf8")
console.log("banner.svg generated", svg.length, "bytes")
