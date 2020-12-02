import React from "react";
import './login.scss';
import header_photo from './login-photo.png'


export class Login extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="LoginPage">
        <header className="Header">
          <img className="HeaderImg" src={header_photo} />
        </header>
        <div className="abc">
          <text id="title">התחבר</text>
          <p/>
          <label>
            שם משתמש:
              <input type='text' name="username" />
          </label>
          <p />
          <label>
            סיסמא:
              <input type='password' name="pw" />
          </label>
          <p />
          <input type="submit" value="כניסה" onClick={() => alert('ok')} />
          <p />
          <button id="GetPW" onClick={() => alert('ops')}>
            שכחתי סיסמא
          </button>
        </div>
      </div>
    );
  }
}