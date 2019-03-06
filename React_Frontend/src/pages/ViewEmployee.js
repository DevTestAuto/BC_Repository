import React, { Component } from 'react';
import { Image, Grid, Button } from 'semantic-ui-react'
import Layout from "../components/Layout";
import logo from '../images/header-left.png';
import Footer from '../components/Footer'
import ConstantsList from "../constants/address.js";
import axios from 'axios';
import moment from 'moment';
const ipfsPrefixUrl = 'https://gateway.ipfs.io/ipfs/';


class EditEmployee extends Component {

    state = {
        UEN: '',
        empNumber: '',
        fName: '',
        lName: '',
        fatherName: '',
        dateOfBirth: '',
        qualification: '',
        value: '',
        fromDate: '',
        relDate: '',
        empType: '',
        extType: '',
        techExpertise: '',
        designation: '',
        panNo: '',
        imgUrl: '',
        docUrl: '',
        currentDate: new Date(),
        imgIpfsHash: '',
        user: '',
        bc_count: 0,
        values: ''
    };

    async componentDidMount() {
        document.body.style.backgroundColor = "#e5e7f4";
        this.getEmpData();
        if (this.props.location.state.role === ConstantsList.HRUser) {
            this.setState({ user: ConstantsList.HRUser });
        } else if (this.props.location.state.role === ConstantsList.ManagementUser) {
            this.setState({ user: ConstantsList.ManagementUser });
        } else if (this.props.location.state.role === ConstantsList.ManagerUser) {
            this.setState({ user: ConstantsList.ManagerUser });
        }

    }

    /**
     * This method is used to handle logout button navigation.
     */
    logout = () => {
        this.props.history.push(`/`);
    }

