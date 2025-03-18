import logo from './assets/fulldark.png';


export default function Header() {
   return(
   <div className="header">
       <div className="logodiv">
       <img id="logo" src={logo} alt="logo"></img>
       </div>
       <div className="titlediv">
       <h2 id="title">Live Timing Dashboard</h2>
   </div>
   </div>
   )
}