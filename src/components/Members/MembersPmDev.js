import { connect } from 'react-redux';
import { mapCredentials } from '../../redux/mapToProps';
import { MemberList } from './MemberList';
import { useHistory } from 'react-router-dom';

// Parent component for member list on the pm/dev side

const MembersPmDevComponent = props => {

    // useHistory simplified client redirect

    let history = useHistory();

    // If no username in redux store, user is not logged in

    if (!props.userInfo.username) {

        history.push('/login');

        return null;

    }

    // If no team username in redux store, user does not have a team

    if (!props.userInfo.teamUsername) {

        history.push('/team-login');

        return null;

    }
    
    return (

        <div className="main-page-parent">
            
            <MemberList />

        </div>

    );

};

// Connect component to redux and export it

const MembersPmDev = connect(mapCredentials)(MembersPmDevComponent);

export { MembersPmDev };