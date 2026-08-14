from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.passport_sustainability import PassportSustainability
from app.models.passport_material import PassportMaterial
from app.models.verification_claim import VerificationClaim
from app.schemas.verify import RecycledVerifyRequest, ElementVerifyRequest, RecycledZKPRequest
from app.zkp import prove_and_verify_recycled

router = APIRouter()

def save_claim(db, passport_id, claim_type, result):
    claim = VerificationClaim(passport_id=passport_id, claim_type=claim_type, result=result)
    db.add(claim)
    db.commit()

@router.post("/verify/recycled")
def verify_recycled(data: RecycledVerifyRequest, db: Session = Depends(get_db)):
    record = db.query(PassportSustainability).filter(PassportSustainability.passport_id == data.passport_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Sustainability data not found for passport")
    result = record.recycled_content is not None and record.recycled_content > data.threshold
    claim_type = f"RECYCLED_CONTENT_GT_{int(data.threshold)}"
    save_claim(db, data.passport_id, claim_type, result)
    return {"verified": result}

@router.post("/verify/element")
def verify_element(data: ElementVerifyRequest, db: Session = Depends(get_db)):
    record = db.query(PassportMaterial).filter(PassportMaterial.passport_id == data.passport_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Material data not found for passport")
    value = getattr(record, data.element.lower(), None)
    if value is None:
        raise HTTPException(status_code=400, detail=f"Unknown element: {data.element}")
    result = value > data.threshold
    claim_type = f"{data.element.upper()}_THRESHOLD_MET"
    save_claim(db, data.passport_id, claim_type, result)
    return {"verified": result}

@router.post("/verify/recycled/zkp")
def verify_recycled_zkp(data: RecycledZKPRequest, db: Session = Depends(get_db)):
    record = db.query(PassportSustainability).filter(PassportSustainability.passport_id == data.passport_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Sustainability data not found for passport")

    result = prove_and_verify_recycled(record.recycled_content, data.recycled_threshold)
    save_claim(db, data.passport_id, "RECYCLED_ZKP_GT20", result)
    return {"verified": result}

@router.get("/verify/{passport_id}/claims")
def get_claims(passport_id: int, db: Session = Depends(get_db)):
    claims = db.query(VerificationClaim).filter(VerificationClaim.passport_id == passport_id).all()
    return [{"claim_type": c.claim_type, "result": c.result, "verification_date": c.verification_date} for c in claims]
