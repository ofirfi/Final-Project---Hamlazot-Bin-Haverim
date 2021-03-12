import './style.css'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

export function Form(props){
    const [rate,setRate] = useState('1');
    const [comment,setComment] = useState('');
    const dispatch = useDispatch();

    const addRecommendation = () =>{
        console.log(props.rId)
        console.log(props.name)
        console.log(props.type)
        console.log(props.userName)
        console.log(rate)
        console.log(comment);
        dispatch({type:"TOGGLEFORM"});
    }
    

    return(
            <div className = "grid flex fixed w-full h-full block  bg-gray-400 bg-opacity-80 ">
                <div className = "flex flex-col w-3/5 md:w-2/5 lg:w-1/4 h-96 bg-red-400 rounded-2xl self-center justify-self-center">
                    <div className = "text-4xl text-center grid place-content-center break-normal h-16 w-full ">
                        הוסף המלצה
                    </div>
                    <div className = "text-4xl text-center grid place-content-center break-normal h-24 w-full ">
                        {props.name}
                    </div>

                    <div className = "flex flex-row-reverse w-full text-xl text-right mt-3 h-7 self-start grid">
                        <lab className = "self-right justify-end">
                            
                            <select className = "mr-2 w-16 text-black text-center"
                                value = {rate}
                                onChange ={event => setRate(event.target.value)}
                                >
                                <option value = "1">1</option>
                                <option value = "2">2</option>
                                <option value = "3">3</option>
                                <option value = "4">4</option>
                                <option value = "5">5</option>
                            </select>
                            בחר דירוג
                        </lab>

                    </div>
            
                    {/* <div className = "flex flex-row-reverse w-full text-white text-xl text-center mt-3 h-7 self-start">
                        <div className = "w-1/6 self-center text-black">
                            דירוג
                        </div>
                        <div className = "w-1/6">
                            <button className = "w-1/2 self-center bg-blue-400 rounded-full hover:bg-blue-700 focus:outline-none">
                                1
                            </button>
                        </div>
                        <div className = "w-1/6">
                            <button className = "w-1/2 self-center bg-blue-400 rounded-full hover:bg-blue-700 focus:outline-none">
                                2
                            </button>
                        </div>
                        <div className = "w-1/6">
                            <button className = "w-1/2 self-center bg-blue-400 rounded-full hover:bg-blue-700 focus:outline-none">
                                3
                            </button>
                        </div>
                        <div className = "w-1/6">
                            <button className = "w-1/2 self-center bg-blue-400 rounded-full hover:bg-blue-700 focus:outline-none">
                                4
                            </button>
                        </div>
                        <div className = "w-1/6">
                            <button className = "w-1/2 self-center bg-blue-400 rounded-full hover:bg-blue-700 focus:outline-none">
                                5
                            </button>
                        </div>
                        
                    </div> */}



                    <div className = "w-5/6 h-28 self-center text-xl flex flex-col grid">
                        <textarea className="self-center placeholder-gray-300 text-right rounded w-full h-20 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-70"
                            placeholder="תגובה"
                            value={comment}
                            onChange={(event)=>setComment(event.target.value)}
                            required
                            />
                    </div>



                    <div className = "flex justify-around w-full h-14 text-white">
                        <button className="w-1/4 h-full bg-blue-400 rounded-full self-center hover:bg-blue-700 focus:outline-none"
                            onClick={()=>dispatch({type:"TOGGLEFORM"})}
                        >
                        סגור
                        </button>
    
                        <button className="w-1/4 h-full bg-blue-400 rounded-full hover:bg-blue-700 focus:outline-none"
                            onClick={addRecommendation}
                        >
                        הוסף
                        </button>
                    </div>

                </div>
            </div>
    )


}