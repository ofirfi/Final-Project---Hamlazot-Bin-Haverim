import '../utils/style.css'
import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import Header from '../images/logo.jpg'
import BackGround from '../images/background.jpg'



const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const history = useHistory();



  const login = () => {
    if (!email || !password) {
      console.log('אנא הכנס מייל וסיסמא');
      return;
    }

    axios.post("http://localhost:8001/auth/login", {
      email,
      password
    })
      .then(res => {
        window.localStorage.setItem('token', res.data.token);
        window.localStorage.setItem('userName', res.data.data.userName);
        dispatch({ type: "SETLOGGED", payload: true });
        alert(res.data.data.userName + ' ברוך הבא');
        history.push('');
      })
      .catch(err => {
        if (err.response.data.message === "Please provide an email and a password")
          alert('אנא הכנס מייל וסיסמא.');
        else if (err.response.data.message === 'Wrong email or password')
          alert('מייל או סיסמא שגויים.');
        else
          alert('ארע שגיאה אנא נסה שנית.')
      })
  }

  const forgot_password = () => {
    if (email === "") {
      alert('אנא הכנס מייל לשחזור סיסמא');
      return;
    }
    axios.post("http://localhost:8001/auth/forgotPassword", {
      email,
    })
      .then(res => {
        alert('מייל לשחזור סיסמא נשלח ל-' + email);
        setEmail('');
      })
      .catch(err => {
        alert('מייל לשחזור סיסמא נשלח ל-' + email);
        setEmail('');
      })
  }

  const signup = () => history.push('/signup')



  return (
    <div className="flex flex-col bg-fixed w-full min-h-full"
      style={{ backgroundImage: `url(${BackGround})`, backgroundSize: '100% 100%' }}
    >
      <header className="flex flex-col sm:w-full h-0 sm:h-1/6 invisible sm:visible">
        <img src={Header} alt="" className="" />
      </header>



      <div className="flex flex-col self-center w-72 h-72 sm:h-3/4 my-6 sm:my-28 bg-red-400 rounded-md shadow-xl text-center items-center">

        <div className="my-3 underline font-black text-xl">
          !ברוך הבא
        </div>

        <div className="flex flex-col text-center items-center mb-3 w-full h-full">

          <div className="w-full h-12 flex flex-col items-center grid justify-items-center text-center">
            <input className="bg-blue-100 text-black placeholder-black sm:mt-2 text-center rounded focus:outline-none"
              placeholder="מייל"
              value={email}
              onChange={event => setEmail(event.target.value)}
              required />
          </div>

          <div className = "w-full h-12 flex flex-col items-center grid justify-items-center text-center">
            <input className="bg-blue-100 text-black placeholder-black sm:mt-2 text-center rounded focus:outline-none"
              placeholder="סיסמא"
              type="password"
              value={password}
              onChange={event => setPassword(event.target.value)}
              required />

          </div>
          
          <div className="h-5 w-full flex flex-col items-center">
            <button className="text-xs text-white focus:outline-none"
              onClick={forgot_password}
            >
              ?שכחת סיסמא
            </button>
          </div>

          <div className="h-12 w-full mt-4">
            <button className="w-1/2 h-3/4 rounded-lg text-white bg-indigo-500 hover:bg-indigo-700 focus:ring-4 focus:ring-white focus:ring-opacity-50 focus:outline-none"
              onClick={login}
            >
              התחבר
            </button>
          </div>

          <div className="h-12 w-full my-2">
            <button className="w-1/2 h-3/4 sm:py:3 rounded-lg text-white bg-indigo-500 hover:bg-indigo-700 focus:ring-4 focus:ring-white focus:ring-opacity-50 focus:outline-none"
              onClick={signup}
            >
              הרשם
            </button>
          </div>

        </div>

      </div>
    </div>
  )
}

export default LoginPage;

