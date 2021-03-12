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
    <div className="flex flex-col bg-fixed  h-full  sm:h-full w-full"
      style={{ backgroundImage: `url(${BackGround})`, backgroundSize: '100% 100%' }}
    >
      <header className="flex flex-col h-1/6 sm:h-2/6 w-full justify-center">
        <img src={Header} alt="" className="h-full" />
      </header>



      <div className="flex flex-col self-center w-1/2 h-56 sm:h-1/2 sm:w-1/4 sm:h-3/4 bg-red-400 rounded-lg shadow-xl text-center items-center my-28">

        <div id="top" className="mb-3">
          !ברוך הבא
        </div>

        <div className="flex flex-col text-center items-center sm:space-y-3">
          <div>
            <input className="bg-blue-100 text-black placeholder-black sm:mt-2 text-center rounded"
              placeholder="מייל"
              value={email}
              onChange={event => setEmail(event.target.value)}
              required />
          </div>

          <div>
            <input className="bg-blue-100 text-black placeholder-black mt-2 text-center rounded flex flex-col"
              placeholder="סיסמא"
              type="password"
              value={password}
              onChange={event => setPassword(event.target.value)}
              required />

            <text className="text-xs text-white sm:w-1/2"
              onClick={forgot_password}
            >
              ?שכחת סיסמא
            </text>
          </div>

          <div>
            <button className="border-1 sm:border-4 rounded-full mt-3 sm:py:3 sm:px-6 focus:ring-4 focus:ring-white focus:ring-opacity-50 bg-indigo-500 border-none text-white"
              onClick={login}
            >
              התחבר
            </button>
          </div>

          <div>
            <button className="border-1 sm:border-4 rounded-full mt-3 sm:py:3 sm:px-6 focus:ring-4 focus:ring-white focus:ring-opacity-50 bg-indigo-500 border-none text-white"
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

