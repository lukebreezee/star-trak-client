import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCredentials, mapDispatch } from '../../redux/mapToProps';
import { useState, useEffect } from 'react';
import { MDBCard, MDBCardBody, MDBCardTitle } from 'mdb-react-ui-kit';
import axios from 'axios';
import Button from 'react-bootstrap/Button';

const TeamLoginComponent = props => {

    // useHistory allows client redirect

    let history = useHistory();

    // If user has team username, redirect to project page

    useEffect(() => {

        if (props.userInfo.teamUsername) {

            history.push('/projects-admin-pm');

        }

    }, [props, history]);

    // State is set on input change

    const [username, setUsername] = useState('');

    const [password, setPassword] = useState('');

    // Function called on form submit

    const handleSubmit = event => {

        // Prevent page refresh
    
        event.preventDefault();

        // Message displayed to user if problem occurs

        let alert = document.getElementById('team-login-status');

        alert.innerHTML = 'Loading...';

        // Query back-end to fetch team info

        axios.post('https://star-trak.herokuapp.com/team-login', {

            teamUsername: username,
            password: password,
            username: props.userInfo.username,
            firstName: props.userInfo.firstName,
            lastName: props.userInfo.lastName

        })
        
        .then(res => {

            // If no message, fetch was successful, so we update team info

            if (res.data.message === undefined) {

                // Send team info to redux store

                props.teamInfoUpdate(res.data);

                // Update user info in database to assign the team username

                axios.post('https://star-trak.herokuapp.com/update-user', {

                    key: 'teamUsername',
                    updateValue: username,
                    username: props.userInfo.username

                })
                
                .then(res => {

                    // If there is a message, there is an error

                    if (res.data.message) {

                        alert.innerHTML = res.data.message;

                    } else {

                        // Else, userInfo object gets a team username in redux

                        props.teamLogIn(res.data.teamUsername);

                        // Redirect to projects page

                        history.push('/projects-admin-pm');

                    }

                })
                
                .catch(() => {

                    alert.innerHTML = 'An unexpected error has occured';

                });

            } else {

                alert.innerHTML = res.data.message;

            }

        })
        
        .catch(() => {

            alert.innerHTML = 'An unexpected error has occured';

        });

    };

    return (

        <div>
            <div className="main-page-parent">

                <div className="login-form">

                    <form className="spaced-form" onSubmit={e => handleSubmit(e)}>

                        <div id="team-login-status" className="alert" />

                        <MDBCard>

                            <MDBCardBody

                                style={{
                                        
                                    borderStyle: 'solid', 
                                    borderColor: '#CCCCCC', 
                                    borderWidth: '2px',
                                    boxShadow: '1px 1px 5px #CCCCCC'
                                    
                                }}

                            >

                                <MDBCardTitle>Team Login</MDBCardTitle>

                                <div className="change-auth-form">

                                    <input 

                                        type="text" 
                                        name="username" 
                                        placeholder="Team ID"
                                        onChange={e => setUsername(e.target.value)}
                                        spellCheck="false"
                                        required 

                                    />

                                    <input 

                                        type="password" 
                                        name="password" 
                                        placeholder="Password"
                                        onChange={e => setPassword(e.target.value)}
                                        required 

                                    />

                                    <Button type="submit" variant="primary">Submit</Button>

                                </div>

                            </MDBCardBody>

                        </MDBCard>

                    </form>

                    <Link to="/create-team" className="login-link" >Create A Team</Link>

                    <Link to="/login" className="login-link" onClick={() => props.userLogOut()}>Log Out</Link>

                </div>

            </div>

        </div>

    );
}

// Connect our component to the store and export it

const TeamLogin = connect(mapCredentials, mapDispatch)(TeamLoginComponent);

export { TeamLogin };