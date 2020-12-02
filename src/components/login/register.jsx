import React from "react";
import './register.scss';
import header_photo from './Header_Photo.png'

export class Register extends React.Component {
  constructor(props) {
    super(props);
  }

  joinBtn() {
    alert('yes')
    //בדיקות קלט
    //בדיקה שהשמתשמש לא תפוס
    //מעבר לדף חיפוש
  };
  login() {
    alert('no')
  };
  
  render() {
    return (
      <div className="LoginPage">
        <header className='Header'>
          <img class='HeaderImg' src={header_photo} />
        </header>
        <section className="Body">
          <div className="Form">
            <h1>הרשמה</h1>
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
            <input type="submit" value="הצטרף" onClick={() => this.joinBtn()} />
            <p />
            <button id="login" onClick={() => this.login()}>
              הרשמה
            </button>
            <p />
          </div>
        </section>
      </div>
    );
  }
}