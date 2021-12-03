import { connect } from 'react-redux';
import { mapCredentials } from '../../redux/mapToProps';
import { MyProjects } from './MyProjects';
import { useHistory } from 'react-router-dom';

const ProjectsDevComponent = props => {

    // useHistory simplifies user redirect

    let history = useHistory();

    // If username not in redux, user is not logged in

    if (!props.userInfo.username) {

        history.push('/login');

        return null;

    }

    // If team username is not in redux, user does not have a team

    if (!props.userInfo.teamUsername) {

        history.push('/team-login');

        return null;

    }
    
    return (

        <div className="main-page-parent">

            <MyProjects role="dev" />

        </div>

    );

};

// Connect component to redux and export it

const ProjectsDev = connect(mapCredentials)(ProjectsDevComponent);

export { ProjectsDev };