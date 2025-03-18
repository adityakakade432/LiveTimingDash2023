import { useEffect, useState, createContext } from "react";
let SOCKET_URL = "ws://localhost:5173"  //livetimingdash.heroku.com for comp deployment
const ws = new WebSocket(SOCKET_URL)
export const SocketContext = createContext(ws) //this is what is exported in usesocket

interface ISocketProvider {
  children: React.ReactNode
}

export const SocketProvider = (props: ISocketProvider) => {
  const [web, setWeb] = useState<WebSocket>(ws)
  useEffect(() => {
    const onClose = () => {
      setTimeout(() => {
        setWeb(new WebSocket(SOCKET_URL))
      }, 30)
    }
    const onOpen = () => {
      console.log("socket opened");
    }
    ws.addEventListener("open", onOpen)
    console.log(ws.readyState)

    ws.addEventListener("close", onClose)
    return () => {
      ws.removeEventListener("close", onClose)
    }
  }, [ws])
  //need to create a stable websocket server wrapped in a hook to prevent reopening
  //maybe try again with use websocket tbh 
  // or this? https://stackoverflow.com/questions/60152922/proper-way-of-using-react-hooks-websockets



  return (
    <SocketContext.Provider value={ws}>{props.children}</SocketContext.Provider>
  )
}