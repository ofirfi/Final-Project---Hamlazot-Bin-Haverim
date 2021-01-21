import React,{useState} from 'react';
import './login.scss';
import axios from 'axios'
import {useHistory} from 'react-router-dom'


const LoginPage = () => {
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [token,setToken] = useState('');
  const history = useHistory();

  const login = () => {
    axios.post("http://localhost:8001/auth/login",{
      email,
      password
    })
    .then(res =>{
      setToken(res.data.token);
      alert(res.data.data.userName+' ברוך הבא');
      history.push('/main');
    })
    .catch(err=>{
      console.log(err.response.data.message);
      if(err.response.data.message === "Please provide an email and a password")
        alert('אנא הכנס מייל וסיסמא');
      if(err.response.data.message === 'Wrong email or password')
        alert('מייל או סיסמא שגויים')
    })
  }
  const forgot_password = () => {
    axios.post("http://localhost:8001/auth/forgotPassword",{
      email,
    })
    .then(res =>{
      alert('מייל לשחזור סיסמא נשלח ל-'+email);
      setEmail('');
    })
    .catch(err=>{
      alert('מייל לשחזור סיסמא נשלח ל-'+email);
      setEmail('');
      
    })
  }

  const signup = () => {
    history.push('/signup')
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
            type="password"
            value = {password}
            onChange = {event => setPassword(event.target.value)}
            required />

          <text id="forgotPass"
            onClick = {forgot_password}
           >
              שכחת סיסמא?
            </text>

          <button className="btnl" onClick ={login}>
            התחבר
          </button>
    
          <button className="btnl"
            id="registerBtnl"
            onClick = {signup}
            >
              הרשם
            </button>
        </section>
      </div>
    </div>
  );
};


export default LoginPage;