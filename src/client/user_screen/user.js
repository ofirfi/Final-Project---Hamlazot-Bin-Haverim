import '../utils/style.css'
import React, { useEffect, useState } from "react"
import BackGround from '../images/background.jpg'
import { Navbar } from '../navbar/navbar'
import default_user from '../images/default_user.png'
import axios from 'axios'
import { Friends, Recommendations } from './userInfo'
import { useHistory } from 'react-router-dom'

const UserPage = (props) =>{
    const user = props.match.params.userName;
    const [fullName,setFullName] = useState('');
    const [myRecommendations,setMyRecommendations] = useState('');
    const [myFriends,setMyFriends] = useState('');
    const [showRecommendations,setShowRecommendations] = useState(false);
    const [showFriends,setShowFriends] = useState(false);
    const history = useHistory();
    const headers = {
        headers: {
            Authorization: `Bearer ${window.localStorage.getItem('token')}`
        }
    }

    useEffect( () =>{
        axios.post("http://localhost:8001/users", {
            userName: props.match.params.userName,
            self: false
        }, headers)
        .then(res => {
            setFullName(res.data.data.firstName + " " + res.data.data.lastName)
            setMyRecommendations(res.data.data.recommendations);
            setMyFriends(res.data.data.friends)
        })
        .catch(() => history.push('/404'))
    },[])

    return(
        <div className="flex flex-col bg-fixed items-center min-h-full"
            style={{ backgroundImage: `url(${BackGround})`, backgroundSize: '100% 100%' }}
        >
            <Navbar />

            <div className = "flex flex-col items-center bg-green-600 w-1/6 mt-8 border-4 border-b-0 border-black">
                <div>
                    <img className="h-1 w-1 sm:h-28 sm:w-28 rounded-full mt-2 sm:mt-5 invisible sm:visible"
                        src={default_user}
                    />
                </div>
                <div className = "text-xl my-2">
                    {user}
                </div>
                <div className = "text-lg my-2">
                    {fullName}
                </div>
            
            </div>

            <div className = "flex flex-row w-3/4 mb-10">
                
                <div className = "w-1/2 self-start grid justify-items-center bg-green-600 border-l-4 border-r-2 border-t-4 border-b-4 border-black">
                    <div>
                        <button className = "h-12 w-36 text-sm bg-white rounded-full hover:bg-gray-300 focus:outline-none"
                            onClick = {()=>setShowFriends(!showFriends)}
                        >
                            {showFriends? 'הסתר רשימת חברים': 'הצג רשימת חברים'}</button>
                    </div>
                    <div>
                        {showFriends?<Friends myFriends={myFriends} />:null}
                    </div>
                   
                </div>


                <div className = "w-1/2 self-start grid justify-items-center bg-green-600 border-l-2 border-r-4 border-t-4 border-b-4 border-black">
                    <div>
                        <button className = "h-12 w-36 text-sm bg-white rounded-full hover:bg-gray-300 focus:outline-none"
                            onClick = {()=>setShowRecommendations(!showRecommendations)}
                        >
                            {showRecommendations? 'הסתר רשימת המלצות': 'הצג רשימת המלצות'}</button>
                    </div>
                    <div>
                        {showRecommendations?<Recommendations myRecommendations={myRecommendations} />:null}
                    </div>
                </div>
                
            </div>

        </div>
    )
}


export default UserPage;