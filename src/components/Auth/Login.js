import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCredentials, mapDispatch } from '../../redux/mapToProps';
import Button from 'react-bootstrap/Button';
import GoogleLogin from 'react-google-login';

const LoginComponent = props => {

    // useHistory allows us to redirect user

    let history = useHistory();

    // If userInfo.username in redux is not null, user is already logged in

    useEffect(() => {

        if (props.userInfo.username) {

            // Redirect user to log into their team

            history.push('/team-login');

        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // State is set on input change
    
    const [username, setUsername] = useState('');

    const [password, setPassword] = useState('');

    // Function called when google auth is successful

    const googleResponseSuccess = response => {

        // Query back-end with googleId from response to log in

        axios.post('https://star-trak.herokuapp.com/google-client-login', {

            googleId: response.profileObj.googleId

        })
        
        .then(res => {

            const message = res.data.message;

            // If falsy, an error has occured or user needs to register

            if (message) {

                // If message is different from user not found, something went wrong,

                // so we alert the user

                if (message !== 'User not found') {

                    document.getElementById('login-status')

                    .innerHTML = 'An unexpected error has occured';

                    return;
    
                }

                // If message is user not found, we register user

                const info = response.profileObj;

                // Update redux store with google login info

                props.googleInfoUpdate({

                    googleId: info.googleId,
                    firstName: info.givenName,
                    lastName: info.familyName,
                    username: info.email

                });

                // Redirect to google register page with info in store

                // (Simpler than URL params)

                history.push('/register/google');

            } else {

                // If no message, then login was successful and we update user info

                props.userLogIn(res.data);

                // If user has no team, redirect to team login

                if (!props.userInfo.teamUsername) history.push('/team-login');

            }

        });

    };

    // If google response was a failure, there was an error

    const googleResponseFailure = () => {

        document.getElementById('login-status')
        .innerHTML = 'An unexpected error has occured';

    };

    // Function called on form submit for traditional login

    const handleSubmit = event => {

        // Prevent page refresh

        event.preventDefault();

        // Message shown to user if there is a problem

        let alert = document.getElementById('login-status');

        alert.innerHTML = 'Loading...';

        // Query the database to authenticate user

        axios.post('https://star-trak.herokuapp.com/login', {

            username,
            password

        })

        .then(res => {

            // res.data.message has multiple possibilities

            switch(res.data.message) {

                case 'Incorrect':

                    alert.innerHTML = 'Email or password is incorrect';

                    break;

                case 'Unknown':

                    alert.innerHTML = 'An unexpected error has occured';

                    break;

                default:

                    // If no message, query was successful

                    // So we log the user in

                    alert.innerHTML = '';

                    // Dispatch to redux store

                    props.userLogIn(res.data);

                    // Redirect to homepage (projects)

                    history.push('/');

            }

        })

        .catch(() => {

            alert.innerHTML = 'An unexpected error has occured';

        });

    };

    return (

        <div className="main-page-parent">

            <div className="login-form">

                <div className="aligned">Welcome, Please Log In</div>

                <div id="login-status" className="aligned alert" />

                <br />

                <form className="login-fields" onSubmit={e => handleSubmit(e)} >

                    <div 

                        className="lbtn lbtn-github" 
                        id="github-button"
                        onClick={() => window.location.replace(
                            
                            'https://github.com/login/oauth/authorize?client_id=a02180673c2e4b33c2f6'

                            // ^ Redirect to GitHub's login page
                            
                        )}

                    >

                        <i className="logo"></i>

                        <p className="label">

                            Continue With GitHub

                        </p>

                    </div>

                    <GoogleLogin 
                    
                        clientId="301612113265-5drj9s0i1l2u7tufef65d6e80a6j8pbh.apps.googleusercontent.com"
                        buttonText="Continue With Google"
                        id="google-button"
                        onSuccess={res => googleResponseSuccess(res)}
                        onFailure={() => googleResponseFailure()}
                        cookiePolicy={'single_host_origin'}

                    />

                    <input 

                        type="text" 
                        name="username" 
                        onChange={e => setUsername(e.target.value)} 
                        placeholder="Email" 
                        spellCheck="false"

                    />

                    <input 

                        type="password" 
                        name="password" 
                        onChange={e => setPassword(e.target.value)} 
                        placeholder="Password" 
                        
                    />

                    <Button variant="primary" type="submit">

                        Submit

                    </Button>

                </form>

                <br />

                <Link to="/register">Create Account</Link>

                <Link to="/demo-user-select">Continue as Demo User</Link>

            </div>

        </div>

    );

}

// Connect component to redux and export it

const Login = connect(mapCredentials, mapDispatch)(LoginComponent);

export { Login };