import { connect } from 'react-redux';
import { mapCredentials } from '../../redux/mapToProps';
import { MyTickets } from './MyTickets';
import { AllTickets } from './AllTickets';
import { useHistory } from 'react-router-dom';

const TicketsAdminPmComponent = props => {

    // useHistory simplifies client redirect

    let history = useHistory();

    // if no username in redux, user is not logged in

    if (!props.userInfo.username) {

        history.push('/login');

        return null;

    }

    // If no team username in redux, user does not have a team

    if (!props.userInfo.teamUsername) {

        history.push('/team-login');

        return null;

    }

    // Get user's members info

    const memberObj = props.teamInfo.members.find(elem => 
        
        elem.username === props.userInfo.username
        
    );

    // If user's role is dev, redirect to dev page

    if (memberObj.role === 'dev') {

        history.push('/tickets-dev');

    }
    
    return (

        <div className="secondary-page-parent">

            <MyTickets />
            
            <AllTickets />

        </div>

    );

};

// Connect component to redux and export

const TicketsAdminPm = connect(mapCredentials)(TicketsAdminPmComponent);

export { TicketsAdminPm };