import React from 'react';
import './Login.css';
import header_photo from './Header_Photo.png'

export default class Login extends React.Component {


    loginBtn() {
        alert('yes')
        //בדיקות קלט
        //בדיקה שהשמתשמ+סיסמא נכונים
        //מעבר לדף חיפוש
    };
    register() {
        alert('no')
    };

    forgotpw() {
        alert('ops')
    };

    render() {
        return (
            <div className="LoginPage">
                <header className='Header'>
                    <img class='HeaderImg' src={header_photo} />
                </header>
                <section className="Body">
                    <div className="Form">
                        <h1>התחברות</h1>
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
                        <input type="submit" value="כניסה" onClick={() => this.loginBtn()} />
                        <p />
                        <button id="Register" onClick={() => this.register()}>
                            הרשמה
                        </button>
                        <p />
                        <button id="GetPW" onClick={() => this.forgotpw()}>
                            שכחתי סיסמא
                        </button>
                    </div>
                </section>

            </div>
        );
    }
}

