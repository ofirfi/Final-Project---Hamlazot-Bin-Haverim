import '../utils/style.css'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import BackGround from '../images/background.jpg'
import { Recommendations } from '../recommendations_component/recommendation'
import { Navbar } from '../navbar/navbar'
import { Form } from '../utils/form'
import { useSelector, useDispatch } from 'react-redux'
import { BOOKS_API_KEY } from '../utils/config.json'
import { useHistory } from 'react-router-dom'
import picture_unavailable from '../images/picture_unavailable.jpg'
import { FaUserFriends, FaChartBar, FaBookOpen } from 'react-icons/fa'
import { GiBookCover } from 'react-icons/gi'


export const getAuthor = (res) => {
    const data = res;
    let hebrewAuthors = "";
    let englishAuthors = "";
    if (data === undefined)
        return "שם הסופר אינו זמין";
    if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
            if (isHebrew(data[i])) {
                if (hebrewAuthors !== "")
                    hebrewAuthors += ", " + data[i];
                else hebrewAuthors += data[i];
            }
            else {
                if (englishAuthors !== "")
                    englishAuthors += ", " + data[i];
                else englishAuthors += data[i];
            }
        }
        if (hebrewAuthors !== "") {
            return hebrewAuthors;
        }
        else if (englishAuthors !== "")
            return englishAuthors;
    }
    else return "שם הסופר אינו זמין";
}


export const isHebrew = (data) => {
    if ((("A" <= data[0]) && (data[0] <= "Z")) || (("a" <= data[0]) && (data[0] <= "z")))
        return false;
    return true;
}


const BookPage = (props) => {
    const bookId = props.match.params.id;
    const isForm = useSelector(state => state.isForm);
    const dispatch = useDispatch();
    const history = useHistory();
    const rating = useSelector(state => state.rating);
    const raters = useSelector(state => state.raters);
    const [voteAverage, setvoteAverage] = useState('');
    const [book, setBook] = useState({
        title: "",
        author: "",
        publishedDate: "",
        description: "",
        publisher: "",
        imageLinks: "",
    });


    useEffect(async () => {
        await axios.get(`https://www.googleapis.com/books/v1/volumes/${bookId}?key=${BOOKS_API_KEY}&language=iw`)
            .then((res) => {
                setBook({
                    title: res.data.volumeInfo.title,
                    author: getAuthor(res.data.volumeInfo.authors),
                    publishedDate: res.data.volumeInfo.publishedDate,
                    description: getDescription(res.data.volumeInfo.description),
                    publisher: res.data.volumeInfo.publisher,
                    imageLinks: getImage(res.data.volumeInfo.imageLinks),
                });

                console.log(res.data);
                setvoteAverage("אינו זמין כעת");
            })
            .catch(() => {
                history.push('/404');
            })
    }, [])


    const getDescription = (res) => {
        if (res === undefined)
            return "תקציר אינו זמין כעת";
        return res;
    }


    const getImage = (res) => {
        if (res === undefined)
            return picture_unavailable;
        else return res.thumbnail;
    }


    const createRecommendation = () => {
        dispatch({
            type: "SETFORMINFO",
            payload: {
                rId: bookId,
                name: book.title,
                rate: 1,
                comment: "",
                type: "ספר",
            }
        })
        dispatch({ type: "TOGGLEFORM" })
    }


    return (
        <div className="flex flex-col bg-fixed items-center"
            style={{ backgroundImage: `url(${BackGround})`, backgroundSize: '100% 100%' }}
        >
            <Navbar />

            <div className="flex flex-col self-center w-4/5 lg:w-1/2 my-10 box-border border-4 rounded-lg bg-gray-300">

                {/* Name */}
                <div className="w-full h-16 sm:h-24 text-3xl sm:text-5xl lg:text-6xl text-center font-bold bg-white">
                    <div> {book.title} </div>
                    <div className="text-base md:text-xl"> {book.author} </div>
                </div>

                {/* Photo + description */}
                <div className="flex flex-row-reverse w-full">

                    <div className="flex w-1/2 h-48 sm:h-56 justify-center p-2 border-l-2">
                        <img src={book.imageLinks} />
                    </div>

                    <div className="flex w-1/2 justify-end text-right text-md sm:text-lg p-2 border-r-2">

                        {book.description}

                    </div>

                </div>

                {/* Author + rating */}
                <div className="flex flex-row-reverse text-md md:text-lg text-center border-2">
                    <div className="flex w-1/2 text-center justify-center border-2">
                        <div className="mr-2"> {book.publisher}, {book.publishedDate} </div>
                        <div className="self-center"> <GiBookCover /> </div>
                    </div>
                    <div className="flex w-1/4 text-center justify-center border-2">
                        <div className="mr-2"> {rating !== 0 ? rating : voteAverage} / 5 </div>
                        <div className="self-center"> <FaChartBar /> </div>
                    </div>
                    <div className="flex w-1/4 text-center justify-center border-2">
                        <div className="mr-2"> {raters} </div>
                        <div className="self-center"> <FaUserFriends /> </div>
                    </div>
                </div>

                {/* Recommendations + add button */}
                <div className="flex flex-col w-full items-center bg-white">

                    <div className="text-xl self-center my-2 font-bold underline">המלצות</div>

                    <div className="h-56 mb-5 w-full sm:w-3/4 mx-2 overflow-y-auto text-right">
                        <Recommendations rId={bookId} closeness={props.closeness} />
                    </div>

                    <button className="self-center my-5 border-4 border-transparent text-sm sm:text-base text-white rounded-lg bg-blue-300 hover:bg-blue-500 focus:outline-none"
                        onClick={() => createRecommendation()}
                    >
                        הוסף המלצה
                    </button>

                </div>


            </div>
            {isForm ? <Form openBtnLabel="שלח את ההמלצה שלי" closeBtnLabel="אמליץ בפעם אחרת" /> : null}
        </div>
    )

}

export default BookPage