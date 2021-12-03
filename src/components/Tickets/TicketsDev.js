import { connect } from 'react-redux';
import { mapCredentials } from '../../redux/mapToProps';
import { MyTickets } from './MyTickets';
import { useHistory } from 'react-router-dom';

const TicketsDevComponent = props => {

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
    
    return (

        <div className="aligned">

            <MyTickets />

        </div>

    );

};

// Connect component to redux and export

const TicketsDev = connect(mapCredentials)(TicketsDevComponent);

export { TicketsDev };