import { AiTwotoneStar } from "react-icons/ai"



function starNumber(stars) {
    if(stars === 1)
        return ( <div class = "flex flex-row jusitfy-center"><AiTwotoneStar/></div>)
    else if(stars === 2)
        return (<div class = "flex flex-row content-center"> <AiTwotoneStar/><AiTwotoneStar/></div>)
    else if(stars === 3)
        return (<div class = "flex flex-row jusitfy-center"> <AiTwotoneStar/><AiTwotoneStar/><AiTwotoneStar/></div>)
    else if(stars === 4)
        return (<div class = "flex flex-row jusitfy-center"><AiTwotoneStar/><AiTwotoneStar/><AiTwotoneStar/><AiTwotoneStar/></div>)
    else if(stars === 5)
        return (<div class = "flex flex-row content-center"><AiTwotoneStar/><AiTwotoneStar/><AiTwotoneStar/><AiTwotoneStar/><AiTwotoneStar/></div>)
}


export function RecommendationsList(props) {
    const recommandations = props.recommandations;
    const listItems = recommandations.map((recommandation) => 
        <div class = "bg-blue-200 rounded-xl mb-3 border-2 border-transparent" key={recommandation.key} >
            <div class ="flex flex-col">
                    <div>{recommandation[0]}</div>
                    <div class = "self-end">{starNumber(recommandation[1])}</div>
                    <div class = "text-right h-12 overflow-y-auto">{recommandation[2]}</div>
                    <div>נכתב בתאריך {recommandation[3]}</div>
            </div>
        </div>
    );
    return (
      <div>{listItems}</div>
    );
}