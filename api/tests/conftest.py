import os
import tempfile

# main을 import하기 전에 테스트용 DB로 바꿔 둔다
_db_file = os.path.join(tempfile.mkdtemp(), "test.db")
os.environ["DATABASE_URL"] = f"sqlite:///{_db_file}"
os.environ.pop("API_KEY", None)
