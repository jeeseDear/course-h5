"""建库建表并灌入初始数据。

用法：
    python seed.py            # 建表；news 表为空时灌入初始数据
    python seed.py --reset    # 清空三张表后重新灌入（可反复执行）
"""

import json
import sys

import db
from data_courses import COURSES
from data_news import CITIES, CONTENT_TEMPLATES, NEWS_SOURCE, TOPICS

INSERT_NEWS = """
INSERT INTO news (id, title, published_at, city, category, author, auditor, views, lead, blocks)
VALUES (:id, :title, :published_at, :city, :category, :author, :auditor, :views, :lead, :blocks)
"""

INSERT_COURSE = """
INSERT INTO courses (id, tag, title, lessons, learners, free, color_from, color_to, lecturer, intro)
VALUES (:id, :tag, :title, :lessons, :learners, :free, :color_from, :color_to, :lecturer, :intro)
"""

INSERT_CHAPTER = """
INSERT INTO chapters (course_id, sort, title, duration, done)
VALUES (?, ?, ?, ?, ?)
"""


def build_news_rows():
	"""把列表 + 题材模板展开成 48 条完整记录，正文块序列化为 JSON。"""
	rows = []
	for item in NEWS_SOURCE:
		index = item["id"] - 1
		city = CITIES[index // len(TOPICS)]
		tpl = CONTENT_TEMPLATES[index % len(TOPICS)]
		rows.append(
			{
				"id": item["id"],
				"title": item["title"],
				"published_at": item["time"],
				"city": city,
				"category": tpl["category"],
				"author": tpl["author"],
				"auditor": tpl["auditor"],
				"views": 320 + (item["id"] * 137) % 1860,
				"lead": tpl["lead"](city),
				"blocks": json.dumps(tpl["blocks"](city), ensure_ascii=False),
			}
		)
	return rows


def seed(reset=False):
	db.init_schema()

	with db.session() as conn:
		if reset:
			conn.executescript("DELETE FROM chapters; DELETE FROM courses; DELETE FROM news;")

		news_total = conn.execute("SELECT COUNT(*) AS n FROM news").fetchone()["n"]
		if news_total and not reset:
			return {
				"seeded": False,
				"reason": "数据已存在，加 --reset 可强制重建",
				"news": news_total,
				"courses": conn.execute("SELECT COUNT(*) AS n FROM courses").fetchone()["n"],
			}

		conn.executemany(INSERT_NEWS, build_news_rows())

		chapter_total = 0
		for course in COURSES:
			conn.execute(
				INSERT_COURSE,
				{
					"id": course["id"],
					"tag": course["tag"],
					"title": course["title"],
					"lessons": course["lessons"],
					"learners": course["learners"],
					"free": 1 if course["free"] else 0,
					"color_from": course["from"],
					"color_to": course["to"],
					"lecturer": course["lecturer"],
					"intro": course["intro"],
				},
			)
			for sort, chapter in enumerate(course["chapters"], start=1):
				conn.execute(
					INSERT_CHAPTER,
					(
						course["id"],
						sort,
						chapter["title"],
						chapter["duration"],
						1 if chapter["done"] else 0,
					),
				)
				chapter_total += 1

	return {
		"seeded": True,
		"db": str(db.DB_PATH),
		"news": len(NEWS_SOURCE),
		"courses": len(COURSES),
		"chapters": chapter_total,
	}


if __name__ == "__main__":
	print(seed(reset="--reset" in sys.argv))
