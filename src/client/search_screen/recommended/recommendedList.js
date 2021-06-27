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
                type={props.title}
            />
        )
        setItems(list);
    }, [])




    return (
        <table className="mx-2 w-1/3">
            {props.title}
            <th className="flex flex-row-reverse">
                <tr className="mx-2 text-center w-3/6">שם</tr>
                <tr className="mx-2 text-center w-1/6">דירוג</tr>
                <tr className="mx-2 text-center w-1/6">מדרגים</tr>
                <tr className="mx-2 text-center w-1/6"></tr>
            </th>
            <tbody>
                {items}
                {/* <RecommendedItem />
                <RecommendedItem />
                <RecommendedItem />
                <RecommendedItem /> */}
            </tbody>
        </table>
    )
}