    /**
    * This method is used to fetch the selected employee data from the database
    */
    getEmpData() {
        var url = 'http://192.168.10.40:3210/data/' + this.props.location.state.emp_id + '/' + this.props.location.state.companyName;
        axios.get(url).then((empData) => {
            console.log(empData.data);
            if (empData.data.length > 0) {
                if (empData.data[0].emp_id !== null) {
                    this.setState({ empNumber: empData.data[0].emp_id });
                }
                if (empData.data[0].emp_uid !== null) {
                    this.setState({ UEN: empData.data[0].emp_uid });
                }
                if (empData.data[0].emp_fname !== null) {
                    this.setState({ fName: empData.data[0].emp_fname });
                }
                if (empData.data[0].emp_lname !== null) {
                    this.setState({ lName: empData.data[0].emp_lname });
                }
                if (empData.data[0].emp_fathername !== null) {
                    this.setState({ fatherName: empData.data[0].emp_fathername });
                }
                if (empData.data[0].date_of_birth !== null) {
                    this.setState({ dateOfBirth: moment(empData.data[0].date_of_birth).format('DD-MMM-YYYY') });
                }
                if (empData.data[0].qualification !== null) {
                    this.setState({ qualification: empData.data[0].qualification });
                }
                if (empData.data[0].date_of_joining !== null) {
                    this.setState({ fromDate: moment(empData.data[0].date_of_joining).format('DD-MMM-YYYY') });
                }
                if (empData.data[0].pan_number !== null) {
                    this.setState({ panNo: empData.data[0].pan_number });
                }
                if (empData.data[0].relieving_date !== null && empData.data[0].relieving_date !== undefined && empData.data[0].relieving_date !== '') {
                    this.setState({ relDate: moment(empData.data[0].relieving_date).format('DD-MMM-YYYY') });
                } else if (empData.data[0].relieving_date === '') {
                    this.setState({ relDate: '-' });
                }
                if (empData.data[0].emp_type !== null && (empData.data[0].emp_type === 1 || empData.data[0].emp_type === '1')) {
                    this.setState({ empType: 'Permanent' });
                } else if (empData.data[0].emp_type !== null && (empData.data[0].emp_type === 2 || empData.data[0].emp_type === '2')) {
                    this.setState({ empType: 'Temporary' });
                } else if (empData.data[0].emp_type !== null && (empData.data[0].emp_type === 3 || empData.data[0].emp_type === '3')) {
                    this.setState({ empType: 'Contract' });
                }
                if (empData.data[0].exit_type !== null && (empData.data[0].exit_type === 1 || empData.data[0].exit_type === '1')) {
                    this.setState({ extType: 'Normal' });
                } else if (empData.data[0].exit_type !== null && (empData.data[0].exit_type === 2 || empData.data[0].exit_type === '2')) {
                    this.setState({ extType: 'Terminated' });
                } else if (empData.data[0].exit_type !== null && (empData.data[0].exit_type === 3 || empData.data[0].exit_type === '3')) {
                    this.setState({ extType: 'Absconding' });
                } else if (empData.data[0].exit_type !== null && (empData.data[0].exit_type === 0 || empData.data[0].exit_type === '0')) {
                    this.setState({ extType: 'N/A' });
                }
                if (empData.data[0].tech_expertise !== null) {
                    this.setState({ techExpertise: empData.data[0].tech_expertise });
                }
                if (empData.data[0].gender !== null && (empData.data[0].gender === '1' || empData.data[0].gender === 1)) {
                    this.setState({ value: 'Male' });
                } else if (empData.data[0].gender !== null && (empData.data[0].gender === '2' || empData.data[0].gender === 2)) {
                    this.setState({ value: 'Female' });
                }
                if (empData.data[0].flag_verification !== null && empData.data[0].flag_verification !== undefined && (empData.data[0].flag_verification === 1 || empData.data[0].flag_verification === '1')) {
                    this.setState({ values: 'Yes' });
                } else if (empData.data[0].flag_verification !== null && empData.data[0].flag_verification !== undefined && (empData.data[0].flag_verification === 2 || empData.data[0].flag_verification === '2')) {
                    this.setState({ values: 'No' });
                }
                if (empData.data[0].emp_avatar !== null && empData.data[0].emp_avatar !== "" && empData.data[0].emp_avatar !== undefined) {
                    this.setState({ imgUrl: ipfsPrefixUrl + empData.data[0].emp_avatar });
                    this.setState({ imgIpfsHash: empData.data[0].emp_avatar });
                }
                if (empData.data[0].emp_profile !== null && empData.data[0].emp_profile !== "" && empData.data[0].emp_profile !== undefined) {
                    this.setState({ docUrl: ipfsPrefixUrl + empData.data[0].emp_profile });
                }
                if (empData.data[0].designation !== null && (empData.data[0].designation === 1 || empData.data[0].designation === '1')) {
                    this.setState({ designation: 'Associate' });
                } else if (empData.data[0].designation !== null && (empData.data[0].designation === 2 || empData.data[0].designation === '2')) {
                    this.setState({ designation: 'Software Engineer' });
                } else if (empData.data[0].designation !== null && (empData.data[0].designation === 3 || empData.data[0].designation === '3')) {
                    this.setState({ designation: 'Senior Software Engineer' });
                } else if (empData.data[0].designation !== null && (empData.data[0].designation === 4 || empData.data[0].designation === '4')) {
                    this.setState({ designation: 'Team Lead' });
                } else if (empData.data[0].designation !== null && (empData.data[0].designation === 5 || empData.data[0].designation === '5')) {
                    this.setState({ designation: 'Project Manager' });
                } else if (empData.data[0].designation !== null && (empData.data[0].designation === 6 || empData.data[0].designation === '6')) {
                    this.setState({ designation: 'Senior Project Manager' });
                } else if (empData.data[0].designation !== null && (empData.data[0].designation === 7 || empData.data[0].designation === '7')) {
                    this.setState({ designation: 'Deputy General Manager' });
                } else if (empData.data[0].designation !== null && (empData.data[0].designation === 8 || empData.data[0].designation === '8')) {
                    this.setState({ designation: 'General Manager' });
                } else if (empData.data[0].designation !== null && (empData.data[0].designation === 9 || empData.data[0].designation === '9')) {
                    this.setState({ designation: 'Associate Director' });
                } else if (empData.data[0].designation !== null && (empData.data[0].designation === 10 || empData.data[0].designation === '10')) {
                    this.setState({ designation: 'Director' });
                }
            }
            if (empData.data[0].emp_avatar !== null && empData.data[0].emp_avatar !== "" && empData.data[0].emp_avatar !== undefined) {
                this.setState({ imgUrl: ipfsPrefixUrl + empData.data[0].emp_avatar });
                this.setState({ imgIpfsHash: empData.data[0].emp_avatar });
            }
        })
    }

    /**
    * This method is used to handle the applying colors to the employee exit type
    */
    renderColor() {
        if ((this.state.extType) === 'Normal') {
            return 'green';
        } else if ((this.state.extType) === 'Terminated') {
            return 'orange';
        } else if ((this.state.extType) === 'Absconding') {
            return 'red';
        } else {
            return 'blue';
        }
    }

    /**
    * This method is used to handle the applying colors to the employee verification flag
    */
    verifyFlagColor() {
        if ((this.state.values) === 'No') {
            return 'red';
        } 
    }

    /**
     * This method is used to handle Employee info page navigation
     */
    empInfo = () => {
        this.props.history.push({
            pathname: `/EmpInfo`,
            state: { loginCompany: this.props.location.state.loginCompany, companyName: this.props.location.state.companyName, role: this.props.location.state.role, selectedIndex: this.props.location.state.selectedIndex }
        })
    }

