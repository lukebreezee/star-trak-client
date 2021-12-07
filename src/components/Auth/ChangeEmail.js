import { MDBCard, MDBCardBody, MDBCardTitle } from 'mdb-react-ui-kit';
import { connect } from 'react-redux';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { mapCredentials, mapDispatch } from '../../redux/mapToProps';
import { checkEmail } from '../../helpers';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const ChangeEmailComponent = props => {

    //Credentials that will be updated on input change

    const [password, setPassword] = useState('');

    const [newUsername, setNewUsername] = useState('');

    //Use history to redirect the user if needed

    let history = useHistory();

    //Handles the submission of the change email form

    const handleSubmit = () => {

        // Message shown to user showing status

        let alert = document.getElementById('change-email-alert');

        //Query the database to change the email

        axios.post('https://star-trak.herokuapp.com/update-user/email', {

            username: props.userInfo.username,
            newUsername,
            password

        })
        
        .then(res => {

            //If res.data.message is truthy, it is an error message

            if (res.data.message) {

                alert.innerHTML = res.data.message;

                return;

            }

            //Send user info to redux store

            props.userLogIn(res.data.userInfo);

            //Send team info to redux store

            props.teamInfoUpdate(res.data.teamInfo);

            //Show the user that it was a success

            alert.style.color = '#00AA00';

            alert.innerHTML = 'Success';

            //After message is displayed, go back to the members page after 1/2 second

            setTimeout(() => {

                history.push('/members-admin');

            }, 500);

        });

    }

    const handleSubmitOauth = () => {

        console.log('oauth');

        // Message shown to user

        let alert = document.getElementById('change-email-alert');

        // Query the server with new info

        axios.post('https://star-trak.herokuapp.com/oauth-email-change', {

            username: props.userInfo.username,
            newUsername,

        })

        .then(res => {

            if (res.data.message) {

                alert.innerHTML = res.data.message;

                return;

            }

            //Send user info to redux store

            props.userLogIn(res.data.userInfo);

            //Send team info to redux store

            props.teamInfoUpdate(res.data.teamInfo);

            //Show the user that it was a success

            alert.style.color = '#00AA00';

            alert.innerHTML = 'Success';
            
            //After message is displayed, go back to the members page after 1/2 second

            setTimeout(() => {

                history.push('/members-admin');

            }, 500);

        })

    };

    const submitDirect = event => {

        //Prevent the page from reloading on submit

        event.preventDefault();

        //Alert message for the outcome

        let alert = document.getElementById('change-email-alert');

        //Set the alert's color to red, show a message

        alert.style.color = '#AA0000';

        alert.innerHTML = 'Loading...';

        //Check the format of the email, if not correct format it is invalid

        if (!checkEmail(newUsername)) {

            alert.innerHTML = 'Invalid Email';

            return;

        }

        if (!props.userInfo.githubUsername && !props.userInfo.googleId) {

            handleSubmit();

        } else {

            handleSubmitOauth();

        }

    };

    let changeEmailPasswordInput = null;

    if (!props.userInfo.githubUsername && !props.userInfo.googleId) {

        changeEmailPasswordInput = (

            <input 
                            
                type="password" 
                placeholder="Confirm Password"
                onChange={e => setPassword(e.target.value)}
                required
                
            />

        );

    }

    return (

        <div className="aligned">

            <MDBCard>

                <MDBCardBody 

                    style={{
                        
                        borderStyle: 'solid', 
                        borderColor: '#CCCCCC', 
                        borderWidth: '2px',
                        boxShadow: '1px 1px 5px #CCCCCC'
                        
                    }}
                    
                >

                    <MDBCardTitle>Change Email</MDBCardTitle>

                    <form className="change-auth-form" onSubmit={e => submitDirect(e)}>

                        {changeEmailPasswordInput}

                        <input 
                        
                            type="text" 
                            placeholder="New Email"
                            onChange={e => setNewUsername(e.target.value)}
                            spellCheck="false"
                            required
                            
                        />

                        <Button type="submit" variant="primary">Submit</Button>

                    </form>

                </MDBCardBody>

            </MDBCard>

            <br />

            <div 
                
                id="change-email-alert" 
                style={{ color: '#AA0000' }}
                className="alert"
                
            />

        </div>

    );

};

//Connecting the component to redux and then we export

const ChangeEmail = connect(mapCredentials, mapDispatch)(ChangeEmailComponent);

export { ChangeEmail };