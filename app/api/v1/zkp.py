from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db

from app.models.passport import Passport
from app.models.peer_session import PeerSession

from app.api.v1.signal import send_to_peer


router = APIRouter()


@router.post("/zkp/request")
async def create_zkp_request(
    data: dict,
    db: Session = Depends(get_db)
):

    try:

        print("\n====== ZKP REQUEST RECEIVED ======")
        print(data)


        passport_identifier = data.get(
            "passport_id"
        )


        passport = (
            db.query(Passport)
            .filter(
                Passport.passport_id == passport_identifier
            )
            .first()
        )


        if not passport:

            print(
                "PASSPORT NOT FOUND:",
                passport_identifier
            )

            return {
                "status":"error",
                "message":"Passport not found"
            }


        print(
            "PASSPORT FOUND:",
            passport.passport_id
        )


        manufacturer = (
            db.query(PeerSession)
            .filter(
                PeerSession.role == "MANUFACTURER"
            )
            .first()
        )


        if not manufacturer:

            print(
                "NO MANUFACTURER FOUND"
            )

            return {
                "status":"error",
                "message":"Manufacturer unavailable"
            }


        print(
            "TARGET MANUFACTURER UID:",
            manufacturer.supabase_uid
        )


        print(
            "MANUFACTURER:",
            manufacturer.name
        )


        message = {

            "type":"zkp_request",

            "passport_id":
            passport.passport_id,

            "element":
            data.get("element"),

            "operator":
            data.get("operator"),

            "threshold":
            data.get("threshold")

        }


        await send_to_peer(
            manufacturer.supabase_uid,
            message
        )


        print(
            "ZKP REQUEST SENT TO MANUFACTURER"
        )


        return {

            "status":"pending",

            "passport_id":
            passport.passport_id,

            "manufacturer_uid":
            manufacturer.supabase_uid,

            "manufacturer":
            manufacturer.name,

            "message":
            "ZKP request sent to manufacturer"

        }


    except Exception as error:

        print(
            "\n====== ZKP ERROR ======"
        )

        print(
            repr(error)
        )


        return {

            "status":"error",

            "message":
            str(error)

        }