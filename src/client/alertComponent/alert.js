import { store } from 'react-notifications-component';
import '../utils/style.css'


export function Alert(title, message, type, duration, doFunction = null) {
    let content = null;
    if (doFunction)
        content = <div className="flex flex-col w-full bg-gray-200 rounded-lg text-center">
            <h1 className = "mt-3">
                {message}
            </h1>
            <div className="flex flex-row-reverse my-3">

                <div className="flex flex-col items-center text-center w-1/2">
                    <button className="flex flex-col w-1/2 text-center font-extrabold rounded-md bg-red-600 hover:bg-red-800 focus:outline-none"
                        onClick={doFunction}
                    >
                        אישור
                    </button>
                </div>

                <div className="flex flex-col items-center text-center w-1/2">
                    <button className="flex flex-col w-1/2 text-center font-extrabold rounded-md bg-blue-300 hover:bg-blue-500 focus:outline-none">
                        ביטול
                    </button>
                </div>
            </div>
        </div>;


    return (
        store.addNotification({
            title,
            message,
            type,
            content,
            container: "top-center",
            animationIn: ["animate__animated", "animate__fadeIn"],
            animationOut: ["animate__animated", "animate__fadeOut"],
            dismiss: {
                duration,
                onScreen: true,
            }
        })
    )
}