/* eslint-disable jsx-a11y/anchor-is-valid */
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCredentials, mapDispatch } from '../redux/mapToProps';
import logo from '../images/star-trak-logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faBell } from '@fortawesome/free-solid-svg-icons';
import { FaBars } from 'react-icons/fa';
import { useState } from 'react';
import { useEffect } from 'react';
import { Dropdown } from 'react-bootstrap';

// The navbar has a different appearance when the screen width

// is less than 700px. The following is the markup for > 700px

const NavbarDefaultMarkup = (

    <nav>

        <ul>


            <li>

                <img className="nav-link" src={logo} alt="Star-Trak" id="logo" />

            </li>


            <Link to="/tickets-admin-pm" className="link-component">

                <li className="nav-link">Tickets</li>

            </Link>

            <Link to="/members-admin" className="link-component">

                <li className="nav-link">Members</li>

            </Link>

            <Link to="/projects-admin-pm" className="link-component">

                <li className="nav-link">Projects</li>

            </Link>

            <div />

            <Link to="/notifs" className="link-component">

                {/* <li className="nav-link">Notifications</li> */}

                <FontAwesomeIcon icon={faBell} className="nav-icon" />

            </Link>

            <Link to="/account" className="link-component">

                <FontAwesomeIcon icon={faCog} className="nav-icon" />

            </Link>

        </ul>

    </nav>

);

// The markup for < 700px (dropdown instead of tabs)

const NavbarPhoneMarkup = (

    <nav>

        <ul>

            <Dropdown>

                <Dropdown.Toggle variant="secondary" id="dropdown-basic">

                    <FaBars />

                </Dropdown.Toggle>

                <Dropdown.Menu>

                    <Dropdown.Item href="#">
                        
                        <Link to="/tickets-admin-pm" className="link-component">

                            Tickets

                        </Link>

                    </Dropdown.Item>

                    <Dropdown.Item href="#">
                        
                        <Link to="/members-admin" className="link-component">

                            Members

                        </Link>
                        
                    </Dropdown.Item>

                    <Dropdown.Item href="#">
                        
                        <Link to="/projects-admin-pm" className="link-component">

                            Projects

                        </Link>
                        
                    </Dropdown.Item>

                    <Dropdown.Item href="#">
                        
                        <Link to="/account" className="link-component">

                            Account

                        </Link>
                        
                    </Dropdown.Item>

                    <Dropdown.Item href="#">
                        
                        <Link to="/notifs" className="link-component">

                            Notifications

                        </Link>
                        
                    </Dropdown.Item>

                </Dropdown.Menu>

            </Dropdown>

            <li>

                <img className="nav-link" src={logo} alt="Star-Trak" id="logo" />

            </li>

            <div />

        </ul>

    </nav>

);

// Parent component

const NavbarComponent = props => {

    // State field is set based on screen width

    const [render, setRender] = useState(NavbarDefaultMarkup);

    // Replicates componentDidMount

    useEffect(() => {

        // If screen width is greater than 700, render the default

        // markup declared earlier. Else, render phone markup (also

        // declared earlier)

        if (window.innerWidth > 700) {
            
            setRender(NavbarDefaultMarkup);
        
        } else {
            
            setRender(NavbarPhoneMarkup);
        
        }

    }, []);

    // Listen for resize throughout the lifecycle of the component

    window.addEventListener('resize', () => {

        // If screen width is greater than 700, render
        
        // default markup. Else, render the phone markup.

        if (window.innerWidth > 700) {
            
            setRender(NavbarDefaultMarkup);

            return;
        
        }

        setRender(NavbarPhoneMarkup);

    });

    // Return the state field
        
    return render;

};

// Connect component to redux and export

const Navbar = connect(mapCredentials, mapDispatch)(NavbarComponent);

export { Navbar };