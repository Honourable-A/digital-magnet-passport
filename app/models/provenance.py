from sqlalchemy import Column, Integer, String, DateTime
from app.database import Base


class Provenance(Base):

    __tablename__ = "provenance"

    id = Column(
        Integer,
        primary_key=True
    )

    passport_id = Column(
        Integer,
        nullable=False
    )

    stage = Column(
        String(100),
        nullable=False
    )

    organisation = Column(
        String(255),
        nullable=False
    )

    country = Column(
        String(100),
        nullable=False
    )

    timestamp = Column(
        DateTime,
        nullable=False
    )