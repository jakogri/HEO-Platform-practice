import React from "react";
import { Nav, NavLink, NavMenu }
from "./NavbarElements";
const Navbar = () => {
return (
<>
<Nav>
<NavMenu>
<NavLink to="/registration" activeStyle>
Registration
</NavLink>
<NavLink to="/proposals_voting" activeStyle>
Proposals voting
</NavLink>
<NavLink to="/vote" activeStyle>
Vote
</NavLink>
<NavLink to="/vote_results" activeStyle>
Vote results
</NavLink>
</NavMenu>
</Nav>
</>
);
};
export default Navbar;
