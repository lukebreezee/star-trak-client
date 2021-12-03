import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { mapCredentials, mapDispatch } from '../../redux/mapToProps';
import Button from 'react-bootstrap/Button';
import { useState, useEffect } from 'react';

const MyProjectsComponent = props => {

    // useHistory simplifies component redirect

    let history = useHistory();

    // Filter through team's projects to find the ones that

    // the user is associated with

    const userProjects = props.teamInfo.projects.filter(obj => {

        // Make a copy of the assigned members list

        const members = [...obj.selectedMembers];

        // If user's username is in the list, the project 

        // will be pushed to userProjects

        if (members.indexOf(props.userInfo.username) !== -1) {

            return true;

        }

        // And the same goes if the user is the creator of the project

        if (obj.creator === props.userInfo.username) return true;

        // Else, return false and do not push

        return false;

    });

    // If user clicks on one of the projects, the name gets dispatched to redux

    // and the user is redirected.

    const handleClick = projectName => {

        props.currentProjectUpdate(projectName);

        history.push('/view-project')

    };

    // If the user is a PM or an admin, the create project button will appear

    // (Passed in as a prop)

    let CreateProjectButton;

    if (props.role !== 'dev') {

        CreateProjectButton = (

            <Button variant="primary" onClick={() => history.push('/create-project')}>
                
                Create New Project
                
            </Button>

        );

    } else {

        CreateProjectButton = null;

    }

    // Gets the creator's info and returns their first and last name

    const findCreatorName = creatorUsername => {

        const creatorInfo = 
        
            props.teamInfo.members.find(obj => obj.username === creatorUsername);

        return `${creatorInfo.firstName} ${creatorInfo.lastName}`;

    };

    // It was simpler to make tickets and projects relational as opposed to

    // storing a 'tickets' array inside of project objects, so this 

    // functions iterates through the ticket list and finds the ones that are

    // associated with the project at hand. This function returns the # of tickets

    // that a specific project has.

    const findTicketCount = projectName => {

        return props.teamInfo.tickets.reduce((acc, obj) => {

            if (obj.projectName === projectName) {

                acc++;

            }

            return acc;

        }, 0);

    };

    // Markup is different on mobile, this markup is for non-mobile

    const MyProjectsDefaultMarkup = (

        <div>
    
            <h3>My Projects</h3>
    
            <div className="project-list-headers">
    
                <div className="scrolling-list-div-left"><u>Name</u></div>
    
                <div><u># People</u></div>
    
                <div><u>Created By</u></div>
    
                <div><u>Priority</u></div>
    
                <div><u># Tickets</u></div>
    
                <div><u>Date</u></div>
    
            </div>
    
            <div className="scrolling-list-medium" id="my-projects-list">
            
                {

                    // Iterate through projects that the user is associated with

                    // and display certain information
    
                    userProjects.map((obj, index) => {           
    
                        return (
    
                            <div
    
                                key={index}
                                onClick={() => handleClick(obj.projectName)}
                                className="project-list-div"
                                
                            >
    
                                <div className="scrolling-list-div-left">{obj.projectName}</div>
    
                                <div>{obj.selectedMembers.length}</div>
    
                                <div>{findCreatorName(obj.creator)}</div>
    
                                <div>{obj.priority}</div>
    
                                <div>{findTicketCount(obj.projectName)}</div>
    
                                <div className="scrolling-list-div-right">{obj.date.slice(4, 15)}</div>
    
                            </div>
    
                        );
    
                    })
    
                }
    
            </div>
    
            <br />
    
            {
    
                CreateProjectButton // Conditionally rendered
    
            }
    
        </div>
    
    );

    // Markup for mobile device or any screen width less than 700px

    const MyProjectsPhoneMarkup = (

        <div>
    
            <h3>My Projects</h3>
    
            <div className="scrolling-list-medium" id="my-projects-list">
            
                {

                    // Iterate through project list, but this time only display the

                    // name to save screen space
    
                    userProjects.map((obj, index) => {           
    
                        return (
    
                            <div
    
                                key={index}
                                onClick={() => handleClick(obj.projectName)}
                                className="project-list-div"
                                
                            >
    
                                <div className="scrolling-list-div-left">{obj.projectName}</div>
    
                            </div>
    
                        );
    
                    })
    
                }
    
            </div>
    
            <br />
    
            {
    
                CreateProjectButton // Conditionally rendered
    
            }
    
        </div>

    );

    // State updates markup depending on screen size

    const [render, setRender] = useState(MyProjectsDefaultMarkup);

    // Replicates componentDidMount, shows mobile markup if screen width is < 700px

    useEffect(() => {

        if (window.innerWidth > 700) {
            
            setRender(MyProjectsDefaultMarkup);
        
        } else {
            
            setRender(MyProjectsPhoneMarkup);
        
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // If user resizes page to < 700px wide, display phone markup

    window.addEventListener('resize', () => {

        if (window.innerWidth > 700) {
            
            setRender(MyProjectsDefaultMarkup);

            return;
        
        }

        setRender(MyProjectsPhoneMarkup);

    });

    //  State field
    
    return render;

};

// Component gets connected to redux and exported

const MyProjects = connect(mapCredentials, mapDispatch)(MyProjectsComponent);

export { MyProjects };