-- 聚安 H5 数据库结构（SQLite）
-- 执行方式：python seed.py --reset 会自动建表并灌入初始数据

PRAGMA foreign_keys = ON;

-- 聚安动态
CREATE TABLE IF NOT EXISTS news (
	id           INTEGER PRIMARY KEY,
	title        TEXT    NOT NULL,
	published_at TEXT    NOT NULL,                 -- YYYY-MM-DD HH:MM:SS
	city         TEXT    NOT NULL,
	category     TEXT    NOT NULL,
	author       TEXT,
	auditor      TEXT,
	views        INTEGER NOT NULL DEFAULT 0,
	lead         TEXT    NOT NULL,                 -- 导语
	blocks       TEXT    NOT NULL,                 -- 正文块，JSON 数组
	created_at   TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_news_published ON news (published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_category ON news (category);

-- 课程
CREATE TABLE IF NOT EXISTS courses (
	id         INTEGER PRIMARY KEY,
	tag        TEXT    NOT NULL,                   -- 分类：人工智能 / 数智化转型 / 安全生产 / 应急管理
	title      TEXT    NOT NULL,
	lessons    INTEGER NOT NULL DEFAULT 0,
	learners   TEXT,
	free       INTEGER NOT NULL DEFAULT 1,         -- 1 免费 / 0 会员
	color_from TEXT    NOT NULL,                   -- 封面渐变起始色（接口中字段名为 from）
	color_to   TEXT    NOT NULL,                   -- 封面渐变结束色（接口中字段名为 to）
	lecturer   TEXT,
	intro      TEXT
);

CREATE INDEX IF NOT EXISTS idx_courses_tag ON courses (tag);

-- 课程章节
CREATE TABLE IF NOT EXISTS chapters (
	id        INTEGER PRIMARY KEY AUTOINCREMENT,
	course_id INTEGER NOT NULL REFERENCES courses (id) ON DELETE CASCADE,
	sort      INTEGER NOT NULL,                    -- 章节序号，从 1 开始
	title     TEXT    NOT NULL,
	duration  TEXT,
	done      INTEGER NOT NULL DEFAULT 0           -- 初始已学标记
);

CREATE INDEX IF NOT EXISTS idx_chapters_course ON chapters (course_id, sort);
