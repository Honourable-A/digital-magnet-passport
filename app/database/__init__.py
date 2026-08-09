from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from app.config import settings

class Base(DeclarativeBase):
    pass

engine = create_engine(settings.database_url)
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)

def init_db():
    # only peer_session is owned by FastAPI — all passport/supply-chain tables are managed by Supabase/Next.js
    import app.models.peer_session
    # import app.models.audit_log           # kept — not created by fastapi in supabase stager
    # import app.models.passport            # supabase-managed
    # import app.models.passport_identity   # merged into passport
    # import app.models.passport_material   # supabase-managed
    # import app.models.passport_sustainability  # supabase-managed
    # import app.models.passport_compliance # supabase-managed
    # import app.models.company             # supabase-managed
    # import app.models.supply_chain_edge   # supabase-managed
    # import app.models.verification_claim  # depends on passport.id — supabase-managed
    # import app.models.passport_certificate  # supabase-managed
    # import app.models.passport_event      # supabase-managed
    # import app.models.passport_lineage    # supabase-managed
    # import app.models.passport_custody    # supabase-managed
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
