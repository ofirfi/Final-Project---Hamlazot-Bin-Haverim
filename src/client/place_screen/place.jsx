import React from "react";
import './place.scss';


const IMAGES = {
        src: "https://www.my-events.co.il/wp-content/uploads/2017/07/rimonbistro-halavi-a2.jpg",
        thumbnail: "https://www.my-events.co.il/wp-content/uploads/2017/07/rimonbistro-halavi-a2.jpg",
        thumbnailWidth: 320,
        thumbnailHeight: 212,
        tags: [{value: "קפה רימון", title: "קפה רימון"}],
        caption: "קפה רימון, ירושלים"
}

const recommandations = [["עידן","קפה מעולה מנות גדולות ומפנקות, מסעדה ברמה!"],
                         ["אופיר","אירוח ברמה, באנו כמה חברים ונהננו מאוד :)"]]

function RecommendationsList(props) {
    const recommandations = props.recommandations;
    const listItems = recommandations.map((recommandation) => 
        <li className="lip" key={recommandation.key} >
            <text style={{ position: "relative", float: "right" }}>{recommandation[0]}</text>
            <text style={{ position: "relative", float: "right" }}>{recommandation[1]}</text>
        </li>
    );
    return (
      <ul style={{ listStyleType: "none" }}>{listItems}</ul>
    );
}

export default class Place extends React.Component {

  render(){
      return(
        <div className="pagep">
            <header className="navbarp">
                
            </header>
            <section className="infoSectionp">
                <div id="info">
                    <h1 id="h1p">שם המקום <text>דירוג</text></h1>
                    <text className="info">מיקום</text>
                    <p/>
                    <text className="info">שעות פתיחה</text>
                    <p/>
                    <text className="info">המלצות החברים שלך</text>
                    <div className="list">
                        <RecommendationsList recommandations={recommandations} />
                    </div>
                </div>
                <div id="pics">
                    
                </div>
            </section>
        </div>
      );
  };
};