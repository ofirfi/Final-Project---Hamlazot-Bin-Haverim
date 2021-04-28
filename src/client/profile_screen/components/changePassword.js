import '../../utils/style.css'
import { useState } from 'react'
import axios from 'axios'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'

export function ChangePassword() {
    const userName = window.localStorage.getItem('userName');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isPasswordChange, setIsPasswordChange] = useState(false);

    const headers = {
        headers: {
            Authorization: `Bearer ${window.localStorage.getItem('token')}`
        }
    }


    const validationCheck = () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            alert('אנא מלא את כל השדות');
            return false;
        }
        if (newPassword.length < 8) {
            alert('הסיסמא צריכה להיות בין 8 ל-16 תווים');
            return false;
        }
        if (newPassword !== confirmPassword) {
            alert('הסיסמאות אינן תואמות');
            return false;
        }
        return true;
    }


    const clearFields = () => {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    }


    const changePassword = () => {
        if (!validationCheck())
            return;
        setIsPasswordChange(true);
        axios.put("http://localhost:8001/auth/changePassword", {
            userName,
            current_password: currentPassword,
            password: newPassword,
            confirm_password: confirmPassword,
        }, headers)
            .then(res => {
                alert('הסיסמא שונתה בהצלחה');
                clearFields();
                setIsPasswordChange(false);
            })
            .catch(err => {
                if (err.response.data.message === 'confirm password is wrong')
                    alert('הסיסמא הנוכחית שגויה');
                else
                    alert('קרתה שגיאה אנא נסה שנית');
                clearFields();
            })
    }


    return (
        <div className="flex flex-col w-full">
            <div className="self-center text-center text-white text-2xl underline font-bold my-5">
                החלף סיסמא
            </div>

            <div className="flex flex-col w-1/2 sm:w-2/5 mt-2 md:mt-10 self-center items-center text-sm md:text-md">

                <input className="w-5/6 h-8 my-3 md:my-6 rounded-xl text-center focus:outline-none"
                    placeholder="סיסמא נוכחית"
                    type="password"
                    onChange={event => setCurrentPassword(event.target.value)}
                    value={currentPassword}
                    required
                />

                <input className="w-5/6 h-8 my-3 md:my-6 rounded-xl text-center focus:outline-none"
                    placeholder="סיסמא חדשה"
                    type="password"
                    onChange={event => setNewPassword(event.target.value)}
                    value={newPassword}
                    required
                />

                <input className="w-5/6 h-8 my-3 md:my-6 rounded-xl text-center focus:outline-none"
                    placeholder="אימות סיסמא חדשה"
                    type="password"
                    onChange={event => setConfirmPassword(event.target.value)}
                    value={confirmPassword}
                    required
                />

                <button className="grid flex flex-row items-center w-24 h-10 my-4 md:my-8 bg-blue-500 rounded-full text-md text-white hover:bg- focus:outline-none"
                    disabled={isPasswordChange}
                    onClick={changePassword}
                >
                    {isPasswordChange ?
                        <AiOutlineLoading3Quarters className="grid justify-self-center w-1/2 h-1/2 animate-spin" />
                        :
                        "אישור"
                    }
                </button>
            </div>
        </div>
    )
}