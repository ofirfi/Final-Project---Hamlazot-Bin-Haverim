import '../../utils/style.css'
import { useHistory } from 'react-router'
import { GiPopcorn, GiWhiteBook } from 'react-icons/gi'
import { IoRestaurant } from 'react-icons/io5'


export function RecommendedItem(props) {
    const history = useHistory();


    const transferation = () => {
        history.push(`${props.type}/${props.rId}`);
    }


    const icon = () => {
        if(props.type === "place")
            return <IoRestaurant style={{ fontSize: 72 }} />
        else if(props.type === "movie")
            return <GiPopcorn style={{ fontSize: 72 }} />
        else return <GiWhiteBook style={{ fontSize: 72 }} />
    }

    return (
        // <tr className = "flex border-2">
        //     <td className ="w-full border-2">{props.raters}</td>
        //     <td className ="w-full border-2">{props.rating}</td>
        //     <td className ="w-full border-2"
        //         onClick = {transferation}>{props.name}
        //     </td>
        // </tr>
        <tr className="flex flex-row items-center border-2 rounded h-28 w-64 my-2 bg-green-200 cursor-pointer" onClick = {transferation}>
            <div className="flex m-2 w-1/5">
                {icon()}
            </div>
            <div className="flex flex-col m-2 w-4/5">    
                <div className="text-lg mb-2">{props.name}</div>
                <div>{props.rating}</div>
                <div>קיבלת המלצה מ-{props.raters} חברים</div>
            </div>
        </tr>
    )
}