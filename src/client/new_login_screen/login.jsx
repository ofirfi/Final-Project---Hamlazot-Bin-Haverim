import React,{useState} from "react";
import './login.scss';
import axios from 'axios'


export default () => {
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [token,setToken] = useState('');

  
  const login = ()=>{
    axios.post("http://localhost:8001/auth/login",{
      email,
      password
    })
    .then(res =>{
      setToken(res.data.token);
      console.log('clicked on login');
    })
    .catch(err=>{
      console.log(err.response.data.message);
    })
  }

  const forgotPassword = ()=>{
    axios.post("http://localhost:8001/auth/forgotPassword",{
      email,
    })
    .then(res =>{
      console.log('נשלח')
    })
    .catch(err=>{
      console.log('נשלח');
    })
  }



  return (
    <div className="page">
      <header className="navbar1">

      </header>
      <div className="boxl">
        <section className="section1">
          <h2 id="h2l"> ברוך הבא! </h2>

          <input className="input1"
            placeholder="מייל"
            value = {email}
            onChange = {event => setEmail(event.target.value)}
            required />

          <input className="input1"
            placeholder="סיסמא"
            value = {password}
            onChange = {event => setPassword(event.target.value)}
            required />

          <text id="forgotPass" onClick ={forgotPassword}> שכחת סיסמא? </text>
          <button className="btnl" onClick ={login}>
            התחבר
          </button>
    
          <button className="btnl" id="registerBtnl">הרשם</button>
        </section>
      </div>
    </div>
  );
};