
// Load all of our main components since they will be given different routes

import { Login } from './components/Auth/Login';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { Notifs } from './components/Notifs';
import { Account } from './components/Account';
import { Create } from './components/Auth/Create';
import { TeamLogin } from './components/Auth/TeamLogin';
import { CreateTeam } from './components/Auth/CreateTeam';
import { MembersAdmin } from './components/Members/MembersAdmin';
import { MembersPmDev } from './components/Members/MembersPmDev';
import { TicketsAdminPm } from './components/Tickets/TicketsAdminPm';
import { TicketsDev } from './components/Tickets/TicketsDev';
import { ProjectsAdminPm } from './components/Projects/ProjectsAdminPm';
import { ProjectsDev } from './components/Projects/ProjectsDev';
import { CreateProject } from './components/Projects/CreateProject';
import { ViewProject } from './components/Projects/ViewProject';
import { NewTicket } from './components/Tickets/NewTicket';
import { GithubRegister } from './components/Auth/GitHubRegister';
import { ViewTicket } from './components/Tickets/ViewTicket';
import { GithubLogin } from './components/Auth/GithubLogin';
import { ChangeEmail } from './components/Auth/ChangeEmail';
import { ChangePassword } from './components/Auth/ChangePassword';
import { DemoUserSelect } from './components/Auth/DemoUserSelect';

import { mapCredentials } from './redux/mapToProps.js';

import { getTeamInfo } from './helpers';

// This app uses react router to simplify routing and whatnot

import { Switch, Route, useLocation, useHistory } from 'react-router-dom';

import { connect } from 'react-redux';

import { useEffect } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';

import { GoogleRegister } from './components/Auth/GoogleRegister';

// This is our parent component as you may have guessed

const AppComponent = props => {

  // Necessary for conditional rendering based on path

  let location = useLocation();

  // useHistory simplifies client redirect

  let history = useHistory();

  // useEffect dependent on history and current path

  useEffect(() => {

    // If no redux username, user is not logged in

    // So we use a regex to test the path

    // if the user is on the register page, login page,

    // or GitHub login page, they do not need to redirect. Otherwise,

    // they do.
        
    if (
      
      !props.userInfo.username

      && /\/register|\/login\/github|\/demo-user-select/.test(location.pathname) === false

    ) {
  
      history.push('/login');

      // If no team username property, user is not yet on a team.

      // If user is not on the create-team page, one of the login

      // pages, or one of the register pages, redirect to team login.
  
    } else if (
      
        !props.userInfo.teamUsername

        && location.pathname !== '/create-team'

        && /\/register|\/login|\/demo-user-select/.test(location.pathname) === false

      ) {
  
          history.push('/team-login');
  
    }

    // Access properties of the parent component

    let parent = document.getElementById('app');

    // Page needs to render differently based on the path

    switch(location.pathname) {

      // Tickets page for admin/pm needs to be longer

      case '/tickets-admin-pm':

        parent.style.height = '150vh';

        break;

      // Notifs page needs to change height based on # of notifs

      case '/notifs':

        // First, we redirect user if not logged in or if not on a team yet.

        if (!props.userInfo.username || !props.userInfo.teamUsername) {

          history.push('/login');

          break;

        }

        // Get the number of notifications that exist in userInfo

        const notifCount = props.userInfo.notifications.length;

        // Page can render regularly if < 6 notifs

        if (notifCount < 6) {

          parent.style.height = '100vh';

          break;

        };

        // Else, we use this formula to calculate page height

        const pageHeight = ((notifCount - 5) * 12 + 100).toString();

        // And assign the parent height to the above var in vh (viewport height)

        parent.style.height = `${pageHeight}vh`;

        break;

      // The following paths need to render 150vh height if 
      // screen width < 700px

      case '/create-project':
      case '/view-ticket':
      case '/members-admin':

        if (window.innerWidth > 700) {
          
          parent.style.height = '100vh';

          break;
        
        }

        parent.style.height = '150vh';

        break;

      // The following paths need to render to 130vh height

      // if screen width < 700 px

      case '/view-project':
      case '/new-ticket':

        if (window.innerWidth > 700) {
          
          parent.style.height = '100vh';

          break;
        
        }

        parent.style.height = '130vh';

        break;

      // Default case switches height back to regular if

      // the user was just visiting a page with irregular height

      default:

        parent.style.height = '100vh';

    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history, location.pathname]);

// When user visits a new page, team info needs to be fetched

useEffect(() => {

    getTeamInfo();

}, [location.pathname]);


  return (

    <div id="app">

        <Navbar />

          <div id="parent-div">

            <Switch>

              <Route path="/" component={Dashboard} exact />

              <Route path="/register" component={Create} exact/>

              <Route path="/login" component={Login} exact />

              <Route path="/notifs" component={Notifs} />

              <Route path="/account" component={Account} />

              <Route path="/team-login" component={TeamLogin} />

              <Route path="/create-team" component={CreateTeam} />

              <Route path="/members-admin" component={MembersAdmin} />

              <Route path="/members-pm-dev" component={MembersPmDev} />

              <Route path="/tickets-admin-pm" component={TicketsAdminPm} />

              <Route path="/tickets-dev" component={TicketsDev} />

              <Route path="/projects-admin-pm" component={ProjectsAdminPm} />

              <Route path="/projects-dev" component={ProjectsDev} />

              <Route path="/create-project" component={CreateProject} />

              <Route path="/view-project" component={ViewProject} />

              <Route path="/new-ticket" component={NewTicket} />

              <Route path="/view-ticket" component={ViewTicket} />

              <Route path="/register/github" component={GithubRegister} />

              <Route path="/login/github" component={GithubLogin} />

              <Route path="/register/google" component={GoogleRegister} />

              <Route path="/change-email" component={ChangeEmail} />

              <Route path="/change-password" component={ChangePassword} />

              <Route path="/demo-user-select" component={DemoUserSelect} />

            </Switch>

          </div>

      </div>    

  );
  
}

// Export component and connect to store

const App = connect(mapCredentials)(AppComponent);

export default App;