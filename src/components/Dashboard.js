import { useHistory } from 'react-router-dom';

// This component acts as the homepage; it redirects to

// the projects page

const Dashboard = () => {

    // useHistory simplifies client redirect
    
    let history = useHistory();

    // Redirect user

    history.push('/projects-admin-pm');

    return null;

};

// Export the component for connection with the router

export { Dashboard };