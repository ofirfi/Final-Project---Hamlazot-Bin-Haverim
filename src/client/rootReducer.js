const initialState = {
    logged: false,
    recommendations: null,
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
        default:
            return state
    }
}

export default rootReducer;