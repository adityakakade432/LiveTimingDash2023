from fastapi import APIRouter, Request, HTTPException
import json

router = APIRouter()

@router.post("/uc24")
async def insert_uc24(request: Request):
    try: 
        data = await request.json()
    except Exception as e:
         raise HTTPException(status_code=400, detail=f"Invalid JSON payload: {e}")

    try: 
        steer_angle = data['steer_angle']
        left_rpm = data['left_rpm']
        right_rpm = data['right_rpm']
        brake_on = data['brake_on']
        accel = data['accel']
        temp = data['temp']
        voltage = data['voltage']
    except KeyError as e:
        missing_field = e.args[0]
        raise HTTPException(status_code=422, detail=f"Missing required field: {missing_field}")

    print(f"Steering Angle: {steer_angle}; Left RPM: {left_rpm}; Right RPM: {right_rpm}; "
          f"Brake On: {brake_on}; Accelerometer: {accel}; Temperature: {temp}; Voltage: {voltage}")
    
    return {
        "message": "Sensor values received", 
        "steer_angle": steer_angle, 
        "left_rpm": left_rpm, 
        "right_rpm": right_rpm, 
        "brake_on": brake_on, 
        "accel": accel, 
        "temp": temp, 
        "voltage": voltage
    }
