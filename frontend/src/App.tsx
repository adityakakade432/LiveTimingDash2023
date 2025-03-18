import { io } from "socket.io-client";
import { useState, useEffect } from 'react'
import './App.css'
import { SocketProvider } from './SocketProvider'
import Lapping from './Lapping'
import Header from './Header'
// import BatteryData from './BatteryData'
// import CarData from './CarData'
// import SpeedGraph from './Graph'


let loc = location.host //livetimingdash.heroku.com for comp deployment
let SOCKET_URL = "wss://" + loc + "/insert/uc24"
const socket = io()

interface Data {
  accel: number,
  gps_lat: number,
  gps_long: number,
  left_rpm: number,
  right_rpm: number,
  potent: number,
  temp: number
}
function App() {

  // const [currMsg, setMsg] = useState<string>("")
  // const { lastMessage, readyState } = useWebSocket(SOCKET_URL, { onOpen: () => console.log("socket opened"), shouldReconnect: (closeEvent) => true, retryOnError: true, share: true });
  // console.log("readystate:" + readyState)
  // let data: Data = { power: 0, speed: 0, potench: 0, mc_temp: 0, accel: 0 }
  // useEffect(() => {
  //   if (lastMessage != null) {
  //     setMsg(lastMessage.toString())
  //     data = Object.assign(data, JSON.parse(currMsg))
  //   }
  // }, [lastMessage])
  const [data, setData] = useState<Data>({
    accel: 0,
    gps_lat: 0,
    gps_long: 0,
    left_rpm: 0,
    right_rpm: 0,
    potent: 0,
    temp: 0
  })
  socket.on("connect", () => {
    console.log(socket.id); // x8WIv7-mJelg7on_ALbx
    console.log(socket.connected)
  });
  socket.on("data-sent", (raw) => {
    const temp = Object.assign(data, JSON.parse(raw))
    setData(temp)
  })
  // const [wsStatus, setStatus] = useState<boolean>(false)

  // useEffect(() => {
  //   const ws = new WebSocket(SOCKET_URL)
  //   console.log(ws.readyState)
  //   ws.onopen = () => {
  //     console.log("socket is open")
  //     setStatus(true)
  //   }

  //   ws.onmessage = (e) => {
  //     setData(Object.assign(data, JSON.parse(e.data)))
  //     console.log("recieved data")
  //     ws.send("data recieved!!")
  //   }

  // }, [])

  return (
    <>
      <Header />
      {/* <SocketProvider> */}
      <Lapping accel={data.accel} right_rpm={data.right_rpm} left_rpm={data.left_rpm} potent={data.potent} temp={data.temp} />
      {/* </SocketProvider> */}
      {/* <BatteryData /> */}
    </>
  )
}

export default App
