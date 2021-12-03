import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { mapCredentials, mapDispatch } from '../../redux/mapToProps';

// Displays all tickets that the team has created

// Only available to admin and PM

const AllTicketsComponent = props => {

    // useHistory simplifies client redirect

    let history = useHistory();

    // Function called when user clicks on a ticket

    const handleClick = (projectName, ticketName) => {

        // Update current project in redux store

        props.currentProjectUpdate(projectName);

        // Update current ticket in redux store

        props.currentTicketUpdate(ticketName);

        // Redirect user

        history.push('/view-ticket');

    };
    
    return (

        <div>

            <h3>All Tickets</h3>

            <div className="ticket-list-headers">

                <div className="scrolling-list-div-left"><u>Name</u></div>

                <div><u>Project</u></div>

                <div><u>Priority</u></div>

                <div><u>Status</u></div>

                <div><u>Date</u></div>

            </div>

            <div className="scrolling-list-medium">
            
                {

                    // Displays info for all tickets on the team

                    props.teamInfo.tickets.map((obj, index) => {                        

                        return (

                            <div

                                key={index}
                                onClick={() => handleClick(obj.projectName, obj.ticketName)}
                                className="ticket-list-div"
                                
                            >

                                <div className="scrolling-list-div-left">{obj.ticketName}</div>

                                <div>{obj.projectName}</div>

                                <div>{obj.priority}</div>

                                <div>{obj.status}</div>

                                <div>{obj.date.slice(4, 15)}</div>

                            </div>

                        );

                    })

                }

            </div>

        </div>

    );

};

// Connect component to redux and export

const AllTickets = connect(mapCredentials, mapDispatch)(AllTicketsComponent);

export { AllTickets };