
import React, { Component } from 'react';
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import Layout from '../components/Layout';
import { Input, Button, Dropdown, Table, Grid, Form, Message, Image, Loader, Dimmer, Radio, Modal } from 'semantic-ui-react';
import axios from 'axios';
import RequestRow from '../components/RequestRow';
import BlockChainData from '../components/BlockChainData';
import ConstantsList from "../constants/address.js";
import empContract from '../ethereum/factory'
import logo from '../images/header-left.png';
import Footer from '../components/Footer'

require('../styles.css');
class EmpInfo extends Component {

    state = {
        user: '',
        isUser: true,
        isOwnComp: true,
        isOtherComp: false,
        errorMessage: '',
        cvalue: '',
        employeeInfo: [],
        company_id: '',
        showCompSpinner: true,
        isHR: true,
        modalOpen: false,
        selectedIndex: 0,
        value: '',
        searchuid: '',
        compList: [],
    };

    handleSelect = index => {
        this.setState({ selectedIndex: index });
        this.getEmpData(this.state.company_id);
        this.setState({ searchuid: '' });
    };

    handleButtonClick = () => {
        this.setState({ selectedIndex: 0 });
    };

    loadingShow = () => this.setState({ active: true })

    loadingHide = () => this.setState({ active: false })

    handleCompanyDropDown = (e, data) => {
		this.setState({ searchuid: '' });
        this.setState({ company_id: data.value });
        if ((data.value).toString() !== (this.props.location.state.loginCompany).toString()) {
            this.setState({ isUser: true });
            this.setState({ isOtherComp: true });
        } else {
            this.setState({ isUser: false });
            this.setState({ isOtherComp: false });
        }

        this.setState({ cvalue: data.value });
        this.getEmpData(data.value);
    }

    handleOpen = () => this.setState({ modalOpen: true })

    handleClose = () => this.setState({ modalOpen: false })

    handleChange = (e, { value }) => this.setState({ value, errorMessage: '' });

    async componentDidMount() {
        document.body.style.backgroundColor = "#e5e7f4";
        if (this.props.location.state !== 'undefined' && this.props.location.state !== undefined) {
            this.loadingShow();
            this.getCompaniesList();

            if ((this.props.location.state.companyName).toString() === (this.props.location.state.loginCompany).toString()) {
                this.setState({ isOtherComp: false });
            } else {
                this.setState({ isOtherComp: true });
            }

            if (this.props.location.state.selectedIndex === 0) {
                this.setState({ selectedIndex: 0 });
            } else {
                this.setState({ selectedIndex: 1 });
            }

            this.setState({ company_id: this.props.location.state.companyName });

            if (this.props.location.state.role === ConstantsList.HRUser) {
                this.setState({ isOwnComp: false });
                this.setState({ showCompSpinner: false });
                this.setState({ isHR: false });
                this.setState({ user: ConstantsList.HRUser });
                this.setState({ isUser: false });
            } else if (this.props.location.state.role === ConstantsList.ManagementUser) {
                this.setState({ user: ConstantsList.ManagementUser });
                this.setState({ isOwnComp: true });
                this.setState({ showCompSpinner: false });
                this.setState({ isHR: true });
                this.setState({ isUser: false });
            } else if (this.props.location.state.role === ConstantsList.ManagerUser) {
                this.setState({ user: ConstantsList.ManagerUser });
                this.setState({ isOwnComp: true });
                this.setState({ isHR: true });
                this.setState({ showCompSpinner: true });
                this.setState({ isUser: false });
            }

            const countOfEmployees = await empContract.methods.getEmpProfCount().call();
            this.state.cvalue = this.props.location.state.companyName;
            this.getEmpData(this.state.company_id);
            this.loadingHide();
        }
    }

/**
  * This method is used to fetch companies list from the database.
  */
  getCompaniesList() {
    var url = 'http://ec2-3-84-93-231.compute-1.amazonaws.com:3210/compList';
    axios.get(url)
        .then((compList) => {
            console.log(compList.data);
            this.setState({
                compList: compList.data,
            })
            var allFiled = { comp_id: 0, comp_name: "All" }
            this.state.compList.push(allFiled);
        })
}

    renderSearch = async () => {
        if (this.state.searchuid !== "" && this.state.searchuid.length > 0) {
            var url = 'http://ec2-3-84-93-231.compute-1.amazonaws.com:3210/search/' + this.state.searchuid + '/' + this.state.company_id;
            axios.get(url)
                .then((empData) => {
                    this.setState({
                        employeeInfo: empData.data,
                    })
                })
        } else {
            this.getEmpData(this.state.cvalue);
        }
    }

