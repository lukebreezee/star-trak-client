import { connect } from "react-redux";
import { mapCredentials, mapDispatch } from "../../redux/mapToProps";
import { MDBCard, MDBCardBody, MDBCardTitle } from 'mdb-react-ui-kit';
import Button from 'react-bootstrap/Button';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { checkPassword } from '../../helpers';
import axios from 'axios';

const ChangePasswordComponent = props => {

    //State gets updated on input change

    const [currentPassword, setCurrentPassword] = useState('');

    const [newPassword, setNewPassword] = useState('');

    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    // Use history hook to redirect the user when needed

    let history = useHistory();

    //Function called on form submit

    const handleSubmit = event => {

        //Prevent page from refreshing

        event.preventDefault();

        //Message displayed to user if something goes wrong

        let alert = document.getElementById('change-password-alert');

        alert.style.color = '#AA0000';

        if (newPassword !== confirmNewPassword) {

            alert.innerHTML = 'Bottom passwords must be the same';

            return;

        }

        //Helper function that ensures the password is secure. See helpers.js in src

        alert.innerHTML = checkPassword(newPassword);

        //If blank, password is OK

        if (alert.innerHTML !== '') return;

        alert.innerHTML = 'Loading...';

        //Query the database to update the password

        axios.post('https://star-trak.herokuapp.com/update-user/password', {

            username: props.userInfo.username,
            currentPassword,
            newPassword

        })
        
        .then(res => {

            //If res.data.message is truthy, it is an error message

            if (res.data.message) {

                alert.innerHTML = res.data.message;

                return;

            }

            //Send user info to redux store

            props.userLogIn(res.data);

            //Redirect to the members page

            history.push('/members-admin');

        });

    };

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

                    <MDBCardTitle>Change Password</MDBCardTitle>

                    <form className="change-auth-form" onSubmit={e => handleSubmit(e)}>

                        <input 
                            
                            type="password" 
                            placeholder="Current Password"
                            onChange={e => setCurrentPassword(e.target.value)}
                            required
                            
                        />

                        <input 
                        
                            type="password" 
                            placeholder="New Password"
                            onChange={e => setNewPassword(e.target.value)}
                            required
                            
                        />

                        <input 
                            
                            type="password" 
                            placeholder="Confirm New Password"
                            onChange={e => setConfirmNewPassword(e.target.value)}
                            required
                            
                        />

                        <Button type="submit" variant="primary">Submit</Button>

                    </form>

                </MDBCardBody>

            </MDBCard>

            <br />

            <div 
            
                id="change-password-alert" 
                style={{ color: '#AA0000' }}
                className="alert"
                
            />

        </div>

    );

};

//Connect our component to the redux store and export

const ChangePassword = connect(mapCredentials, mapDispatch)(ChangePasswordComponent);

export { ChangePassword };