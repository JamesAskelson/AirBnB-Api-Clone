// frontend/src/components/Navigation/index.js
import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);




  return (
    <ul className="navi-icons">
      <li>
        <NavLink exact to="/">
          <img src='https://i.imgur.com/uAZQt4q.png'/>
        </NavLink>
      </li>
      {sessionUser && (<NavLink className='create-a-spot-link' exact to='/spots/new'>Create a new Spot</NavLink>)}
      {isLoaded && (
        <li>
          <ProfileButton user={sessionUser} />
        </li>
      )}
    </ul>

  );
}

export default Navigation;
