import { useState } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { mapCredentials, mapDispatch } from "../../redux/mapToProps";
import { sendNotification } from '../../helpers';
import { MDBCard, MDBCardBody, MDBCardTitle } from 'mdb-react-ui-kit';
import axios from 'axios';
import Button from 'react-bootstrap/Button';


const ViewTicketComponent = props => {

    // State fields to be updated on input change

    const [comment, setComment] = useState('');

    const [newTicketStatus, setNewTicketStatus] = useState('Status');

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

    // When user clicks on ticket, the name of the ticket is

    // dispatched to redux to avoid needing URL parameters.

    // So if there is no ticket name in the store, something is wrong.

    if (!props.currentTicket) {

        history.push('/view-project');

    }

    // Same goes for the project that the ticket is associated with

    if (!props.currentProject) {

        history.push('/projects-admin-pm');

    }

    // Get ticket info from store

    const ticketInfo = props.teamInfo.tickets.find(obj =>
        
        obj.ticketName === props.currentTicket
        
        && obj.projectName === props.currentProject
    
    );

    // Get info from store on the ticket's creator

    const creatorInfo = props.teamInfo.members.find(obj => 
                        
        obj.username === ticketInfo.creator
        
    );

    // Function called, as you may have guessed, when the user

    // wants to submit a comment.

    const submitComment = event => {

        // Prevent page refresh

        event.preventDefault();

        // Message displayed if error occurs

        let alert = document.getElementById('comment-alert');

        // Comment needs to have a body

        if (comment === '') {

            alert.innerHTML = 'Comment cannot be empty';

            return;

        }

        // Set message back to blank in case there was an error 
        // on a previous attempt

        alert.innerHTML = '';

        // Post comment to database

        axios.post('https://star-trak.herokuapp.com/ticket-comment', {

            comment: {

                body: comment,
                author: `${props.userInfo.firstName} ${props.userInfo.lastName}`

            },
            teamUsername: props.teamInfo.username,
            projectName: ticketInfo.projectName,
            ticketName: ticketInfo.ticketName

        })

        .then(res => {

            // If message, something went wrong, so we display to user

            if (res.data.message) {

                alert.innerHTML = res.data.message;

                return;

            }

            // Else, post was a success and new team info was sent,

            // so we dispatch to redux store

            props.teamInfoUpdate(res.data);

            // Get list of members assigned on ticket to send notification

            // about comment.

            let memberList = [...ticketInfo.ticketMembers, ticketInfo.creator];

            // Filter out user's username, they do not need to be pushed a notif

            memberList = memberList.filter(username => 

                username !== props.userInfo.username

            );

            // Send a notification to all assigned members except for author of comment

            sendNotification({
                
                type: 'NEW COMMENT',
                author: `${props.userInfo.firstName} ${props.userInfo.lastName}`,
                ticketName: ticketInfo.ticketName,
                comment,
                memberList
            
            });

            // Message goes back to blank if there was an error before

            alert.innerHTML = '';

        });

    };

    // Any assigned member can change the ticket status

    const changeTicketStatus = () => {

        // Message shown if error occurs

        let alert = document.getElementById('ticket-status-alert');

        // Check for default value

        if (newTicketStatus === 'Status') {

            alert.innerHTML = 'Please select a new status';

            return;

        }

        // Priority cannot be the same as before

        if (newTicketStatus === ticketInfo.status) {

            alert.innerHTML = 'This is already the current status';

            return;

        }

        // Post the new status to the db

        axios.post('https://star-trak.herokuapp.com/change-ticket-status', {

            teamUsername: props.userInfo.teamUsername,
            ticketName: ticketInfo.ticketName,
            projectName: ticketInfo.projectName,
            newStatus: newTicketStatus

        })
        
        .then(res => {

            // If message, something went wrong, so we display to user

            if (res.data.message) {

                alert.innerHTML = res.data.message;

                return;

            }

            // Else, post was successful, so we update team info with response

            props.teamInfoUpdate(res.data);

            // Get the list of members from the team

            let memberList = [...ticketInfo.ticketMembers, ticketInfo.creator];

            // Filter the list to exclude the person who changed the status

            memberList = memberList.filter(username => 

                username !== props.userInfo.username

            );

            // Send notification to the users on memberList

            sendNotification({

                type: 'TICKET STATUS CHANGE',
                memberList,
                ticketName: ticketInfo.ticketName,
                status: newTicketStatus

            });

            // Message goes back to blank if there was an error before

            alert.innerHTML = '';

        });

    }

    return (

        <div>

            <div className="main-page-parent" id="view-ticket-parent">

                <div>

                    <h3>{ticketInfo.ticketName}</h3>

                    <br />

                    <MDBCard >

                        <MDBCardBody 

                            style={{
                                
                                borderStyle: 'solid', 
                                borderColor: '#CCCCCC', 
                                borderWidth: '2px',
                                boxShadow: '1px 1px 5px #CCCCCC'
                                
                            }}
                            
                        >

                            <MDBCardTitle>Details</MDBCardTitle>

                                
                                <ul className="card-ul">

                                    <li>Project: {ticketInfo.projectName}</li>

                                    <li>Creator: {creatorInfo.firstName} {creatorInfo.lastName}</li>

                                    <li>Priority: {ticketInfo.priority}</li>

                                    <li>Date Created: {ticketInfo.date.slice(4, 15)}</li>

                                    <li>Status: {ticketInfo.status}</li>

                                </ul>
                                

                        </MDBCardBody>

                    </MDBCard>

                    <br />

                    <select onChange={e => setNewTicketStatus(e.target.value)}>

                        <option>Status</option>

                        <option>Not Started</option>

                        <option>In Progress</option>

                        <option>Finished</option>

                    </select>

                    <Button 
                    
                        variant="outline-primary" 
                        onClick={() => changeTicketStatus()}
                        style={{marginLeft: '10px', padding: '1px 3px 1px 3px'}}
                        
                    >
                        
                        Change
                        
                    </Button>

                    <div id="ticket-status-alert" className="alert" />

                    <h5>Description:</h5>

                    <div 
                    
                        style={{maxWidth: '300px', wordWrap: 'break-word'}}
                        
                    >
                        {ticketInfo.description}
                        
                    </div>

                </div>
                
                <div>

                    <div className="spaced-form">

                        <h5>Comments:</h5>

                        <div className="scrolling-list-xs">

                            {

                                // Iterate through comments on ticket and display body

                                ticketInfo.comments.map((comment, index) => {

                                    return <div key={index}>{comment.author}: "{comment.body}"</div>

                                })

                            }

                        </div>

                        <form className="spaced-form" onSubmit={e => submitComment(e)}>

                            <input 

                                type="text" 
                                placeholder="New Comment" 
                                onChange={e => setComment(e.target.value)}
                                
                            />

                            

                            <Button variant="primary" type="submit">Submit</Button>

                        </form>

                        <div id="comment-alert" className="alert" />

                    </div>

                    <br />

                    <div>

                    <h5>Teammates On Ticket:</h5>

                    <div className="scrolling-list-xs">

                        {

                            // Iterate through ticket members (list of usernames),

                            // find username in team's member list and display info

                            ticketInfo.ticketMembers.map((username, index) => {

                                const teamMembers = [...props.teamInfo.members];

                                const currentMember = teamMembers.find(obj => 
                                    
                                    obj.username === username
                                    
                                );

                                return (

                                    <div key={index}>
                                        
                                        {currentMember.firstName} {currentMember.lastName} ({currentMember.role})
                                        
                                    </div>

                                );

                            })

                        }

                    </div>

                </div>

                </div>

            </div>

        </div>

    );

};

// Connect component to redux and export

const ViewTicket = connect(mapCredentials, mapDispatch)(ViewTicketComponent);

export { ViewTicket };