import { connect } from 'react-redux';
import { mapCredentials, mapDispatch } from '../redux/mapToProps';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

const NotifsComponent = props => {

    // useHistory simplifies client redirect

    let history = useHistory();

    // If no username in store, user is not logged in

    if (!props.userInfo.username) {
        
        history.push('/login');

        return null;
    
    }

    // If no team username in store, user does not have a team

    if (!props.userInfo.teamUsername) {
        
        history.push('/team-login');

        return null;
    
    }

    // Fetch user info from server to update notif list

    axios.get('https://star-trak.herokuapp.com/get-user-info', {

        headers: {

            username: props.userInfo.username

        }

    })
    
    .then(res => {

        // Error handling

        if (res.message) return;

        // If no error, load user data

        props.userLogIn(res.data);

    });
    
    return (

        <div className="notification-page-parent">

            <h3>Notifications</h3>

            {

                // List notifications in order from newest to oldest

                props.userInfo.notifications.slice(0).reverse().map((elem, index) => {

                    return (

                        <div key={index}>

                            <hr />
                    
                            <div className="notification-div">{elem}</div>

                        </div>
                        
                    )

                })

            }

        </div>

    );

};

// Connect component to redux and export

const Notifs = connect(mapCredentials, mapDispatch)(NotifsComponent);

export { Notifs };