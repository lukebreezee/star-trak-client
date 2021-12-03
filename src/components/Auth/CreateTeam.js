import { Link, useHistory } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { checkPassword, updateUser } from '../../helpers';
import { mapCredentials, mapDispatch } from '../../redux/mapToProps';
import { connect } from 'react-redux';
import { MDBCard, MDBCardBody, MDBCardTitle } from 'mdb-react-ui-kit';
import axios from 'axios';
import Button from 'react-bootstrap/Button';

const CreateTeamComponent = props => {

    // Use history for redirecting the user

    let history = useHistory();

    // If user already has a team, redirect

    useEffect(() => {

        if (props.userInfo.teamUsername) {

            history.push('/projects-admin-pm');

        }

    }, [props, history]);

    // Credentials that will be updated on input change

    const [teamName, setTeamName] = useState('');

    const [username, setUsername] = useState('');

    const [password, setPassword] = useState('');

    // Function called on form submit

    const handleSubmit = event => {

        // Prevent page refresh

        event.preventDefault();

        // Message for user if error occurs

        let alert = document.getElementById('create-team-status');


        // Testing inputs


        if (teamName.length > 20) {

            alert.innerHTML = 'Team name cannot be more than 20 characters';

            return;
            
        }

        if (username.length > 15) {

            alert.innerHTML = 'Team ID cannot be more than 15 characters';

            return;

        }

        // Regex to test team ID

        if (/\s/.test(username)) {

            alert.innerHTML = 'Team ID cannot contain a space';

            return;

        }

        // Helper function to check password strength

        alert.innerHTML = checkPassword(password);

        // If user has been given a message, something is wrong

        if (alert.innerHTML !== '') return;

        // Query the database to register team

        alert.innerHTML = 'Loading...';

        axios.post('https://star-trak.herokuapp.com/create-team', {

            teamName: teamName,
            username: username,
            password: password,
            members: [

                {
                    username: props.userInfo.username,
                    role: 'admin',
                    firstName: props.userInfo.firstName,
                    lastName: props.userInfo.lastName
                }

            ]

        })

        .then(res => {

            switch(res.data) {

                // Multiple use cases for different errors that may occur

                case 'Unknown':

                    alert.innerHTML = 'An unexpected error has occured';

                    break;

                case 'Duplicate':

                    alert.innerHTML = 'A team with this ID already exists';

                    break;

                // If no errors, load team info

                default:

                    alert.innerHTML = '';

                    // Updates team info object in redux

                    props.teamInfoUpdate(res.data);

                    //Update teamUsername for userInfo object in redux

                    props.teamLogIn(res.data.username);

                    //Queries backend, updates user's teamUsername in db

                    updateUser('teamUsername', res.data.username, props.userInfo.username);

                    //Redirects user to projects page

                    history.push('/projects-admin-pm');

            }

        })

        // If there is an error, it is unexpected

        .catch(() => {

            alert.innerHTML = 'An unexpected error has occured';

        });

    }

    return (

        <div className="main-page-parent">

            <form className="spaced-form" onSubmit={e => handleSubmit(e)}>

                <div id="create-team-status" className="alert" />

                <MDBCard>

                    <MDBCardBody
                    
                        style={{
                                
                            borderStyle: 'solid', 
                            borderColor: '#CCCCCC', 
                            borderWidth: '2px',
                            boxShadow: '1px 1px 5px #CCCCCC'
                            
                        }}
                    
                    >

                    <MDBCardTitle>Create Team</MDBCardTitle>

                    <div className="change-auth-form">

                    <input 

                        type="text" 
                        name="teamName" 
                        placeholder="Team Name" 
                        onChange={e => setTeamName(e.target.value)}
                        spellCheck="false"
                        required

                    />

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

                <Link to="/team-login" className="login-link" >Back to team login</Link>

            </form>

        </div>

    );

};

// Connect component to redux store and export

const CreateTeam = connect(mapCredentials, mapDispatch)(CreateTeamComponent);

export { CreateTeam };