import jwt_decode from 'jwt-decode'


function checkAuth() {
    const token = window.localStorage.getItem('token')
    if (!token)
        return false

    const decodedToken = jwt_decode(token)
    const currentTime = new Date()

    if (decodedToken.exp * 1000 < currentTime.getTime())
        return false
    return true
}

export default checkAuth