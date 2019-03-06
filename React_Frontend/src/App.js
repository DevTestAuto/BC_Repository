import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Dashboard from './pages/DashBoard';
import Login from './pages/Login';
import AddEmployee from './pages/AddEmployee';
import EmpInfo from './pages/EmpInfo';
import EditEmployee from './pages/EditEmployee';
import BcDataInfo from './pages/BcDataInfo';
import ViewProfile from './pages/ViewEmployee';
import UENBcDataInfo from './pages/UENBcDataInfo';
import BCUidDataInfo from './pages/BCUidDataInfo';
import AddCompany from './pages/AddCompany';
import CompaniesInfo from './pages/CompaniesInfo';
import EditCompany from './pages/EditCompany';

class App extends Component {
    render() {
      return (
      <Router>
          <div>
            <Switch>
                <Route exact path='/' component={Dashboard} />
                <Route path='/Login' component={Login} />
                <Route path='/EmpInfo' component={EmpInfo} />
                <Route path='/AddEmployee' component={AddEmployee} />
                <Route path='/EditEmployee' component={EditEmployee} />
                <Route path='/BcDataInfo' component={BcDataInfo} />
                <Route path='/ViewProfile' component={ViewProfile} />
                <Route path='/UENBcDataInfo' component={UENBcDataInfo} />
                <Route path='/BCUidDataInfo' component={BCUidDataInfo} />
                <Route path='/AddCompany' component={AddCompany} />
                <Route path='/CompaniesInfo' component={CompaniesInfo} />
                <Route path='/EditCompany' component={EditCompany} />
            </Switch>
          </div>
        </Router>
      );
    }
  }
  
  export default App;