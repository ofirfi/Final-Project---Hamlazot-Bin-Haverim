import '../utils/style.css'
import React from "react";
import './place.scss';
import Header from '../images/logo.jpg'
import BackGround from '../images/background.jpg'
import { FcSettings } from 'react-icons/fc'
import { GiExitDoor } from 'react-icons/gi'
import { AiTwotoneStar } from "react-icons/ai"
import { RecommendationsList } from './recommendations'


const IMAGES = {
        src: "http://www.caferimon.co.il/warehouse/dynamic/122270.jpeg",
        name: "קפה רימון",
        place: "מרכז העיר, ירושלים",
        opening: "7:00 - 23:00",
        stars: 5
}

const recommandations = [["עידן",4,"קפה מעולה מנות גדולות ומפנקות, מסעדה ברמה! קפה מעולה מנות גדולות ומפנקות, מסעדה ברמה! קפה מעולה מנות גדולות ומפנקות, מסעדה ברמה! קפה מעולה מנות גדולות ומפנקות, מסעדה ברמה!","27/06/2020"],
                         ["אופיר",5,"אירוח ברמה, באנו כמה חברים ונהננו מאוד :)","10/01/2019"],
                         ["עידנקו",3,"קפה מעולה מנות גדולות ומפנקות, מסעדה ברמה!","02/08/2020"],
                         ["עוף",5,"אירוח ברמה, באנו כמה חברים ונהננו מאוד :)","12/12/2019"],
                         ["אופיקו",4,"קפה מעולה מנות גדולות ומפנקות, מסעדה ברמה!","11/11/2020"],
                         ["פיטל",4,"אירוח ברמה, באנו כמה חברים ונהננו מאוד :)","06/10/2019"],
                         ["בוף",4,"קפה מעולה מנות גדולות ומפנקות, מסעדה ברמה!","01/01/2020"],
                         ["פיטליטי",3,"אירוח ברמה, באנו כמה חברים ונהננו מאוד :)","01/01/2020"]]

function starNumber(stars) {
    if(stars === 1)
        return ( <div className = "flex flex-row jusitfy-center"><AiTwotoneStar/></div>)
    else if(stars === 2)
        return (<div className = "flex flex-row content-center"> <AiTwotoneStar/><AiTwotoneStar/></div>)
    else if(stars === 3)
        return (<div className = "flex flex-row jusitfy-center"> <AiTwotoneStar/><AiTwotoneStar/><AiTwotoneStar/></div>)
    else if(stars === 4)
        return (<div className = "flex flex-row jusitfy-center"><AiTwotoneStar/><AiTwotoneStar/><AiTwotoneStar/><AiTwotoneStar/></div>)
    else if(stars === 5)
        return (<div className = "flex flex-row content-center"><AiTwotoneStar/><AiTwotoneStar/><AiTwotoneStar/><AiTwotoneStar/><AiTwotoneStar/></div>)
}

const PlacePage = () => {

    return (
        <div className="flex flex-col bg-fixed items-center"
            style={{ backgroundImage: `url(${BackGround})`, backgroundSize: '100% 100%' }}
        >

            <div className="flex items-start h-56 w-full"
                style={{ backgroundImage: `url(${Header})`, backgroundSize: '100% 100%' }}
            >
                <div className="w-1/2 flex justify-start mt-5 sm:mt-10 ml-5 sm:ml-10">
                    <button className="bg-green-300"
                        onClick={() => { }}>
                        <GiExitDoor className="text-3xl sm:text-5xl" />
                    </button>
                </div>

                <div className="w-1/2 flex justify-end mt-5 sm:mt-10 mr-5 sm:mr-10">
                    <button className=""
                        onClick={() => { }}
                    >
                        <FcSettings className="text-3xl sm:text-5xl" />
                    </button>
                </div>

            </div>














            <div className = "flex flex-row my-10 w-3/5 bg-red-400 rounded-xl ">

                <div className = "w-1/2 h-full">
                    <img src={IMAGES.src}/>
                </div>


                <div className = "flex flex-col w-1/2 ">
                    <div className =" self-center text-lg sm:text-3xl mt-2">{starNumber(IMAGES.stars)}</div>
                    <div className = "text-3xl sm:text-6xl self-center font-extrabolds">{IMAGES.name}</div>
                    <div className = "text-xs sm:text-lg self-end mt-8">שעות פתיחה: {IMAGES.opening}</div>
                    <div className = "text-xs sm:text-lg self-end mt-6">כתובת: {IMAGES.opening}</div>
                    <div className = "text-xl self-end font-bold underline">המלצות</div>
                    <div className = "h-96  overflow-y-auto text-right">
                    <RecommendationsList recommandations={recommandations} />
                    </div>
                </div>


            </div>
















            {/* <section classNameName="infoSectionP">
                <div id="info">
                    <h1 id="h1p">{IMAGES.name} {starNumber(IMAGES.stars)}</h1>
                    <text classNameName="info">{IMAGES.place}</text>
                    <p/>
                    <text classNameName="info">שעות פתיחה: {IMAGES.opening}</text>
                    <p/>
                    <text classNameName="info">המלצות החברים שלך</text>
                    <div classNameName="listP">
                        <RecommendationsList recommandations={recommandations} />
                    </div>
                </div>
                <div id="pics">
                    <img id="image" src={IMAGES.src}/>
                </div>
            </section> */}
        </div>
      );

};

export default PlacePage;