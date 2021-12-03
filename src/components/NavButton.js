import React from 'react';

// A simple button for the navigation bar

const NavButton = props => {

    return (

        <div id="nav-button">{props.label}</div>

    );

};

// And then export

export { NavButton };