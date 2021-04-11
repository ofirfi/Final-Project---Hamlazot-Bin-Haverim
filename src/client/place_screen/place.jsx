import '../utils/style.css'
import { useEffect, useState } from "react"
import { Navbar } from '../navbar/navbar'
import BackGround from '../images/background.jpg'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import { Form } from '../utils/form'
import { Recommendations } from '../recommendations_component/recommendation'
import { useHistory } from 'react-router-dom'

const placeApiKey = require("../utils/config.json").PLACE_API_KEY;


const recommandations = [["עידן", 4, "קפה מעולה מנות גדולות ומפנקות, מסעדה ברמה! קפה מעולה מנות גדולות ומפנקות, מסעדה ברמה! קפה מעולה מנות גדולות ומפנקות, מסעדה ברמה! קפה מעולה מנות גדולות ומפנקות, מסעדה ברמה!", "27/06/2020"],
["אופיר", 5, "אירוח ברמה, באנו כמה חברים ונהננו מאוד :)", "10/01/2019"],
["עידנקו", 3, "קפה מעולה מנות גדולות ומפנקות, מסעדה ברמה!", "02/08/2020"],
["עוף", 5, "אירוח ברמה, באנו כמה חברים ונהננו מאוד :)", "12/12/2019"],
["אופיקו", 4, "קפה מעולה מנות גדולות ומפנקות, מסעדה ברמה!", "11/11/2020"],
["פיטל", 4, "אירוח ברמה, באנו כמה חברים ונהננו מאוד :)", "06/10/2019"],
["בוף", 4, "קפה מעולה מנות גדולות ומפנקות, מסעדה ברמה!", "01/01/2020"],
["פיטליטי", 3, "אירוח ברמה, באנו כמה חברים ונהננו מאוד :)", "01/01/2020"]]



const PlacePage = (props) => {
    const placeId = props.match.params.id;
    const [voteAverage,setvoteAverage] = useState('');
    const rating = useSelector(state => state.rating);
    const raters = useSelector(state => state.raters);
    const isForm = useSelector(state => state.isForm);
    const dispatch = useDispatch();
    const history = useHistory();
    const [placeInfo, setPlaceInfo] = useState({
        name: "",
        openingHours: [[], [], [], [], [], [], []],
        address: "",
        phoneNumber: "",
        isOpened: "",
        photo: ""
    });
    const headers = {
        headers: {
            Authorization: `Bearer ${window.localStorage.getItem('token')}`
        }
    }


    // const zidkiaho = 'ChIJS1oDEh4oAxURdy5Qkzxy2CE'
    // const rimon = "ChIJP8f5Ac4pAxURQKlXZot6V0c"


    useEffect(() => {
        axios.get(`http://localhost:8001/place/show/${placeId}`, headers)
            .then(res => fillPlaceInfo(res.data.result))
            .catch(err => {
                console.log(err)
                history.push('/404')
            })
    }, [])


    const fillPlaceInfo = (place) => {
        let openingHours = place.opening_hours.weekday_text.map(day => day)
        setvoteAverage((place.rating).toFixed(1));
        setPlaceInfo({
            name: place.name,
            openingHours: openingHours,
            address: place.formatted_address,
            phoneNumber: place.formatted_phone_number,
            isOpened: place.opening_hours.opne_now,
            photo: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=500&photoreference=${place.photos[0].photo_reference}&key=${placeApiKey}`//AIzaSyDByhBwcAy1pRhQuJUNL_DyAcl6YFUFocw`
        })

    }


    const createRecommendation = () => {
        dispatch({
            type: "SETFORMINFO",
            payload: {
                rId: placeId,
                name: placeInfo.name,
                rate: 1,
                comment: "",
                type: "מקום",
            }
        })
        dispatch({ type: "TOGGLEFORM" })
    }



    return (
        <div className="flex flex-col bg-fixed"
            style={{ backgroundImage: `url(${BackGround})`, backgroundSize: '100% 100%' }}
        >
            <Navbar />

            <div className="flex flex-col self-center my-10 w-2/5 bg-red-400 rounded-xl ">

                <div className="text-3xl sm:text-6xl self-center font-extrabolds mb-10">
                    {placeInfo.name}
                </div>

                <div className="flex flex-row-reverse">

                    <div className="flex w-1/2 h-full self-start">
                        <img src={placeInfo.photo} />
                    </div>

                    <div className="flex flex-col w-1/2 text-right text-xs sm:text-lg">
                        <div className="">
                            <div className="underline">שעות פתיחה</div>
                            <div className="border-2">
                            <div>{placeInfo.openingHours[0]}</div>
                            <div>{placeInfo.openingHours[1]}</div>
                            <div>{placeInfo.openingHours[2]}</div>
                            <div>{placeInfo.openingHours[3]}</div>
                            <div>{placeInfo.openingHours[4]}</div>
                            <div>{placeInfo.openingHours[5]}</div>
                            <div>{placeInfo.openingHours[6]}</div>
                            </div>
                        </div>
                        <div className="text-xs sm:text-lg self-end">
                            כתובת: {placeInfo.address}
                        </div>
                    </div>

                </div>

                <div className = "flex flex-row-reverse">
                    <div className = "w-1/2 text-center border-2">
                        דירוג: 5 / {rating!==0? rating : voteAverage}
                    </div>
                    <div className = "w-1/2 text-center border-2">
                        חברים שדרגו: {raters}
                    </div>
                </div>

                <div className="flex flex-col w-1/2 self-center">

                    <div className="text-xl self-end md:self-center my-3 font-bold underline">המלצות</div>
                    
                    <div className="h-96 mb-5 overflow-y-auto text-right">
                        <Recommendations rId={placeId} closeness = {props.closeness}></Recommendations>
                    </div>

                    <button className="self-center my-5 border-4 border-transparent text-sm sm:text-base text-white rounded-lg bg-blue-300 hover:bg-blue-500 focus:outline-none"
                        onClick={() => createRecommendation()}
                    >
                        הוסף המלצה
                        </button>

                </div>


            </div>
            {isForm ? <Form btnLabel="הוסף" /> : null}
        </div>
    );

};

export default PlacePage;