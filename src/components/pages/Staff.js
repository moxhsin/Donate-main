import React, { Component } from "react";

class Staff extends Component {
  state = {
    currentUserName: "",
    currentUserEmail: "",
  };

  componentDidMount() {
    const idToken = JSON.parse(localStorage.getItem(""));
    this.setState({
      currentUserEmail: idToken.idToken.claims.email,
      currentUserName: idToken.idToken.claims.name,
    });
  }

  render() {
    const { currentUserEmail, currentUserName } = this.state;

    return (
      <div>
        <h1>Welcome {currentUserName}</h1>
        <p>Email: {currentUserEmail}</p>
        <p>You have reached the member portal of Donation.com</p>
      </div>
    );
  }
}

export default Staff;
