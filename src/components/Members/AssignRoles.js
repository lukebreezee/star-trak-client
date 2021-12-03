import { connect } from 'react-redux';
import { mapCredentials } from '../../redux/mapToProps';
import { useState } from 'react';
import { getTeamInfo } from '../../helpers';
import Button from 'react-bootstrap/Button';
import axios from 'axios';

const AssignRolesComponent = props => {

    // State set when a user's div is clicked

    const [selectedMemberUsername, setSelectedMemberUsername] = useState('');

    // Handles click on user's div

    const handleClick = (e, username) => {

        let color = e.target.style.backgroundColor;

        // If div is white...

        if (color === '') {

            // Get div with same username property

            let current = document.querySelector(`div[username='${selectedMemberUsername}']`);

            // If there is already a selected member, that user's div turns back to white

            if (current) current.style.backgroundColor = '';

            // New selected user's div turns light-ish grey

            e.target.style.backgroundColor = '#CCCCCC';

            // Set state

            setSelectedMemberUsername(username);

        } else {

            // If color is not white, div is already selected, so we deselect it

            e.target.style.backgroundColor = '';

            setSelectedMemberUsername('');

        }

    };

    // Called when 'Assign' button is clicked

    const handleAssign = () => {

        // Message shown to user for outcome

        let alert = document.getElementById('assign-submit-status');

        // Role is the value of the select tag below

        let role = document.getElementById('assign-role-select');

        // User must be selected before you update team

        if (selectedMemberUsername === '') {

            alert.innerHTML = 'A user must be selected';

            return;

        }

        // Role must be selected in dropdown

        if (role.value === 'Role') {

            alert.innerHTML = 'A role must be selected';

            return;

        }

        // The following prevents the user from demoting themself if no other

        // admin exists on the team.

        if (selectedMemberUsername === props.userInfo.username

            && role.value !== 'admin') {

            // Iterate through team members with reduce function,

            // if there exists another admin then accumulator turns true.

            const isExtraAdmin = props.teamInfo.members.reduce((acc, obj) => {

                if (obj.role === 'admin' 
                    && obj.username !== selectedMemberUsername) {

                        return true;

                } else {

                    return acc;

                }

            }, false);

            // Alert user if false

            if (!isExtraAdmin) {

                alert.innerHTML = 'Another admin must exist to change your role';

                return;

            }

        }

        // Post to database to assign role to member

        axios.post('https://star-trak.herokuapp.com/assign-role', {

            teamUsername: props.userInfo.teamUsername,
            username: selectedMemberUsername,
            role: role.value,

        })
        
        .then(res => {

            // Response should always send a message

            alert.innerHTML = res.data.message;

            if (res.data.message === 'Success') {

                // If success then fetch team info from database and update

                getTeamInfo();

            }

        });

    };
    
    return (

        <div id="assign-roles">

            <h3>Assign Roles</h3>

            <br />

            <div className="scrolling-list-small" id="assign-roles-list">
                
                {

                    props.teamInfo.members.map((obj, index) => {

                        return <div

                                    onClick={e => handleClick(e, obj.username)}
                                    key={index}
                                    className="assign-roles-button"
                                    username={obj.username}

                                >

                                    {obj.firstName} {obj.lastName} ({obj.role})

                                </div>

                    })
                
                }

            </div>

            <br />

            <div id="assign-submit-status" className="alert" />

            <select id="assign-role-select">

                <option>Role</option>

                <option>admin</option>

                <option>project manager</option>

                <option>dev</option>

            </select>

            <br />

            <br />

            <Button 

                variant="primary" 
                onClick={() => handleAssign()}
                color="#0088FF"
            
            >
                
                Assign
            
            </Button>

            <br />

        </div>

    );

};

// Connect component to redux and export

const AssignRoles = connect(mapCredentials)(AssignRolesComponent);

export { AssignRoles };