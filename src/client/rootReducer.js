const initialState = {
    logged: false,
    recommendations: null,
    isForm: false,
    rating: null,
    raters: null,
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
        default:
            return state
    }
}

export default rootReducer;