import React from 'react';
import './Login.css';
import log from './one.jpg'

export default class Login extends React.Component {


    loginBtn() {
        alert('ok')
        //בדיקות קלט
        //בדיקה שהשמתשמ+סיסמא נכונים
        //מעבר לדף חיפוש
    };

    forgotpw(){
        alert('ops')
    };

    render() {
        return (
            <div className = "LoginPage">
                <header className = 'Header'>
                    <img class = 'HeaderImg' src={log}/>
                    <h1>המלצות בין חברים</h1>
                </header>
                <section className = "Body">
                    <form className = "Form" onSubmit={()=>this.loginBtn()}>
                        <label>
                            שם משתמש:
                            <input type='text' name="username" />
                        </label>
                        <p/>
                        <label>
                            סיסמא:
                            <input type='password' name="pw" />
                        </label>
                        <p/>
                        <input type="submit" value="כניסה" />
                        <p/>
                    </form>
                    <button id="GetPW" onClick={()=>this.forgotpw()}>  
                        Activate Lasers
                    </button>
                </section>
            </div>
        );
    }
}

// export default App;
