import Button from 'react-bootstrap/Button';
import { useState } from 'react';
import { connect } from 'react-redux';
import { mapCredentials, mapDispatch } from '../../redux/mapToProps';
import { checkEmail } from '../../helpers';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

// Google OAuth API provides user's gmail, but work email may be different

const GoogleRegisterComponent = props => {

    // State set on input change

    const [username, setUsername] = useState('');

    // Use history allows user redirect

    let history = useHistory();

    // Function called on form submit

    const handleSubmit = event => {

        // Prevent page refresh

        event.preventDefault();

        // Message shown to user if error occurs

        const alert = document.getElementById('google-register-status');

        let credentials;

        // if user declared a different email...

        if (username) {

            // Check the email for validity with regex

            if (!checkEmail(username)) {

                alert.innerHTML = 'Email is invalid';

                return;

            }

            // If email is valid, above variable is set to...

            credentials = {

                ...props.googleInfo,
                username

            };

        } else {

            // If user did not provide email, we will use their gmail

            credentials = {...props.googleInfo};

        }

        // Query the database to register user

        axios.post('https://star-trak.herokuapp.com/oauth-client-register', {credentials})

        .then(res => {

            // If res.data.message is truthy, there was an error so we will alert user

            if (res.data.message) {
                
                alert.innerHTML = res.data.message;

                return;
            
            }

            // Else, registration was successful, so we update user info

            props.userLogIn(res.data);

            // And then we redirect to projects page

            history.push('/projects-admin-pm');

        });

    }

    return (

        <div className="main-page-parent">

            <div className="login-form">

                <div className="aligned">Please provide your...</div>

                <div id="google-register-status" className="alert" />

                <br />

                <form 
                    
                    className="login-fields"
                    onSubmit={e => handleSubmit(e)}
                    
                >

                    <input

                        type="text"
                        placeholder="Work Email (If Not Gmail)"
                        onChange={e => setUsername(e.target.value)}
                        spellCheck="false"

                    />

                    <Button variant="primary" type="submit">Submit</Button>

                </form>

            </div>

        </div>

    );

};

// Connect the component to redux and export it

const GoogleRegister = connect(mapCredentials, mapDispatch)(GoogleRegisterComponent);

export { GoogleRegister };