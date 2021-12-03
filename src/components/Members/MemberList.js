import { connect } from 'react-redux';
import { mapCredentials } from '../../redux/mapToProps';

// This component is displayed on members page; shows members, roles, and emails.

const MemberListComponent = props => {

    return (

        <div id="member-list">

            <h3>Member List</h3>

            <div className="member-list-headers">

                <div className="scrolling-list-div-left"><u>Name</u></div>

                <div><u>Role</u></div>

                <div><u>Email</u></div>

            </div>

            <div className="scrolling-list">

                {

                    // Iterate through members and display certain info

                    props.teamInfo.members.map((obj, index) => {

                        return (

                            <div key={index} >
                                
                                <div className="scrolling-list-div-left">
                                    
                                    {obj.firstName} {obj.lastName}
                                    
                                </div>

                                <div>{obj.role} </div>

                                <div className="scrolling-list-div-right">
                                    
                                    <a 
                                    
                                        href={`mailto: ${obj.username}`}
                                        style={{color: '#0088FF'}}
                                        
                                    >
                                        
                                        {obj.username}
                                        
                                    </a>
                                    
                                </div>
                                
                            </div>

                        );

                    })

                }
                
            </div>

        </div>

    );

};

const MemberList = connect(mapCredentials)(MemberListComponent);

export { MemberList };