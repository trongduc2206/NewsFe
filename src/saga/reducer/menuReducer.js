const initialState = {
    selectedKey: []
}

export default (state = initialState, action) => {
    switch (action.type) {
        case 'ON_MENU_CLICK':
            return {
                ...state
            }
    }
}