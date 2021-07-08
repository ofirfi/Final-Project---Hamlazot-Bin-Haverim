import '../utils/style.css'
import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import Header from '../images/logo.jpg'
import BackGround from '../images/background.jpg'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { Alert } from '../alertComponent/alert'


const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();


  const login = () => {
    if (!email || !password) {
      Alert("שגיאה","אנא הכנס מייל וסיסמא","danger",5000);
      return;
    }
    
    setIsLogin(true);
    axios.post("https://rbfserver.herokuapp.com/auth/login", {
      email,
      password
    })
      .then(res => {
        window.localStorage.setItem('token', res.data.token);
        window.localStorage.setItem('userName', res.data.data.userName);
        dispatch({ type: "SETLOGGED", payload: true });
        Alert(`${res.data.data.userName} ברוך הבא`,"שמחים לראותך שוב","success",5000);
        history.push('');
      })
      .catch(err => {
        if (err.response.data.message === "Please provide an email and a password")
          Alert("שגיאה","אנא הכנס מייל וסיסמא","danger",5000);
        else if (err.response.data.message === 'Wrong email or password')
          Alert("שגיאה","מייל או סיסמא שגויים","danger",5000);
        else
          Alert("שגיאה","ארע שגיאה אנא נסה שנית","danger",5000);
        setIsLogin(false)
      })
  }


  const clearFields = () =>{
    setEmail('');
    setPassword('');
  }

  const forgot_password = () => {
    if (email === "") {
      Alert("שגיאה",'אנא הכנס מייל לשחזור סיסמא',"danger",5000);
      return;
    }
    let message = 'מייל לשחזור סיסמא נשלח ל' + "\n" + email;
    
    axios.post("https://rbfserver.herokuapp.com/auth/forgotPassword", {
      email,
    })
      .then(res => {
        Alert("",message,"success",5000);
        clearFields();
      })
      .catch(err => {
        Alert("",message,"success",5000);
        clearFields();
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
      <div id="test"></div>
      <div className="flex self-center text-center mt-5">
        האתר מציע חיפוש מקומות אוכל,סרטים וספרים ע"פ דירוג חברים משוקלל
        <br />
        כאן תוכלו לכתוב המלצה עם דירוג למסעדות, בתי קפה, סרטים וספרים ולעזור לחבריכם
      </div>

      <div className="flex flex-col self-center w-72 h-72 sm:h-3/4 my-6 sm:my-12 bg-red-400 rounded-md shadow-xl text-center items-center">

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

          <div className="w-full h-12 flex flex-col items-center grid justify-items-center text-center">
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

          {isLogin ?
            <AiOutlineLoading3Quarters className="grid justify-self-center w-1/6 h-1/6 my-3 animate-spin focus:outline-none" />
            :
            <div className="w-full">
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
          }

        </div>
      </div>

    </div>
  )
}

export default LoginPage;

