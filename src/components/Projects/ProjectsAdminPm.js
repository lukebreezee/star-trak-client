import { connect } from 'react-redux';
import { mapCredentials, mapDispatch } from '../../redux/mapToProps';
import { MyProjects } from './MyProjects';
import { useHistory } from 'react-router-dom';
import { getTeamInfo } from '../../helpers';
import { useEffect, useState } from 'react';

const ProjectsAdminPmComponent = props => {

    // useHistory simplifies client redirect

    let history = useHistory();

    // Return statement needs to wait until team info is loaded

    // to render.

    const [returnStatement, setReturnStatement] = useState(null);

    let componentBody = (

        <div className="main-page-parent">

            <MyProjects role="admin-pm" />

        </div>

    );

    useEffect(() => {

        // If userInfo.username is null, user is not logged in

        if (!props.userInfo.username) {
    
            return history.push('/login');
    
        }

        // if userInfo.teamUsername is null, user has no team

        if (!props.userInfo.teamUsername) {

            return history.push('/team-login');
    
        }

        // If teamInfo has been fetched, set the state field to render the JSX

        if (props.teamInfo.username) {
            
            setReturnStatement(componentBody);

            return;
        
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    getTeamInfo()

    .then(res => {

        // Update redux store with team info

        props.teamInfoUpdate(res);

        // Get user's member info

        const memberObj = res.members.find(elem => 
        
            elem.username === props.userInfo.username
            
        );;

        // If the user's role is dev, they need to be redirected to the dev

        // version of this page
    
        if (memberObj.role === 'dev') {
    
            history.push('/projects-dev');

            return;
    
        }

        // And finally we set out return statement to render the markup

        setReturnStatement(componentBody);

    })

    .catch(() => {

        return;

    });
        
    return returnStatement; // State field

};

// Connect component to redux and export

const ProjectsAdminPm = connect(mapCredentials, mapDispatch)(ProjectsAdminPmComponent);

export { ProjectsAdminPm };