import { persistReducer } from 'redux-persist';
import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';

//Initial state for redux store

const initialState = {

    userInfo: {

        username: null,
        teamUsername: null
        
    },

    teamInfo: {},
    
    currentProject: null,

    currentTicket: null,

    googleInfo: {}
  
};

// This app uses redux persist to cache the redux store in local storage.

// This prevents page refreshes from resetting the application and 

// also keeps the user logged into their account.

const persistConfig = {

    key: 'root',
    storage

};

// The root reducer for our store

const rootReducer = (state = initialState, action) => {

    // Create copy of state with spread operator

    const tmp = {...state};

    // Switch statement that filters the dispatch

    switch(action.type) {

        // Load user info into store

        case 'USER LOGIN':

            tmp.userInfo = action.userObj;

            break;

        // Essentially clears the store

        // Reverts userInfo and teamInfo

        case 'USER LOGOUT':

            tmp.userInfo = { username: null, teamUsername: null };

            tmp.teamInfo = {};

            break;

        // Loads team username into userInfo obj

        // Allows fetches from database

        case 'TEAM LOGIN':

            tmp.userInfo.teamUsername = action.username;

            break;

        // Loads new team info

        case 'TEAM INFO UPDATE':

            tmp.teamInfo = action.teamObj;

            break;

        // Clears team info and reverts teamUsername

        case 'TEAM LOGOUT':

            tmp.teamInfo = {};

            tmp.userInfo.teamUsername = null;

            break;

        // This is needed to avoid URL parameters when on the view project page

        case 'CURRENT PROJECT UPDATE':

            tmp.currentProject = action.projectName;

            break;

        // Avoids URL parameters when on the view ticket page

        case 'CURRENT TICKET UPDATE':

            tmp.currentTicket = action.ticketName;

            break;

        // Updates google info for when user first registers using OAuth

        // Necessary since the user may want to provide their work email

        // as opposed to their gmail.

        case 'GOOGLE INFO UPDATE':

            tmp.googleInfo = action.obj;

            break;

        default:
            
            return state;

    }

    // Return the copy to replace the original

    return tmp;

};

// Only one reducer but this is necessary for redux persist to work

const reducer = combineReducers({

    root: rootReducer

});

// Create our persisted reducer to be cached in local storage

const persistedReducer = persistReducer(persistConfig, reducer);

// And then export that persisted reducer that we just created

export { persistedReducer };