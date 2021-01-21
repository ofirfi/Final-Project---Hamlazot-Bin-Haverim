import React, { Profiler } from "react";
import './user.scss';
import vr46 from './vr46.jpg'
import { GiExitDoor } from 'react-icons/gi'
import { FcSettings } from 'react-icons/fc'
import { FaUserFriends, FaPenFancy, FaLock } from 'react-icons/fa'
import {useHistory} from 'react-router-dom'


const ProfilePage = ()=>{
    const friends = ["עוף", "עופיק", "עופיקו","עוף", "עופיק", "עופיקו","עוף", "עופיק", "עופיקו","אופיר", "עוף", "עופיק", "עופיקו","עוף", "עופיק", "עופיקו","עוף", "עופיק", "עופיקו", "פיטל"];
    const recommandations = ["aaa", "bbb"]
    const history = useHistory();

    function FriendsList(props) {
        const friends = props.friends;
        const listItems = friends.map((friend) => 
            <li className="li" key={friend.key} >
                <text style={{ position: "relative", float: "right" }}>{friend}</text>
                <button className="listButton">1</button>
                <button className="listButton">2</button>
                <button className="listButton">3</button>
                <button className="listButton">4</button>
                <button className="listButton">5</button>
            </li>
        );
        return (
          <ul style={{ listStyleType: "none" }}>{listItems}</ul>
        );
    }
    
    function RecommendationsList(props) {
        const recommandations = props.recommandations;
        const listItems = recommandations.map((recommandation) => 
            <li className="li" key={recommandation.key} >
                <text style={{ position: "relative", float: "right" }}>{recommandation}</text>
                <button className="listButton" style={{ width: "100px" }}>ערוך המלצה</button>
            </li>
        );
        return (
          <ul style={{ listStyleType: "none" }}>{listItems}</ul>
        );
    }
    
    const log_out = () => {
        history.push('/');
    }

    const go_profile = () => {
        history.push('/profile')
    }

    return(

        <div className="page">
            <header className="nav">
                <button onClick={go_profile} style={{ position: "relative", top: "20%", left: "40%", backgroundColor: "transparent", border: "none", cursor: "pointer" }}><FcSettings style={{ fontSize:36 }}/></button>
                <button onClick={log_out} style={{ position: "relative", top: "20%", right: "40%", backgroundColor: "transparent", border: "none", cursor: "pointer", color: "rgb(53, 111, 123)" }}><GiExitDoor style={{fontSize:36}}/></button>
                <div style={{ position:"relative", top:"-30%"}}>
                    <input id="mini-search-box" type="text" placeholder="חפש המלצות על מסעדות, הצגות, סרטים וספרים"/>
                </div>
            </header>

            <div className="body">
                <div className="userDetails">  
                    <img className="avatar" src={vr46} ></img>
                    <h3 style={{ position: "relative", top: "3%", margin: "5%", color: "whitesmoke" }}> עידן כהן </h3>
                    <h4 className="h4"> idance@post.jce.ac.il </h4>
                    <h4 className="h4">  </h4>
                    <button className="button" onClick={()=>{} }> רשימת חברים <FaUserFriends style={{ float: "left" }}/></button>
                    <button className="button"> ההמלצות שלי <FaPenFancy style={{ float: "left" }}/></button>
                    <button className="button"> החלף סיסמא <FaLock style={{ float: "left" }}/></button>
                </div>

                {/* <div className="box">
                    <text style={{ position: "relative", top: "2%", fontSize: "20px", fontWeight: "bold", color: "whitesmoke", height: "0%" }}> החברים שלי </text>
                    <div className="list">
                        <FriendsList friends={friends} />
                    </div>
                    <text style={{ position: "relative", fontSize: "10px", fontWeight: "bold", color: "whitesmoke", height: "0%" }}> תוכל לדרג את הרמה שבה אתה סומך על ההמלצות של החברים שלך בלחיצה על הכפתור הנכון - 1 סומך מעט, 5- סומך מאוד </text>
                </div> */}

                {/* <div className="box">
                    <text style={{ position: "relative", top: "2%", fontSize: "20px", fontWeight: "bold", color: "whitesmoke", height: "0%" }}> ההמלצות שלי </text>
                    <div className="list">
                        <RecommendationsList recommandations={recommandations} />
                    </div>
                    <text style={{ position: "relative", fontSize: "10px", fontWeight: "bold", color: "whitesmoke", height: "0%" }}> תוכל לערוך ולדרג מחדש את ההמלצות שלך </text>
                </div> */}

                <div className="box">
                    <text style={{ position: "relative", top: "2%", fontSize: "20px", fontWeight: "bold", color: "whitesmoke", height: "0%" }}> החלף סיסמא </text>
                    <div className="list" style={{top:"15%", width:"85%"}}>
                        <input className="pwInput" placeholder="סיסמא חדשה" type="password" required/> <p/>
                        <input className="pwInput" placeholder="אימות סיסמא חדשה" type="password" required/> <p/>
                        <button className="button" style={{width:"80px"}}> אישור </button>
                    </div>
                    <text style={{ position: "relative", fontSize: "10px", fontWeight: "bold", color: "whitesmoke", height: "0%" }}> להחלפת סיסמא - מלא את שני השדות </text>
                </div>
            </div>
        </div>
    );

}

export default ProfilePage;