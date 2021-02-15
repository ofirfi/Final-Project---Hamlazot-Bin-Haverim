import axios from 'axios'

const initialState = {
    userName: null,
    token: null,
    logged: false,
    recommendations: null,
}


// const checkAuth = async () =>{
//     axios.post("http://localhost:8001/auth/",{token})
//     .then(res =>initialState.logged = true)
//     .catch(err=>initialState.logged = false)
// }



const rootReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case "SETUSER":
            return {
                ...state,
                userName: payload
            }
        case "SETTOKEN":
            return {
                ...state,
                token: payload
            }
        case "SETLOGGED":
            return {
                ...state,
                logged: payload
            }
        case "SETRECOOMENDATIONS":
            return {
                ...state,
                recommendations: payload
            }
        default:
            return state
    }
}

export default rootReducer;