import { connect } from 'react-redux';
import { mapCredentials, mapDispatch } from '../../redux/mapToProps';
import { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { sendNotification } from '../../helpers';

// Page allows admins and PMs to create projects

const CreateProjectComponent = props => {

    // State fields update on input change and get sent to db

    const [projectName, setProjectName] = useState('');

    const [description, setDescription] = useState('');

    const [priority, setPriority] = useState('Priority');

    const [selectedMembers, setSelectedMembers] = useState([]);

    // useHistory simplifies client redirect

    let history = useHistory();

    // If no username in redux store, user is not logged in

    if (!props.userInfo.username) {

        history.push('/login');

        return null;

    }

    // If no team username in redux store, user does not hava a team

    if (!props.userInfo.teamUsername) {

        history.push('/team-login');

        return null;

    }

    // Get info for user's member object in their team info

    const memberObj = props.teamInfo.members.find(obj => 

        obj.username === props.userInfo.username

    );

    // If user is a dev, they are not allowed to create a project

    if (memberObj.role === 'dev') {

        history.push('/projects-dev');

        return null;

    }

    // Function called on form submit

    const handleSubmit = event => {

        // Prevent page refresh

        event.preventDefault();

        // Message shown to user if error occurs

        let alert = document.getElementById('create-project-alert');

        // If user did not select a priority the state field 
        
        // will still be set to its default.

        if (priority === 'Priority') {

            alert.innerHTML = 'A priority must be set';
            return;

        }

        // User needs to assign as least one other member

        if (selectedMembers.length === 0) {

            alert.innerHTML = 'At least one member must be selected';

            return;

        }

        // Post project to database

        axios.post('https://star-trak.herokuapp.com/create-project', {

            teamUsername: props.userInfo.teamUsername,
            projectInfo: {

                projectName,
                selectedMembers,
                description,
                priority,
                creator: props.userInfo.username,
                date: Date().toString()

            }

        })

        .then(res => {

            // If message, something went wrong

            if (res.data.message) {

                alert.innerHTML = res.data.message;

                return;

            }

            // If we get to this point the post was successful

            // So we update the team info in redux

            props.teamInfoUpdate(res.data);

            // And we dispatch the name of the current project so that

            // we can view it on /view-project

            props.currentProjectUpdate(projectName);

            // Notify assigned members

            sendNotification({ 
                
                type: 'NEW PROJECT',
                memberList: selectedMembers, 
                name: projectName,
                projectName
            
            });

            // Bring up the project

            history.push('/view-project');

        });

    };

    // Handle member select

    const handleClick = (event, username) => {

        // Get element's color, signifies whether user is selected

        let color = event.target.style.backgroundColor;

        // If background is white, user is not selected

        if (color === '') {

            // So we update local state using the spread operator

            setSelectedMembers([...selectedMembers, username]);

            // Update element's background to grey

            event.target.style.backgroundColor = '#CCCCCC';

        } else {

            // If element is already grey, it has been selected so we deselect it

            setSelectedMembers(() => {

                // Copy local state field

                const tmp = [...selectedMembers];

                // Find the index of the user being deselected

                const userIndex = tmp.indexOf(username);

                // Get rid of the username at that index

                tmp.splice(userIndex, 1);

                // selectedMembers becomes this temporary variable

                return tmp;

            });

            // And finally, the background color returns white

            event.target.style.backgroundColor = '';

        }

    };
        
    return (
        
        <div>

        <h3>New Project</h3>

        <br />

            <div className="main-page-parent">

                <form 

                    onSubmit={e => handleSubmit(e)}
                    className="main-page-parent"

                >

                    <div>

                        <input

                            type="text" 
                            placeholder="Project Name" 
                            onChange={e => setProjectName(e.target.value)}
                            style={{width: '100%'}}
                            required

                        />

                        <br />

                        <br />

                        <div>Members You Want On The Project:</div>

                        <div id="create-project-alert" className="alert" />

                        <div className="scrolling-list-small">

                            {

                                // Displays all team members for project selection

                                props.teamInfo.members.map((obj, index) => {

                                    if (obj.username === props.userInfo.username) {

                                        return null;
                                        
                                    }

                                    return (

                                        <div 

                                            onClick={e => handleClick(e, obj.username)}
                                            username={obj.username}
                                            key={index}

                                        >

                                            {obj.firstName} {obj.lastName} ({obj.role})

                                        </div>

                                    );

                                })

                            }

                        </div>

                    </div>

                    <div>

                        <textarea 

                            className="description"
                            onChange={e => setDescription(e.target.value)}
                            placeholder="Description (Optional)"
                            wrap="soft"
                            maxLength="150"

                        />

                        <br />

                        <br />

                        <select 
                        
                            onChange={e => setPriority(e.target.value)}
                            style={{width: '100%'}}
                            
                        >

                            <option>Priority</option>

                            <option>High</option>

                            <option>Medium</option>

                            <option>Low</option>

                        </select>

                        <br />

                        <br />

                        <br />

                        <Button type="submit" style={{width: '100%'}}>Create</Button>

                    </div>

                </form>

            </div>

        </div>

    );

};

// Connecting the component to redux and exporting it

const CreateProject = connect(mapCredentials, mapDispatch)(CreateProjectComponent);

export { CreateProject };