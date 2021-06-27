import '../utils/style.css'
import { useEffect, useState } from "react"
import { Navbar } from '../navbar/navbar'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import { Form } from '../utils/form'
import { Recommendations } from '../recommendations_component/recommendation'
import { useHistory } from 'react-router-dom'
import { FaMapMarkerAlt, FaPhone, FaHome, FaUserFriends, FaChartBar } from 'react-icons/fa'
import { CgWebsite } from 'react-icons/cg'
import picture_unavailable from '../images/picture_unavailable.jpg'
const placeApiKey = require("../utils/config.json").PLACE_API_KEY;



const PlacePage = (props) => {
    const placeId = props.match.params.id;
    const [voteAverage, setvoteAverage] = useState('');
    const closeness = (props.location && props.location.state) ? props.location.state.closeness : 1;
    const rating = useSelector(state => state.rating);
    const raters = useSelector(state => state.raters);
    const isForm = useSelector(state => state.isForm);
    const dispatch = useDispatch();
    const history = useHistory();
    const [placeInfo, setPlaceInfo] = useState({
        name: "",
        openingHours: [[""], [""], [""], [""], [""], [""], [""]],
        address: "",
        phoneNumber: "",
        isOpened: "",
        photo: "",
        location: "",
        website: ""
    });

    const headers = {
        headers: {
            Authorization: `Bearer ${window.localStorage.getItem('token')}`
        }
    }


    useEffect(() => {
        axios.get(`https://rbfserver.herokuapp.com/place/show/${placeId}`, headers)
            .then(res => fillPlaceInfo(res.data.result))
            .catch(err => {
                console.log(err)
                history.push('/404')
            })
    }, [])


    const fillPlaceInfo = (place) => {
        let openingHours = [[""], [""], [""], [""], [""], [""], [""]];
        let isOpened;
        if (place.opening_hours) {
            openingHours = place.opening_hours.weekday_text.map(day => day);
            isOpened = place.opening_hours.open_now ? "פתוח" : "סגור";
        }
        else
            isOpened = "סגור לצמיתות";

        let isPhoto = picture_unavailable;
        if (place.photos)
            isPhoto = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=2000&photoreference=${place.photos[0].photo_reference}&key=${placeApiKey}`

        setvoteAverage((place.rating).toFixed(1));
        setPlaceInfo({
            name: place.name,
            openingHours: openingHours,
            address: place.vicinity,
            phoneNumber: place.formatted_phone_number,
            isOpened,
            photo: isPhoto,
            location: place.url,
            website: place.website
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
            style={{ backgroundImage: `url(${placeInfo.photo})`, backgroundSize: '100% 100%' }}
        >
            <Navbar />

            <div className="flex flex-col self-center w-4/5 lg:w-1/2 my-10 box-border border-4 rounded-lg bg-gray-300">

                {/* Name */}
                <div className="w-full h-full text-3xl sm:text-5xl lg:text-6xl text-center font-bold bg-white">
                    {placeInfo.name}
                </div>

                {/* Photo + opening hours */}
                <div className="flex flex-row-reverse ">

                    <div className="flex w-1/2 h-48 sm:h-56 justify-center self-center p-2 border-l-2">
                        <img src={placeInfo.photo} alt="" />
                    </div>

                    <div className="flex w-1/2 justify-end text-right text-md sm:text-lg p-2 border-r-2">
                        <div className="">
                            <div className="underline">{`שעות פתיחה (${placeInfo.isOpened})`}</div>
                            <div className="">
                                <div>{placeInfo.openingHours[0]}</div>
                                <div>{placeInfo.openingHours[1]}</div>
                                <div>{placeInfo.openingHours[2]}</div>
                                <div>{placeInfo.openingHours[3]}</div>
                                <div>{placeInfo.openingHours[4]}</div>
                                <div>{placeInfo.openingHours[5]}</div>
                                <div>{placeInfo.openingHours[6]}</div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Adress + Rating */}
                <div className="flex flex-row-reverse text-md md:text-lg text-center border-t-2">
                    <div className="flex w-1/2 text-center justify-center border-t-2 border-l-2">
                        <div className="mr-2"> {placeInfo.address} </div>
                        <div className="self-center"> <FaHome /> </div>
                    </div>
                    <div className="flex w-1/4 text-center justify-center border-t-2 border-r-2 border-l-2">
                        <div className="mr-2"> {rating !== 0 ? rating : voteAverage} / 5 </div>
                        <div className="self-center"> <FaChartBar /> </div>
                    </div>
                    <div className="flex w-1/4 text-center justify-center border-t-2 border-r-2 border-l-2">
                        <div className="mr-2"> {raters} </div>
                        <div className="self-center"> <FaUserFriends /> </div>
                    </div>
                </div>

                {/* Phone + Location */}
                <div className="flex flex-row-reverse text-md md:text-lg text-center border-t-2 ">
                    <div className="flex w-1/2 text-center justify-center border-t-2 border-l-2 border-b-4">
                        <div className="mr-2"> {placeInfo.phoneNumber} </div>
                        <div className="self-center"> <FaPhone /> </div>
                    </div>
                    <div className="flex w-1/4 text-center justify-center border-t-2 border-r-2 border-l-2 border-b-4">
                        <a className="mr-1" href={placeInfo.location}> פתח במפה </a>
                        <div className="self-center"> <FaMapMarkerAlt /> </div>
                    </div>
                    <div className="flex w-1/4 text-center justify-center border-t-2 border-r-2 border-l-2 border-b-4">
                        <a className="mr-2" href={placeInfo.website}> לאתר העסק </a>
                        <div className="self-center"> <CgWebsite /> </div>
                    </div>
                </div>

                {/* Recommendations + add button */}
                <div className="flex flex-col w-full items-center bg-white">

                    <div className="text-xl self-center my-2 font-bold underline">המלצות</div>

                    <div className="h-56 mb-5 w-full sm:w-3/4 mx-2 overflow-y-auto text-right">
                        <Recommendations rId={placeId} closeness={closeness} />
                    </div>

                    <button className="self-center my-5 border-4 border-transparent text-sm sm:text-base text-white rounded-lg bg-blue-300 hover:bg-blue-500 focus:outline-none"
                        onClick={() => createRecommendation()}
                    >
                        הוסף המלצה
                    </button>

                </div>


            </div>
            {isForm ? <Form openBtnLabel="שלח את ההמלצה שלי" closeBtnLabel="אמליץ בפעם אחרת" /> : null}
        </div>
    );

};

export default PlacePage;