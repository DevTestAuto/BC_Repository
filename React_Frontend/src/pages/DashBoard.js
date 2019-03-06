
import React, { Component } from 'react';
import Layout from '../components/Layout';
import { Image, Grid, Button, Sidebar, Form, Message, Dropdown, Menu, Icon } from 'semantic-ui-react';
import Footer from '../components/Footer'
import axios from 'axios';
import logo from '../images/header-left.png';
import dbCompany from '../images/db_company.png';
import dbEmployee from '../images/db_employee.png';
import ic_spsoft from '../images/ic_spsoft.jpg';
import ic_eis from '../images/ic_eis.jpg';
import ic_mjb from '../images/ic_mjb.jpg';
import ic_dpr from '../images/ic_dpr.jpg';
import ic_devt from '../images/ic_devt.jpg';
import ic_krx from '../images/ic_krx.jpg';
import dbBcImage from '../images/computing_4.gif';
require('../styles.css');

/**
* This component is used to handle displaying Dashboard screen.
*/
class Dashboard extends Component {

    state = {

        errorMessage: '',
        companies: 0,
        employees: 0,
        visible: false,
        aLoginVisible: false,
        companyName: '',
        role: '',
        password: '',
        uname: '',
        adminPwd: '',
        compList: []
    };

    handleShowClick = () => this.setState({ visible: true })
    handleSidebarHide = () => this.setState({ visible: false })
    handleHideClick = () => {
        this.setState({ visible: false })
        this.setState({ errorMessage: '' })
        this.setState({ companyName: '' })
        this.setState({ role: '' })
        this.setState({ password: '' })
    }

    handleShowAdminLoginClick = () => this.setState({
        aLoginVisible: true, 
        errorMessage: '', 
        uname: '', 
        adminPwd: ''
    })
    handleSidebarAdminLoginHide = () => this.setState({ aLoginVisible: false })
    handleAdminLoginHideClick = () => {
        this.setState({ aLoginVisible: false })
        this.setState({ errorMessage: '' })
        this.setState({ uname: '' })
        this.setState({ adminPwd: '' })
    }


    handleCompanyNameDropDown = (e, data) => {
        this.setState({ companyName: data.value, errorMessage: '' });
    }

    handleroleTypeDropDown = (e, data) => {
        this.setState({ role: data.value, errorMessage: '' });
    }

    toggleVisibility = () => this.setState({ visible: false })

    async componentDidMount() {
        document.body.style.backgroundColor = "#e5e7f4";
        this.getCompaniesCount();
        this.getbcEmpCount();
        this.getCompaniesList();
    }

     /**
     * This method is used to fetch active companies list from the database.
     */
    getCompaniesList() {
        var url = 'http://192.168.10.40:3210/activeCompList';
        axios.get(url)
            .then((compList) => {
                console.log(compList.data);
                this.setState({
                    compList: compList.data,
                })
            })
    }

    /**
     * This method is used to fetch the companies count from the database.
     */
    getCompaniesCount() {
        var url = 'http://192.168.10.40:3210/cmpCount/';
        axios.get(url)
            .then((cmpCount) => {
                console.log(cmpCount.data[0].count);
                this.setState({
                    companies: cmpCount.data[0].count,
                })
            })
    }


    /**
     * This method is used to fetch the companies count from the database.
     */
    getbcEmpCount() {
        var url = 'http://192.168.10.40:3210/bcEmpCount/';
        axios.get(url)
            .then((empCount) => {
                console.log(empCount.data[0].count);
                this.setState({
                    employees: empCount.data[0].count,
                })
            })
    }

