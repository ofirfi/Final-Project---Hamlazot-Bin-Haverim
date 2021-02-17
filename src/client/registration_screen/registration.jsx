import React, {useState} from "react"
import './registration.scss'
import { FaUser } from 'react-icons/fa'
import axios from 'axios'
import {useHistory} from 'react-router-dom'
import { useDispatch } from 'react-redux'


const RegistrationPage = ()=>{
  const [email,setEmail] = useState('');
  const [userName,setUserName] = useState('');
  const [password,setPassword] = useState('');
  const [confirmPassword,setConfirmPassword] = useState('');
  const [firstName,setFirstName] = useState('');
  const [surname,setSurname] = useState('');
  const history = useHistory();
  const dispatch = useDispatch();

  const signup = () =>{
    axios.post("http://localhost:8001/auth/signup",{
      email,
      userName,
      password,
      confirm_password: confirmPassword,
      first_name:firstName,
      last_name:surname
    })
    .then((res)=>{
      dispatch({type:"SETTOKEN",payload:res.data.token})
      dispatch({type:"SETUSER",payload:userName});
      dispatch({type:"SETLOGGED",payload:true});
      alert(userName + " ברוך הבא, שמחים שהצטרפת!");
      history.push('/main');
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
                  type="password"
                  value = {password}
                  onChange = {(event)=>setPassword(event.target.value)}
                  required
                  />
                <input className="inputr"
                  placeholder="אימות סיסמא"
                  type="password"
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

export default RegistrationPage;