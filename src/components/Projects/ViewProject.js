import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { mapCredentials, mapDispatch } from '../../redux/mapToProps';
import { MDBCard, MDBCardBody, MDBCardTitle, MDBCardText } from 'mdb-react-ui-kit';
import Button from 'react-bootstrap/Button';

const ViewProjectComponent = props => {

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

    // The name of the current project needs to be in redux store

    // This keeps us from needing to use URL parameters

    // So if the current project is null, push back to main projects page

    if (!props.currentProject) {

        history.push('/projects-admin-pm');

        return null;

    }

    // Get project info from teamInfo in redux

    const projectInfo = props.teamInfo.projects.find(obj => 
        
        obj.projectName === props.currentProject
        
    );

    // Get creator info to display

    const creatorInfo = props.teamInfo.members.find(obj => 
                        
        obj.username === projectInfo.creator
        
    );

    // newTicket button is conditionally rendered

    let newTicket;

    // Get user's member info

    const memberObj = props.teamInfo.members.find(obj => 
        
        obj.username === props.userInfo.username
        
    );

    // If the user is a PM or admin, render newTicket button

    if (memberObj.role !== 'dev') {

        newTicket = (

            <div>

                <Button 
                
                    onClick={() => history.push('/new-ticket')} 
                    variant="primary"
                    style={{width: '100%'}}
                    
                >
                    
                    New Ticket
                    
                </Button>

            </div>

        );

    } else {

        newTicket = null;

    }

    // If user clicks on a ticket, dispatch to redux the name of the ticket

    // so that it can be shown, then redirect user.

    const handleClick = ticketName => {

        props.currentTicketUpdate(ticketName);

        history.push('/view-ticket');

    }

    return (

        <div>

            <h3>{projectInfo.projectName}</h3>

            <br />

            <div className="main-page-parent">

                <div>

                    <MDBCard >

                        <MDBCardBody 
                        
                            style={{
                                
                                borderStyle: 'solid', 
                                borderColor: '#CCCCCC', 
                                borderWidth: '2px',
                                boxShadow: '1px 1px 5px #CCCCCC'
                                
                            }}>

                            <MDBCardTitle>Details</MDBCardTitle>

                            <MDBCardText>
                                
                                <ul className="card-ul">

                                    <li>Date Created: {projectInfo.date.slice(4, 15)}</li>

                                    <li>Creator: {creatorInfo.firstName} {creatorInfo.lastName}</li>

                                    <li>Priority: {projectInfo.priority}</li>

                                </ul>
                                
                            </MDBCardText>

                        </MDBCardBody>

                    </MDBCard>

                    <br />

                    <h6>Teammates On Project:</h6>

                    <div className="scrolling-list-xs">

                        {

                            // Iterate through assigned members, display their name/role

                            projectInfo.selectedMembers.map((username, index) => {

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

                    <div>

                        <h6>Tickets For This Project:</h6>

                        <div className="scrolling-list-small" style={{height: '120px'}}>

                            {

                                // Iterate through tickets; if ticket's projectName 

                                // property is equal to the current project's name,

                                // it will be displayed in the list.

                                props.teamInfo.tickets.map((obj, index) => {

                                    if (obj.projectName === projectInfo.projectName) {

                                        return (
                                        
                                            <div 

                                                key={index}
                                                onClick={() => handleClick(obj.ticketName)}
                                                
                                            >
                                                {obj.ticketName}
                                                
                                            </div>
                                            
                                        );

                                    } else {

                                        return null;

                                    }

                                })

                            }

                        </div>

                        <br />

                        {

                            newTicket // Conditionally rendered

                        }

                        <br />

                        <h6>Description:</h6>

                        <div 
                            
                            style={{maxWidth: '300px', wordWrap: 'break-word'}}
                            
                        >
                            {projectInfo.description}
                            
                        </div>

                    </div>
                
            </div>

        </div>

    );

};

// Connect the component to redux and export it

const ViewProject = connect(mapCredentials, mapDispatch)(ViewProjectComponent);

export { ViewProject };