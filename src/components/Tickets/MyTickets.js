import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { mapCredentials, mapDispatch } from '../../redux/mapToProps';

const MyTicketsComponent = props => {

    // useHistory simplifies client redirect

    let history = useHistory();

    // Function generates a list of all tickets the user is

    // associated with.

    const userTickets = props.teamInfo.tickets.filter(obj => {

        // Create copy of ticketMembers list

        const members = [...obj.ticketMembers];

        // If user is in the list, push ticket to userTickets

        if (members.indexOf(props.userInfo.username) !== -1) {

            return true;

        } else if (obj.creator === props.userInfo.username) {

            // If the user created the ticket, push ticket to userTickets

            return true;

        }

        // Else, do not push

        return false;

    });

    // Function called when user clicks on a ticket

    const handleClick = (projectName, ticketName) => {

        // Update redux store with the project name

        props.currentProjectUpdate(projectName);

        // Update redux store with the ticket name

        props.currentTicketUpdate(ticketName);

        // Redirect user

        history.push('/view-ticket');

    };
    
    return (

        <div>

            <h3>My Tickets</h3>

            <div className="ticket-list-headers">

                <div className="scrolling-list-div-left"><u>Name</u></div>

                <div><u>Project</u></div>

                <div><u>Priority</u></div>

                <div><u>Status</u></div>

                <div><u>Date</u></div>

            </div>

            <div className="scrolling-list-medium">
            
                {

                    // Displays info from the ticket list declared above

                    userTickets.map((obj, index) => {           

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

                                <div className="scrolling-list-div-right">
                                    
                                    {obj.date.slice(4, 15)}
                                    
                                </div>

                            </div>

                        );

                    })

                }

            </div>

        </div>

    );

};

// Connect component to redux store and export

const MyTickets = connect(mapCredentials, mapDispatch)(MyTicketsComponent);

export { MyTickets };