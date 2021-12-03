import axios from 'axios';
import Button from 'react-bootstrap/Button';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { mapDispatch } from '../../redux/mapToProps';

// This component allows the user to pick a demo role

const DemoUserSelectComponent = props => {

    // useHistory simplifies client redirect

    let history = useHistory();

    // Called when user clicks on one of the buttons

    const handleDemoLogin = e => {

        // Fetch demo data from the server

        axios.get('https://star-trak.herokuapp.com/demo', {

            headers: {

                role: e.target.innerHTML

            }

        })
        
        .then(res => {

            // If message, something went wrong

            if (res.message) return;

            // Log the user in with the demo data

            props.userLogIn(res.data);

            // Redirect to home page (projects)

            history.push('/');

        });

    };

    return (

        <div className="spaced-form">

            <h3>Continue as...</h3>

            <Button onClick={e => handleDemoLogin(e)}>Admin</Button>

            <Button 
            
                variant="warning" 
                onClick={e => handleDemoLogin(e)}
                
            >
                Project Manager
                
            </Button>

            <Button 
                
                variant="success" 
                onClick={e => handleDemoLogin(e)}
                
            >
                Dev
                
            </Button>

            <br />

            <p style={{maxWidth: 'fit-content'}}>

                <strong>Note:</strong> Demo data will be reverted back to default when you log out.
                
            </p>

        </div>

    )

}

// Connect component to redux and export

const DemoUserSelect = connect(null, mapDispatch)(DemoUserSelectComponent);

export { DemoUserSelect };