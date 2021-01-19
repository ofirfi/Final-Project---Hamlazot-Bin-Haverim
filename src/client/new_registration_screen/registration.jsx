import React from "react";
import './registration.scss';
import { FaUser } from 'react-icons/fa';

export default class Registration extends React.Component {

  render(){
      return(
        <div className="page">
            <header className="navbarr">

            </header>
            <div className="boxr">  
                <section className="sectionr">
                    <h2 id = "h2r"> הרשמה </h2>   
                    <input className="inputr" placeholder="שם פרטי" required/>
                    <input className="inputr" placeholder="שם משפחה" required/>
                    <input className="inputr" placeholder="שם משתמש" required/>
                    <input className="inputr" placeholder='דוא"ל' required/>
                    <input className="inputr" placeholder="סיסמא" required/>
                    <input className="inputr" placeholder="אימות סיסמא" required/>
                    <button className="btnr">הרשם</button>
                    <button className="btnr" id="loginbtnr">התחבר</button>
                    
                </section>
            </div>
        </div>
      );
  };
};