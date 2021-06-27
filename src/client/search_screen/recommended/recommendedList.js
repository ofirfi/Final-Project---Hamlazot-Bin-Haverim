import '../../utils/style.css'
import { useEffect, useState } from 'react'
import { RecommendedItem } from './recommendedItem'

export function RecommendedList(props) {
    const [items, setItems] = useState([]);


    useEffect(() => {
        let items = props.items;
        let list = items.map(item =>
            <RecommendedItem
                name={item.name}
                rating={item.rating}
                raters={item.raters}
                rId={item.rId}
                type={props.type}
            />
        )
        setItems(list);
    }, [])




    return (
        <div className = "flex flex-col w-1/3 mx-5 text-sm">
            {props.title}
            <table className="w-full">
                <th className="flex">
                    <tr className="w-full border-2">מדרגים</tr>
                    <tr className="w-full border-2">דירוג</tr>
                    <tr className="w-full border-2">שם</tr>
                </th>
                <tbody>
                    {items}
                </tbody>
            </table>
        </div>

    )
}