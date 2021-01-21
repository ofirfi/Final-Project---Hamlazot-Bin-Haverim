import React from "react";
import './place.scss';
import { AiTwotoneStar } from "react-icons/ai"

const IMAGES = {
        src: "http://www.caferimon.co.il/warehouse/dynamic/122270.jpeg",
        name: "קפה רימון",
        place: "מרכז העיר, ירושלים",
        opening: "7:00 - 23:00",
        stars: 5
}

const recommandations = [["עידן",4,"קפה מעולה מנות גדולות ומפנקות, מסעדה ברמה!","27/06/2020"],
                         ["אופיר",5,"אירוח ברמה, באנו כמה חברים ונהננו מאוד :)","10/01/2019"],
                         ["עידנקו",3,"קפה מעולה מנות גדולות ומפנקות, מסעדה ברמה!","02/08/2020"],
                         ["עוף",5,"אירוח ברמה, באנו כמה חברים ונהננו מאוד :)","12/12/2019"],
                         ["אופיקו",4,"קפה מעולה מנות גדולות ומפנקות, מסעדה ברמה!","11/11/2020"],
                         ["פיטל",4,"אירוח ברמה, באנו כמה חברים ונהננו מאוד :)","06/10/2019"],
                         ["בוף",4,"קפה מעולה מנות גדולות ומפנקות, מסעדה ברמה!","01/01/2020"],
                         ["פיטליטי",3,"אירוח ברמה, באנו כמה חברים ונהננו מאוד :)","01/01/2020"]]

function starNumber(stars) {
    if(stars === 1)
        return (<text> <AiTwotoneStar/></text>)
    else if(stars === 2)
        return (<text> <AiTwotoneStar/><AiTwotoneStar/></text>)
    else if(stars === 3)
        return (<text> <AiTwotoneStar/><AiTwotoneStar/><AiTwotoneStar/></text>)
    else if(stars === 4)
        return (<text> <AiTwotoneStar/><AiTwotoneStar/><AiTwotoneStar/><AiTwotoneStar/></text>)
    else if(stars === 5)
        return (<text> <AiTwotoneStar/><AiTwotoneStar/><AiTwotoneStar/><AiTwotoneStar/><AiTwotoneStar/></text>)
}

function RecommendationsList(props) {
    const recommandations = props.recommandations;
    const listItems = recommandations.map((recommandation) => 
        <li className="lip" key={recommandation.key} >
            <div className="boxP">
                <div id="text">
                    <text>{recommandation[0]}</text>
                    {starNumber(recommandation[1])}
                    <p>{recommandation[2]}</p>
                    <h6>נכתב בתאריך: {recommandation[3]}</h6>
                </div>
            </div>
        </li>
    );
    return (
      <ul style={{ listStyleType: "none" }}>{listItems}</ul>
    );
}

const PlacePage = () =>{
 
      return(
        <div className="pagep">
            <header className="navbarp">
                
            </header>
            <section className="infoSectionP">
                <div id="info">
                    <h1 id="h1p">{IMAGES.name} {starNumber(IMAGES.stars)}</h1>
                    <text className="info">{IMAGES.place}</text>
                    <p/>
                    <text className="info">שעות פתיחה: {IMAGES.opening}</text>
                    <p/>
                    <text className="info">המלצות החברים שלך</text>
                    <div className="listP">
                        <RecommendationsList recommandations={recommandations} />
                    </div>
                </div>
                <div id="pics">
                    <img id="image" src={IMAGES.src}/>
                </div>
            </section>
        </div>
      );

};

export default PlacePage;