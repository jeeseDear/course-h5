// 推荐好课 mock 数据（后续替换为真实接口）
// 视频放在 public 下，路径需带上 vite base 前缀（当前部署在 /course/）
export const VIDEO_SRC = `${import.meta.env.BASE_URL}videos/lesson.mp4`

/** 批量生成章节：前两节默认已学，时长按固定表轮换，保证数据稳定 */
function buildChapters(titles) {
	const durations = ["12:18", "16:42", "19:35", "22:07", "14:56", "25:30", "18:04", "11:27"]
	return titles.map((title, i) => ({
		id: i + 1,
		title,
		duration: durations[i % durations.length],
		done: i < 2
	}))
}

export const courses = [
	{
		id: 1,
		tag: "人工智能",
		title: "前沿技术分享会",
		lessons: 6,
		learners: "1.2万",
		free: true,
		from: "#0b1f45",
		to: "#1c4ea6",
		lecturer: "李彦 · 集团智能科技研究院",
		intro:
			"面向集团技术与业务骨干的前沿技术分享，围绕大模型、智能体与多模态三条主线，结合安全巡检、知识问答等真实场景，讲清技术边界与落地路径。",
		chapters: [
			{ id: 1, title: "大模型能力全景与产业落地路径", duration: "12:36", done: true },
			{ id: 2, title: "从 RAG 到 Agent：企业知识问答的工程实践", duration: "18:24", done: true },
			{ id: 3, title: "多模态技术在安全巡检中的应用", duration: "15:08", done: false },
			{ id: 4, title: "模型微调与私有化部署的取舍", duration: "21:15", done: false },
			{ id: 5, title: "智能体工作流编排实操", duration: "26:40", done: false },
			{ id: 6, title: "圆桌：AI 落地的组织与人才准备", duration: "33:02", done: false }
		]
	},
	{
		id: 2,
		tag: "数智化转型",
		title: "先锋训练营",
		lessons: 8,
		learners: "8623",
		free: false,
		from: "#191338",
		to: "#45318f",
		lecturer: "王琳 · 集团数字化转型办公室",
		intro:
			"以业务场景为切口，讲透数智化转型从诊断、立项到规模化复制的完整方法，配套三个业务单元的转型复盘案例。",
		chapters: [
			{ id: 1, title: "开营：为什么转型要从业务价值出发", duration: "09:12", done: true },
			{ id: 2, title: "业务诊断：找到真正值得改的流程", duration: "16:45", done: true },
			{ id: 3, title: "数据底座：先治理还是先应用", duration: "19:20", done: true },
			{ id: 4, title: "场景立项与投入产出测算", duration: "14:38", done: false },
			{ id: 5, title: "小步快跑：试点项目的节奏控制", duration: "17:54", done: false },
			{ id: 6, title: "从试点到规模化：组织与考核", duration: "22:06", done: false },
			{ id: 7, title: "案例复盘：城燃业务单元", duration: "20:31", done: false },
			{ id: 8, title: "案例复盘：能源服务业务单元", duration: "25:17", done: false }
		]
	},
	{
		id: 3,
		tag: "安全生产",
		title: "双重预防机制实务",
		lessons: 5,
		learners: "6541",
		free: true,
		from: "#08302f",
		to: "#14786f",
		lecturer: "陈志远 · 集团安全环保部",
		intro:
			"围绕风险分级管控与隐患排查治理两条主线，逐条拆解双重预防机制的建设要点、常见误区与验收标准。",
		chapters: [
			{ id: 1, title: "双重预防机制的政策脉络与建设要求", duration: "13:05", done: true },
			{ id: 2, title: "风险辨识：作业活动与设备设施两条线", duration: "18:42", done: false },
			{ id: 3, title: "风险评价与四级管控清单编制", duration: "20:18", done: false },
			{ id: 4, title: "隐患排查治理闭环与台账管理", duration: "16:27", done: false },
			{ id: 5, title: "验收要点与常见扣分项", duration: "11:50", done: false }
		]
	},
	{
		id: 4,
		tag: "应急管理",
		title: "现场处置能力提升",
		lessons: 4,
		learners: "4380",
		free: false,
		from: "#3a2408",
		to: "#9a6212",
		lecturer: "赵海峰 · 应急救援指挥中心",
		intro:
			"聚焦一线班组长的现场处置能力，从预案编制、初期处置到信息报送，配套燃气泄漏与受限空间两起典型事故推演。",
		chapters: [
			{ id: 1, title: "现场处置的黄金十分钟", duration: "10:48", done: true },
			{ id: 2, title: "预案编制与演练组织要点", duration: "15:32", done: false },
			{ id: 3, title: "典型事故推演：燃气泄漏", duration: "23:14", done: false },
			{ id: 4, title: "典型事故推演：受限空间作业", duration: "19:06", done: false }
		]
	},
	{
		id: 5,
		tag: "人工智能",
		title: "大模型应用开发实战",
		lessons: 6,
		learners: "9862",
		free: true,
		from: "#07294d",
		to: "#0f5f8f",
		lecturer: "周敏 · 智能科技研究院",
		intro:
			"从接口调用到工程化落地，完整走一遍企业级大模型应用的建设流程，含提示词编排、检索增强、评测与成本控制四个模块。",
		chapters: buildChapters([
			"开发环境与模型选型",
			"提示词编排与结构化输出",
			"检索增强：知识库切分与召回",
			"工具调用与函数注册",
			"效果评测：从人工到自动",
			"成本与延迟优化"
		])
	},
	{
		id: 6,
		tag: "数智化转型",
		title: "数据资产化实操",
		lessons: 5,
		learners: "7432",
		free: false,
		from: "#2b1030",
		to: "#7a2b6b",
		lecturer: "孙彤 · 数据管理部",
		intro:
			"讲清数据从资源到资产的认定路径，覆盖盘点、确权、质量评级与入表四个环节，配套一份可复用的资产目录模板。",
		chapters: buildChapters([
			"数据资产化的政策与口径",
			"数据盘点：从系统到业务对象",
			"数据确权与责任边界划分",
			"质量评级与资产目录编制",
			"数据入表的实务要点"
		])
	},
	{
		id: 7,
		tag: "安全生产",
		title: "动火作业风险管理",
		lessons: 4,
		learners: "5218",
		free: true,
		from: "#0d2a16",
		to: "#1e6b3a",
		lecturer: "马国强 · 集团安全环保部",
		intro:
			"聚焦动火作业这一高风险场景，从作业票办理、气体检测到监护与收尾，逐项拆解管控要点与常见违章。",
		chapters: buildChapters([
			"动火分级与作业票办理",
			"作业前的气体检测与隔离",
			"现场监护与动火过程控制",
			"收尾确认与资料归档"
		])
	},
	{
		id: 8,
		tag: "应急管理",
		title: "消防应急疏散演练",
		lessons: 4,
		learners: "6905",
		free: true,
		from: "#3d1508",
		to: "#a33a12",
		lecturer: "刘建军 · 应急救援指挥中心",
		intro:
			"以高层办公楼与场站两类场景为例，讲清疏散预案编制、演练组织、过程评估与改进闭环的完整做法。",
		chapters: buildChapters([
			"疏散预案的编制要点",
			"演练脚本与角色分工",
			"过程记录与计时方法",
			"评估复盘与预案修订"
		])
	},
	{
		id: 9,
		tag: "人工智能",
		title: "智能体工作流设计",
		lessons: 5,
		learners: "4517",
		free: false,
		from: "#14203d",
		to: "#2a4f8f",
		lecturer: "李彦 · 集团智能科技研究院",
		intro:
			"从单体智能体讲到多智能体协作，结合巡检报告生成、工单分派两个业务样例，讲清编排、兜底与人工介入的设计原则。",
		chapters: buildChapters([
			"智能体的能力边界",
			"单智能体：角色与工具设计",
			"多智能体协作与任务分派",
			"异常兜底与人工接管",
			"业务样例：巡检报告自动生成"
		])
	},
	{
		id: 10,
		tag: "数智化转型",
		title: "数字化产品经理入门",
		lessons: 6,
		learners: "8341",
		free: true,
		from: "#1c2333",
		to: "#3c4a6b",
		lecturer: "王琳 · 集团数字化转型办公室",
		intro:
			"面向业务骨干转型产品岗的基础课，覆盖需求调研、方案设计、指标定义与上线运营，帮助把业务经验转成产品语言。",
		chapters: buildChapters([
			"业务骨干如何转产品岗",
			"需求调研与访谈提纲",
			"方案设计与原型表达",
			"指标定义与验收口径",
			"上线运营与反馈闭环",
			"跨部门协作的沟通技巧"
		])
	},
	{
		id: 11,
		tag: "安全生产",
		title: "设备完整性管理",
		lessons: 5,
		learners: "3876",
		free: false,
		from: "#24300c",
		to: "#5c7a1a",
		lecturer: "陈志远 · 集团安全环保部",
		intro:
			"围绕设备全生命周期，讲清分级分类、检验检测、预防性维护与失效分析的方法，降低非计划停车与设备事故率。",
		chapters: buildChapters([
			"设备分级与完整性策略",
			"检验检测计划编制",
			"预防性维护与备件管理",
			"失效分析与根因追溯",
			"完整性指标与考核"
		])
	},
	{
		id: 12,
		tag: "应急管理",
		title: "危化品泄漏处置",
		lessons: 5,
		learners: "5633",
		free: true,
		from: "#3a2008",
		to: "#b3600f",
		lecturer: "赵海峰 · 应急救援指挥中心",
		intro:
			"以场站储罐与槽车两类泄漏场景为主线，讲清警戒区划定、堵漏与围控、人员防护与洗消的处置流程。",
		chapters: buildChapters([
			"危化品特性与危害识别",
			"警戒区划定与人员疏散",
			"堵漏与围控技术要点",
			"个体防护与洗消流程",
			"信息报送与协同处置"
		])
	},
	{
		id: 13,
		tag: "人工智能",
		title: "提示词工程进阶",
		lessons: 4,
		learners: "1.5万",
		free: true,
		from: "#0b1f45",
		to: "#2b6fb8",
		lecturer: "周敏 · 智能科技研究院",
		intro:
			"面向已具备基础使用经验的学员，讲清结构化提示词、少样本示例、思维链与自我校验四类技巧的适用边界。",
		chapters: buildChapters([
			"提示词的四个组成要素",
			"少样本示例的设计方法",
			"思维链与分步推理",
			"自我校验与结果稳定性"
		])
	},
	{
		id: 14,
		tag: "数智化转型",
		title: "低代码平台落地",
		lessons: 5,
		learners: "6720",
		free: false,
		from: "#191338",
		to: "#5a3fa0",
		lecturer: "孙彤 · 数据管理部",
		intro:
			"讲清低代码适用的场景边界、平台选型维度与治理机制，配套三个业务部门自建应用的实践案例。",
		chapters: buildChapters([
			"低代码适合做什么",
			"平台选型的五个维度",
			"应用搭建：从表单到流程",
			"权限与数据安全管理",
			"自建应用的治理机制"
		])
	},
	{
		id: 15,
		tag: "安全生产",
		title: "有限空间作业规范",
		lessons: 4,
		learners: "4402",
		free: true,
		from: "#08302f",
		to: "#1a8a7d",
		lecturer: "马国强 · 集团安全环保部",
		intro:
			"针对中毒窒息事故高发环节，讲清作业审批、通风置换、气体监测与应急救援的强制要求与违章红线。",
		chapters: buildChapters([
			"有限空间辨识与台账",
			"作业审批与安全交底",
			"通风置换与气体监测",
			"监护要求与应急救援"
		])
	},
	{
		id: 16,
		tag: "应急管理",
		title: "事故案例复盘工作坊",
		lessons: 4,
		learners: "3980",
		free: false,
		from: "#3d1508",
		to: "#8f3a1a",
		lecturer: "刘建军 · 应急救援指挥中心",
		intro:
			"用四起真实事故的完整时间线做复盘，训练从现象到根因的追溯能力，输出可执行的改进清单。",
		chapters: buildChapters([
			"复盘的方法论与常见误区",
			"案例一：受限空间中毒事故",
			"案例二：检维修动火事故",
			"改进清单与跟踪机制"
		])
	}
]

