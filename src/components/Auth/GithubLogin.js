import { Route, useLocation, useHistory } from 'react-router-dom';
import { Octokit } from '@octokit/core';
import { connect } from 'react-redux';
import { mapCredentials, mapDispatch } from '../../redux/mapToProps';
import axios from 'axios';
import { useEffect } from 'react';

const GithubLoginComponent = props => {

    // Use location lets us get the query string from the URL

    const { search } = useLocation();

    // Get the access token from the query string

    const urlParams = new URLSearchParams(search);

    const accessToken = urlParams.get('accessToken');

    // Use history allows us to redirect the user

    let history = useHistory();

    useEffect(() => {

        //Fetches user info from back-end

        const fetchData = async () => {

            let githubUsername;

            // Octokit makes it easier to query GitHub's API

            const octokit = new Octokit({ auth: accessToken });

            // Query GitHub for user login
        
            await octokit.request('GET /user')
        
            .then(res => {

                // If res.data.login is truthy, request was successful

                // If falsy, something went wrong, redirect to login
        
                if (!res.data.login) {

                    console.log('No login');
                    
                    history.push('/login');
        
                    return;
                
                }

                // res.data.login is their username on GitHub
        
                githubUsername = res.data.login;
        
            });

            // Fetch user info now that we have the GitHub username
        
            axios.post('https://star-trak.herokuapp.com/github-client-login', {
        
                githubUsername
        
            })
            
            .then(res => {

                // If res.data.message is truthy, something went wrong
        
                if (res.data.message) {
        
                    history.push('/login');
        
                }

                // Else, query was successful, so we update user info
        
                props.userLogIn(res.data);

                // Redirect to projects page
        
                history.push('/projects-admin-pm');
        
            });

        };

        // Call the above function

        fetchData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // This component does not return JSX, we just need it for the URL params

    return (
    
        <div className="main-page-parent">
            
            <div>Github Login</div>
            
        </div>
        
    );

};

// Connect the above component to redux

const GithubLogin = connect(mapCredentials, mapDispatch)(GithubLoginComponent);

// const GithubLogin = () => {

//     return (

//         <Route path=":accessToken">

//             <GithubLoginConnected />

//         </Route>

//     );

// };

export { GithubLogin };