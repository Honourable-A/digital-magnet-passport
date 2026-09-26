from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import json


router = APIRouter()


rooms = {}



async def send_to_peer(
    room: str,
    message: dict
):

    print(
        "SENDING WS MESSAGE TO:",
        room
    )


    connections = rooms.get(
        room,
        []
    )


    print(
        "ACTIVE CONNECTIONS:",
        len(connections)
    )


    for connection in connections:

        await connection.send_json(
            message
        )



@router.websocket(
    "/ws/signal/{room}"
)
async def websocket_endpoint(
    websocket: WebSocket,
    room: str
):

    await websocket.accept()


    print(
        "WS CONNECTED:",
        room
    )


    if room not in rooms:

        rooms[room] = []


    rooms[room].append(
        websocket
    )


    try:

        while True:

            data = await websocket.receive_text()

            message = json.loads(
                data
            )


            print(
                "WS MESSAGE:",
                message
            )


            for connection in rooms.get(room, []):

                if connection != websocket:

                    await connection.send_json(
                        message
                    )



    except WebSocketDisconnect:


        print(
            "WS DISCONNECTED:",
            room
        )


        if websocket in rooms.get(room, []):

            rooms[room].remove(
                websocket
            )


        if room in rooms and not rooms[room]:

            del rooms[room]