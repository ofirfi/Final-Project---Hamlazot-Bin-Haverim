import React from "react";
import './register.scss';
import header_photo from './sign-photo.png'
import { FaUser } from 'react-icons/fa';

export class Register extends React.Component {
  constructor(props) {
    super(props);
  }

  joinBtn() {
    alert('joined')
    //בדיקות קלט
    //בדיקה שהשמתשמש לא תפוס
    //מעבר לדף חיפוש
  };

  
  render() {
    return (
      <div className="RegisterPage">
        <header className='Header2'>
          <img class='HeaderImg' src={header_photo} />
        </header>
          <div>
            
            <div className='box'>
              <div class="group">
                <input type="text" required/>
                <span class="highlight"></span>
                <span class="bar"></span>
                <label>שם פרטי <FaUser/></label>
                
              </div>
              <div class="group">
                <input type="text" required/>
                <span class="highlight"></span>
                <span class="bar"></span>
                <label>שם משפחה</label>
              </div>
              <div class="group">
                <input type="text" required/>
                <span class="highlight"></span>
                <span class="bar"></span>
                <label>שם משתמש</label>
              </div>
              <div class="group">
                <input type="email" required/>
                <span class="highlight"></span>
                <span class="bar"></span>
                <label>דוא"ל</label>
              </div>
              <div class="group">
                <input type="password" required/>
                <span class="highlight"></span>
                <span class="bar"></span>
                <label>סיסמא</label>
              </div>
              <div class="group">
                <input type="password" required/>
                <span class="highlight"></span>
                <span class="bar"></span>
                <label>אימות סיסמא</label>
              </div>
            </div>
            <div>
              <button className="bot" id="GetPW" onClick={() => this.joinBtn()}>
                אישור
              </button>
            </div>





            {/* <label>
              שם פרטי:
              <input type='text' name="first_name" />
            </label>
            <p/>
            <label>
              שם משפחה:
              <input type='text' name="surename" />
            </label>
            <p/>
            <label>
              שם משתמש:
              <input type='text' name="username" />
            </label>
            <p />
            <label>
              דוא"ל:
              <input type='email' name="email" />
            </label>
            <p />
            <label>
              סיסמא:
              <input type='password' name="pw" />
            </label>
            <p />
            <label>
              אימות סיסמא:
              <input type='password' name="repw" />
            </label>
            <p />
            <input type="submit" value="הרשם" onClick={() => this.joinBtn()} />
            <p /> */}
          </div>

      </div>
    );
  }
}