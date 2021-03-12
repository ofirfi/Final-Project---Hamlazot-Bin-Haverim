import React, {useState} from "react"
import './registration.scss'
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


  const fieldCheck = () =>{
    if (!firstName ||!surname || !userName || !email || !password || !confirmPassword){
      alert('אנא מלא את כל השדות');
      return false;
    }
    if(password.length < 8){
      alert('הסיסמא צריכה להיות בין 8 ל-16 תווים');
      return false;
    }
    if (password !== confirmPassword){
      alert('הסיסמאות אינן תואמות');
      return false;
    }
    if (userName.length < 5){
      alert('שם משתמש חייב להיות לפחות באורך 5 תווים');
      return false;
    }
    if (firstName.length < 2|| surname.length < 2){
      alert('שם פרטי ומשפחה חייבים להיות לפחות באורך 2 תווים');
      return false;
    }
    return true;
  }

  const signup = () =>{
    if (!fieldCheck())
      return;

    axios.post("http://localhost:8001/auth/signup",{
      email,
      userName,
      password,
      confirm_password: confirmPassword,
      first_name:firstName,
      last_name:surname
    })
    .then((res)=>{
      window.localStorage.setItem('token', res.data.token);
      window.localStorage.setItem('userName', userName);
      dispatch({ type: "SETLOGGED", payload: true });
      alert(userName + " ברוך הבא, שמחים שהצטרפת!");
      history.push('');
    })
    .catch((err)=>{
      if (err.response.data.message.startsWith("Duplicated"))
        alert(`${err.response.data.message.substring(17,err.response.data.message.search(". please"))} כבר קיים במערכת, אנא הכנס משהו אחר`);
      else{
        console.log(err.response.data.message);
        alert('ארע שגיאה, אנא נסה נסית');
      }  
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