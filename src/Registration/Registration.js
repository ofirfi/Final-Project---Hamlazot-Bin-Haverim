import React from 'react';
import './Registration.css';
import header_photo from './Header_Photo.png'

export default class Login extends React.Component {


    registerBtn() {
        alert('yes')
        //בדיקות קלט
        //בדיקה שהשמתשמ+סיסמא נכונים
        //מעבר לדף חיפוש
    };
    goBack() {
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
                            דוא"ל:
                            <input type='text' name="email" />
                        </label>
                        <p />
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
                        <label>
                            אימות סיסמא:
                            <input type='password' name="confirm_pw" />
                        </label>
                        <p />
                        <input type="submit" value="הרשם" onClick={() => this.registerBtn()} />
                        <p />
                        <button id="Register" onClick={() => this.goBack()}>
                            חזרה
                        </button>
                        <p />
                    </div>
                </section>

            </div>
        );
    }
}

