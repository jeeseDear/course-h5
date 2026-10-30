const cities = [
	"北海市",
	"南宁市",
	"钦州市",
	"防城港市",
	"玉林市",
	"柳州市",
	"桂林市",
	"梧州市"
]

const topics = [
	"交通运输局党组织书记到访新智聚安，助力城市安全水平提升",
	"应急管理局领导调研城市安全感知平台建设情况",
	"安全生产月启动，企业隐患排查治理方案正式发布",
	"城市生命线安全监测项目顺利通过阶段性验收",
	"智慧园区安全感知平台上线试运行，覆盖重点监管场景",
	"重点行业领域安全大检查完成，重点场所实现全覆盖"
]

const START = new Date("2023-05-16T10:27:56").getTime()

function formatTime(timestamp) {
	const d = new Date(timestamp)
	const pad = (n) => String(n).padStart(2, "0")
	return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

// 模拟数据源：8 个城市 × 6 个主题 = 48 条，时间按 7 小时间隔递减
export const newsSource = cities.reduce((acc, city, cityIndex) => {
	topics.forEach((topic, topicIndex) => {
		const index = cityIndex * topics.length + topicIndex
		acc.push({
			id: index + 1,
			title: city + topic,
			time: formatTime(START - index * 7 * 60 * 60 * 1000)
		})
	})
	return acc
}, [])

/**
 * 分页查询聚安动态（模拟接口，后续替换为真实请求）
 * @param {{ page?: number, pageSize?: number, keyword?: string }} params
 */
export function fetchNews({ page = 1, pageSize = 10, keyword = "" } = {}) {
	return new Promise((resolve) => {
		setTimeout(() => {
			const kw = keyword.trim()
			const filtered = kw ? newsSource.filter((item) => item.title.includes(kw)) : newsSource
			const start = (page - 1) * pageSize
			const list = filtered.slice(start, start + pageSize)
			resolve({
				list,
				total: filtered.length,
				hasMore: start + list.length < filtered.length
			})
		}, 350)
	})
}

/* ------------------------------ 详情 mock ------------------------------ */

// 6 类题材的正文模板，blocks 中的城市等变量在调用时注入
const contentTemplates = [
	{
		category: "来访交流",
		author: "品牌运营部",
		auditor: "李 明",
		lead: (city) =>
			`${city}交通运输局党组织书记一行到访新智聚安，围绕城市交通安全风险监测、重点营运车辆动态监管等议题展开交流，双方就下一步深化合作达成初步共识。`,
		blocks: (city) => [
			{
				type: "p",
				text: "在展厅现场，来访领导首先听取了新智聚安关于城市安全感知平台的整体介绍。平台以“一网统管”为主线，整合交通运输、应急管理、消防救援等多源数据，形成覆盖“感知—预警—处置—复盘”的完整闭环。"
			},
			{ type: "h", text: "重点关注三类场景" },
			{
				type: "list",
				items: [
					`${city}重点营运车辆动态监管：接入客运、危货运输车辆的定位与车载视频数据，对超速、疲劳驾驶、不按规定线路行驶等行为实时预警；`,
					"城市交通基础设施监测：对桥梁、隧道、下穿通道等关键节点开展结构健康与积水风险监测，汛期可实现分钟级告警；",
					"节假日客流态势研判：结合历史客流、天气与票务数据，提前输出重点场站的疏导与运力调配建议。"
				]
			},
			{
				type: "figure",
				label: "城市交通安全感知平台",
				caption: "来访领导在展厅了解平台实时运行情况"
			},
			{
				type: "p",
				text: "在随后召开的座谈会上，双方围绕数据共享机制、事件协同处置流程以及基层执法力量的技术支撑展开讨论。书记表示，交通安全治理的关键在于“看得见、判得准、叫得应”，希望平台能力进一步向一线中队下沉。"
			},
			{
				type: "quote",
				text: "技术手段要真正解决一线执法的痛点，把预警信息推到最需要它的人手上，才算把平台用活了。"
			},
			{
				type: "p",
				text: "下一步，新智聚安将结合本次交流形成的意见，细化场景清单与实施计划，先行选择两个重点场站开展试点，成熟后再向全市推广。"
			}
		]
	},
	{
		category: "应急调研",
		author: "政企事业部",
		auditor: "王 睿",
		lead: (city) =>
			`${city}应急管理局领导一行到新智聚安调研城市安全感知平台建设情况，实地查看风险监测预警中心运行状态，并就汛期防治、危化品监管等重点事项进行部署。`,
		blocks: (city) => [
			{
				type: "p",
				text: "调研期间，平台运营团队现场演示了从传感器告警、模型研判到工单派发的完整链路。以燃气泄漏场景为例，系统在接收到浓度异常信号后 8 秒内完成研判，并自动向属地网格员与专业抢修队伍同时推送处置任务。"
			},
			{ type: "h", text: "平台运行情况" },
			{
				type: "list",
				items: [
					`累计接入${city}各类感知设备 1.2 万余台，覆盖燃气、供水、排水、桥梁、边坡等 11 类城市生命线场景；`,
					"日均处理告警事件 300 余起，其中 92% 在 30 分钟内完成闭环处置；",
					"汛期专项模型上线后，内涝风险的预警提前量由平均 26 分钟提升至 58 分钟。"
				]
			},
			{
				type: "p",
				text: "局领导对平台在汛期防范中发挥的作用给予肯定，同时提出三点要求：一是继续扩大感知覆盖，向老旧小区、地下空间等薄弱环节延伸；二是强化跨部门数据协同，打通与消防、住建的数据壁垒；三是完善基层使用体验，减少重复填报。"
			},
			{
				type: "figure",
				label: "风险监测预警中心",
				caption: "值班人员正在对实时告警进行研判"
			},
			{
				type: "p",
				text: "新智聚安表示，将按照调研要求逐项落实，本月底前完成薄弱环节的摸排，并形成感知设备补点方案报审。"
			}
		]
	},
	{
		category: "安全生产",
		author: "安全服务中心",
		auditor: "张 蕾",
		lead: (city) =>
			`以“人人讲安全、个个会应急”为主题，${city}安全生产月活动正式启动，现场同步发布企业隐患排查治理数字化方案，推动安全管理从“事后追责”走向“事前预防”。`,
		blocks: (city) => [
			{
				type: "p",
				text: "启动仪式上，主办方通报了今年以来全市安全生产总体形势，并重点介绍了隐患排查治理数字化方案的落地路径。方案以企业自查、属地抽查、行业核查三级联动为核心，全部流程线上留痕。"
			},
			{ type: "h", text: "方案四大能力" },
			{
				type: "list",
				items: [
					"隐患清单标准化：内置 26 个行业、1800 余条检查项，企业按行业自动匹配检查表单；",
					"排查过程留痕：支持拍照定位、语音描述、AI 辅助识别，杜绝“纸面整改”；",
					"整改闭环跟踪：超期未整改自动升级提醒，重大隐患直报监管部门；",
					"数据看板分析：按区域、行业、隐患类型多维统计，识别高频风险点。"
				]
			},
			{
				type: "quote",
				text: "隐患就是事故，排查治理不能停留在表格上。数字化不是为了多填一张表，而是让每一条隐患都有人管、能闭环。"
			},
			{
				type: "figure",
				label: "安全生产月启动现场",
				caption: "企业代表现场签署安全生产承诺书"
			},
			{
				type: "p",
				text: `本次活动将持续一个月，期间将组织应急演练、安全知识竞赛、专家进企业等系列活动，预计覆盖${city}各类生产经营单位 3000 余家。`
			}
		]
	},
	{
		category: "项目验收",
		author: "交付中心",
		auditor: "陈 磊",
		lead: (city) =>
			`${city}城市生命线安全监测项目顺利通过阶段性验收。验收组对燃气、供水、排水、桥梁四个专项的监测能力进行现场抽查，一致同意通过本次验收。`,
		blocks: (city) => [
			{
				type: "p",
				text: "本次验收覆盖感知层、传输层、平台层三个层面，重点核查设备安装质量、数据接入完整性与预警模型准确率。验收组随机抽取了 18 个监测点位进行现场复核，数据与平台展示一致。"
			},
			{ type: "h", text: "验收关键指标" },
			{
				type: "list",
				items: [
					"设备在线率 99.2%，高于合同约定的 98%；",
					"数据完整率 99.6%，平均时延低于 1.8 秒；",
					"燃气泄漏模型准确率 94.7%，误报率控制在 5% 以内；",
					"桥梁结构监测覆盖 12 座重点桥梁，测点 460 个。"
				]
			},
			{
				type: "figure",
				label: "城市生命线监测中心",
				caption: "验收组现场核查监测数据"
			},
			{
				type: "p",
				text: "验收组同时提出整改意见，包括部分低洼路段液位计安装高度需复核、两处排水管网数据存在短时断流等。项目组已现场记录，并承诺在 10 个工作日内完成整改复测。"
			},
			{
				type: "p",
				text: `下一阶段，项目将进入试运行期，重点验证汛期与用气高峰两个极端工况下的稳定性，为${city}城市生命线安全运行提供持续支撑。`
			}
		]
	},
	{
		category: "平台上线",
		author: "产品研发部",
		auditor: "周 宁",
		lead: (city) =>
			`${city}智慧园区安全感知平台正式上线试运行，首期覆盖 6 个重点园区、142 家企业，实现园区安全风险的统一监测与分级预警。`,
		blocks: (city) => [
			{
				type: "p",
				text: "平台围绕园区“人、车、物、环、管”五个维度构建感知体系，将原本分散在各企业的视频监控、消防主机、用电监测、危化品仓储等系统统一接入，形成园区级的安全运行视图。"
			},
			{ type: "h", text: "首期上线场景" },
			{
				type: "list",
				items: [
					"消防安全：接入消防主机报警与消防水池液位、管网压力数据，报警联动视频复核；",
					"用电安全：对配电房、重点生产线开展电气火灾监测，识别过载、漏电等隐患；",
					"危化品管理：出入库、存储、使用全流程留痕，超量存储自动预警；",
					"人员定位：特殊作业区域人员聚集、滞留超时提醒。"
				]
			},
			{
				type: "figure",
				label: "智慧园区安全感知平台",
				caption: "园区管理方可在大屏查看实时安全态势"
			},
			{
				type: "quote",
				text: "平台的价值不在于接了多少路视频，而在于把风险从“事后发现”变成“事前提醒”。"
			},
			{
				type: "p",
				text: `试运行期间，项目组将驻场收集使用反馈，重点优化告警分级规则与移动端处置体验，计划三个月后启动二期建设，向${city}其余园区推广。`
			}
		]
	},
	{
		category: "安全检查",
		author: "安全服务中心",
		auditor: "赵 岩",
		lead: (city) =>
			`${city}重点行业领域安全大检查顺利完成，累计检查生产经营单位 862 家，重点场所实现全覆盖，一批典型隐患得到闭环整改。`,
		blocks: (city) => [
			{
				type: "p",
				text: "本次大检查聚焦危化品、城镇燃气、建筑施工、交通运输、消防五个重点行业，采取“企业自查 + 部门抽查 + 专家会诊”的方式推进，检查结果全部录入安全监管平台。"
			},
			{ type: "h", text: "检查成果" },
			{
				type: "list",
				items: [
					"检查生产经营单位 862 家，发现各类隐患 2143 项；",
					"已整改完成 2058 项，整改率 96.0%，其余均落实管控措施；",
					"重大隐患 12 项全部挂牌督办，目前已销号 10 项；",
					"责令限期整改 47 家，停产停业整顿 3 家。"
				]
			},
			{
				type: "figure",
				label: "现场安全检查",
				caption: "检查组在企业开展设备设施安全检查"
			},
			{
				type: "p",
				text: "检查中发现的高频问题集中在三方面：一是部分企业安全管理制度与实际运行“两张皮”；二是特殊作业票证审批不规范；三是消防通道占用、应急照明失效等基础性问题反复出现。"
			},
			{
				type: "p",
				text: "针对上述问题，监管部门将建立“一企一档”问题清单，把反复出现的隐患纳入重点监管对象，并借助平台实现整改过程的在线跟踪，防止问题反弹。"
			}
		]
	}
]

/**
 * 查询聚安动态详情（模拟接口）
 * @param {number|string} id
 */
export function fetchNewsDetail(id) {
	return new Promise((resolve) => {
		setTimeout(() => {
			const targetId = Number(id)
			const item = newsSource.find((n) => n.id === targetId)
			if (!item) {
				resolve(null)
				return
			}

			const topicIndex = (targetId - 1) % topics.length
			const cityIndex = Math.floor((targetId - 1) / topics.length)
			const city = cities[cityIndex]
			const tpl = contentTemplates[topicIndex]

			resolve({
				id: item.id,
				title: item.title,
				time: item.time,
				date: item.time.slice(0, 10),
				city,
				category: tpl.category,
				source: "新智聚安",
				author: tpl.author,
				auditor: tpl.auditor,
				views: 320 + ((item.id * 137) % 1860),
				lead: tpl.lead(city),
				blocks: tpl.blocks(city),
				// 相关推荐：同题材的其他城市动态
				related: newsSource
					.filter((n) => n.id !== targetId && (n.id - 1) % topics.length === topicIndex)
					.slice(0, 3)
			})
		}, 300)
	})
}

