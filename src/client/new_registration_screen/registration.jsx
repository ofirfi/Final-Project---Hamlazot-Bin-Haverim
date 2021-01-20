import React, {useState} from "react";
import './registration.scss';
import { FaUser } from 'react-icons/fa';
import axios from 'axios'
import {useHistory} from 'react-router-dom'

export default ()=>{
  const [email,setEmail] = useState('');
  const [userName,setUserName] = useState('');
  const [password,setPassword] = useState('');
  const [confirmPassword,setConfirmPassword] = useState('');
  const [firstName,setFirstName] = useState('');
  const [surname,setSurname] = useState('');
  const history = useHistory();

  const signup = () =>{
    axios.post("http://localhost:8001/auth/signup",{
      email,
      userName,
      password,
      confirm_password: confirmPassword
    })
    .then((res)=>{
      console.log(res.data)
    })
    .catch((err)=>{
      console.log(err.response.data.message);
    })
  }

  

  return(
    <div className="page">
        <header className="navbarr">

        </header>
        <div className="boxr">  
            <section className="sectionr">
                <h2 id = "h2r"> הרשמה </h2>   
                <input className="inputr"
                  placeholder="שם פרטי"
                  value = {firstName}
                  onChange = {(event)=>setFirstName(event.target.value)}
                  required
                  />
                <input className="inputr"
                  placeholder="שם משפחה"
                  value = {surname}
                  onChange = {(event)=>setSurname(event.target.value)}
                  required
                  />
                <input className="inputr"
                  placeholder="שם משתמש"
                  value = {userName}
                  onChange = {(event)=>setUserName(event.target.value)}
                  required
                  />       
                <input className="inputr"
                  placeholder='דוא"ל'
                  value = {email}
                  onChange = {(event)=>setEmail(event.target.value)}
                  required
                  />
                <input className="inputr"
                  placeholder="סיסמא"
                  value = {password}
                  onChange = {(event)=>setPassword(event.target.value)}
                  required
                  />
                <input className="inputr"
                  placeholder="אימות סיסמא"
                  value = {confirmPassword}
                  onChange = {(event)=>setConfirmPassword(event.target.value)}
                  required
                  />
                <button className="btnr"
                  onClick = {signup}
                  >
                  הרשם
                  </button>
                <button className="btnr"
                  id="loginbtnr"
                  onClick = {()=>history.goBack()}
                  >
                    התחבר
                  </button>
                
            </section>
        </div>
    </div>
  );


}




// export default class Registration extends React.Component {

//   render(){
//       return(
//         <div className="page">
//             <header className="navbarr">

//             </header>
//             <div className="boxr">  
//                 <section className="sectionr">
//                     <h2 id = "h2r"> הרשמה </h2>   
//                     <input className="inputr" placeholder="שם פרטי" required/>
//                     <input className="inputr" placeholder="שם משפחה" required/>
//                     <input className="inputr" placeholder="שם משתמש" required/>
//                     <input className="inputr" placeholder='דוא"ל' required/>
//                     <input className="inputr" placeholder="סיסמא" required/>
//                     <input className="inputr" placeholder="אימות סיסמא" required/>
//                     <button className="btnr">הרשם</button>
//                     <button className="btnr" id="loginbtnr">התחבר</button>
                    
//                 </section>
//             </div>
//         </div>
//       );
//   };
// };