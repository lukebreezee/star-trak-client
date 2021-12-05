// import { Route, useParams, useHistory } from 'react-router-dom';
// import { Octokit } from '@octokit/core';
import { connect } from 'react-redux';
import { mapCredentials, mapDispatch } from '../../redux/mapToProps';
// import axios from 'axios';
// import { useEffect } from 'react';

const GithubLogin = () => {

    // // Use params lets us use URL parameters

    // const { accessToken } = useParams();

    // // Use history allows us to redirect the user

    // let history = useHistory();

    // // useEffect(() => {

    //     //Fetches user info from back-end

    //     const fetchData = async () => {

    //         console.log('foo');

    //         let githubUsername;

    //         // Octokit makes it easier to query GitHub's API

    //         const octokit = new Octokit({ auth: accessToken });

    //         // Query GitHub for user login
        
    //         await octokit.request('GET /user')
        
    //         .then(res => {

    //             console.log(res);

    //             // If res.data.login is truthy, request was successful

    //             // If falsy, something went wrong, redirect to login
        
    //             if (!res.data.login) {

    //                 console.log('No login');
                    
    //                 history.push('/login');
        
    //                 return;
                
    //             }

    //             // res.data.login is their username on GitHub
        
    //             githubUsername = res.data.login;
        
    //         });

    //         // Fetch user info now that we have the GitHub username
        
    //         axios.post('https://star-trak.herokuapp.com/github-client-login', {
        
    //             githubUsername
        
    //         })
            
    //         .then(res => {

    //             console.log('Got to the server response');

    //             console.log(res);

    //             // If res.data.message is truthy, something went wrong
        
    //             if (res.data.message) {
        
    //                 history.push('/login');
        
    //             }

    //             // Else, query was successful, so we update user info
        
    //             props.userLogIn(res.data);

    //             // Redirect to projects page
        
    //             history.push('/projects-admin-pm');
        
    //         });

    //     };

    //     // Call the above function

    //     fetchData();

    // // }, []);

    // // This component does not return JSX, we just need it for the URL params

    return (
    
        <div className="aligned">Foo</div>
        
    );

};

// Connect the above component to redux

// const GithubLogin = connect(mapCredentials, mapDispatch)(GithubLoginComponent);

// Parent component handles the URL params and is the one that is exported

// const GithubLogin = () => {

//     return (

//         <Route path="/login/github/:accessToken">

//             <GithubLoginConnected />

//         </Route>

//     );

// };

export { GithubLogin };