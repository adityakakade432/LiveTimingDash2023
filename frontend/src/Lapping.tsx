import React, { useContext, useEffect } from "react"
import { useSocket } from "./useSocket"
import SpeedGraph from "./Graph";

const TICK_SIZE = 10
const NAN_STRING = "--"

// interface Data {
//   power: number,
//   speed: number,
//   potench: number,
//   mc_temp: number,
//   accel: number
// }
/**
 * Given a number time, format it to look like 00:00:00. Time is in milliseconds. 
 * If the given time is NaN, just returns "---". If the given time is not a number 
 * (as in it's a string or something), then just return that too.
 */
function formatTime(time: number) {
  if (isNaN(time)) return NAN_STRING

  // get the centiseconds (/ 10) and truncate to two decimals (% 100)
  const centiseconds = Math.floor(time / 10 % 100)
  const seconds = Math.floor(time / 1000)
  const minutes = Math.floor(seconds / 60)

  return [minutes, seconds, centiseconds]
    // make into strings
    .map(n => `${n}`)
    // add leading zeros
    .map(s => s.length === 1 ? "0" + s : s)
    // combine with colon
    .join(":")
}

/**
 * A method abstracting the timer format (label and time)
 * @param namethe label for this Timer
 * @param value the time displayed
 * @param children: rest of elements in div
 * @returns Formatted timer div
 */
const Timer = ({ name, value, children }: { name: string, value: number, children: JSX.Element | JSX.Element[] }) => (
  <div className="timer_element" id={name.toLowerCase().replace(" ", "_")}>
    <p className="lap_header" id={name.toLowerCase().replace(" ", "_")}>
      {name.toUpperCase()}
    </p>

    <div className="lap_data">
      <div className="Stopwatch">
        <div className="Stopwatch-display">
          {formatTime(value)}
        </div>
      </div>
    </div>
    <div>
      {children}
    </div>
  </div>)

interface LappingProps {
  accel: number,
  left_rpm: number,
  right_rpm: number,
  potent: number,
  temp: number
}
export default function Lapping(props: LappingProps) {
  // const socket = useSocket();
  // state functions for whether timer is on or off
  const [runningTime, setRunningTime] = React.useState<boolean>(false)

  //state functions for discrete values
  const [currentTime, setCurrentTime] = React.useState<number>(0)
  const [currentWatts, setCurrentWatts] = React.useState<number>(0)
  const [totalWatts, setTotalWatts] = React.useState<number>(0)

  // array of all values for each data point -> could be used for graphs..?
  const [completedTime, setCompletedTime] = React.useState<number[]>([])
  const [completedWatts, setCompletedWatts] = React.useState<number[]>([])

  //lap number
  const [lapNum, updateLapNum] = React.useState<number>(0)

  //setting timer
  useEffect(() => {
    const ticker = setInterval(() => {
      if (runningTime) {
        setCurrentTime(t => t + TICK_SIZE)
      }
    }, TICK_SIZE)

    return () => clearInterval(ticker)
  }, [runningTime])

  //not using watts rn ig
  // useEffect(() => {

  //   setTotalWatts(t => currentWatts + t)
  // }, [])
  // useEffect(() => {
  //   const update = (rawData: string) => {
  //     data = Object.assign(data, JSON.parse(rawData))
  //     setCurrentWatts(data.power)
  //   } //should be stringified in the server.js file before being sent here
  //   socket.onmessage = (event: MessageEvent) => {
  //     update(event.data)
  //   }
  //   setTotalWatts(t => currentWatts + t)
  // }, [socket])

  /**
   * Updates Wattage and Time arrays after a lap is completed
   */
  function incrementLap() {
    // add the current lap to the completed list, since we just 
    // finished it (that's what it means to increment a lap)
    setCompletedTime(p => [...p, currentTime])
    // same with the Watts
    setCompletedWatts(w => [...w, currentWatts])
    // TODO replace this with proper state management
    // hacky DOM manipulation for now lol
    updateLapNum(lapNum + 1)
  }

  // the total is the current lap time plus the sum of all the completed lap times
  const totalTime = currentTime + completedTime.reduce((sum, next) => sum + next, 0)
  // either the time of the previous lap or NaN if there is no previously completed lap
  const previousTime = completedTime.length > 0 ? completedTime[completedTime.length - 1] : NaN
  // get the shortest time out of all of the laps that we've done so far (NaN if none)
  const bestTime = completedTime.length > 0 ? Math.min(...completedTime) : NaN

  const previousWatts = completedWatts.length > 0 ? completedWatts[completedWatts.length - 1] : NaN
  // Joules = Power (Watts) * time (seconds). Round to nearest two decimals
  const currentJoules = Math.round(currentWatts * (currentTime / 1000) * 100) / 100
  // TODO decide if instead of whatever this math is if we just add up all the joules in the same way as watts
  const totalJoules = Math.round(totalWatts * (totalTime / 1000) * 100) / 100
  // get the Watt consumption of the lap that had best time (not necessarily had the lowest Watts)
  // TODO is this the proper behaviour?
  const bestWatts = completedTime.length > 0 ? completedWatts[completedTime.indexOf(bestTime)] : NaN

  return (<>
    <div className="lap_graph_container">
      <div>
        <div className="lapnum">
          <h1 id="lapno">LAP {lapNum}</h1>
        </div>
        <div className="lap_timer">
          <section className="lap_buttons">
            <button className="lap_button" onClick={() => setRunningTime(true)}>Start</button>
            <button className="lap_button" onClick={() => setRunningTime(false)}>Stop</button>
            <button className="lap_button" onClick={() => {
              incrementLap()
              setCurrentTime(0)
              setCurrentWatts(0)
            }}>Lap</button>
            <button className="lap_button" onClick={() => {
              setRunningTime(false)
              setCurrentTime(0)
              setCompletedTime([])
              setCurrentWatts(0)
              setCompletedWatts([])
              setTotalWatts(0)
              updateLapNum(0);
            }}>Reset</button>
          </section>

          <div className="lap_timings">
            <Timer name="current lap" value={currentTime}>
              <p className="measurement" id="current_power">
                {currentWatts} <span className="units" id="current_power_units">Watts</span>
              </p>
              <p className="measurement" id="current_power_joules">
                {currentJoules} <span className="units" id="current_power_units_joules">Joules</span>
              </p>
            </Timer>

            <Timer name="total time" value={totalTime}>
              <p className="measurement" id="current_power">
                {totalWatts} <span className="units" id="current_power_units">Total Watts</span>
              </p>
              <p className="measurement" id="current_power_joules">
                {totalJoules} <span className="units" id="current_power_units_joules">Total Joules</span>
              </p>
            </Timer>

            <Timer name="previous lap" value={previousTime}>
              <p className="measurement" id="previous_power">
                {previousWatts} <span className="units">Watts</span>
              </p>
            </Timer>

            <Timer name="best lap" value={bestTime}>
              <p className="measurement" id="best_power">
                {bestWatts} <span className="units">Watts</span>
              </p>
            </Timer>
          </div>
        </div>
      </div>
      <SpeedGraph running={runningTime} accel={props.accel} right_rpm={props.right_rpm} left_rpm={props.left_rpm} potent={props.potent} temp={props.temp}></SpeedGraph>
    </div>
  </>)
}