
import React, { Component } from 'react';
import Layout from '../components/Layout';
import { Button, Table, Grid, Form, Image, Loader, Dimmer } from 'semantic-ui-react';
import BCUidData from '../components/BCUidData';
import ConstantsList from "../constants/address.js";
import logo from '../images/header-left.png';
import Footer from '../components/Footer'
import axios from 'axios';

require('../styles.css');

/**
 * This component is used to display Blockchain data based on employee id
 */
class UENBcDataInfo extends Component {

    state = {
        user: '',
        isOtherComp: false,
        cvalue: '',
        company_id: '',
        companyName: '',
        isHR: true,
        employeeInfo: []
    };

    loadingShow = () => this.setState({ active: true })

    loadingHide = () => this.setState({ active: false })

    async componentDidMount() {
        document.body.style.backgroundColor = "#e5e7f4";
        if (this.props.location.state !== 'undefined' && this.props.location.state !== undefined) {
            this.loadingShow();
            this.getEmpData(this.props.location.state.emp_uid);
            this.setState({ isOtherComp: false });
            if (this.props.location.state.companyName === 1) {
                this.setState({ company_id: '1' });
                this.setState({ companyName: 'SPS' });
            } else if (this.props.location.state.companyName === 2) {
                this.setState({ company_id: '2' });
                this.setState({ companyName: 'EIS' });
            } else if (this.props.location.state.companyName === 3) {
                this.setState({ company_id: '3' });
                this.setState({ companyName: 'JPI' });
            } else if (this.props.location.state.companyName === 0) {
                this.setState({ company_id: '0' });
                this.setState({ companyName: 'All' });
            }

            if (this.props.location.state.role === ConstantsList.HRUser) {
                this.setState({ isHR: false });
                this.setState({ user: ConstantsList.HRUser });
            } else if (this.props.location.state.role === ConstantsList.ManagementUser) {
                this.setState({ user: ConstantsList.ManagementUser });
                this.setState({ isHR: true });
            } else if (this.props.location.state.role === ConstantsList.ManagerUser) {
                this.setState({ user: ConstantsList.ManagerUser });
                this.setState({ isHR: true });
            }
            this.state.cvalue = this.props.location.state.companyName;
            this.loadingHide();
        }
    }

    /**
     * This method is used to fetch the employee data from the database.
     */
    getEmpData(emp_uid) {
        var url = 'http://192.168.10.40:3210/fetchBCData/' + emp_uid;
        axios.get(url)
            .then((empData) => {
                //  console.log(empData.data[0]);
                this.setState({
                    employeeInfo: empData.data
                })
                console.log(this.state.employeeInfo);
                console.log(this.state.employeeInfo.length);
            })

    }

    /**
     * This method is used to handle back button navigation.
     */
    empInfo = () => {
        this.props.history.push({
            pathname: `/EmpInfo`,
            state: { loginCompany: this.props.location.state.loginCompany, companyName: this.props.location.state.companyName, role: this.props.location.state.role, selectedIndex: 1 }
        })
    }

    /**
     * This method is used to handle logout button navigation
     */
    logout = () => {
        this.props.history.push(`/`);
    }

    /**
     * This method is used to send Blockchain data to BCDetailed data file to render the rows. 
     * @param {*1 or 2} flag 
     */
    renderRows() {
        const { Cell, Row } = Table;
        var rempid = -1;
        if (this.state.employeeInfo.length > 0 && this.state.employeeInfo !== undefined && this.state.employeeInfo !== null) {
            return this.state.employeeInfo.map((employee, index) => {
                if (employee.bc_count > 0) {
                    rempid = rempid + 1
                    return (
                        <BCUidData
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
                            <BCUidData
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
        } else {
            return (
                <Row>
                    <Cell colSpan="11" textAlign="center">
                        <p style={{ fontSize: '20px', textAlign: 'center', color: 'brown' }}>No records found</p>
                    </Cell>
                </Row>);
        }
    }
    render() {
        if (this.props.location.state !== 'undefined' && this.props.location.state !== undefined) {
            const { active } = this.state
            const { Row, HeaderCell, Body } = Table;

            return (
                <Layout>
                    <div id="header-bg">
                        <Grid>
                            <Grid.Row style={{ marginRight: '-50px', paddingBottom: '0px', paddingTop: '10px' }}>
                                <Grid.Column width={10}>
                                    <Image src={logo} alt="logo" />
                                </Grid.Column>
                                <Grid.Column textAlign='right' width={4} style={{ marginLeft: '25px' }}>
                                    <div style={{ paddingTop: '45px', color: '#6f88c0' }}>Logged In User: <b style={{ color: 'white' }}>{this.state.user}</b></div>
                                </Grid.Column>
                                <Grid.Column style={{ cursor: 'pointer' }} textAlign='right' width={1} onClick={this.logout} >
                                    <div style={{ paddingTop: '45px' }}><b style={{ color: '#92a5cf' }}>Logout</b></div>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </div>

                    <Form >

                        <Grid style={{ marginTop: '18px', marginRight: '8px', marginLeft: '8px' }}>
                            <Grid.Row>
                                <Grid.Column width={15} style={{ marginTop: '-9px', marginLeft: '-2px' }}>
                                    <div style={{ borderTop: '1px solid #c8cad6', borderLeft: '1px solid #c8cad6', borderRight: '1px solid #c8cad6', marginTop: '31px', backgroundColor: '#dadce9', width: '310px', padding: '7px', textAlign: 'center' }}>Blockchain Published Data of <span><b>UEN - {this.props.location.state.emp_uid}</b></span></div>
                                </Grid.Column>

                                <Grid.Column textAlign='right' width={1} style={{ marginTop: '7px', marginLeft: '-28px' }}>
                                    <Button onClick={this.empInfo} style={{ backgroundColor: '#184fa2', color: '#bed4e1' }}>BACK</Button>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>

                    </Form>
                    <Dimmer active={active} inverted >
                        <Loader content='Loading..' />
                    </Dimmer>

                    <div id='container' style={{ height: 'auto', overflowX: 'auto', marginLeft: '20px', marginRight: '20px', marginBottom: '25px' }}>
                        <Table celled striped style={{ width: '2000px' }}>
                            <Table.Header>
                                <Row textAlign="center">
                                    <HeaderCell style={{ textAlign: 'center', fontSize: '12px' }} singleLine>S.No</HeaderCell>
                                    <HeaderCell style={{ textAlign: 'center', fontSize: '12px' }} singleLine>Employee Id</HeaderCell>
                                    <HeaderCell style={{ textAlign: 'center', fontSize: '12px' }} singleLine>Employee Name</HeaderCell>
                                    <HeaderCell style={{ textAlign: 'center', fontSize: '12px' }} singleLine>Company</HeaderCell>
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
                                </Row>
                            </Table.Header>
                            <Body>{this.renderRows()}</Body>
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

export default UENBcDataInfo;