    clearSearch() {
        if (this.state.searchuid === "" || this.state.searchuid.length === 1) {
            this.getEmpData(this.state.cvalue);
        }
    }

    /**
     * This method is used to fetch the employee data from the database.
     */
    getEmpData(comp) {
        var url = 'http://ec2-3-84-93-231.compute-1.amazonaws.com:3210/data/' + comp;
        axios.get(url)
            .then((empData) => {
                console.log(empData.data);
                this.setState({
                    employeeInfo: empData.data,
                })
            })
    }


    /**
     * This method is used to handle Add Employee page navigation.
     */
    addEmployee = () => {
        if (this.state.value !== '') {
            this.props.history.push({
                pathname: `/AddEmployee`,
                state: { loginCompany: this.props.location.state.loginCompany, user: this.state.user, companyName: this.props.location.state.loginCompany, role: this.props.location.state.role, empType: this.state.value }
            })
        } else {
            this.handleClose();
        }
    }

    /**
     * This method is used to handle logout button navigation.
     */
    logout = () => {
        this.props.history.push(`/`);
    }

    /**
     * This method is used to send Employee data to RequestRow file and BlockChainData file to render the rows. 
     * @param {*1 or 2} flag 
     */
    renderRows(flag) {

        const { Cell, Row } = Table;
        var rempid = -1;
        if (flag === 1) {
            if (this.state.employeeInfo.length > 0 && this.state.employeeInfo !== undefined && this.state.employeeInfo !== null) {
                return this.state.employeeInfo.map((employee, index) => {
                    if ((this.state.user === ConstantsList.HRUser && employee.bc_status === 0) ||
                        (this.state.user === ConstantsList.ManagementUser && employee.mgmt_status === 0 && employee.relieving_date !== "") ||
                        (this.state.user === ConstantsList.ManagerUser && employee.mgr_status === 0 && employee.relieving_date !== "") && employee.bc_status === 0) {
                        rempid = rempid + 1
                        return (
                            <RequestRow
                                key={index}
                                employee={employee}
                                status={this.state.isHR}
                                user={this.state.user}
                                isUser={this.state.isUser}
                                nodata={false}
                                loginCompany={this.props.location.state.loginCompany}
                                sno={rempid}
                                history={this.props.history}
                            />
                        );
                    } else {
                        if ((rempid < 0) && ((this.state.employeeInfo.length) === (index + 1))) {
                            rempid = rempid + 1
                            return (
                                <RequestRow
                                    key={0}
                                    employee={this.state.employeeInfo}
                                    status={this.state.isHR}
                                    user={this.state.user}
                                    isUser={this.state.isUser}
                                    nodata={true}
                                    loginCompany={this.props.location.state.loginCompany}
                                    sno={rempid}
                                    history={this.props.history}
                                />
                            );
                        }
                    }
                });
            } else {
                return (
                    <Row>
                        <Cell colSpan="12" textAlign="center">
                            <p style={{ fontSize: '20px', textAlign: 'center', color: 'brown' }}>No records found</p>
                        </Cell>
                    </Row>);
            }

        } else {
            if (this.state.employeeInfo.length > 0 && this.state.employeeInfo !== undefined &&
                this.state.employeeInfo !== null && this.state.cvalue !== '0') {
                return this.state.employeeInfo.map((employee, index) => {
                    if (employee.bc_count > 0) {
                        rempid = rempid + 1
                        return (
                            <BlockChainData
                                key={index}
                                id={index}
                                sid={rempid}
                                employee={employee}
                                status={this.state.isHR}
                                user={this.state.user}
                                nodata={false}
                                company={this.state.cvalue}
                                loginCompany={this.props.location.state.loginCompany}
                                history={this.props.history}
                            />
                        );
                    } else {
                        if ((rempid < 0) && ((this.state.employeeInfo.length) === (index + 1))) {
                            rempid = rempid + 1
                            return (
                                <BlockChainData
                                    key={index}
                                    id={index}
                                    sid={rempid}
                                    employee={employee}
                                    status={this.state.isHR}
                                    user={this.state.user}
                                    nodata={true}
                                    company={this.state.cvalue}
                                    loginCompany={this.props.location.state.loginCompany}
                                    history={this.props.history}
                                />
                            );
                        }
                    }
                });
            } else if (this.state.employeeInfo.length > 0 && this.state.employeeInfo !== undefined &&
                this.state.employeeInfo !== null && this.state.cvalue === '0') {
                return this.state.employeeInfo.map((employee, index) => {
                    rempid = rempid + 1
                    return (
                        <BlockChainData
                            key={index}
                            id={index}
                            sid={rempid}
                            employee={employee}
                            status={this.state.isHR}
                            user={this.state.user}
                            nodata={false}
                            company={this.state.cvalue}
                            loginCompany={this.props.location.state.loginCompany}
                            history={this.props.history}
                        />
                    );
                });
            } else {
                return (
                    <Row>
                        <Cell colSpan="12" textAlign="center">
                            <p style={{ fontSize: '20px', textAlign: 'center', color: 'brown' }}>No records found</p>
                        </Cell>
                    </Row>);
            }
        }
    }

