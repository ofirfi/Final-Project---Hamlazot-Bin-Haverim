import '../../utils/style.css'
import { useHistory } from 'react-router'


export function RecommendedItem(props) {
    const history = useHistory();


    const transferation = () =>{
        history.push(`${props.type}/${props.rId}`);
    }
    

    return (
        <tr className = "flex border-2">
            <td className ="w-full border-2">{props.raters}</td>
            <td className ="w-full border-2">{props.rating}</td>
            <td className ="w-full border-2"
                onClick = {transferation}
                >
                    {props.name}
                </td>
        </tr>
    )
}