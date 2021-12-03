import { connect } from 'react-redux';
import { mapCredentials, mapDispatch } from '../redux/mapToProps';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';

// Allows user to edit their account credentials

const AccountComponent = props => {

    // State field that renders a button when the user's

    // first name input or last name input is different 

    // from their values in redux store

    const [UpdateButton, setUpdateButton] = useState(null);

    // Below variables are not state properties because 

    // they do not update right away when outside of a form,

    // but they are set the same way on input change.

    let firstName = props.userInfo.firstName;

    let lastName = props.userInfo.lastName;

    // useHistory simplifies client redirect

    let history = useHistory();

    // Function called when log out button is clicked

    const handleLogOut = () => {

        // If user is in demo mode, revert data back to what it was

        if (props.teamInfo.username === 'demo-team') {

            axios.delete('https://star-trak.herokuapp.com/demo-delete');

        }

        // Clears userInfo and teamInfo objects in redux store

        props.userLogOut();

        // Redirect to the login page

        history.push('/login');

    };

    // Function called when leave team button is clicked

    const handleTeamLogOut = async () => {

        // If user is in demo mode, prevent team leave

        if (props.teamInfo.username === 'demo-team') return;

        // Deleting user's member object from their team

        await axios.post('https://star-trak.herokuapp.com/delete-member', {

            teamUsername: props.userInfo.teamUsername,
            username: props.userInfo.username

        });

        // Making the user's team value null so that they can join a new team

        axios.post('https://star-trak.herokuapp.com/update-user', {

            username: props.userInfo.username,
            key: 'teamUsername',
            updateValue: null

        });

        // Clear team info from redux store

        props.teamLogOut();

        // Redirect user

        history.push('/team-login');

    }

    // Called when user decides to change first or last name

    const updateUserInfo = () => {

        // If user is in demo mode, prevent update

        if (props.teamInfo.username === 'demo-team') return;

        // Message displayed to user showing outcome

        let alert = document.getElementById('update-user-names-alert');

        alert.style.color = '#AA0000';

        // Prompt user if either name is blank

        if (!firstName || !lastName) {

            alert.innerHTML = 'Names cannot be blank';

            return;

        }

        // Make post request to back-end to update first/last name of user

        axios.post('https://star-trak.herokuapp.com/update-user/names', {

            username: props.userInfo.username,
            teamUsername: props.userInfo.teamUsername,
            firstName,
            lastName

        })
        
        .then(res => {

            // If message, something is wrong, so we display to user

            if (res.message) {

                alert.innerHTML = res.message;

                return;

            }

            // Else, post was successful, so we turn the text

            // green and alert user

            alert.style.color = '#00AA00';

            alert.innerHTML = 'Success';

            // Then we update redux with new user info

            props.userLogIn(res.data);

        });

    };

    // JSX appears if first or last name is different from

    // values in redux store

    const UpdateButtonComponent = (

        <div id="update-button">

            <Button 
            
                id="update-button" 
                variant="outline-primary"
                onClick={() => updateUserInfo()}
                
            >
                
                Update
                
            </Button>

            <br />

            <br />

            <div id="update-user-names-alert" style={{maxWidth: 'fit-content'}}></div>

        </div>

    );

    // Called when user changes value of first/last name inputs

    const handleInfoChange = event => {

        // Case for first name change

        if (event.target.name === 'firstName') {

            // Set previously declared variable

            firstName = event.target.value;

            // If input value is different from username in redux,

            // render update button

            if (event.target.value !== props.userInfo.firstName) {

                setUpdateButton(UpdateButtonComponent);

                return;

            }

            if (lastName !== props.userInfo.lastName) {

                setUpdateButton(UpdateButtonComponent);

                return;

            }

        }

        if (event.target.name === 'lastName') {

            // Set previously declared variable

            lastName = event.target.value;

            // If input value is not the same as last name in

            // redux, render update button

            if (event.target.value !== props.userInfo.lastName) {

                setUpdateButton(UpdateButtonComponent);

                return;

            }

            if (firstName !== props.userInfo.firstName) {

                setUpdateButton(UpdateButtonComponent);

                return;

            }

        }

        // Else, update button does not render

        setUpdateButton(null);

    }

    return (

        <div className="aligned">

            <div className="account-page-main-parent">

                <div></div>

                <div className="account-page-parent">

                    <h3>Edit Account</h3>

                    <div>

                        <label htmlFor="firstName"><strong>First Name:</strong></label>

                        <br />

                        <input 
                        
                            type="text"
                            name="firstName"
                            defaultValue={props.userInfo.firstName}
                            onChange={e => handleInfoChange(e)}

                        />

                        <br />

                        <div style={{height: '15px'}}></div>

                        <label htmlFor="lastName"><strong>Last Name:</strong></label>

                        <br />

                        <input 
                        
                            type="text"
                            name="lastName"
                            defaultValue={props.userInfo.lastName}
                            onChange={e => handleInfoChange(e)}

                        />

                    </div>

                    <br />

                    <div><strong>Email:</strong> {props.userInfo.username}</div>

                    <br />

                    <Button 
                    
                        variant="dark" 
                        onClick={() => history.push('/change-email')}
                        
                    >
                        
                        Change Email
                        
                    </Button>

                    <Button 
                        
                        variant="dark" 
                        onClick={() => history.push('/change-password')}
                        
                    >
                        Change Password
                        
                    </Button>

                    <Button 
                    
                        onClick={() => handleLogOut()} 
                        variant="danger"
                        
                    >
                        Log Out
                        
                    </Button>

                    <Button onClick={() => handleTeamLogOut()} variant="danger">Leave Team</Button>
                    
                </div>

                {UpdateButton}

            </div>

        </div>

    );

};

// Connect component to redux and export

const Account = connect(mapCredentials, mapDispatch)(AccountComponent);

export { Account };