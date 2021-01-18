import React from "react";
import './login.scss';
import header_photo from './user-icon.jpg'
// Redux to install, replacing props + Hooks
//TAILWIND instead of bootstrap

export class Login extends React.Component {
  constructor(props) {
    super(props);
  }

  log(){
    alert('logged')
  }
  getPW(){
    alert('forgot')
  }



  render() {
    return (
      <div className="LoginPage">
        <header className="Header">
          <img className="HeaderImg" src={header_photo} />
        </header>

        <div>
          <h1>התחבר</h1>

          <div className='box'>
            <div class="group">
              <input type="text" required/>
                <span class="highlight"></span>
                <span class="bar"></span>
                <label>שם משתמש</label>
            </div>
            <div class="group">
              <input id = 'pw' type="password" required/>
                <span class="highlight"></span>
                <span class="bar"></span>
                <label>סיסמא</label>
            </div>

            <div className="btns">
            <button className ="button" id="enter" onClick={() => this.log()}>
              הכנס
            </button>
            </div>
            <div className="btns">
            <button className="button" id="GetPW" onClick={() => this.getPW()}>
              שכחתי סיסמא
            </button>
            </div>
          </div>

        </div>
      </div>
    );
  }
}