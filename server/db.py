"""SQLite 连接、建表与会话管理。数据库文件默认与代码同目录（course.db），可用 COURSE_DB 覆盖。"""

import os
import sqlite3
from contextlib import contextmanager
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
SCHEMA_PATH = BASE_DIR / "schema.sql"
DB_PATH = Path(os.environ.get("COURSE_DB") or BASE_DIR / "course.db")


def connect():
	"""每个请求一个连接；sqlite3 连接不能跨线程复用。"""
	DB_PATH.parent.mkdir(parents=True, exist_ok=True)
	conn = sqlite3.connect(DB_PATH)
	conn.row_factory = sqlite3.Row
	conn.execute("PRAGMA foreign_keys = ON")
	return conn


@contextmanager
def session():
	conn = connect()
	try:
		yield conn
		conn.commit()
	except Exception:
		conn.rollback()
		raise
	finally:
		conn.close()


def init_schema():
	"""执行 schema.sql；表已存在时不会重建。"""
	with session() as conn:
		conn.executescript(SCHEMA_PATH.read_text(encoding="utf-8"))


def table_count(table):
	with session() as conn:
		return conn.execute(f"SELECT COUNT(*) AS n FROM {table}").fetchone()["n"]
