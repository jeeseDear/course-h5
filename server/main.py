"""聚安 H5 接口服务（FastAPI + SQLite）

首次启动自动建表并灌入初始数据；也可手动重建：
    python seed.py --reset

本地启动：
    cd server
    python -m uvicorn main:app --host 127.0.0.1 --port 8200 --reload

接口文档：http://127.0.0.1:8200/docs
"""

import json
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

import db
from seed import seed as seed_database


@asynccontextmanager
async def lifespan(app):
	# 建表 + 空库时灌入初始数据
	seed_database()
	yield


app = FastAPI(title="聚安 H5 接口服务", version="1.1.0", lifespan=lifespan)

# 本地前端直连（不经 vite 代理）时也能跨域访问
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

NEWS_FIELDS = "id, title, published_at, city, category, author, auditor, views, lead, blocks"
COURSE_FIELDS = "id, tag, title, lessons, learners, free, color_from, color_to, lecturer, intro"


def news_summary(row):
    return {"id": row["id"], "title": row["title"], "time": row["published_at"]}


def course_row(row):
    return {
        "id": row["id"],
        "tag": row["tag"],
        "title": row["title"],
        "lessons": row["lessons"],
        "learners": row["learners"],
        "free": bool(row["free"]),
        "from": row["color_from"],
        "to": row["color_to"],
        "lecturer": row["lecturer"],
        "intro": row["intro"],
    }


def clamp_paging(page, page_size):
    page = max(1, page)
    page_size = max(1, min(100, page_size))
    return page, page_size, (page - 1) * page_size


@app.get("/api/health")
def health():
    with db.session() as conn:
        news = conn.execute("SELECT COUNT(*) AS n FROM news").fetchone()["n"]
        courses = conn.execute("SELECT COUNT(*) AS n FROM courses").fetchone()["n"]
        chapters = conn.execute("SELECT COUNT(*) AS n FROM chapters").fetchone()["n"]
    return {
        "status": "ok",
        "db": str(db.DB_PATH),
        "news": news,
        "courses": courses,
        "chapters": chapters,
    }


@app.get("/api/news")
def list_news(
    page: int = 1,
    page_size: int = Query(10, alias="pageSize"),
    keyword: str = "",
):
    page, page_size, offset = clamp_paging(page, page_size)
    kw = keyword.strip()
    where = "WHERE (:kw = '' OR instr(title, :kw) > 0)"

    with db.session() as conn:
        total = conn.execute(f"SELECT COUNT(*) AS n FROM news {where}", {"kw": kw}).fetchone()["n"]
        rows = conn.execute(
            f"SELECT {NEWS_FIELDS} FROM news {where} ORDER BY published_at DESC LIMIT :limit OFFSET :offset",
            {"kw": kw, "limit": page_size, "offset": offset},
        ).fetchall()

    return {
        "list": [news_summary(row) for row in rows],
        "total": total,
        "hasMore": offset + len(rows) < total,
    }


@app.get("/api/news/{news_id}")
def news_detail(news_id: int):
    with db.session() as conn:
        row = conn.execute(
            f"SELECT {NEWS_FIELDS} FROM news WHERE id = ?", (news_id,)
        ).fetchone()
        if row is None:
            raise HTTPException(status_code=404, detail="动态不存在")
        related = conn.execute(
            """
            SELECT id, title, published_at FROM news
            WHERE category = ? AND id != ?
            ORDER BY published_at DESC
            LIMIT 3
            """,
            (row["category"], news_id),
        ).fetchall()

    return {
        "id": row["id"],
        "title": row["title"],
        "time": row["published_at"],
        "date": row["published_at"][:10],
        "city": row["city"],
        "category": row["category"],
        "source": "新智聚安",
        "author": row["author"],
        "auditor": row["auditor"],
        "views": row["views"],
        "lead": row["lead"],
        "blocks": json.loads(row["blocks"]),
        "related": [news_summary(item) for item in related],
    }


@app.get("/api/course-tags")
def course_tags():
    with db.session() as conn:
        rows = conn.execute(
            "SELECT DISTINCT tag FROM courses ORDER BY tag"
        ).fetchall()
    return [row["tag"] for row in rows]


@app.get("/api/courses")
def list_courses(
    page: int = 1,
    page_size: int = Query(8, alias="pageSize"),
    keyword: str = "",
    tag: str = "",
):
    page, page_size, offset = clamp_paging(page, page_size)
    kw = keyword.strip()
    where = """
    WHERE (:tag = '' OR tag = :tag)
      AND (:kw = '' OR instr(title || tag || COALESCE(lecturer, ''), :kw) > 0)
    """
    params = {"tag": tag, "kw": kw}

    with db.session() as conn:
        total = conn.execute(f"SELECT COUNT(*) AS n FROM courses {where}", params).fetchone()["n"]
        rows = conn.execute(
            f"SELECT {COURSE_FIELDS} FROM courses {where} ORDER BY id LIMIT :limit OFFSET :offset",
            {**params, "limit": page_size, "offset": offset},
        ).fetchall()

    return {
        "list": [course_row(row) for row in rows],
        "total": total,
        "hasMore": offset + len(rows) < total,
    }


@app.get("/api/courses/{course_id}")
def course_detail(course_id: int):
    with db.session() as conn:
        row = conn.execute(
            f"SELECT {COURSE_FIELDS} FROM courses WHERE id = ?", (course_id,)
        ).fetchone()
        if row is None:
            raise HTTPException(status_code=404, detail="课程不存在")
        chapters = conn.execute(
            """
            SELECT sort AS id, title, duration, done FROM chapters
            WHERE course_id = ? ORDER BY sort
            """,
            (course_id,),
        ).fetchall()

    course = course_row(row)
    course["chapters"] = [
        {
            "id": chapter["id"],
            "title": chapter["title"],
            "duration": chapter["duration"],
            "done": bool(chapter["done"]),
        }
        for chapter in chapters
    ]
    return course


@app.get("/api/training/home")
def training_home():
    # 修炼场首屏只展示 4 门推荐课，完整列表走 /api/courses
    with db.session() as conn:
        rows = conn.execute(
            f"SELECT {COURSE_FIELDS} FROM courses ORDER BY id LIMIT 4"
        ).fetchall()
    return {"courses": [course_row(row) for row in rows]}
