import { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { checkPassword, checkEmail } from '../../helpers.js';
import { connect } from 'react-redux';
import { mapDispatch, mapCredentials } from '../../redux/mapToProps';
import { MDBCard, MDBCardBody, MDBCardTitle } from 'mdb-react-ui-kit';
import axios from 'axios';
import Button from 'react-bootstrap/Button';

const CreateComponent = props => {

    //Use history allows us to redirect the user

    let history = useHistory();

    //If user is logged in, push to team login

    useEffect(() => {

        if (props.userInfo.username) {

            history.push('/team-login');

        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    //Info to be sent to the database

    const [accountInfo, setAccountInfo] = useState({

        firstName: '',
        lastName: '',
        username: '',
        password: ''

    });

    //Confirm password

    const [confirm, setConfirm] = useState('');

    //Called on form submit

    const handleSubmit = event => {

        //Prevent page refresh
    
        event.preventDefault();

        //Message shown if something goes wrong

        let alert = document.getElementById('registration-status');

        //Password and confirm need to match

        if (confirm !== accountInfo.password) {

            alert.innerHTML = 'Passwords must match.';

        } else {

            //Helper function, see ../../helpers.js

            alert.innerHTML = checkPassword(accountInfo.password);
            
        }

        //Another helper function, uses regex to check for valid email

        if (!checkEmail(accountInfo.username)) {

            alert.innerHTML = 'Email is invalid';

        }

        //If message is blank, no errors yet
        
        if (alert.innerHTML === '') {

            alert.innerHTML = 'Loading...';

            //Query the database to register user

            axios.post('https://star-trak.herokuapp.com/register', accountInfo)

            .then(res => {

                //Multiple different outcomes

                switch(res.data) {

                    case 'Unknown':

                        alert.innerHTML = 'An unexpected error has occured';

                        break;

                    case 'Duplicate':

                        alert.innerHTML = 'An account with this email address already exists';

                        break;

                    //If no errors, the database has sent back the user's info

                    default:

                        alert.innerHTML = '';

                        //Send user info to redux store

                        props.userLogIn(res.data);

                        //Redirect to projects page

                        history.push('/projects-admin-pm');

                }

            })
            
            .catch(() => {

                //If there was an error, it is unknown

                alert.innerHTML = 'An unexpected error has occured';

            });

        }

    }

    return (

        <div className="main-page-parent">

            <div className="login-form">

                <div id="registration-status" className="alert" />

                <br />

                <form className="login-fields" onSubmit={e => handleSubmit(e)} >

                    <MDBCard>

                        <MDBCardBody 

                            style={{
                                
                                borderStyle: 'solid', 
                                borderColor: '#CCCCCC', 
                                borderWidth: '2px',
                                boxShadow: '1px 1px 5px #CCCCCC'
                                
                            }}
                            
                        >

                            <MDBCardTitle>Create Account</MDBCardTitle>

                            <div className="change-auth-form">

                                <input 

                                    type="text" 
                                    name="firstName" 
                                    onChange={e => setAccountInfo({...accountInfo, firstName: e.target.value})} 
                                    placeholder="First Name" 
                                    spellCheck="false" 
                                    required

                                />

                                <input 

                                type="text" 
                                name="lastName" 
                                onChange={e => setAccountInfo({...accountInfo, lastName: e.target.value})} 
                                placeholder="Last Name" 
                                spellCheck="false" 
                                required

                                />

                                <input 

                                type="text" 
                                name="username" 
                                onChange={e => setAccountInfo({...accountInfo, username: e.target.value})} 
                                placeholder="Email" 
                                spellCheck="false" 
                                required

                                />

                                <input 

                                type="password" 
                                name="password" 
                                onChange={e => setAccountInfo({...accountInfo, password: e.target.value})} 
                                placeholder="Password"
                                required

                                />

                                <input 

                                type="password" 
                                name="confirm" 
                                onChange={e => setConfirm(e.target.value)} 
                                placeholder="Confirm Password"
                                required

                                />

                                <Button type="submit" variant="primary">Submit</Button>

                            </div>

                        </MDBCardBody>

                    </MDBCard>

                </form>

                <Link to="/login" className="login-link">Log In</Link>

            </div>

        </div>

    );

}

//Connect our component to redux and export

const Create = connect(mapCredentials, mapDispatch)(CreateComponent);

export { Create };