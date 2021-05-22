import '../utils/style.css'
import React, { useState } from 'react'
import axios from 'axios'
import { useHistory } from 'react-router-dom'

const ResetPasswordPage = (props) => {
    const [password, setPassword] = useState('');
    const [consifrmPassword, setConfirmPassword] = useState('');
    const history = useHistory();

    const isValidData = () => {
        if (!password || !consifrmPassword) {
            alert("אנא וודא שהשדות מלאים");
            return false;
        }
        if (password.length < 8) {
            alert("סיסמא חייבת להיות לפחות 8 תווים");
            return false;
        }
        if (password !== consifrmPassword) {
            alert("הסיסמאות אינן תואמות");
            return false;
        }
        return true;
    }
    
    const sendReset = () => {
        if (!isValidData())
            return;

        axios.put(`https://rbfserver.herokuapp.com/auth/resetPassword/${props.match.params.token}`,{
            password,
            confirm_password : consifrmPassword
        })
        .then(res => {
            alert("הסיסמא שונתה בהצלחה");
            history.push('/login');
        })
        .catch(err => alert("Token is invalid or has expired"))
    }


    return (
        <div className="flex flex-col self-center items-center w-full">
            <div className=" w-72 flex flex-col self-center items-start">

                <lab className="flex flex-row-reverse my-5">
                    סיסמא
                    <input className="border-2 text-center mx-2"
                        type="password"
                        placeholder="לפחות 8 תווים"
                        onChange={event => setPassword(event.target.value)}
                        value={password}
                    />
                </lab >

                <lab className="flex flex-row-reverse">
                    אימות סיסמא
                    <input className="border-2 text-center mx-2"
                        type="password"
                        placeholder="אימות סיסמא"
                        onChange={event => setConfirmPassword(event.target.value)}
                        value={consifrmPassword}
                    />
                </lab>

                <button className="w-24 h-12 my-5 flex self-center items-center grid rounded-lg bg-blue-400 hover:bg-blue-600 focus:ring-4 focus:ring-white focus:ring-opacity-50 focus:outline-none"
                    onClick={sendReset}
                >
                    אישור
                </button>
                
            </div>
        </div>
    )

}


export default ResetPasswordPage;