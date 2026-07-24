from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from app.config import settings

class Base(DeclarativeBase):
    pass

engine = create_engine(settings.database_url)
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)

def init_db():
    # create db if not there, then create tables
    db_name = settings.database_url.rsplit("/", 1)[-1]
    base_url = settings.database_url.rsplit("/", 1)[0]
    tmp = create_engine(base_url + "/", isolation_level="AUTOCOMMIT")
    with tmp.connect() as conn:
        conn.execute(text(f"CREATE DATABASE IF NOT EXISTS `{db_name}`"))
    tmp.dispose()
    import app.models.user
    import app.models.audit_log
    import app.models.passport
    import app.models.passport_identity
    import app.models.passport_material
    import app.models.passport_sustainability
    import app.models.passport_compliance
    import app.models.company
    import app.models.supply_chain_edge
    import app.models.verification_claim
    import app.models.passport_certificate
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
