import '../../utils/style.css'
import { useEffect, useState } from 'react'
import { RecommendedItem } from './recommendedItem'

export function RecommendedList(props) {
    const [items, setItems] = useState([]);
    const MAX_ITEMS = 5;

    useEffect(() => {
        let items = props.items;

        if (items.length === 0){
            setItems(
                <div className="w-64 text-sm">
                    אין המלצות עבורך
                </div>
            )
            return;
        }

        let list = [];
        for (let i = 0; i< items.length && i < MAX_ITEMS; i++)
            list[i] = <RecommendedItem
                        name={items[i].name}
                        rating={items[i].rating}
                        raters={items[i].raters}
                        rId={items[i].rId}
                        type={props.type}
                    />
        setItems(list);

    }, [])




    return (
        <div className="flex flex-col w-1/3 mx-5 text-sm">
            <div className="text-lg">{props.title}</div>
            <table className="w-full">
                {/* <th className="flex">
                    <tr className="w-full border-2">מדרגים</tr>
                    <tr className="w-full border-2">דירוג</tr>
                    <tr className="w-full border-2">שם</tr>
                </th> */}
                <tbody>
                    {items}
                </tbody>
            </table>
        </div>

    )
}