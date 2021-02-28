import '../utils/style.css'
import React, { useState } from 'react';
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import Header from '../images/logo.jpg'
import BackGround from '../images/background.jpg'


const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const history = useHistory();



  const login = () => {
    axios.post("http://localhost:8001/auth/login", {
      email,
      password
    })
      .then(res => {
        dispatch({ type: "SETTOKEN", payload: res.data.token })
        dispatch({ type: "SETUSER", payload: res.data.data.userName });
        dispatch({ type: "SETLOGGED", payload: true });
        alert(res.data.data.userName + ' ברוך הבא');
        history.push('/main');
      })
      .catch(err => {
        console.log(err.response.data.message);
        if (err.response.data.message === "Please provide an email and a password")
          alert('אנא הכנס מייל וסיסמא');
        if (err.response.data.message === 'Wrong email or password')
          alert('מייל או סיסמא שגויים')
      })
  }

  const forgot_password = () => {
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
    <div class="flex flex-col bg-fixed bg-blue-700  h-full  sm:h-full w-full"
      style={{ backgroundImage: `url(${BackGround})`, backgroundSize: '100% 100%' }}
    >
      <header class="flex flex-col h-1/6 sm:h-2/6 w-full justify-center">
        <img src={Header} alt="" class="h-full" />
      </header>



      <div class="flex flex-col self-center w-1/2 h-56 sm:h-1/2 sm:w-1/4 sm:h-3/4 bg-red-400 rounded-lg shadow-xl text-center items-center my-28">

        <div id="top" class="mb-3">
          !ברוך הבא
        </div>

        <div class="flex flex-col text-center items-center sm:space-y-3">
          <div>
            <input class="bg-blue-100 text-black placeholder-black sm:mt-2 text-center rounded"
              placeholder="מייל"
              value={email}
              onChange={event => setEmail(event.target.value)}
              required />
          </div>

          <div>
            <input class="bg-blue-100 text-black placeholder-black mt-2 text-center rounded flex flex-col"
              placeholder="סיסמא"
              type="password"
              value={password}
              onChange={event => setPassword(event.target.value)}
              required />

            <text class="text-xs text-white sm:w-1/2"
              onClick={forgot_password}
            >
              ?שכחת סיסמא
            </text>
          </div>

          <div>
            <button class="border-1 sm:border-4 rounded-full mt-3 sm:py:3 sm:px-6 focus:ring-4 focus:ring-white focus:ring-opacity-50 bg-indigo-500 border-none text-white"
              onClick={login}
            >
              התחבר
            </button>
          </div>

          <div>
            <button class="border-1 sm:border-4 rounded-full mt-3 sm:py:3 sm:px-6 focus:ring-4 focus:ring-white focus:ring-opacity-50 bg-indigo-500 border-none text-white"
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

