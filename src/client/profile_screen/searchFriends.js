import { useState } from 'react'
import axios from 'axios'


export function Searcher() {
    const [results, setResults] = useState('');
    const [input, setInput] = useState('');
    const [rels, setRels] = useState([]);
    let reliabilities;

    const headers = {
        headers: {
            Authorization: `Bearer ${window.localStorage.getItem('token')}`
        }
    }

    const head = <div className="flex flex-row-reverse font-bold h-10 my-2">
        <div className="w-1/6 pr-10">#</div>
        <div className="w-1/6 underline">משתמש</div>
        <div className="w-1/6 underline">פרטי</div>
        <div className="w-1/6 underline">משפחה</div>
        <div className="w-1/6 underline">דירוג</div>
        <div className="w-1/6 underline"></div>
    </div>


    const search = () => {
        if (!input) {
            alert("אנא הזן שם משתמש לחיפוש");
            return;
        }
        setResults('');
        setRels([]);
        reliabilities = [];

        axios.post(`http://localhost:8001/users/friends/search/${input}`, {}, headers)
            .then(res => {
                if (res.data.data.data.length === 0) {
                    setResults(<div className="">לא נמצאו תוצאות</div>);
                    return;
                }
                fillResults(res.data.data.data);
            })
            .catch(err => { })
    }


    const fillResults = users => {
        setResults(old => [...old, head])
        reliabilities = [];
        setRels([]);

        for (let i = 0; i < users.length; i++)
            setRels(old => [...old, 'מעט'])

        for (let i = 0; i < users.length; i++) {
            reliabilities.push('מעט');
            fillUser(users[i], i);
        }
    }


    const fillUser = (user, i) => {
        let insertion =
            <div className="flex flex-row-reverse h-10 text-sm  hover:bg-green-700">
                <div className="w-1/6 pr-10 grid items-center">{i + 1}</div>
                <div className="w-1/6 grid items-center">{user.userName}</div>
                <div className="w-1/6 grid items-center">{user.first_name}</div>
                <div className="w-1/6 grid items-center">{user.last_name}</div>

                <div className="w-1/6 grid items-center">

                    <lab className="self-right justify-end">
                        <select id={i} className=" w-18 text-black text-center"
                            value={rels[i]}
                            onChange={event => reliabilities[i] = event.target.value}
                        >
                            <option value="מעט"> מעט </option>
                            <option value="בינוני">בינוני</option>
                            <option value="הרבה">הרבה</option>
                        </select>
                    </lab>


                </div>
                <div className="w-1/6 grid justify-items-end  items-center flex flex-col">
                    <button id={user.userName} className="w-1/3 rounded-full bg-blue-500 hover:bg-blue-700 focus:outline-none"
                        onClick={() => addFriend(user.userName, i)}
                    >
                        הוסף
                    </button>
                </div>
            </div>
        setResults(old => [...old, insertion]);
    }



    const addFriend = (friend, i) => {
        axios.post(`http://localhost:8001/users/friends/`, {
            userName: window.localStorage.getItem('userName'),
            friend,
            reliability: reliabilities[i]
        }, headers)
            .then(res => {
                alert(`${friend} התווסף לרשימת החברים שלך`);
                document.getElementById(friend).remove();
            })
            .catch(err => {
                alert(`לא ניתן להוסיף את ${friend}, ייתכן שנמצא כבר ברשימת החברים שלך`)
            })
    }



    return (
        <div className="grid flex fixed w-full h-full block  bg-gray-400 bg-opacity-80 ">
            <div className="flex flex-col w-3/5 md:w-4/5 h-3/4 bg-gray-600 text-white rounded-2xl self-center justify-self-center">
                <div className="text-4xl text-center grid place-content-center break-normal h-16 w-full ">
                    חיפוש חברים
                    </div>
                <div className="flex flex-row h-1/6">
                    <div className="flex flex-col w-1/4 h-full grid">
                        <button className="w-1/3 h-1/2 self-center justify-self-center rounded-full text-white bg-blue-500 hover:bg-blue-700 focus:outline-none"
                            onClick={search}
                        >
                            חפש
                        </button>
                    </div>
                    <div className="flex flex-col w-3/4 grid">
                        <input className="w-3/4 h-1/2 rounded-xl justify-self-center self-center text-center text-black self-start focus:outline-none"
                            type="text"
                            placeholder="חפש חברים על פי שם משתמש"
                            value={input}
                            onChange={event => setInput(event.target.value)}
                        />
                    </div>

                </div>

                <div className="flex flex-col w-full text-xl text-right mt-3 h-96 self-start  overflow-y-auto border">
                    {results}
                </div>



                <div className="flex justify-around w-full h-1/6 text-white">
                    <button className="w-1/12 h-2/3 bg-blue-500 rounded-full self-center hover:bg-blue-700 focus:outline-none"
                        onClick={() => window.location.reload()}
                    >
                        סגור
                    </button>
                </div>

            </div>
        </div>
    )
}