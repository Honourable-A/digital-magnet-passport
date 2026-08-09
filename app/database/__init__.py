from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from app.config import settings

class Base(DeclarativeBase):
    pass

engine = create_engine(settings.database_url)
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)

def init_db():
    import app.models.audit_log
    import app.models.passport
    import app.models.passport_material
    import app.models.passport_sustainability
    import app.models.passport_compliance
    import app.models.company
    import app.models.supply_chain_edge
    import app.models.verification_claim
    import app.models.passport_certificate
    import app.models.passport_event
    import app.models.passport_lineage
    import app.models.passport_custody
    import app.models.peer_session
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