    render() {
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

                <Grid style={{ padding: '20px' }}>
                    <Grid.Row>
                        <Grid.Column width={7} >
                            <div style={{ backgroundColor: 'white', padding: '40px', height: '650px', borderRadius: '4px' }}>
                                <label style={{ color: '#492e83', marginBottom: '-1px', fontSize: '22px' }}>Personal Information</label> <hr></hr>

                                <table style={{ marginTop: '20px' }}>
                                    <tr className="margin_top">
                                        <td className="lable_head">Unique Employee Number:</td>
                                        <td className="table_clumn"><b>{this.state.UEN}</b></td>
                                    </tr>
                                    <tr className="margin_top">
                                        <td className="lable_head">Employee Id:</td>
                                        <td className="table_clumn"><b>{this.state.empNumber}</b></td>
                                    </tr>
                                    <tr className="margin_top">
                                        <td className="lable_head">First Name:</td>
                                        <td className="table_clumn"><b>{this.state.fName}</b></td>
                                    </tr>
                                    <tr className="margin_top">
                                        <td className="lable_head">Last Name:</td>
                                        <td className="table_clumn"><b>{this.state.lName}</b></td>
                                    </tr>
                                    <tr className="margin_top">
                                        <td className="lable_head">Gender:</td>
                                        <td className="table_clumn"><b>{this.state.value}</b></td>
                                    </tr>
                                    <tr className="margin_top">
                                        <td className="lable_head">Father Name:</td>
                                        <td className="table_clumn"><b>{this.state.fatherName}</b></td>
                                    </tr>
                                    <tr className="margin_top">
                                        <td className="lable_head">Date of Birth:</td>
                                        <td className="table_clumn"><b>{this.state.dateOfBirth}</b></td>
                                    </tr>
                                    <tr className="margin_top">
                                        <td className="lable_head">Qualification:</td>
                                        <td className="table_clumn"><b>{this.state.qualification}</b></td>
                                    </tr>
                                    <tr className="margin_top">
                                        <td className="lable_head">Aadhar No:</td>
                                        <td className="table_clumn"><b>{this.state.panNo}</b></td>
                                    </tr>
                                </table>
                            </div>
                        </Grid.Column>

                        <Grid.Column width={7}>
                            <div style={{ backgroundColor: 'white', padding: '40px', height: '650px', borderRadius: '4px' }}>
                                <label style={{ color: '#492e83', marginBottom: '-1px', fontSize: '22px' }}>Employment Information</label><hr></hr>
                                <table style={{ marginTop: '20px' }}>
                                    <tr className="margin_top">
                                        <td className="lable_head">Date Of Joining:</td>
                                        <td className="table_clumn"><b>{this.state.fromDate}</b></td>
                                    </tr>

                                    <tr className="margin_top">
                                        <td className="lable_head">Relieving Date:</td>
                                        <td className="table_clumn"><b>{this.state.relDate}</b></td>
                                    </tr>
                                    <tr className="margin_top">
                                        <td className="lable_head">Employment Type:</td>
                                        <td className="table_clumn"><b>{this.state.empType}</b></td>
                                    </tr>
                                    <tr className="margin_top">
                                        <td className="lable_head">Exit Type:</td>
                                        <td textAlign="center" className="table_clumn" singleLine style={{ color: this.renderColor() }} ><b>{this.state.extType}</b></td>
                                    </tr>
                                    <tr className="margin_top">
                                        <td className="lable_head">Technical Expertise:</td>
                                        <td className="table_clumn"><b>{this.state.techExpertise}</b></td>
                                    </tr>
                                    <tr className="margin_top">
                                        <td className="lable_head">Designation:</td>
                                        <td className="table_clumn"><b>{this.state.designation}</b></td>
                                    </tr>
                                    <tr className="margin_top">
                                        <td className="lable_head">Previous Employment Verified:</td>
                                        <td className="table_clumn"  style={{ color: this.verifyFlagColor() }}><b>{this.state.values}</b></td>
                                    </tr>

                                </table>
                            </div>
                        </Grid.Column>

                        <Grid.Column width={2}>
                            <Image src={this.state.imgUrl} size='small' />
                        </Grid.Column>


                        <Grid.Column width={16} textAlign="bottom" verticalAlign="right">
                            <Button onClick={this.empInfo} style={{ backgroundColor: '#184fa2', color: '#bed4e1' }}>BACK</Button>
                        </Grid.Column>

                    </Grid.Row>


                </Grid>

                <Footer />
            </Layout>
        )

    }
}



export default EditEmployee;