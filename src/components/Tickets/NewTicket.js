import { connect } from "react-redux";
import { mapCredentials, mapDispatch } from "../../redux/mapToProps";
import { useHistory } from 'react-router-dom';
import { useState } from 'react';
import { sendNotification } from '../../helpers';
import axios from "axios";
import Button from 'react-bootstrap/Button';

// This component allows PMs and admins to create tickets

// for projects that they are associated with.

const NewTicketComponent = props => {

    // State fields are updated on input change

    const [ticketMembers, setTicketMembers] = useState([]);

    const [ticketName, setTicketName] = useState('');

    const [description, setDescription] = useState('');

    const [priority, setPriority] = useState('Priority');

    // useHistory simplifies client redirect

    let history = useHistory();

    // If no username in redux, user is not logged in

    if (!props.userInfo.username) {

        history.push('/login');

        return null;

    }

    // If no team username in redux, user does not have a team

    if (!props.userInfo.teamUsername) {

        history.push('/team-login');
        return null;

    }

    // Get user's team member info to see their role

    const memberObj = props.teamInfo.members.find(elem => 
        
        elem.username === props.userInfo.username
        
    );

    // If user is a dev, redirect back to projects page

    if (memberObj.role === 'dev') {

        history.push('/projects-dev');

    }

    // Get project info with project name provided by redux

    const projectInfo = props.teamInfo.projects.find(obj => 
        
        obj.projectName === props.currentProject
    
    );

    // Markup for project's assigned members

    const projectMembers = projectInfo.selectedMembers.map((username, index) => {

        // Get the user's member info for access to their first/last name

        // and role, then display that information in a scrolling list.

        const memberInfo = props.teamInfo.members.find(obj =>
            
            obj.username === username
            
        );

        return (

            <div 

                onClick={e => handleClick(e, username)}
                username={username}
                key={index}
                
            >

                {memberInfo.firstName} {memberInfo.lastName} ({memberInfo.role})

            </div>

        );

    });

    // Function called when user clicks on a member to assign

    // them to the ticket (or deselect them)

    const handleClick = (event, username) => {

        // Background color of the div indicates whether user

        // has been selected

        let color = event.target.style.backgroundColor;

        // If background is white, user has not been selected

        if (color === '') {

            // So we push their username to the ticketMembers field

            setTicketMembers([...ticketMembers, username]);

            // And their div's background turns grey

            event.target.style.backgroundColor = '#CCCCCC';

        } else {

            // If background is not white, user is already selected

            // and will now be deselected

            setTicketMembers(() => {

                // Create copy of ticket members list

                const tmp = [...ticketMembers];

                // Find user's index in list

                const userIndex = tmp.indexOf(username);

                // Get rid of the username at that index

                tmp.splice(userIndex, 1);

                // ticketMembers gets set to temporary copy

                return tmp;

            });

            // And finally we set the background back to white

            event.target.style.backgroundColor = '';

        }

    };

    // Function called when 'Create' button is clicked

    const handleSubmit = event => {

        // Prevent page refresh

        event.preventDefault();

        // Message displayed to user if there is a problem

        let alert = document.getElementById('new-ticket-alert');

        // If priority state field is set to its default value,

        // a priority was not selected

        if (priority === 'Priority') {

            alert.innerHTML = 'A priority must be set';
            return;

        }

        // Post the ticket info to the db

        axios.post('https://star-trak.herokuapp.com/new-ticket', {

            ticketInfo: {

                ticketName,
                ticketMembers,
                description,
                priority,
                date: Date().toString(),
                creator: props.userInfo.username,
                projectName: projectInfo.projectName,
                comments: [],
                status: 'Not Started'

            },
            teamUsername: props.teamInfo.username

        })

        .then(res => {

            // If there is message, something went wrong, so we show user

            if (res.data.message) {

                alert.innerHTML = res.data.message;

                return;

            }

            // Else, the post was successful, so we update redux with new team info

            props.teamInfoUpdate(res.data);

            // Then we dispatch the ticket name to redux to view it

            props.currentTicketUpdate(ticketName);

            // Send a notification to the assigned members

            sendNotification({

                type: 'NEW TICKET',
                projectName: projectInfo.projectName,
                memberList: ticketMembers

            });

            // And we redirect the user to the view ticket page

            history.push('/view-ticket');

        });

    };

    return (

        <div>

            <h3>New Ticket</h3>

            <br />

            <div className="main-page-parent">

                <form 
                
                    onSubmit={e => handleSubmit(e)}
                    className="main-page-parent"
                    
                >

                    <div>

                        <input 

                            type="text" 
                            placeholder="Ticket Name"
                            onChange={e => setTicketName(e.target.value)}
                            style={{width: '100%'}}
                            required 
                            
                        />

                        <br />

                        <br />

                        <div>Members You Want On The Ticket: </div>

                        <div className="scrolling-list-small">

                            {

                                // Only members of the project can be assigned
                            
                                projectMembers.map(elem => {

                                    return elem;

                                })
                            
                            }

                        </div>

                    </div>

                    <div>

                    <textarea 

                        wrap="soft"
                        placeholder="Description (Optional)" 
                        className="description"
                        onChange={e => setDescription(e.target.value)}
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

                    <Button 

                        variant="primary" 
                        type="submit" 
                        style={{width: '100%'}}
                        
                    >
                        Create
                        
                    </Button>

                    <div id="new-ticket-alert" className="alert" />

                    </div>

                </form>

            </div>

        </div>

    );

};

// Connect the component to redux and export it

const NewTicket = connect(mapCredentials, mapDispatch)(NewTicketComponent);

export { NewTicket };