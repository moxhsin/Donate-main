import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import SignInWidget from './SignInWidget';

export default (
  class Login extends Component {
    constructor(props) {
      super(props);
      this.onSuccess = this.onSuccess.bind(this);
      this.onError = this.onError.bind(this);
      this.state = {
        authenticated: null
      };
      this.checkAuthentication();
    }

    async checkAuthentication() {
      const authenticated = await this.props.auth.isAuthenticated();
      if (authenticated !== this.state.authenticated) {
        this.setState({ authenticated });
      }
    }

    componentDidUpdate() {
      this.checkAuthentication();
    }

    onSuccess = res => {
      return this.props.auth.redirect({
        sessionToken: res.session.token
      });
    };

    onError = err => {
      console.log('error logging in', err);
    };

    render() {
      if (this.state.authenticated === null) return null;
      return this.state.authenticated ? (
        <Redirect to={{ pathname: '/portal' }} />
      ) : (
          <SignInWidget
            baseUrl={this.props.baseUrl}
            onSuccess={this.onSuccess}
            onError={this.onError}
          />
        );
    }
  }
);
