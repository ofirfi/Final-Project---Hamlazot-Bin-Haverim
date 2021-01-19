import React from "react";
import './login.scss';

export default class Login extends React.Component {

  render(){
      return(
        <div className="page">
            <header className="navbar1">

            </header>
            <div className="boxl">
              <section className="section1">
                  <h2 id = "h2l"> ברוך הבא! </h2>   
                  <input className="input1" placeholder="שם משתמש" required/>
                  <input className="input1" placeholder="סיסמא" required/>
                  <text id="forgotPass"> שכחת סיסמא? </text>
                  <button className="btnl">התחבר</button>
                  {/* <text id="">או</text> */}
                  <button className="btnl" id="registerBtnl">הרשם</button>
              </section>
            </div>
        </div>
      );
  };
};