/** 按 id 取课程，找不到返回 null */
export function getCourse(id) {
	return courses.find((item) => item.id === Number(id)) || null
}

/**
 * 拉取课程详情（模拟接口，后续替换为真实请求）
 * @param {string|number} id
 */
export function fetchCourse(id) {
	return new Promise((resolve) => {
		setTimeout(() => resolve(getCourse(id)), 320)
	})
}

/**
 * 拉取修炼场首屏数据（模拟接口，后续替换为真实请求）
 * 首页只展示 4 门推荐课，完整列表走课程列表页
 */
export function fetchTrainingHome() {
	return new Promise((resolve) => {
		setTimeout(() => resolve({ courses: courses.slice(0, 4) }), 320)
	})
}

/** 课程分类（列表页筛选用） */
export const courseTags = ["人工智能", "数智化转型", "安全生产", "应急管理"]

/**
 * 分页查询课程列表（模拟接口，后续替换为真实请求）
 * @param {{ page?: number, pageSize?: number, keyword?: string, tag?: string }} params
 */
export function fetchCourseList({ page = 1, pageSize = 8, keyword = "", tag = "" } = {}) {
	return new Promise((resolve) => {
		setTimeout(() => {
			const kw = keyword.trim()
			const list = courses.filter((item) => {
				const hitTag = !tag || item.tag === tag
				const hitKw = !kw || (item.title + item.tag + item.lecturer).includes(kw)
				return hitTag && hitKw
			})
			const start = (page - 1) * pageSize
			const rows = list.slice(start, start + pageSize)
			resolve({
				list: rows,
				total: list.length,
				hasMore: start + rows.length < list.length
			})
		}, 350)
	})
}
