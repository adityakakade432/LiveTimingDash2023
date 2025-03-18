import { useState, useEffect } from "react";
import { useSocket } from "./useSocket";

// type for data. will be updated to match what is sent from mobile dash
interface Data {
  level: number;
  temperature: number;
}

/**
 * A component storing data about the battery
 * @returns a component displaying the battery percentage (level) and temperature
 */
export default function BatteryData() {
  const socket = useSocket()
  const [batt_level, setBatteryLevel] = useState(100);
  const [batt_temp, setBatteryTemp] = useState(0);
  let data: Data = { level: 0, temperature: 0 }

  useEffect(() => {
    const update = (rawData: string) => {
      data = Object.assign(data, JSON.parse(rawData))
      setBatteryLevel(data.level)
      setBatteryTemp(data.temperature)
    } //should be stringified in the server.js file before being sent here
    socket.onmessage = (event: MessageEvent) => {
      update(event.data)
    }
    socket.OPEN

    return () => {
      socket.close()
    }
  }, [socket])

  return (
    <div>
      <p className="measurement_nobg">BATTERY LEVEL: {batt_level}</p>
      <p className="measurement_nobg">BATTERY TEMPERATURE: {batt_temp}</p>
    </div>
  )

}