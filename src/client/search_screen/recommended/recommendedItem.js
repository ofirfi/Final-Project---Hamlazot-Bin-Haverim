import '../../utils/style.css'
import { useHistory } from 'react-router'


export function RecommendedItem(props) {
    const history = useHistory();


    const transferation = () =>{
        history.push(`${props.type}/${props.rId}`);
    }
    

    return (
        <tr className = "flex flex-row-reverse border-2"
            onClick = {transferation}
            >
            <td className ="mx-2 text-center w-1/2">{props.name}</td>
            <td className ="mx-2 text-center w-1/6">{props.rating}</td>
            <td className ="mx-2 text-center w-1/6">{props.raters}</td>
        </tr>
    )
}