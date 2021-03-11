const initialState = {
    logged: false,
    recommendations: null,
    isForm: false
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
        case "TOGGLEFORM":
            return{
                ...state,
                isForm: !state.isForm
            }
        default:
            return state
    }
}

export default rootReducer;