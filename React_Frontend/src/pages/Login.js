
import React, { Component } from 'react';
import Layout from '../components/Layout';
import { Button, Grid, Form, Message, Dropdown, Image } from 'semantic-ui-react';
import logo from '../images/header-left.png';
import Footer from '../components/Footer'
require('../styles.css');

/**
* This component is used to handle login
*/
class Login extends Component {

    state = {
        errorMessage: '',
        companyName: '',
        role: '',
        password: ''
    };

    handleCompanyNameDropDown = (e, data) => {
        this.setState({ companyName: data.value, errorMessage:'' });
    }

    handleroleTypeDropDown = (e, data) => {
        this.setState({ role: data.value, errorMessage:'' });
    }

    async componentDidMount() {
        document.body.style.backgroundColor = "#e5e7f4";
    }

    /**
   * This method is used to handle back button navigation
   */
    gotoDashboard = () => {
        this.props.history.push(`/`);
    }

    /**
     * This method is used to handle View Records button navigation
     */
    viewRecords = async event => {
        const { companyName, role, password } = this.state;
        if (companyName === "") {
            this.setState({ errorMessage: 'Please select Company' });
        } else if (role === "") {
            this.setState({ errorMessage: 'Please select Role' });
        } else if (password === "") {
            this.setState({ errorMessage: 'Please enter Password' });
        } else {
            if (companyName === "SPS") {
                this.props.history.push({
                    pathname: `/EmpInfo`,
                    state: { loginCompany: 1, companyName: 1, role: role, selectedIndex: 0 }
                })
            } else if (companyName === "EIS") {
                this.props.history.push({
                    pathname: `/EmpInfo`,
                    state: { loginCompany: 2, companyName: 2, role: role, selectedIndex: 0 }
                })
            } else {
                this.props.history.push({
                    pathname: `/EmpInfo`,
                    state: { loginCompany: 3, companyName: 3, role: role, selectedIndex: 0 }
                })
            }
        }
    }

    render() {
        return (
            <Layout >
                <div id="header-bg">
                    <Grid>
                        <Grid.Row style={{ marginRight: '5px', paddingBottom: '0px', paddingTop: '10px' }}>
                            <Grid.Column width={14}>
                                <Image src={logo} alt="logo" />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </div>

                <div>
                    <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                        <div>
                            <Grid >
                                <Grid.Row style={{ margin: '80px' }}>
                                    <Grid.Column>
                                        <Message style={{ padding: '5px', textAlign: 'center', marginTop: '-20px', marginBottom: '-8px' }} error content={this.state.errorMessage} />
                                    </Grid.Column>
                                </Grid.Row>

                                <Grid.Row style={{ marginLeft: '450px', padding: '6px' }}>
                                    <Grid.Column width={16} >
                                        <div style={{ width: '388px' }}>
                                            <label>Company:</label>
                                            <Dropdown selection
                                                className='icon right'
                                                fluid
                                                labeled
                                                icon='dropdown'
                                                right='true'
                                                options={CompayOptions}
                                                placeholder='Select Company'
                                                value={this.state.companyName}
                                                onChange={this.handleCompanyNameDropDown}
                                            />
                                        </div>
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row style={{ marginLeft: '450px', padding: '6px' }}>
                                    <Grid.Column width={16} >
                                        <div style={{ width: '388px' }}>
                                            <label>Role:</label>
                                            <Dropdown selection
                                                className='icon right'
                                                fluid
                                                labeled
                                                icon='dropdown'
                                                right='true'
                                                options={roleTypeOptions}
                                                placeholder='Select Role'
                                                value={this.state.role}
                                                onChange={this.handleroleTypeDropDown}
                                            />
                                        </div>
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row style={{ marginLeft: '450px', padding: '6px' }}>
                                    <Grid.Column width={16}>
                                        <div style={{ width: '388px' }}>
                                            <label>Password:</label>
                                            <input value={this.state.password}
                                                type='password'
                                                placeholder='Enter Password'
                                                onChange={event =>
                                                    this.setState({ password: event.target.password, errorMessage: '' })}
                                            />
                                        </div>
                                    </Grid.Column>
                                </Grid.Row>

                                <Grid.Row style={{ marginLeft: '450px' }}>
                                    <Grid.Column width={16} style={{ marginLeft: '5px' }}>
                                        <label style={{ marginRight: '100px' }}><a>Forgot Password</a></label>
                                        <Button color='red' style={{ marginRight: '10px', color: 'white' }} onClick={this.gotoDashboard}>
                                            BACK
                                        </Button>
                                        <Button style={{ color: 'white', backgroundColor: '#3b896f' }} onClick={this.viewRecords}>
                                            SUBMIT
                                        </Button>

                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </div>
                    </Form>
                </div>
                <Footer />
            </Layout>

        );
    }

}


const CompayOptions = [
    { key: 'SP Software', text: 'SP Software', value: 'SPS' },
    { key: 'Embedded IT Solutions', text: 'Embedded IT Solutions', value: 'EIS' },
    { key: 'JP Informatics', text: 'JP Informatics', value: 'JPI' },
]

const roleTypeOptions = [
    { key: 'HR', text: 'HR', value: 'HR' },
    { key: 'Management', text: 'Management', value: 'Management' },
    { key: 'Manager', text: 'Manager', value: 'Manager' }
]

export default Login;