import '../utils/style.css'
import { useState } from "react"
import axios from 'axios'
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import Header from '../images/logo.jpg'
import BackGround from '../images/background.jpg'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'


const RegistrationPage = () => {
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  const [isSigning, setIsSigning] = useState(false);
  const history = useHistory();
  const dispatch = useDispatch();


  const fieldsCheck = () => {
    if (!firstName || !surname || !userName || !email || !password || !confirmPassword) {
      alert('אנא מלא את כל השדות');
      return false;
    }
    if (password.length < 8) {
      alert('הסיסמא צריכה להיות בין 8 ל-16 תווים');
      return false;
    }
    if (password !== confirmPassword) {
      alert('הסיסמאות אינן תואמות');
      return false;
    }
    if (userName.length < 5) {
      alert('שם משתמש חייב להיות לפחות באורך 5 תווים');
      return false;
    }
    if (firstName.length < 2 || surname.length < 2) {
      alert('שם פרטי ומשפחה חייבים להיות לפחות באורך 2 תווים');
      return false;
    }
    return true;
  }


  const signup = () => {
    if (!fieldsCheck())
      return;
    setIsSigning(true);
    let data = {
      email,
      userName,
      password,
      confirm_password: confirmPassword,
      first_name: firstName,
      last_name: surname
    }

    axios.post("https://rbfserver.herokuapp.com/auth/signup", data)
      .then(res => signUpSuccess(res))
      .catch(err => signUpFailure(err))
  }


  const signUpSuccess = (res) => {
    window.localStorage.setItem('token', res.data.token);
    window.localStorage.setItem('userName', userName);
    dispatch({ type: "SETLOGGED", payload: true });
    alert(userName + " ברוך הבא, שמחים שהצטרפת!");
    history.push('');
  }


  const signUpFailure = (err) => {
    if (err.response.data.message.startsWith("Duplicated"))
      alert(`${err.response.data.message.substring(17, err.response.data.message.search(". please"))} כבר קיים במערכת, אנא הכנס משהו אחר`);
    else if (err.response.data.message === "Invalid input data. Please enter a valid E-mail!")
      alert('המייל אינו בפורמט מתאים')
    else if (err.response.data.message === `${userName} already exists`)
      alert(`${userName} כבר קיים במערכת, אנא הכנס משהו אחר`)
    else
      alert('ארע שגיאה, אנא נסה נסית');
    setIsSigning(false);
  }


  return (
    <div className="flex flex-col bg-fixed w-full min-h-full"
      style={{ backgroundImage: `url(${BackGround})`, backgroundSize: '100% 100%' }}
    >

      <header className="flex flex-col sm:w-full h-0 sm:h-1/6 invisible sm:visible">
        <img src={Header} alt="" className="" />
      </header>


      <div className="flex flex-col self-center w-72 my-6 sm:my-28 bg-red-400 rounded-md shadow-xl text-center items-center">

        <div className="w-full h-10 my-2 text-xl font-black underline">
          הרשמה
        </div>

        <div className="w-full h-12 flex flex-col items-center grid justify-items-center text-center">
          <input className="bg-blue-400 text-white placeholder-white sm:mt-2 text-center rounded focus:outline-none"
            placeholder="שם פרטי"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            required
          />
        </div>

        <div className="w-full h-12 flex flex-col items-center grid justify-items-center text-center">
          <input className="bg-blue-400 text-white placeholder-white sm:mt-2 text-center rounded focus:outline-none"
            placeholder="שם משפחה"
            value={surname}
            onChange={(event) => setSurname(event.target.value)}
            required
          />
        </div>

        <div className="w-full h-12 flex flex-col items-center grid justify-items-center text-center">
          <input className="bg-blue-400 text-white placeholder-white sm:mt-2 text-center rounded focus:outline-none"
            placeholder="שם משתמש"
            value={userName}
            maxLength="16"
            onChange={(event) => setUserName(event.target.value)}
            required
          />
        </div>

        <div className="w-full h-12 flex flex-col items-center grid justify-items-center text-center">
          <input className="bg-blue-400 text-white placeholder-white sm:mt-2 text-center rounded focus:outline-none"
            placeholder='דוא"ל'
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div className="w-full h-12 flex flex-col items-center grid justify-items-center text-center">
          <input className="bg-blue-400 text-white placeholder-white sm:mt-2 text-center rounded focus:outline-none"
            placeholder="סיסמא"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        <div className="w-full h-12 flex flex-col items-center grid justify-items-center text-center">
          <input className="bg-blue-400 text-white placeholder-white sm:mt-2 text-center rounded focus:outline-none"
            placeholder="אימות סיסמא"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
          />
        </div>

        <div className="h-24 w-full mb-6 flex flex-col items-center">
          {isSigning ?
            <AiOutlineLoading3Quarters className="grid justify-self-center w-1/2 h-1/2 mt-6 animate-spin focus:outline-none" />
            :
            <div className="h-24 w-full my-2 flex flex-col items-center">
              <button className="flex flex-row-reverse items-center grid h-24 w-1/2 my-2 rounded-lg text-white bg-indigo-500 hover:bg-indigo-700 focus:ring-4 focus:ring-white focus:ring-opacity-50 focus:outline-none"
                onClick={signup}
              >
                הרשם
              </button>

              <button className="flex flex-row-reverse items-center grid w-1/2 h-24 my-2 rounded-lg text-white bg-indigo-500 hover:bg-indigo-700 focus:ring-4 focus:ring-white focus:ring-opacity-50 focus:outline-none"
                onClick={() => history.goBack()}
              >
                התחבר
              </button>
            </div>
          }
        </div>
      </div>

    </div>
  );


}

export default RegistrationPage;