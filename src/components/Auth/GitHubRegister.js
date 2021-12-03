import { useState } from 'react';
import { Route, useParams } from 'react-router-dom';
import { checkEmail } from '../../helpers';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { connect } from 'react-redux';
import { mapDispatch } from '../../redux/mapToProps';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { Octokit } from '@octokit/core';

const GithubRegisterComponent = props => {

    // User still needs to declare first/last name and username since the GitHub

    // scope chosen does not provide that info. Inputs set state on change.

    const [firstName, setFirstName] = useState('');

    const [lastName, setLastName] = useState('');

    const [username, setUsername] = useState('');

    // useParams hook gives us access to URL parameters

    const { accessToken } = useParams();

    // useHistory allows us to redirect the user

    let history = useHistory();

    // Function called on form submit

    const handleSubmit = async event => {

        // Prevent page refresh

        event.preventDefault();

        // Message showed to user on error

        let alert = document.getElementById('github-register-alert');

        // Checking email using a regex, if invalid then prompt user

        if (!checkEmail(username)) {

            alert.innerHTML = 'Email is invalid';

            return;

        }

        let githubUsername;

        // Octokit makes it easier to query GitHub's API

        const octokit = new Octokit({auth: accessToken});

        // Query GitHub for user login

        await octokit.request('GET /user')

        .then(res => {

            // If res.data.login is truthy, request was successful

            // If falsy, something went wrong

            if (!res.data.login) {

                alert.innerHTML = 'An unexpected error has occured';

                return;

            }

            // res.data.login is their username on GitHub

            githubUsername = res.data.login;

        });

        // Query backend to register user

        axios.post('https://star-trak.herokuapp.com/oauth-client-register', {

            credentials: {
                
                firstName,
                lastName,
                username,
                githubUsername
                
            }

        })

        .then(res => {

            // If res.data.message is truthy, something went wrong

            if (res.data.message) {

                alert.innerHTML = res.data.message;

                return;

            }

            // Else, update user info from response

            props.userLogIn(res.data);

            // Redirect user to team login page

            history.push('/team-login');

        });

    };


    return (

        <div className="main-page-parent">

            <div className="login-form">

                <div>Please enter the following</div>

                <div id="github-register-alert" className="alert" />

                <br />

                <form className="login-fields" onSubmit={e => handleSubmit(e)}>

                    <div className="spaced-form">

                        <input 
                        
                            type="text"
                            onChange={e => setFirstName(e.target.value)}
                            placeholder="First Name"
                            spellCheck="false"
                            required

                        />

                        <input 
                            
                            type="text"
                            onChange={e => setLastName(e.target.value)}
                            placeholder="Last Name"
                            spellCheck="false"
                            required

                        />

                        <input
                            
                            type="text"
                            onChange={e => setUsername(e.target.value)}
                            placeholder="Work Email"
                            spellCheck="false"
                            required

                        />

                    </div>

                    <br />

                    <Button type="submit" variant="primary">

                        Submit

                    </Button>

                </form>

            </div>

        </div>

    );

};

// Connect above component to redux

const GithubRegisterConnected = connect(null, mapDispatch)(GithubRegisterComponent);

// Parent component gives access to URL params and is exported

const GithubRegister = () => {

    return (

        <Route path="/register/github/:accessToken">

            <GithubRegisterConnected />

        </Route>

    );

};

export { GithubRegister };