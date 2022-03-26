import { DISPLAY_ALERT, CLEAR_ALERT } from "./actions"

const reducer = (state, action) => {
    if(action.type === DISPLAY_ALERT){
        return {
            ...state,
            alertOn: true,
            alertText:'Please fill all fields.',
            alertType:'danger',
        }    
    }
    if(action.type === CLEAR_ALERT){
        return {
            ...state,
            alertOn: false,
            alertText:'',
            alertType:'',
        }
    }

    throw new Error(`No such action: ${action.type}`)
}

export default reducer