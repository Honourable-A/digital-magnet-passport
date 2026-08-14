from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.provenance import Provenance


router = APIRouter()


@router.get("/passport/{id}/provenance")
def get_provenance(
    id: int,
    db: Session = Depends(get_db)
):

    records = (
        db.query(Provenance)
        .filter(
            Provenance.passport_id == id
        )
        .order_by(
            Provenance.timestamp
        )
        .all()
    )


    return {
        "path": [
            {
                "stage": r.stage,
                "organisation": r.organisation,
                "country": r.country,
                "timestamp": r.timestamp
            }
            for r in records
        ]
    }