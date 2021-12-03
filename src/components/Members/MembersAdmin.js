import { connect } from 'react-redux';
import { mapCredentials } from '../../redux/mapToProps';
import { AssignRoles } from './AssignRoles';
import { MemberList } from './MemberList';
import { useHistory } from 'react-router-dom';

// Parent component for Assign Roles and Member List

const MembersAdminComponent = props => {

    // useHistory allows client redirect

    let history = useHistory();

    // If redux userInfo.username is null, user is not logged in

    if (!props.userInfo.username) {

        history.push('/login');

        return null;

    }

    // If redux userInfo.teamUsername is null, user does not have a team

    if (!props.userInfo.teamUsername) {

        history.push('/team-login');

        return null;

    }

    // Get user's member info

    const memberObj = props.teamInfo.members.find(elem => 
    
        elem.username === props.userInfo.username
        
    );

    // If user is not admin, they are not allowed to assign roles,

    // so they are pushed to the pm/dev page.

    if (memberObj.role !== 'admin') {

        history.push('/members-pm-dev');

    }
    
    return (


        <div className="main-page-parent" id="members-admin-parent">

            <AssignRoles />

            <MemberList />

        </div>

    );

};

// Export the component and connect it to redux

const MembersAdmin = connect(mapCredentials)(MembersAdminComponent);

export { MembersAdmin };