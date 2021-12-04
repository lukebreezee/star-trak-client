import axios from 'axios';
import { store } from './redux/store';

// Checks strength of password

const checkPassword = password => {

    // Checks password length

    if (password.length < 10 || password.length > 25) {

        return 'Password must be 10-25 characters';

    }

    // Regular expressions for testing

    const capitalRegex = /[A-Z]/;

    const specialRegex = /[@#$%^&*<>?,.]/;

    // All vars are false until proven true

    let hasCapital, hasSpecial, hasNumber = false;

    // Iterate through each character - check for capital

    // letters, special characters, and numbers. The password must have one of each.
    
    for (let i = 0; i < password.length; i++) {

        if (capitalRegex.test(password[i])) {

            hasCapital = true;

        } else if (specialRegex.test(password[i])) {

            hasSpecial = true;

        } else if (!isNaN(password[i])) {

            hasNumber = true;
        }

    }

    // Now we check our vars and return different messages based on

    // the outcome.

    if (!hasCapital) {

        return 'Password must contain a capital letter.'

    } else if (!hasSpecial) {

        return 'Password must contain a special character.';

    } else if (!hasNumber) {

        return 'Password must contain a number.';

    } else {

        return '';

    }

};

//This function is copied from https://ui.dev/validate-email-address-javascript/

// It uses a very complicated regex that I thankfully did not need to come up with myself

// It looks cool though. And it works which is always a plus

const checkEmail = email => {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

};

// This function returns a promise based on the outcome of a fetch

// from the server.

const getTeamInfo = () => {

    return new Promise ((resolve, reject) => {

        // If user is not logged in, this error will be caught

        if (!store.getState().root.userInfo.username) {

            return reject();
    
        }

        // Making a post request to the server
    
        axios.post('https://star-trak.herokuapp.com/get-team-info', {
    
            teamUsername: store.getState().root.userInfo.teamUsername
    
        })

        .then(res => {

            // Dispatch info to the store to be used
    
            store.dispatch({type: 'TEAM INFO UPDATE', teamObj: res.data});

            // If all goes well, this code will execute and team info

            // will show up as the .then() method's parameter

            return resolve(res.data);
    
        })

        .catch(() => {

            // If there is an unexpected error, catch it
    
            return reject('An unexpected error has occured');
    
        });

    });

};

// Posts to the database to update user properties

const updateUser = (key, updateValue, username) => {

    // We make our request

    axios.post('https://star-trak.herokuapp.com/update-user', {

        key,
        updateValue,
        username

    })

    .then(res => {

        // If message, something went wrong

        if (res.data.message) {

            return res.data.message;

        } else {

            // Else, it was a success, so we update our user

            store.dispatch({type: 'USER LOGIN', userObj: res.data});

            return 'Success';

        }

    });

};

// Makes post request to server to update selected users' notifs list

const sendNotification = params => {

    // Variable to be conditionally rendered (notification text)

    let notification;

    // Get user's credentials

    const userInfo = store.getState().root.userInfo;

    // Shorthands for readability and simplicity

    const first = userInfo.firstName;

    const last = userInfo.lastName;

    // Filter the notification type to render the notification body

    switch(params.type) {

        case 'NEW PROJECT':

            notification = 
                
                `${first} ${last} has added you to a project: ${params.name}`;

            break;

        case 'NEW TICKET':

            notification = `You have been assigned a new ticket on: ${params.projectName}`;

            break;

        case 'NEW COMMENT':

            notification = 
            
                `${params.author} has made a comment on "${params.ticketName}": "${params.comment}"`;

            break;

        case 'TICKET STATUS CHANGE':

            notification = 
            
                `${first} ${last} has changed the status of "${params.ticketName}" to "${params.status}"`;

            break;

        default:

            break;

    }

    // Then we send our notification out to the selected users

    axios.post('https://star-trak.herokuapp.com/send-notification', {

        teamUsername: userInfo.teamUsername,
        memberList: params.memberList,
        notification

    });

};

// Exporting functions

export { 
    
    checkPassword, 
    checkEmail, 
    getTeamInfo, 
    updateUser,
    sendNotification

};