    render() {
        if (this.props.location.state !== 'undefined' && this.props.location.state !== undefined) {
            const { active } = this.state
            const { Row, HeaderCell, Body } = Table;
            if (((this.state.user === ConstantsList.HRUser) && !this.state.isOtherComp) ||
                (this.state.user === ConstantsList.ManagementUser) && !this.state.isOtherComp) {
                return (
                    <Layout>
                        <div id="header-bg">
                            <Grid>
                                <Grid.Row style={{ marginRight: '5px', paddingBottom: '0px', paddingTop: '10px' }}>
                                    <Grid.Column width={9}>
                                        <Image src={logo} alt="logo" />
                                    </Grid.Column>
                                    <Grid.Column textAlign='right' width={6}>
                                        <div style={{ paddingTop: '45px', color: '#6f88c0' }}>Logged In User: <b style={{ color: 'white' }}>{this.state.user}</b></div>
                                    </Grid.Column>
                                    <Grid.Column style={{ cursor: 'pointer' }} textAlign='right' width={1} onClick={this.logout} >
                                        <div style={{ paddingTop: '45px' }}><b style={{ color: '#92a5cf' }}>Logout</b></div>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </div>
                        <Grid style={{ marginTop: '10px', marginRight: '8px', marginLeft: '8px', marginBottom: '-30px' }}>
                            <Grid.Row style={{ textAlign: 'right' }}>
                                {this.state.selectedIndex === 1 && this.state.user !== 'Management' ?
                                    <Grid.Column width={3}>
                                        <div style={{ width: '100%', marginLeft: '-24px', marginTop: '10px' }}>
                                            <Dropdown style={{ backgroundColor: '#F1EDED' }}
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
                                                value={this.state.company_id}
                                                onChange={this.handleCompanyDropDown}
                                            />
                                        </div>
                                    </Grid.Column>
                                    : null}

                                {this.state.selectedIndex === 1 && this.state.user === 'Management' ?
                                    <Grid.Column width={3} >
                                        <div style={{ width: '100%', marginLeft: '-24px', marginTop: '10px' }}>
                                            <Dropdown style={{ backgroundColor: '#F1EDED' }}
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
                                                value={this.state.company_id}
                                                onChange={this.handleCompanyDropDown}
                                            />
                                        </div>
                                    </Grid.Column>
                                    : null}
                                <Grid.Column width={4} style={{ marginLeft: '-55px', marginRight: '-38px' }}>
                                    <Input style={{ height: '39px', marginRight: '-3px' }} type='text' placeholder='Search...'
                                        list='euids'
                                        value={this.state.searchuid}
                                        onChange={event =>
                                            this.setState({ searchuid: event.target.value, errorMessage: '' })}
                                        onKeyPress={event => {
                                            if (event.key === 'Enter') {
                                                this.renderSearch()
                                            }
                                        }}
                                        onKeyDown={event => {
                                            if (event.key === 'Backspace' || event.keyCode === 8) {
                                                this.clearSearch()
                                            }
                                        }} />
                                    <Button style={{ marginTop: '9px', marginRight: '61px', height: '38px' }} onClick={this.renderSearch} icon='search'></Button>
                                </Grid.Column>
                                {this.state.isOwnComp ? true : (
                                    <Grid.Column width={2} >
                                        <Button style={{ marginTop: '10px', width: '175px', backgroundColor: '#184fa2', color: '#bed4e1' }} onClick={this.handleOpen} content="ADD EMPLOYEE" icon="add circle" floated="right" />
                                    </Grid.Column>
                                )}
                            </Grid.Row>
                        </Grid>

                        {this.state.selectedIndex === 0 && this.state.user === 'Management' ?
                            <div style={{ marginTop: '10px' }}>
                            </div>
                            : null}

                        <Dimmer active={active} inverted >
                            <Loader content='Loading..' />
                        </Dimmer>

                        <Tabs
                            selectedIndex={this.state.selectedIndex}
                            onSelect={this.handleSelect}>
                            <TabList>
                                <Tab>Employee Data</Tab>
                                <Tab>Blockchain Published Data</Tab>
                            </TabList>
                            <TabPanel>
                                <div id='container' style={{ height: '632px', overflowX: 'hidden', marginLeft: '20px', marginRight: '20px', marginBottom: '25px' }}>
                                    <Table celled striped>
                                        <Table.Header>
                                            <Row textAlign="center">
                                                <HeaderCell style={{ textAlign: 'center', fontSize: '12px' }} singleLine>S.No</HeaderCell>
                                                <HeaderCell style={{ textAlign: 'center', fontSize: '12px' }} singleLine>Employee Id</HeaderCell>
                                                <HeaderCell style={{ textAlign: 'center', fontSize: '12px' }} singleLine>UEN</HeaderCell>
                                                <HeaderCell style={{ textAlign: 'center', fontSize: '12px' }} singleLine>Employee Name</HeaderCell>
                                                <HeaderCell style={{ textAlign: 'center', fontSize: '12px' }} singleLine>Gender</HeaderCell>
                                                <HeaderCell style={{ textAlign: 'center', fontSize: '12px' }} singleLine>Qualification</HeaderCell>
                                                <HeaderCell style={{ textAlign: 'center', fontSize: '12px' }} singleLine>Date Of Joining</HeaderCell>
                                                <HeaderCell style={{ textAlign: 'center', fontSize: '12px' }} singleLine>Relieving Date</HeaderCell>
                                                <HeaderCell style={{ textAlign: 'center', fontSize: '12px' }} singleLine>Employment Type</HeaderCell>
                                                <HeaderCell style={{ textAlign: 'center', fontSize: '12px' }} singleLine>Exit Type</HeaderCell>
                                                <HeaderCell style={{ textAlign: 'center', fontSize: '12px' }} singleLine>Status</HeaderCell>
                                                {this.state.isHR ? true : (
                                                    <HeaderCell style={{ textAlign: 'center', fontSize: '12px' }} singleLine>Action</HeaderCell>
                                                )}
                                            </Row>
                                        </Table.Header>
                                        <Body>{this.renderRows(1)}</Body>
                                    </Table>
                                </div>
                            </TabPanel>
                            <TabPanel>
                                <div id='container' style={{ height: 'auto', overflow: 'auto', marginLeft: '20px', marginRight: '20px', marginBottom: '25px' }}>
                                    <Table celled striped style={{ width: '2200px' }}>
                                        <Table.Header>
                                            <Row textAlign="center">
                                                <HeaderCell style={{ textAlign: 'center', fontSize: '12px' }} singleLine>S.No</HeaderCell>
                                                <HeaderCell style={{ textAlign: 'center', fontSize: '12px' }} singleLine>Employee Id</HeaderCell>
                                                <HeaderCell style={{ textAlign: 'center', fontSize: '12px' }} singleLine>UEN</HeaderCell>
                                                <HeaderCell style={{ textAlign: 'center', fontSize: '12px' }} singleLine>Employee Name</HeaderCell>
                                                <HeaderCell style={{ textAlign: 'center', fontSize: '12px' }} singleLine>Father Name</HeaderCell>
                                                <HeaderCell style={{ textAlign: 'center', fontSize: '12px' }} singleLine>Gender</HeaderCell>
                                                <HeaderCell style={{ textAlign: 'center', fontSize: '12px' }} singleLine>DOB</HeaderCell>
                                                <HeaderCell style={{ textAlign: 'center', fontSize: '12px' }} singleLine>Qualification</HeaderCell>
                                                <HeaderCell style={{ textAlign: 'center', fontSize: '12px' }} singleLine>Aadhar Number</HeaderCell>
                                                <HeaderCell style={{ textAlign: 'center', fontSize: '12px' }} singleLine>Date Of Joining</HeaderCell>
                                                <HeaderCell style={{ textAlign: 'center', fontSize: '12px' }} singleLine>Relieving Date</HeaderCell>
                                                <HeaderCell style={{ textAlign: 'center', fontSize: '12px' }} singleLine>Employment Type</HeaderCell>
                                                <HeaderCell style={{ textAlign: 'center', fontSize: '12px' }} singleLine>Exit Type</HeaderCell>
                                                <HeaderCell style={{ textAlign: 'center', fontSize: '12px' }} singleLine>Designation</HeaderCell>
                                                <HeaderCell style={{ textAlign: 'center', fontSize: '12px' }} singleLine>Technical Expertise</HeaderCell>
                                                <HeaderCell style={{ textAlign: 'center', fontSize: '12px' }} singleLine>Prev. Employment Verified?</HeaderCell>
                                                <HeaderCell style={{ textAlign: 'center', fontSize: '12px' }} singleLine>Published Date&Time</HeaderCell>
                                                {this.state.isHR ? true : (
                                                    <HeaderCell style={{ textAlign: 'center', fontSize: '12px' }} singleLine>Action</HeaderCell>
                                                )}
                                            </Row>
                                        </Table.Header>
                                        <Body>{this.renderRows(2)}</Body>
                                    </Table>
                                </div>
                            </TabPanel>
                        </Tabs>
                        <Modal style={{ width: '500px', marginLeft: '-275px', marginTop: '-95px' }} open={this.state.modalOpen}
                            onClose={this.handleClose}>
                            <Modal.Content>
                                <p>Plese select type of employee</p>
                                <Form.Field>
                                    <div>
                                        <Radio
                                            label='Fresher'
                                            name='Fresher'
                                            value='Fresher'
                                            checked={this.state.value === 'Fresher'}
                                            onChange={this.handleChange}
                                        />
                                        <Radio
                                            label='Experienced'
                                            name='Experienced'
                                            value='Experienced'
                                            style={{ marginLeft: '20px' }}
                                            checked={this.state.value === 'Experienced'}
                                            onChange={this.handleChange}
                                        />
                                    </div>
                                </Form.Field>
                            </Modal.Content>
                            <Modal.Actions>
                                <Button negative onClick={this.handleClose}>Cancel</Button>
                                <Button positive onClick={this.addEmployee}>Continue</Button>
                            </Modal.Actions>
                        </Modal>
                        <Footer />
                    </Layout>
                );
            } else if (this.state.user === ConstantsList.ManagerUser) {
                return (
                    <Layout>

                        <div id="header-bg">
                            <Grid>
                                <Grid.Row columns={2} style={{ marginRight: '5px', paddingBottom: '0px', paddingTop: '10px' }}>
                                    <Grid.Column width={9}>
                                        <Image src={logo} alt="logo" />
                                    </Grid.Column>
                                    <Grid.Column textAlign='right' width={6}>
                                        <div style={{ paddingTop: '45px', color: '#6f88c0' }}>Logged In User: <b style={{ color: 'white' }}>{this.state.user}</b></div>
                                    </Grid.Column>
                                    <Grid.Column style={{ cursor: 'pointer' }} textAlign='right' width={1} onClick={this.logout} >
                                        <div style={{ paddingTop: '45px' }}><b style={{ color: '#92a5cf' }}>Logout</b></div>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </div>

                        <Form error={!!this.state.errorMessage}>
                            <Grid style={{ marginRight: '8px', marginLeft: '8px', marginTop: '30px' }}>
                                <Grid.Row>
                                    <Grid.Column width={12} />
                                    <Grid.Column width={4} textAlign='right'>
                                        <Input style={{ width: '190px', height: '39px', marginRight: '-3px' }} type='text' placeholder='Search...'
                                            list='euids'
                                            value={this.state.searchuid}
                                            onChange={event =>
                                                this.setState({ searchuid: event.target.value, errorMessage: '' })}
                                            onKeyPress={event => {
                                                if (event.key === 'Enter') {
                                                    this.renderSearch()
                                                }
                                            }}
                                            onKeyDown={event => {
                                                if (event.key === 'Backspace' || event.keyCode === 8) {
                                                    this.clearSearch()
                                                }
                                            }} />
                                        <Button style={{ height: '39px' }} onClick={this.renderSearch} icon='search'></Button>
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row>
                                    <Grid.Column width={10} style={{ marginTop: '-64px', marginLeft: '-2px' }}>
                                        <div style={{ borderTop: '1px solid #c8cad6', borderLeft: '1px solid #c8cad6', borderRight: '1px solid #c8cad6', marginTop: '31px', backgroundColor: '#dadce9', width: '145px', padding: '7px', textAlign: 'center' }}>Employee Data</div>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Form>

                        <Dimmer active={active} inverted >
                            <Loader content='Loading..' />
                        </Dimmer>

                        <div id='container' style={{ height: '625px', overflowX: 'hidden', marginLeft: '20px', marginRight: '20px', marginBottom: '25px' }}>
                            <Table celled striped>
                                <Table.Header>
                                    <Row textAlign="center">
                                        <HeaderCell style={{ textAlign: 'center', fontSize: '12px' }} singleLine>S.No</HeaderCell>
                                        <HeaderCell style={{ textAlign: 'center', fontSize: '12px' }} singleLine>Employee Id</HeaderCell>
                                        <HeaderCell style={{ textAlign: 'center', fontSize: '12px' }} singleLine>UEN</HeaderCell>
                                        <HeaderCell style={{ textAlign: 'center', fontSize: '12px' }} singleLine>Employee Name</HeaderCell>
                                        <HeaderCell style={{ textAlign: 'center', fontSize: '12px' }} singleLine>Gender</HeaderCell>
                                        <HeaderCell style={{ textAlign: 'center', fontSize: '12px' }} singleLine>Qualification</HeaderCell>
                                        <HeaderCell style={{ textAlign: 'center', fontSize: '12px' }} singleLine>Date Of Joining</HeaderCell>
                                        <HeaderCell style={{ textAlign: 'center', fontSize: '12px' }} singleLine>Relieving Date</HeaderCell>
                                        <HeaderCell style={{ textAlign: 'center', fontSize: '12px' }} singleLine>Employment Type</HeaderCell>
                                        <HeaderCell style={{ textAlign: 'center', fontSize: '12px' }} singleLine>Exit Type</HeaderCell>
                                        <HeaderCell style={{ textAlign: 'center', fontSize: '12px' }} singleLine>Status</HeaderCell>
                                        {this.state.isHR ? true : (
                                            <HeaderCell style={{ textAlign: 'center', fontSize: '12px' }} singleLine>Edit</HeaderCell>
                                        )}
                                    </Row>
                                </Table.Header>
                                <Body>{this.renderRows(1)}</Body>
                            </Table>
                        </div>
                        <Footer />
                    </Layout>
                );
            } else if (this.state.company_id === 0 || this.state.company_id === '0') {
                return (
                    <Layout>

                        <div id="header-bg">
                            <Grid>
                                <Grid.Row columns={2} style={{ marginRight: '5px', paddingBottom: '0px', paddingTop: '10px' }}>
                                    <Grid.Column width={9}>
                                        <Image src={logo} alt="logo" />
                                    </Grid.Column>
                                    <Grid.Column textAlign='right' width={6}>
                                        <div style={{ paddingTop: '45px', color: '#6f88c0' }}>Logged In User: <b style={{ color: 'white' }}>{this.state.user}</b></div>
                                    </Grid.Column>
                                    <Grid.Column style={{ cursor: 'pointer' }} textAlign='right' width={1} onClick={this.logout} >
                                        <div style={{ paddingTop: '45px' }}><b style={{ color: '#92a5cf' }}>Logout</b></div>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </div>

                        <Form error={!!this.state.errorMessage}>

                            <Grid style={{ marginBottom: '10px', marginRight: '8px', marginLeft: '8px' }}>
                                <Grid.Row >
                                    <Grid.Column>
                                        <Message style={{ padding: '5px', textAlign: 'center' }} error content={this.state.errorMessage} />
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row>

                                    <Grid.Column width={8} style={{ marginTop: '-19px', marginLeft: '-2px' }}>
                                        <div style={{ borderTop: '1px solid #c8cad6', borderLeft: '1px solid #c8cad6', borderRight: '1px solid #c8cad6', marginTop: '31px', backgroundColor: '#dadce9', width: '200px', padding: '7px', textAlign: 'center' }}>Blockchain Published Data</div>
                                    </Grid.Column>

                                    {this.state.showCompSpinner ? true : (
                                        <Grid.Column width={4}>
                                            <div style={{ width: '73%', marginLeft: '163px', marginTop: '-10px' }}>
                                                <Dropdown style={{ backgroundColor: '#F1EDED' }}
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
                                                    value={this.state.company_id}
                                                    onChange={this.handleCompanyDropDown}
                                                />
                                            </div>
                                        </Grid.Column>
                                    )}

                                    <div style={{ textAlign: 'right', marginTop: '-46px', marginRight: '16px' }} textAlign='right'>
                                        <Input style={{ width: '190px', height: '39px', marginTop: '-10px', marginRight: '-3px' }} type='text' placeholder='Search...'
                                            list='euids'
                                            value={this.state.searchuid}
                                            onChange={event =>
                                                this.setState({ searchuid: event.target.value, errorMessage: '' })}
                                            onKeyPress={event => {
                                                if (event.key === 'Enter') {
                                                    this.renderSearch()
                                                }
                                            }}
                                            onKeyDown={event => {
                                                if (event.key === 'Backspace' || event.keyCode === 8) {
                                                    this.clearSearch()
                                                }
                                            }} />
                                        <Button style={{ height: '39px', marginRight: '-4px', marginTop: '-10px' }} onClick={this.renderSearch} icon='search'></Button>
                                    </div>
                                </Grid.Row>
                            </Grid>

                        </Form>
                        <Dimmer active={active} inverted >
                            <Loader content='Loading..' />
                        </Dimmer>

                        <div id='container' style={{ height: 'auto', overflow: 'auto', marginTop: '-7px', marginLeft: '20px', marginRight: '20px', marginBottom: '25px' }}>
                            <Table celled striped style={{ width: '2000px' }}>
                                <Table.Header>
                                    <Row textAlign="center">
                                        <HeaderCell style={{ textAlign: 'center', fontSize: '12px' }} singleLine>S.No</HeaderCell>
                                        <HeaderCell style={{ textAlign: 'center', fontSize: '12px' }} singleLine>UEN</HeaderCell>
                                        <HeaderCell style={{ textAlign: 'center', fontSize: '12px' }} singleLine>Employee Name</HeaderCell>
                                        <HeaderCell style={{ textAlign: 'center', fontSize: '12px' }} singleLine>Father Name</HeaderCell>
                                        <HeaderCell style={{ textAlign: 'center', fontSize: '12px' }} singleLine>Gender</HeaderCell>
                                        <HeaderCell style={{ textAlign: 'center', fontSize: '12px' }} singleLine>DOB</HeaderCell>
                                        <HeaderCell style={{ textAlign: 'center', fontSize: '12px' }} singleLine>Qualification</HeaderCell>
                                        <HeaderCell style={{ textAlign: 'center', fontSize: '12px' }} singleLine>Aadhar Number</HeaderCell>
                                        <HeaderCell style={{ textAlign: 'center', fontSize: '12px' }} singleLine>Date Of Joining</HeaderCell>
                                        <HeaderCell style={{ textAlign: 'center', fontSize: '12px' }} singleLine>Relieving Date</HeaderCell>
                                        <HeaderCell style={{ textAlign: 'center', fontSize: '12px' }} singleLine>Employment Type</HeaderCell>
                                        <HeaderCell style={{ textAlign: 'center', fontSize: '12px' }} singleLine>Exit Type</HeaderCell>
                                        <HeaderCell style={{ textAlign: 'center', fontSize: '12px' }} singleLine>Designation</HeaderCell>
                                        <HeaderCell style={{ textAlign: 'center', fontSize: '12px' }} singleLine>Technical Expertise</HeaderCell>
                                        <HeaderCell style={{ textAlign: 'center', fontSize: '12px' }} singleLine>Prev. Employment Verified?</HeaderCell>
                                        <HeaderCell style={{ textAlign: 'center', fontSize: '12px' }} singleLine>Published Date&Time</HeaderCell>
                                    </Row>
                                </Table.Header>
                                <Body>{this.renderRows(2)}</Body>
                            </Table>
                        </div>

                        <Footer />
                    </Layout>
                );
            } else {
                return (
                    <Layout>

                        <div id="header-bg">
                            <Grid>
                                <Grid.Row columns={2} style={{ marginRight: '5px', paddingBottom: '0px', paddingTop: '10px' }}>
                                    <Grid.Column width={9}>
                                        <Image src={logo} alt="logo" />
                                    </Grid.Column>
                                    <Grid.Column textAlign='right' width={6}>
                                        <div style={{ paddingTop: '45px', color: '#6f88c0' }}>Logged In User: <b style={{ color: 'white' }}>{this.state.user}</b></div>
                                    </Grid.Column>
                                    <Grid.Column style={{ cursor: 'pointer' }} textAlign='right' width={1} onClick={this.logout} >
                                        <div style={{ paddingTop: '45px' }}><b style={{ color: '#92a5cf' }}>Logout</b></div>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </div>

                        <Form error={!!this.state.errorMessage}>

                            <Grid style={{ marginBottom: '10px', marginRight: '8px', marginLeft: '8px' }}>
                                <Grid.Row >
                                    <Grid.Column>
                                        <Message style={{ padding: '5px', textAlign: 'center' }} error content={this.state.errorMessage} />
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row>

                                    <Grid.Column width={8} style={{ marginTop: '-19px', marginLeft: '-2px' }}>
                                        <div style={{ borderTop: '1px solid #c8cad6', borderLeft: '1px solid #c8cad6', borderRight: '1px solid #c8cad6', marginTop: '31px', backgroundColor: '#dadce9', width: '200px', padding: '7px', textAlign: 'center' }}>Blockchain Published Data</div>
                                    </Grid.Column>

                                    {this.state.showCompSpinner ? true : (
                                        <Grid.Column width={4}>
                                            <div style={{ width: '73%', marginLeft: '163px', marginTop: '-10px' }}>
                                                <Dropdown style={{ backgroundColor: '#F1EDED' }}
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
                                                    value={this.state.company_id}
                                                    onChange={this.handleCompanyDropDown}
                                                />
                                            </div>
                                        </Grid.Column>
                                    )}

                                    <div style={{ textAlign: 'right', marginTop: '-46px', marginRight: '16px' }} textAlign='right'>
                                        <Input style={{ width: '190px', height: '39px', marginTop: '-10px', marginRight: '-3px' }} type='text' placeholder='Search...'
                                            list='euids'
                                            value={this.state.searchuid}
                                            onChange={event =>
                                                this.setState({ searchuid: event.target.value, errorMessage: '' })}
                                            onKeyPress={event => {
                                                if (event.key === 'Enter') {
                                                    this.renderSearch()
                                                }
                                            }}
                                            onKeyDown={event => {
                                                if (event.key === 'Backspace' || event.keyCode === 8) {
                                                    this.clearSearch()
                                                }
                                            }} />
                                        <Button style={{ height: '39px', marginRight: '-4px', marginTop: '-10px' }} onClick={this.renderSearch} icon='search'></Button>
                                    </div>
                                </Grid.Row>
                            </Grid>

                        </Form>
                        <Dimmer active={active} inverted >
                            <Loader content='Loading..' />
                        </Dimmer>

                        <div id='container' style={{ height: 'auto', overflow: 'auto', marginTop: '-7px', marginLeft: '20px', marginRight: '20px', marginBottom: '25px' }}>
                            <Table celled striped  style={{ width: '2000px'}}>
                                <Table.Header>
                                    <Row textAlign="center">
                                        <HeaderCell style={{ textAlign: 'center', fontSize: '12px' }} singleLine>S.No</HeaderCell>
                                        <HeaderCell style={{ textAlign: 'center', fontSize: '12px' }} singleLine>Employee Id</HeaderCell>
                                        <HeaderCell style={{ textAlign: 'center', fontSize: '12px' }} singleLine>UEN</HeaderCell>
                                        <HeaderCell style={{ textAlign: 'center', fontSize: '12px' }} singleLine>Employee Name</HeaderCell>
                                        <HeaderCell style={{ textAlign: 'center', fontSize: '12px' }} singleLine>Father Name</HeaderCell>
                                        <HeaderCell style={{ textAlign: 'center', fontSize: '12px' }} singleLine>Gender</HeaderCell>
                                        <HeaderCell style={{ textAlign: 'center', fontSize: '12px' }} singleLine>DOB</HeaderCell>
                                        <HeaderCell style={{ textAlign: 'center', fontSize: '12px' }} singleLine>Qualification</HeaderCell>
                                        <HeaderCell style={{ textAlign: 'center', fontSize: '12px' }} singleLine>Aadhar Number</HeaderCell>
                                        <HeaderCell style={{ textAlign: 'center', fontSize: '12px' }} singleLine>Date Of Joining</HeaderCell>
                                        <HeaderCell style={{ textAlign: 'center', fontSize: '12px' }} singleLine>Relieving Date</HeaderCell>
                                        <HeaderCell style={{ textAlign: 'center', fontSize: '12px' }} singleLine>Employment Type</HeaderCell>
                                        <HeaderCell style={{ textAlign: 'center', fontSize: '12px' }} singleLine>Exit Type</HeaderCell>
                                        <HeaderCell style={{ textAlign: 'center', fontSize: '12px' }} singleLine>Designation</HeaderCell>
                                        <HeaderCell style={{ textAlign: 'center', fontSize: '12px' }} singleLine>Technical Expertise</HeaderCell>
                                        <HeaderCell style={{ textAlign: 'center', fontSize: '12px' }} singleLine>Prev. Employment Verified?</HeaderCell>
                                        <HeaderCell style={{ textAlign: 'center', fontSize: '12px' }} singleLine>Published Date&Time</HeaderCell>
                                    </Row>                                   
                                </Table.Header>
                            <Body>{this.renderRows(2)}</Body>
                            </Table>
                        </div>

                    <Footer />
                    </Layout >
                );
            }
        } else {
            return (
                <Layout>
                    <div id="header-bg">
                        <Grid>
                            <Grid.Row style={{ marginRight: '5px', paddingBottom: '0px', paddingTop: '10px' }}>
                                <Grid.Column width={9}>
                                    <Image src={logo} alt="logo" />
                                </Grid.Column>

                            </Grid.Row>
                        </Grid>
                    </div>

                    <div style={{ padding: '100px' }}>
                        <h3>Please login to get the Employment Information : <b style={{ cursor: 'pointer', color: '#184ea2' }} onClick={this.logout}><u>Login</u></b></h3>
                    </div>
                </Layout>
            );
        }
    }
}

export default EmpInfo;