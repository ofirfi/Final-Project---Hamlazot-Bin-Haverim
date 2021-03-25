const initialState = {
    logged: false,
    recommendations: null,
    isForm: false,
    isFriendSearch: false,
    rating: null,
    raters: null,
    recommendationInfo: {
        rate: 1,
        comment: "",
        id: ""
    }
}



const rootReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case "SETLOGGED":
            return {
                ...state,
                logged: payload
            }
        case "SETRECOMMENDATIONS":
            return {
                ...state,
                recommendations: payload
            }
        case "SETRATING":
            return {
                ...state,
                rating: payload
            }
        case "SETRATERS":
            return {
                ...state,
                raters: payload
            }
        case "TOGGLEFORM":
            return {
                ...state,
                isForm: !state.isForm
            }
        case "TOGGLEFRIENDSEARCH":
            return {
                ...state,
                isFriendSearch: !state.isFriendSearch
            }
        case "SETFORMINFO":
            return {
                ...state,
                recommendationInfo: payload
            }
        default:
            return state
    }
}

export default rootReducer;