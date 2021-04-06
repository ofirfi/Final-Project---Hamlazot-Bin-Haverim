import '../utils/style.css'
import { useEffect, useState } from "react"
import { Navbar } from '../navbar/navbar'
import BackGround from '../images/background.jpg'
import { AiTwotoneStar } from "react-icons/ai"
import { RecommendationsList } from './recommendations'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import { Form } from '../utils/form'
const placeApiKey = require("../utils/config.json").PLACE_API_KEY;

const IMAGES = {
    stars: 5
}


const recommandations = [["עידן", 4, "קפה מעולה מנות גדולות ומפנקות, מסעדה ברמה! קפה מעולה מנות גדולות ומפנקות, מסעדה ברמה! קפה מעולה מנות גדולות ומפנקות, מסעדה ברמה! קפה מעולה מנות גדולות ומפנקות, מסעדה ברמה!", "27/06/2020"],
["אופיר", 5, "אירוח ברמה, באנו כמה חברים ונהננו מאוד :)", "10/01/2019"],
["עידנקו", 3, "קפה מעולה מנות גדולות ומפנקות, מסעדה ברמה!", "02/08/2020"],
["עוף", 5, "אירוח ברמה, באנו כמה חברים ונהננו מאוד :)", "12/12/2019"],
["אופיקו", 4, "קפה מעולה מנות גדולות ומפנקות, מסעדה ברמה!", "11/11/2020"],
["פיטל", 4, "אירוח ברמה, באנו כמה חברים ונהננו מאוד :)", "06/10/2019"],
["בוף", 4, "קפה מעולה מנות גדולות ומפנקות, מסעדה ברמה!", "01/01/2020"],
["פיטליטי", 3, "אירוח ברמה, באנו כמה חברים ונהננו מאוד :)", "01/01/2020"]]


function starNumber(stars) {
    if (stars === 1)
        return (<div className="flex flex-row jusitfy-center"><AiTwotoneStar /></div>)
    else if (stars === 2)
        return (<div className="flex flex-row content-center"> <AiTwotoneStar /><AiTwotoneStar /></div>)
    else if (stars === 3)
        return (<div className="flex flex-row jusitfy-center"> <AiTwotoneStar /><AiTwotoneStar /><AiTwotoneStar /></div>)
    else if (stars === 4)
        return (<div className="flex flex-row jusitfy-center"><AiTwotoneStar /><AiTwotoneStar /><AiTwotoneStar /><AiTwotoneStar /></div>)
    else if (stars === 5)
        return (<div className="flex flex-row content-center"><AiTwotoneStar /><AiTwotoneStar /><AiTwotoneStar /><AiTwotoneStar /><AiTwotoneStar /></div>)
}


const PlacePage = (props) => {
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
    const isForm = useSelector(state => state.isForm);
    const dispatch = useDispatch();
    const placeId = "ChIJP8f5Ac4pAxURQKlXZot6V0c" //props.placeId
    const zidkiaho = 'ChIJS1oDEh4oAxURdy5Qkzxy2CE'
    const rimon = "ChIJP8f5Ac4pAxURQKlXZot6V0c"
    

    useEffect(() => {
        axios.get(`http://localhost:8001/place/show/${placeId}`, headers)
            .then(res => fillPlaceInfo(res.data.result))
            .catch(err => console.log(err))
    }, [])


    const fillPlaceInfo = (place) => {
        let openingHours = place.opening_hours.weekday_text.map(day => day)
        let openingHours2 = place.opening_hours.periods.map(day => getOpeningHours(day))

        setPlaceInfo({
            name: place.name,
            openingHours: openingHours2,
            address: place.formatted_address,
            phoneNumber: place.formatted_phone_number,
            isOpened: place.opening_hours.opne_now,
            photo: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${placeApiKey}`//AIzaSyDByhBwcAy1pRhQuJUNL_DyAcl6YFUFocw`
        })

    }


    const getOpeningHours = (day) => {
        let open = day.open.time[0] + day.open.time[1] + ":" + day.open.time[2] + day.open.time[3];
        let close = day.close.time[0] + day.close.time[1] + ":" + day.close.time[2] + day.close.time[3];
        return close + " - " + open;
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
        <div className="flex flex-col bg-fixed items-center"
            style={{ backgroundImage: `url(${BackGround})`, backgroundSize: '100% 100%' }}
        >

            <Navbar/>


            <div className="flex flex-row my-10 w-3/5 bg-red-400 rounded-xl ">

                <div className="w-1/2 h-full">
                    <img src={placeInfo.photo} />
                </div>


                <div className="flex flex-col w-1/2 ">
                    <div className=" self-center text-lg sm:text-3xl mt-2">{starNumber(IMAGES.stars)}</div>
                    <div className="text-3xl sm:text-6xl self-center font-extrabolds">{placeInfo.name}</div>
                    <div className="text-right text-xs sm:text-lg self-end mt-8">
                        <div className="underline">
                            שעות פתיחה
                        </div>
                        <div>יום ראשון: {placeInfo.openingHours[0]}</div>
                        <div>יום שני: {placeInfo.openingHours[1]}</div>
                        <div>יום שלישי: {placeInfo.openingHours[2]}</div>
                        <div>יום רביעי: {placeInfo.openingHours[3]}</div>
                        <div>יום חמישי: {placeInfo.openingHours[4]}</div>
                        <div>יום שישי: {placeInfo.openingHours[5]}</div>
                        <div>יום שבת: {placeInfo.openingHours[6]}</div>

                    </div>
                    <div className="text-xs sm:text-lg self-end mt-6">כתובת: {placeInfo.address}</div>
                    <div className="text-xl self-end font-bold underline">המלצות</div>
                    <div className="h-96 mb-5 overflow-y-auto text-right">
                        <RecommendationsList recommandations={recommandations} />
                    </div>
                    <button className="self-center my-5 border-4 border-transparent text-sm sm:text-base text-white rounded-lg bg-blue-300 hover:bg-blue-500 focus:outline-none"
                        onClick={() => createRecommendation()}
                    >
                        הוסף המלצה
                        </button>

                </div>


            </div>
            {isForm ? <Form btnLabel = "הוסף"/> : null}
        </div>
    );

};

export default PlacePage;