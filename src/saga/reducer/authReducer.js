const initialState = {
    name:'',
    objects: [],
    userName: "",
    password: '',
    loginStatus: false,
    isSigningup: false,
    signupStatus: false
}
export default (state = initialState, action) => {
    switch (action.type) {
        case 'API_CALL_REQUEST':
            return {
                ...state,
                name: action.name,
                fetching: true,
            }
        case 'API_CALL_SUCCESS':
            console.log(action.payload)
            return {
                ...state,
                objects:action.payload
            }
        case 'CHECK_LOGIN_API':
            return{
                ...state,
            }
        case 'CHECK_LOGIN_SUCCESS':
            console.log(action.userName)
            console.log(action.loginStatus)
            return {
                ...state,
                userName: action.userName,
                loginStatus: action.loginStatus
            }
        case 'CHECK_SIGNUP_API':
            return{
                ...state,
                isSigningup: true
            }
        case 'CHECK_SIGNUP_SUCCESS':
            return{
                ...state,
                isSigningup: false,
                signupStatus: action.signupStatus
            }
        case 'RESET_SIGNUP_STATUS':
            return{
                ...state,
                signupStatus: false
            }
        case 'RESET_LOGIN_STATUS':
            return {
                ...state,
                loginStatus: false
            }
        case 'LOGOUT':
            return {
                ...state,
                loginStatus: false
            }
        default: return state;
    }
}