    /**
     * This method is used to handle login button navigation.
     */
    login = () => {
        this.props.history.push(`/Login`);
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
            this.setState({ errorMessage: 'Password should not be empty' });
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

    /**
     * This method is used to handle View Records button navigation
     */
    verifyAdminLogin = async event => {

        const { uname, adminPwd } = this.state;
        if (uname === "") {
            this.setState({ errorMessage: 'Please enter User Name' });
        } else if (adminPwd === "") {
            this.setState({ errorMessage: 'Please enter Password' });
        } else if (uname == 'Admin' && adminPwd == 'Admin@123') {
            this.props.history.push(`/CompaniesInfo`);
        } else {
            this.setState({ errorMessage: 'Please enter valid admin credentials' });
        }
    }

    render() {
        const { visible, aLoginVisible } = this.state

        return (
            <Layout>
                <div id="header-bg" style={{ marginBottom: '14px' }}>
                    <Grid>
                        <Grid.Row style={{ marginRight: '5px', paddingBottom: '0px', paddingTop: '10px' }}>
                            <Grid.Column width={10}>
                                <Image src={logo} alt="logo" />
                            </Grid.Column>

                            <Grid.Column style={{ cursor: 'pointer' }} textAlign='right' width={4} onClick={this.handleShowAdminLoginClick} >
                                <div style={{ paddingTop: '45px' }} ><Icon style={{ color: '#92a5cf' }} size="mini" name="user outline" /><b style={{ color: '#92a5cf' }}>Admin Login</b></div>
                            </Grid.Column>

                            <Grid.Column style={{ cursor: 'pointer' }} textAlign='right' width={2} onClick={this.handleShowClick}>
                                <div style={{ paddingTop: '45px', marginRight: '35px' }} ><Icon style={{ color: '#92a5cf' }} size="mini" name="user outline" /><b style={{ color: '#92a5cf' }}>Login</b></div>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </div>

                <Sidebar.Pushable>
                    <Sidebar style={{ width: '330px', overflowX: 'hidden' }}
                        as={Menu}
                        animation='overlay'
                        direction='right'
                        onHide={this.handleSidebarAdminLoginHide}
                        vertical
                        visible={aLoginVisible}>

                        <div>
                            <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                                <div style={{ textAlign: 'right' }}>
                                    <Button style={{ backgroundColor: 'Transparent' }} icon='close' disabled={!aLoginVisible} onClick={this.handleAdminLoginHideClick} />
                                </div>

                                <Menu.Item>
                                    <Message color='red' style={{ textAlign: 'center', width: '268px', padding: '3px', marginLeft: '21px' }} error content={this.state.errorMessage}></Message>
                                </Menu.Item>

                                <Grid style={{ marginLeft: '-410px', marginTop: '25px' }}>

                                    <Grid.Row style={{ marginLeft: '441px', padding: '6px' }}>
                                        <Grid.Column width={8}>
                                            <div style={{ width: '235px' }}>
                                                <label >User Name:</label>
                                                <input style={{ background: '#e5e7f4' }}
                                                    value={this.state.uname}
                                                    placeholder='Enter User Name'
                                                    onChange={event =>
                                                        this.setState({ uname: event.target.value, errorMessage: '' })}
                                                    onKeyPress={event => {
                                                        if (event.key === 'Enter') {
                                                            this.verifyAdminLogin()
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row style={{ marginLeft: '441px', padding: '6px' }}>
                                        <Grid.Column width={8}>
                                            <div style={{ width: '235px' }}>
                                                <label >Password:</label>
                                                <input style={{ background: '#e5e7f4' }}
                                                    value={this.state.adminPwd}
                                                    type='password'
                                                    placeholder='Enter Password'
                                                    onChange={event =>
                                                        this.setState({ adminPwd: event.target.value, errorMessage: '' })}
                                                    onKeyPress={event => {
                                                        if (event.key === 'Enter') {
                                                            this.verifyAdminLogin()
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </Grid.Column>
                                    </Grid.Row>

                                    <Grid.Row style={{ marginLeft: '441px' }}>
                                        <Grid.Column width={15} style={{ marginLeft: '5px' }}>
                                            <label style={{ marginRight: '-47px', color: 'blue', cursor: 'pointer' }}><a>Forgot Password</a></label>
                                            <Button style={{ color: 'white', backgroundColor: '#3b896f', marginLeft: '84px' }} onClick={this.verifyAdminLogin}>
                                                SUBMIT
                                        </Button>

                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Form>
                        </div>
                    </Sidebar>

                    <Sidebar style={{ width: '330px', overflowX: 'hidden' }}
                        as={Menu}
                        animation='overlay'
                        direction='right'
                        onHide={this.handleSidebarHide}
                        vertical
                        visible={visible}>

                        <div>
                            <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                                <div style={{ textAlign: 'right' }}>
                                    <Button style={{ backgroundColor: 'Transparent' }} icon='close' disabled={!visible} onClick={this.handleHideClick} />
                                </div>

                                <Menu.Item>
                                    <Message color='red' style={{ textAlign: 'center', width: '268px', padding: '3px', marginLeft: '21px' }} error content={this.state.errorMessage}></Message>
                                </Menu.Item>

                                <Grid style={{ marginLeft: '-410px', marginTop: '5px' }}>
                                    <Grid.Row style={{ marginTop: '5px', marginLeft: '441px', padding: '6px' }}>
                                        <Grid.Column width={8} >
                                            <div style={{ width: '235px' }}>
                                                <label >Company:</label>
                                                <Dropdown style={{ background: '#e5e7f4' }}
                                                    selection
                                                    className='icon right'
                                                    fluid
                                                    labeled
                                                    icon='dropdown'
                                                    right='true'
                                                    options={this.state.compList.map(cl => {
                                                        return { key: cl.comp_id, text: cl.comp_name, value: cl.comp_id };
                                                    })}
                                                    placeholder='Select Company'
                                                    value={this.state.companyName}
                                                    onChange={this.handleCompanyNameDropDown}
                                                />
                                            </div>
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row style={{ marginLeft: '441px', padding: '6px' }}>
                                        <Grid.Column width={8} >
                                            <div style={{ width: '235px' }}>
                                                <label >Role:</label>
                                                <Dropdown style={{ background: '#e5e7f4' }}
                                                    selection
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
                                    <Grid.Row style={{ marginLeft: '441px', padding: '6px' }}>
                                        <Grid.Column width={8}>
                                            <div style={{ width: '235px' }}>
                                                <label >Password:</label>
                                                <input style={{ background: '#e5e7f4' }}
                                                    value={this.state.password}
                                                    type='password'
                                                    placeholder='Enter Password'
                                                    onChange={event =>
                                                        this.setState({ password: event.target.password, errorMessage: '' })}
                                                    onKeyPress={event => {
                                                        if (event.key === 'Enter') {
                                                            this.viewRecords()
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </Grid.Column>
                                    </Grid.Row>

                                    <Grid.Row style={{ marginLeft: '441px' }}>
                                        <Grid.Column width={15} style={{ marginLeft: '5px' }}>
                                            <label style={{ marginRight: '-47px', color: 'blue', cursor: 'pointer' }}><a>Forgot Password</a></label>
                                            <Button style={{ color: 'white', backgroundColor: '#3b896f', marginLeft: '84px' }} onClick={this.viewRecords}>
                                                SUBMIT
                                        </Button>

                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Form>
                        </div>
                    </Sidebar>

                    <Sidebar.Pusher>
                        <div>
                            <Grid style={{ marginRight: '0px' }}>
                                <Grid.Row style={{ padding: '0px' }}>
                                    <Grid.Column width={4} textAlign='center' style={{ backgroundColor: '#f45677', height: '392px', padding: '0px' }}>
                                        <div class="ui one column stackable center aligned page grid">
                                            <div class="column nine wide" style={{ marginTop: '25px' }}>
                                                <Image src={dbCompany} alt="dbCompany" />
                                                <p style={{ color: 'white', fontSize: '70px', margin: '0px', height: '100px', paddingTop: '15px' }} ><b>{this.state.companies}</b></p>
                                                <p style={{ color: 'white', fontSize: '20px', margin: '0px' }}><b>COMPANIES</b></p>
                                            </div>
                                        </div>
                                    </Grid.Column>

                                    <Grid.Column width={4} style={{ backgroundColor: '#38e1de', height: '392px', padding: '0px' }} >
                                        <div class="ui one column stackable center aligned page grid">
                                            <div class="column nine wide" style={{ marginTop: '25px' }}>
                                                <Image src={dbEmployee} alt="dbEmployee" />
                                                <p style={{ color: 'white', fontSize: '70px', margin: '0px', height: '100px', paddingTop: '15px' }} ><b>{this.state.employees}</b></p>
                                                <p style={{ color: 'white', fontSize: '20px', margin: '0px' }}><b>EMPLOYEES</b></p>
                                            </div>
                                        </div>
                                    </Grid.Column>

                                    <Grid.Column width={8} style={{ padding: '0px' }} >
                                        <Image style={{ width: '100%' }} src={dbBcImage} alt="dbBcImage" />
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </div>
                    </Sidebar.Pusher>
                </Sidebar.Pushable>

                <div>
                    <Grid style={{ marginTop: '14px', marginRight: '0px' }}>
                        <Grid.Row style={{ padding: '0px' }}>
                            <Grid.Column width={1} >
                            </Grid.Column>

                            <Grid.Column width={7} >
                                <div style={{ paddingLeft: '25px', paddingRight: '25px', paddingTop: '20px', paddingBottom: '20px', backgroundColor: 'white', marginTop: '25px', height: '280px', borderRadius: '4px' }}>
                                    <p style={{ height: '20px', fontSize: '25px', color: '#253777' }}>About Blockchain Based Employment Information System</p>
                                    <p style={{ textAlign: 'justify', fontSize: '16px', color: '#676767', paddingTop: '25px' }}>Blockchain based employment information system on a consortium network is secure, transparent, efficient, traceable and cost reduction.  The each consortium companies employees data is entered into the Blockchain system is immutable, and the smart contract enabled, highly secure.  There is no third party involvement for background verification of the employee while the employee switching his/her job between the consortium companies.</p>
                                </div>
                            </Grid.Column>

                            <Grid.Column width={7} >
                                <div style={{ paddingLeft: '30px', paddingRight: '30px', paddingTop: '20px', paddingBottom: '20px', backgroundColor: 'white', marginTop: '25px', height: '280px', borderRadius: '4px' }}>
                                    <p style={{ height: '20px', fontSize: '25px', color: '#253777' }}>Onboarded Companies List</p>
                                    <div class="comp_row">
                                        <div class="comp_column">
                                            <Image src={ic_spsoft} />
                                        </div>
                                        <div class="comp_column">
                                            <Image src={ic_eis} />
                                        </div>
                                        <div class="comp_column">
                                            <Image src={ic_mjb} />
                                        </div>
                                    </div>

                                    <div class="comp_row">
                                        <div class="comp_column">
                                            <Image src={ic_krx} />
                                        </div>
                                        <div class="comp_column">
                                            <Image src={ic_dpr} />
                                        </div>
                                        <div class="comp_column">
                                            <Image src={ic_devt} />
                                        </div>
                                    </div>
                                </div>
                            </Grid.Column>
                            <Grid.Column width={1} >
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </div>
                <Footer />
            </Layout >
        );
    }

}

const roleTypeOptions = [
    { key: 'HR', text: 'HR', value: 'HR' },
    { key: 'Management', text: 'Management', value: 'Management' },
    { key: 'Manager', text: 'Manager', value: 'Manager' }
]

export default Dashboard;