import React, { Component } from 'react';
import Layout from "../components/Layout";
import { Step, Form, Button, Input, Message, Radio, Grid, Image, TextArea, Modal, Dimmer, Loader, Dropdown } from 'semantic-ui-react'
import axios from 'axios';
import GridColumn from 'semantic-ui-react/dist/commonjs/collections/Grid/GridColumn';
import ipfs from '../components/IPFS'
import moment from 'moment';
import logo from '../images/header-left.png';

require('../styles.css');
const ipfsPrefixUrl = 'https://gateway.ipfs.io/ipfs/';
class AddEmployee extends Component {
    constructor() {
        super();
        this.state = {
            empUEN: '',
            empNumber: '',
            firstName: '',
            lastName: '',
            fatherName: '',
            dateOfBirth: '',
            qualification: '',
            panNo: '',
            designation: '',
            fromDate: '',
            value: '',
            relDate: '',
            empType: '',
            extType: '',
            techExpertise: '',
            loading: false,
            errorMessage: '',
            currentDate: new Date(),
            modalOpen: false,
            imgIpfsHash: '',
            imgBuffer: '',
            docBuffer: '',
            user: '',
            extEmpId: '',
            values: '',
            steps: '',
            recordsCount: 0,
            typeOfEmp: '',
            uenList: [],
            imgUrl: '',
            duplicateEmp: false
        };
    }

    handleClick = (e, { title }) => {

        if (title === "Employment Information") {
            this.personalInfoSubmit();
        } else {
            this.setState({ steps: 'Personal Information' });
            this.setState({ loading: false, errorMessage: '' });
        }
    }

    handleChange = (e, { value }) => this.setState({ value, errorMessage: '' });

    handleFlagChange = (e, { values }) => this.setState({ values, errorMessage: '' });

    handleOpen = () => this.setState({ modalOpen: true })

    handleClose = () => this.setState({ modalOpen: false })

    loadingShow = () => this.setState({ active: true })

    loadingHide = () => this.setState({ active: false })

    handleEmpTypeDropDown = (e, data) => {
        this.setState({ empType: data.value, errorMessage: '' });
    }

    handleExitTypeDropDown = (e, data) => {
        this.setState({ extType: data.value, errorMessage: '' });
    }

    handledisignationDropDown = (e, data) => {
        this.setState({ designation: data.value, errorMessage: '' });
    }

    async componentDidMount() {
        document.body.style.backgroundColor = "#e5e7f4";
        if (this.props.location.state !== 'undefined' && this.props.location.state !== undefined) {
            this.setState({ user: this.props.location.state.user });
            this.setState({ typeOfEmp: this.props.location.state.empType });
            this.setState({ steps: 'Personal Information' });

            if (this.props.location.state.empType === 'Fresher') {
                this.getEmpCount();
            } else {
                this.getEmpUid();

            }
        }
    }

    /**
     * This method is used to fetch the employee record count from the database.
     */
    getEmpCount() {
        var url = 'http://ec2-34-209-178-145.us-west-2.compute.amazonaws.com:3210/data/';
        axios.get(url)
            .then((recordCount) => {
                console.log(recordCount.data[0].count);
                this.setState({
                    recordsCount: recordCount.data[0].count,
                })
                if (this.state.recordsCount < 9) {
                    const uen = "EMP0" + (this.state.recordsCount + 1);
                    this.setState({ empUEN: uen });
                } else {
                    const uen = "EMP" + (this.state.recordsCount + 1);
                    this.setState({ empUEN: uen });
                }
            })
    }

    /**
    * This method is used to check employee record duplication.
    */
    checkDuplicateRecord = async event => {
        const { firstName, lastName, fatherName, value, dateOfBirth, panNo } = this.state;
        var gender;
        if (value === 'Male') {
            gender = 1;
        } else {
            gender = 2;
        }
        var url = 'http://ec2-34-209-178-145.us-west-2.compute.amazonaws.com:3210/checkDuplicate/' + firstName + '/' + lastName + '/' + fatherName + '/' + gender + '/' + dateOfBirth + '/' + panNo;
        axios.get(url)
            .then((empData) => {
                console.log(empData.data);
                if (empData.data.length > 0) {
                    this.setState({
                        duplicateEmp: true
                    })
                } else {
                    this.setState({
                        duplicateEmp: false
                    })
                }
            })
    }

    /**
     * This method is used to fetch the employee unique id from the database.
     */
    getEmpUid() {
        var url = 'http://ec2-34-209-178-145.us-west-2.compute.amazonaws.com:3210/euid/';
        axios.get(url)
            .then((empData) => {
                console.log(empData.data);
                this.setState({
                    uenList: empData.data,
                })
            })
    }

    checkEmpUEN(empUEN) {
        var validUEN = false;
        this.state.uenList.map((euid, index) => {
            if (empUEN === euid.emp_uid) {
                validUEN = true;
            }
        })
        return validUEN;
    }

    personalInfoSubmit = async event => {
        if (this.state.empNumber !== "" && this.state.empNumber != '0' && this.state.empNumber.match(/^([0-9]{1,5})$/)) {
            this.getExistingEmployee();
        }
        const { typeOfEmp, empUEN, empNumber, extEmpId, firstName, lastName, fatherName, dateOfBirth, currentDate, qualification, panNo, value } = this.state;
        if (typeOfEmp !== 'Fresher' && empUEN === "") {
            this.setState({ errorMessage: 'Unique Employee Number should not be blank' })
        } else if (typeOfEmp !== 'Fresher' && !this.checkEmpUEN(empUEN)) {
            this.setState({ errorMessage: 'Please enter valid Unique Employee Number' })
        } else if (empNumber === "") {
            this.setState({ errorMessage: 'Employee Id should not be blank' })
        } else if (empNumber === '0') {
            this.setState({ errorMessage: 'Please enter valid Employee Id' })
        } else if (!empNumber.match(/^([0-9]{1,20})$/)) {
            this.setState({ errorMessage: 'Employee Id may only contain numerics' })
        } else if (!empNumber.match(/^([0-9]{1,5})$/)) {
            this.setState({ errorMessage: 'Employee Id should not exceed more than 5 digits' })
        } else if (firstName === "") {
            this.setState({ errorMessage: 'First Name should not be blank' })
        } else if (!firstName.match(/^([a-zA-Z\s]{3,250})$/)) {
            this.setState({ errorMessage: 'First Name should be alphabets with minimum three characters' })
        } else if (!firstName.match(/^([a-zA-Z\s]{3,50})$/)) {
            this.setState({ errorMessage: 'First Name should not exceed more than 50 characters' })
        } else if (lastName === "") {
            this.setState({ errorMessage: 'Last Name should not be blank' })
        } else if (!lastName.match(/^([a-zA-Z\s]{3,250})$/)) {
            this.setState({ errorMessage: 'Last Name should be alphabets with minimum three characters' })
        } else if (!lastName.match(/^([a-zA-Z\s]{3,50})$/)) {
            this.setState({ errorMessage: 'Last Name should not exceed more than 50 characters' })
        } else if (fatherName === "") {
            this.setState({ errorMessage: 'Father Name should not be blank' })
        } else if (!fatherName.match(/^([a-zA-Z\s]{3,250})$/)) {
            this.setState({ errorMessage: 'Father Name should be alphabets with minimum three characters' })
        } else if (!fatherName.match(/^([a-zA-Z\s]{3,50})$/)) {
            this.setState({ errorMessage: 'Father Name should not exceed more than 50 characters' })
        } else if (dateOfBirth === "") {
            this.setState({ errorMessage: 'Date of Birth should not be blank' })
        } else if (dateOfBirth !== "" && moment(currentDate).format('YYYY-MM-DD') < moment(this.state.dateOfBirth).format('YYYY-MM-DD')) {
            this.setState({ errorMessage: 'Date of Birth should not be greater than current date' })
        } else if (qualification === "") {
            this.setState({ errorMessage: 'Qualification should not be blank' })
        } else if (!qualification.match(/^([\w\-,.+()-\s]{1,250})$/)) {
            this.setState({ errorMessage: 'Qualification may only contain alphanumerics and (-,.+) and should not exceed more than 250 characters' })
        } else if (panNo === "") {
            this.setState({ errorMessage: 'Aadhar No should not be blank' })
        } else if (panNo === 0 || (!panNo.match(/^([0-9]{12,12})$/))) {
            this.setState({ errorMessage: 'Please enter valid Aadhar No' })
        } else if (value === "") {
            this.setState({ errorMessage: 'Please select Gender' })
        } else if (extEmpId === empNumber) {
            this.setState({ errorMessage: 'Employee id already exist! Please try again.' })
        } else {
            this.setState({ errorMessage: '' });
            this.setState({ steps: 'Employment Information' })
            this.checkDuplicateRecord();
        }
    };

    empInfoSubmit = async event => {
        const { extEmpId, empNumber, fromDate, relDate, empType, extType, techExpertise, currentDate, designation, values } = this.state;
        if (fromDate === "") {
            this.setState({ errorMessage: 'Date Of Joining should not be blank' })
        } else if (moment(this.state.fromDate).format('YYYY') < 1995) {
            this.setState({ errorMessage: 'Please Enter valid date' })
        } else if (moment(currentDate).format('YYYY-MM-DD') < moment(this.state.fromDate).format('YYYY-MM-DD')) {
            this.setState({ errorMessage: 'Date Of Joining should not be greater than current date' })
        } else if (relDate !== "" && moment(currentDate).format('YYYY-MM-DD') < moment(this.state.relDate).format('YYYY-MM-DD')) {
            this.setState({ errorMessage: 'Relieving Date should not be greater than current date' })
        } else if (relDate !== "" && moment(this.state.fromDate).format('YYYY-MM-DD') > moment(this.state.relDate).format('YYYY-MM-DD')) {
            this.setState({ errorMessage: 'Relieving Date should not be Less than Date Of Joining' })
        } else if (empType === "") {
            this.setState({ errorMessage: 'Employment Type should not be blank' })
        } else if (relDate !== "" && extType === '0') {
            this.setState({ errorMessage: 'Please be select Exit Type other than N/A' })
        } else if (relDate !== "" && extType === "") {
            this.setState({ errorMessage: 'Exit Type should not be blank' })
        } else if ((relDate === "" && extType === "1") || ((relDate === "" && extType === "2") || (relDate === "" && extType === "3"))) {
            this.setState({ errorMessage: 'Relieving Date should not be blank else select ExitType N/A' })
        } else if (techExpertise === "") {
            this.setState({ errorMessage: 'Technical Expertise should not be blank' })
        } else if (!techExpertise.match(/^([\w\-,.+()-\s]{1,256})$/)) {
            this.setState({ errorMessage: 'Technical Expertise may only contain alphanumerics and (-,.+)' })
        } else if (designation === "") {
            this.setState({ errorMessage: 'Designation should not be blank' })
        } else if (values === "") {
            this.setState({ errorMessage: 'Please select Previous Employment Verified' })
        } else if (this.state.duplicateEmp === true && this.props.location.state.empType === 'Fresher') {
            this.setState({ errorMessage: 'Employee with this details already exists.' })
        } else if (extEmpId === empNumber) {
            this.setState({ errorMessage: 'Employee id already exist! Please try again.' })
        } else {
            this.setState({ loading: false, errorMessage: '' });
            this.state.flag = 'true';
            this.handleOpen();
        }
    };
    /**
    * This method is used to handle add employee submit button
    */
    onSubmit = async event => {
        //  event.preventDefault();
        if (this.state.empNumber !== "") {
            this.getExistingEmployee();
        }
        const { empNumber, empName, value, fromDate, relDate, empType, extType, techExpertise, currentDate, extEmpId, values } = this.state;
        console.log(this.state);
        if (empNumber === "") {
            this.setState({ errorMessage: 'Employee Number should not be blank' })
        } else if (empNumber === 0) {
            this.setState({ errorMessage: 'Please enter valid Employee Number' })
        } else if (!empNumber.match(/^([0-9]{1,20})$/)) {
            this.setState({ errorMessage: 'Employee Number may only contain numerics' })
        } else if (!empNumber.match(/^([0-9]{1,5})$/)) {
            this.setState({ errorMessage: 'Employee Number should not exceed more than 5 digits' })
        } else if (empName === "") {
            this.setState({ errorMessage: 'Employee Name should not be blank' })
        } else if (!empName.match(/^([a-zA-Z\s]{3,250})$/)) {
            this.setState({ errorMessage: 'Employee Name should be alphabets with minimum three characters' })
        } else if (!empName.match(/^([a-zA-Z\s]{3,50})$/)) {
            this.setState({ errorMessage: 'Employee Name should not exceed more than 50 characters' })
        } else if (value === "") {
            this.setState({ errorMessage: 'Please select Gender' })
        } else if (fromDate === "") {
            this.setState({ errorMessage: 'Date Of Joining should not be blank' })
        } else if (moment(this.state.fromDate).format('YYYY') < 1995) {
            this.setState({ errorMessage: 'Please Enter valid date' })
        } else if (moment(currentDate).format('YYYY-MM-DD') < moment(this.state.fromDate).format('YYYY-MM-DD')) {
            this.setState({ errorMessage: 'Date Of Joining should not be greater than current date' })
        } else if (relDate !== "" && moment(currentDate).format('YYYY-MM-DD') < moment(this.state.relDate).format('YYYY-MM-DD')) {
            this.setState({ errorMessage: 'Relieving Date should not be greater than current date' })
        } else if (relDate !== "" && moment(this.state.fromDate).format('YYYY-MM-DD') > moment(this.state.relDate).format('YYYY-MM-DD')) {
            this.setState({ errorMessage: 'Relieving Date should not be Less than Date Of Joining' })
        } else if (empType === "") {
            this.setState({ errorMessage: 'Employment Type should not be blank' })
        } else if (relDate !== "" && extType === 'N/A') {
            this.setState({ errorMessage: 'Please be select Exit Type other than N/A' })
        } else if (relDate !== "" && extType === "") {
            this.setState({ errorMessage: 'Exit Type should not be blank' })
        } else if ((relDate === "" && extType === "Terminated") || ((relDate === "" && extType === "Normal") || (relDate === "" && extType === "Absconding"))) {
            this.setState({ errorMessage: 'Relieving Date should not be blank else select ExitType N/A' })
        } else if (techExpertise === "") {
            this.setState({ errorMessage: 'Technical Expertise should not be blank' })
        } else if (values === "") {
            this.setState({ errorMessage: 'Please select Previous Employment Verified' })
        } else if (!techExpertise.match(/^([\w\-,.+()-\s]{1,256})$/)) {
            this.setState({ errorMessage: 'Technical Expertise may only contain alphanumerics and (-,.+)' })
        } else if (extEmpId === empNumber) {
            this.setState({ errorMessage: 'Employee id already exist! Please try again.' })
        } else {
            this.setState({ loading: false, errorMessage: '' });
            this.state.flag = 'true';
            this.handleOpen();
        }
    };

    /**
    * This method is used to check the duplicate employee entry
    */
    getExistingEmployee = async () => {
        const { empNumber } = this.state;
        var selQuery = 'http://ec2-34-209-178-145.us-west-2.compute.amazonaws.com:3210/data/' + empNumber + '/' + this.props.location.state.companyName;
        axios.get(selQuery).then((empData) => {
            if (empData.data.length > 0) {
                if (empData.data[0].emp_id !== null) {
                    this.state.extEmpId = empData.data[0].emp_id;
                }
            }
        })
    };

    /**
    * This method is used to handle uploading image to ipfs
    */
    uploadImageToIpfs = async event => {
        setTimeout(async event => {
            this.state.modalOpen = false;
            this.setState({ loading: true, errorMessage: '' });
            this.loadingShow();
            if (this.state.imgBuffer !== "" && this.state.imgBuffer !== undefined) {
                await ipfs.add(this.state.imgBuffer, (err, ipfsHash) => {
                    console.log(err, ipfsHash);
                    this.setState({ imgIpfsHash: ipfsHash[0].hash });
                    console.log("HASH:::::   " + this.state.imgIpfsHash);
                    this.addEmployeeData();

                }) //await ipfs.add 
            } else {
                this.addEmployeeData();
            }
        }, 1000)
    }

    /**
    * This method is used to handle the adding employee record to database
    */
    addEmployeeData = async () => {
        var status = 0;
        var verifFlag, genderFlag, typeOfExit;
        if (this.props.location.state.empType === 'Fresher') {
            this.getEmpCount();
        }
        const { empUEN, empNumber, firstName, lastName, fatherName, dateOfBirth, qualification, panNo, value, fromDate, relDate, empType, extType, techExpertise, designation, values, imgIpfsHash } = this.state;
        console.log(this.state);
        if (this.state.flag === 'true') {
            this.state.flag = 'false';
            if (relDate === "" && (extType !== '0' || extType !== 0)) {
                typeOfExit = '0';
            } else {
                typeOfExit = extType;
            }

            if (imgIpfsHash === "" && value === "Male") {
                this.state.imgIpfsHash = "Qmct7vrnaos4eU7ok36fmJw8y4iLJsbX4hthXtW1ziCGSc";
            } else if (imgIpfsHash === "" && value === "Female") {
                this.state.imgIpfsHash = "QmWcAdtRPQ1JEPgSjsQCcVMsQsLSohBGKSZE44m3Fvetsf";
            }

            if (value === "Male") {
                genderFlag = "1";
            } else if (value === "Female") {
                genderFlag = "2";
            }

            if (values === "Yes") {
                verifFlag = "1";
            } else if (values === "No") {
                verifFlag = "2";
            }
            var url = 'http://ec2-34-209-178-145.us-west-2.compute.amazonaws.com:3210/InsertReq/' + fromDate + "/" + empUEN;
            axios.post(url, {
                emp_uid: empUEN,
                emp_id: empNumber,
                emp_fname: firstName,
                emp_lname: lastName,
                emp_fathername: fatherName,
                emp_avatar: this.state.imgIpfsHash,
                gender: genderFlag,
                date_of_birth: dateOfBirth,
                qualification: qualification,
                pan_number: panNo,
                date_of_joining: fromDate,
                relieving_date: relDate,
                emp_type: empType,
                exit_type: typeOfExit,
                designation: designation,
                tech_expertise: techExpertise,
                flag_verification: verifFlag,
                mgmt_status: 0,
                mgr_status: 0,
                bc_status: 0,
                comp_id: this.props.location.state.companyName,
                bc_count: 0,
                created_date: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                modified_date: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
            }).then(function (response) {
                console.log(response.data.status);
                status = response.data.status;
            })
                .catch(function (error) {
                    console.log(error);

                });

            setTimeout(async event => {
                this.setState({ loading: false });
                this.loadingHide();
                if (status === '1') {
                    this.empInfo();
                } else if (status === '2') {
                    this.setState({ errorMessage: 'Date Of Joining should not be less than relieving date of other companies' })
                }
            }, 1000)
        }
    };

    /**
    * This method is used to handle user avatar change
    */
    onImageChange = (event) => {
        event.stopPropagation()
        event.preventDefault()
        const file = event.target.files[0]
        let reader = new window.FileReader()
        reader.readAsArrayBuffer(file)
        reader.onloadend = () => this.convertToBuffer(reader)
    };

    /**
    * This method is used to handle the converting image to buffer
    */
    convertToBuffer = async (reader) => {
        const imgBuffer = await Buffer.from(reader.result);
        this.setState({ imgBuffer });
    };

    /**
    * This method is used to handle Employee info page navigation
    */
    empInfo = () => {
        this.props.history.push({
            pathname: `/EmpInfo`,
            state: { loginCompany: this.props.location.state.loginCompany, companyName: this.props.location.state.companyName, role: this.props.location.state.role, selectedIndex: 0 }
        })
    }

    /**
    * This method is used to handle logout button navigation
    */
    logout = () => {
        this.props.history.push(`/`);
    }

    focusOut = () => {
        if (!this.checkEmpUEN(this.state.empUEN)) {
            this.setState({ errorMessage: 'Please enter valid Unique Employee Number' })
            this.setState({ empNumber: '', firstName: '', lastName: '', fatherName: '', dateOfBirth: '', qualification: '', panNo: '', value: '', imgUrl: '', imgIpfsHash: '' });
        } else {
            var url = 'http://ec2-34-209-178-145.us-west-2.compute.amazonaws.com:3210/fetchUidData/' + this.state.empUEN;
            axios.get(url)
                .then((empData) => {
                    console.log("empdata", empData);
                    if (empData.data.length > 0) {
                        // if (empData.data[0].emp_id !== null) {
                        //     this.setState({ empNumber: empData.data[0].emp_id });
                        // }
                        if (empData.data[0].emp_fname !== null) {
                            this.setState({ firstName: empData.data[0].emp_fname });
                        }
                        if (empData.data[0].emp_lname !== null) {
                            this.setState({ lastName: empData.data[0].emp_lname });
                        }
                        if (empData.data[0].emp_fathername !== null) {
                            this.setState({ fatherName: empData.data[0].emp_fathername });
                        }
                        if (empData.data[0].date_of_birth !== null) {
                            this.setState({ dateOfBirth: moment(empData.data[0].date_of_birth).format('YYYY-MM-DD') });
                        }
                        if (empData.data[0].qualification !== null) {
                            this.setState({ qualification: empData.data[0].qualification });
                        }
                        if (empData.data[0].pan_number !== null) {
                            this.setState({ panNo: empData.data[0].pan_number });
                        }
                        if (empData.data[0].gender !== null && (empData.data[0].gender === '1' || empData.data[0].gender === 1)) {
                            this.setState({ value: 'Male' });
                        } else if (empData.data[0].gender !== null && (empData.data[0].gender === '2' || empData.data[0].gender === 2)) {
                            this.setState({ value: 'Female' });
                        }
                        if (empData.data[0].emp_avatar !== null && empData.data[0].emp_avatar !== "" && empData.data[0].emp_avatar !== undefined) {
                            this.setState({ imgUrl: ipfsPrefixUrl + empData.data[0].emp_avatar });
                            this.setState({ imgIpfsHash: empData.data[0].emp_avatar });
                        }
                    }
                })
        }
    }

    render() {
        if (this.props.location.state !== 'undefined' && this.props.location.state !== undefined) {
            const { active, steps } = this.state
            return (
                <Layout>
                    <div id="header-bg">
                        <Grid>
                            <Grid.Row style={{ marginRight: '-50px', paddingBottom: '0px', paddingTop: '10px' }}>
                                <Grid.Column width={10}>
                                    <Image src={logo} alt="logo" />
                                </Grid.Column>
                                <Grid.Column textAlign='right' width={4}>
                                    <div style={{ paddingTop: '45px', color: '#6f88c0' }}>Logged In User: <b style={{ color: 'white' }}>{this.state.user}</b></div>
                                </Grid.Column>
                                <Grid.Column style={{ cursor: 'pointer' }} textAlign='right' width={1} onClick={this.logout} >
                                    <div style={{ paddingTop: '45px' }}><b style={{ color: '#92a5cf' }}>Logout</b></div>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </div>
                    <div style={{ paddingLeft: '55px', paddingRight: '55px', paddingTop: '45px' }}>
                        {/* <h3 style={{ display: 'inline-block' }}>Add Employee</h3> */}

                        <Form error={!!this.state.errorMessage}>
                            <Step.Group style={{ width: '100%', marginBottom: '30px' }}>
                                <Step
                                    active={steps === 'Personal Information'}
                                    icon='user'
                                    link
                                    onClick={this.handleClick}
                                    title='Personal Information'
                                    description='Enter Personal Information'
                                />
                                <Step
                                    active={steps === 'Employment Information'}
                                    icon='briefcase'
                                    link
                                    onClick={this.handleClick}
                                    title='Employment Information'
                                    description='Enter Employment Information'
                                />
                            </Step.Group>

                            {this.state.steps === 'Personal Information' && this.state.typeOfEmp === 'Fresher' ?
                                <Grid >
                                    <Grid.Row>
                                        <GridColumn>
                                            <Message style={{ padding: '5px', textAlign: 'center', marginTop: '-20px', marginBottom: '-8px' }} error content={this.state.errorMessage} />
                                        </GridColumn>
                                    </Grid.Row>
                                    <Grid.Row style={{ marginBottom: '15px' }}>

                                        <GridColumn width={4}>
                                            <Form.Field>
                                                <label ><font color="red">* </font> Employee Id:</label>
                                                <Input
                                                    value={this.state.empNumber}
                                                    placeholder='Enter Employee Id'
                                                    onChange={event =>
                                                        this.setState({ empNumber: event.target.value, errorMessage: '' })}
                                                />
                                            </Form.Field>
                                        </GridColumn>

                                        <GridColumn width={4}>
                                            <Form.Field>
                                                <label><font color="red">* </font>First Name:</label>
                                                <Input
                                                    value={this.state.firstName}
                                                    placeholder='Enter First Name'
                                                    onChange={event =>
                                                        this.setState({ firstName: event.target.value, errorMessage: '' })}
                                                />
                                            </Form.Field>
                                        </GridColumn>

                                        <GridColumn width={4}>
                                            <Form.Field>
                                                <label><font color="red">* </font>Last Name:</label>
                                                <Input
                                                    value={this.state.lastName}
                                                    placeholder='Enter Last Name'
                                                    onChange={event =>
                                                        this.setState({ lastName: event.target.value, errorMessage: '' })}
                                                />
                                            </Form.Field>
                                        </GridColumn>

                                        <GridColumn width={4}>
                                            <Form.Field>
                                                <label><font color="red">* </font>Father Name:</label>
                                                <Input
                                                    value={this.state.fatherName}
                                                    placeholder='Enter Father Name'
                                                    onChange={event =>
                                                        this.setState({ fatherName: event.target.value, errorMessage: '' })}
                                                />
                                            </Form.Field>
                                        </GridColumn>

                                    </Grid.Row>

                                    <Grid.Row style={{ marginBottom: '15px' }}>

                                        <GridColumn width={4}>
                                            <Form.Field>
                                                <label><font color="red">* </font>Date of Birth:</label>
                                                <div className="ui calendar" id="dob">
                                                    <div className="ui input right icon">
                                                        <i className="calendar icon"></i>
                                                        <input
                                                            type="date"
                                                            placeholder="Enter Date of Birth"
                                                            value={this.state.dateOfBirth}
                                                            onChange={event =>
                                                                this.setState({ dateOfBirth: event.target.value, errorMessage: '' })} />
                                                    </div>
                                                </div>
                                            </Form.Field>
                                        </GridColumn>

                                        <GridColumn width={4}>
                                            <Form.Field>
                                                <label><font color="red">* </font>Qualification:</label>
                                                <Input
                                                    value={this.state.qualification}
                                                    placeholder='Enter Qualification'
                                                    onChange={event =>
                                                        this.setState({ qualification: event.target.value, errorMessage: '' })}
                                                />
                                            </Form.Field>
                                        </GridColumn>

                                        <GridColumn width={4}>
                                            <Form.Field>
                                                <label><font color="red">* </font>Aadhar No:</label>
                                                <Input
                                                    value={this.state.panNo}
                                                    placeholder='Enter Aadhar No'
                                                    onChange={event =>
                                                        this.setState({ panNo: event.target.value, errorMessage: '' })}
                                                />
                                            </Form.Field>
                                        </GridColumn>

                                        <GridColumn width={4}>
                                            <Form.Field>
                                                <label>Employee Photo:</label>
                                                <div class="ui fluid segment" style={{ paddingTop: '9px', paddingBottom: '9px', marginTop: '3px', fontSize: '13px' }}>
                                                    <input
                                                        id="empImage"
                                                        type="file"
                                                        accept=".gif,.jpg,.jpeg,.png,.bmp,.wmv"
                                                        onChange={this.onImageChange.bind(this)}
                                                    />
                                                </div>
                                            </Form.Field>
                                        </GridColumn>

                                    </Grid.Row>

                                    <Grid.Row style={{ marginBottom: '15px' }}>

                                        <GridColumn width={4}>
                                            <Form.Field>
                                                <Form.Field>
                                                    <label><font color="red">* </font>Gender:</label>
                                                </Form.Field>
                                                <Form.Field>
                                                    <div class="ui fluid segment" style={{ paddingTop: '9px', paddingBottom: '9px', marginTop: '-8px' }}>
                                                        <Radio
                                                            label='Male'
                                                            name='male'
                                                            value='Male'
                                                            checked={this.state.value === 'Male'}
                                                            onChange={this.handleChange}
                                                        />
                                                        <Radio
                                                            label='Female'
                                                            name='female'
                                                            value='Female'
                                                            style={{ marginLeft: '20px' }}
                                                            checked={this.state.value === 'Female'}
                                                            onChange={this.handleChange}
                                                        />
                                                    </div>
                                                </Form.Field>
                                            </Form.Field>
                                        </GridColumn>

                                        <Grid.Column width={12} textAlign="bottom" verticalAlign="right">
                                            <Button onClick={this.empInfo} color='red' style={{ marginTop: '30px' }}>CANCEL</Button>
                                            <Button onClick={this.personalInfoSubmit} style={{ backgroundColor: '#184fa2', color: '#bed4e1', marginLeft: '10px' }}>NEXT</Button>
                                        </Grid.Column>
                                    </Grid.Row>

                                </Grid>
                                : null}

                            {this.state.steps === 'Employment Information' && this.state.typeOfEmp === 'Fresher' ?
                                <Grid >
                                    <Grid.Row>
                                        <GridColumn>
                                            <Message style={{ padding: '5px', textAlign: 'center', marginTop: '-20px', marginBottom: '-8px' }} error content={this.state.errorMessage} />
                                        </GridColumn>
                                    </Grid.Row>

                                    <Grid.Row style={{ marginBottom: '15px' }}>
                                        <GridColumn width={4}>
                                            <Form.Field>
                                                <label><font color="red">* </font>Date Of Joining:</label>
                                                <div className="ui calendar" id="joiningdate">
                                                    <div className="ui input right icon">
                                                        <i className="calendar icon"></i>
                                                        <input
                                                            type="date"
                                                            placeholder="Enter Date Of Joining"
                                                            value={this.state.fromDate}
                                                            onChange={event =>
                                                                this.setState({ fromDate: event.target.value, errorMessage: '' })} />
                                                    </div>
                                                </div>
                                            </Form.Field>
                                        </GridColumn>

                                        <GridColumn width={4}>
                                            <Form.Field>
                                                <label>Relieving Date:</label>
                                                <div className="ui calendar" id="relievingdate">
                                                    <div className="ui input Right icon">
                                                        <i className="calendar icon"></i>
                                                        <input
                                                            type="date"
                                                            placeholder="Enter From Date"
                                                            value={this.state.relDate}
                                                            onChange={event =>
                                                                this.setState({ relDate: event.target.value, errorMessage: '' })} />
                                                    </div>
                                                </div>
                                            </Form.Field>
                                        </GridColumn>

                                        <GridColumn width={4}>
                                            <Form.Field>
                                                <label><font color="red">* </font>Employment Type:</label>
                                                <div>
                                                    <Dropdown style={{ backgroundColor: '#F1EDED' }}
                                                        selection
                                                        className='icon right'
                                                        fluid
                                                        labeled
                                                        icon='dropdown'
                                                        right='true'
                                                        options={empTypeOptions}
                                                        placeholder='Select Employment Type'
                                                        value={this.state.empType}
                                                        onChange={this.handleEmpTypeDropDown}
                                                    />
                                                </div>
                                            </Form.Field>
                                        </GridColumn>

                                        <GridColumn width={4}>
                                            <Form.Field>
                                                <label>Exit Type:</label>
                                                <div>
                                                    <Dropdown style={{ backgroundColor: '#F1EDED' }}
                                                        selection
                                                        className='icon right'
                                                        fluid
                                                        labeled
                                                        icon='dropdown'
                                                        right='true'
                                                        options={extTypeOptions}
                                                        placeholder='Select Exit Type'
                                                        value={this.state.extType}
                                                        onChange={this.handleExitTypeDropDown}
                                                    />
                                                </div>
                                            </Form.Field>
                                        </GridColumn>


                                    </Grid.Row>

                                    <Grid.Row>

                                        <GridColumn width={8}>
                                            <Form.Field>
                                                <label><font color="red">* </font>Technical Expertise:</label>
                                                <TextArea
                                                    style={{ height: '30px' }}
                                                    value={this.state.techExpertise}
                                                    placeholder='Enter Technical Expertise'
                                                    onChange={event =>
                                                        this.setState({ techExpertise: event.target.value, errorMessage: '' })}
                                                />
                                            </Form.Field>
                                        </GridColumn>

                                        <GridColumn width={4}>

                                            <Form.Field>
                                                <label><font color="red">* </font>Designation:</label>
                                                <div>
                                                    <Dropdown style={{ backgroundColor: '#F1EDED' }}
                                                        selection
                                                        className='icon right'
                                                        fluid
                                                        labeled
                                                        icon='dropdown'
                                                        right='true'
                                                        options={disignationOptions}
                                                        placeholder='Select Designation'
                                                        value={this.state.designation}
                                                        onChange={this.handledisignationDropDown}
                                                    />
                                                </div>
                                            </Form.Field>
                                        </GridColumn>

                                        <GridColumn width={4}>
                                            <Form.Field>
                                                <Form.Field>
                                                    <label><font color="red">* </font>Previous Employment Verified:</label>
                                                </Form.Field>
                                                <Form.Field>
                                                    <div class="ui fluid segment" style={{ paddingTop: '9px', paddingBottom: '9px', marginTop: '-8px' }}>
                                                        <Radio
                                                            label='Yes'
                                                            name='Yes'
                                                            values='Yes'
                                                            checked={this.state.values === 'Yes'}
                                                            onChange={this.handleFlagChange}
                                                        />
                                                        <Radio
                                                            label='No'
                                                            name='No'
                                                            values='No'
                                                            style={{ marginLeft: '20px' }}
                                                            checked={this.state.values === 'No'}
                                                            onChange={this.handleFlagChange}
                                                        />
                                                    </div>
                                                </Form.Field>
                                            </Form.Field>
                                        </GridColumn>
                                    </Grid.Row>

                                    <Grid.Row>
                                        <GridColumn width={16} textAlign="bottom" verticalAlign="right">
                                            <Button onClick={this.empInfo} color='red' style={{ marginTop: '30px' }}>CANCEL</Button>
                                            <Button onClick={this.empInfoSubmit} loading={this.state.loading} color='green' style={{ marginTop: '30px', marginLeft: '10px' }}>SAVE</Button>
                                        </GridColumn>
                                    </Grid.Row>
                                </Grid>
                                : null}

                            {this.state.steps === 'Personal Information' && this.state.typeOfEmp === 'Experienced' ?
                                <Grid >
                                    <Grid.Row>
                                        <GridColumn>
                                            <Message style={{ padding: '5px', textAlign: 'center', marginTop: '-20px', marginBottom: '-8px' }} error content={this.state.errorMessage} />
                                        </GridColumn>
                                    </Grid.Row>
                                    <Grid.Row style={{ marginBottom: '15px' }}>

                                        <GridColumn width={4}>
                                            <Form.Field>
                                                <label ><font color="red">* </font>Unique Employee Number:</label>
                                                <Input
                                                    list='euids'
                                                    value={this.state.empUEN}
                                                    onBlur={this.focusOut}
                                                    onChange={event =>
                                                        this.setState({ empUEN: event.target.value, errorMessage: '' })}
                                                    placeholder='Enter UEN' />
                                                <datalist id='euids'>
                                                    {this.state.uenList.map((euid) => {
                                                        return <option value={euid.emp_uid}></option>;
                                                    })}
                                                </datalist>

                                            </Form.Field>
                                        </GridColumn>
                                        <GridColumn width={4}>
                                            <Form.Field>
                                                <label ><font color="red">* </font> Employee Id:</label>
                                                <Input
                                                    value={this.state.empNumber}
                                                    placeholder='Enter Employee Id'
                                                    onChange={event =>
                                                        this.setState({ empNumber: event.target.value, errorMessage: '' })}
                                                />
                                            </Form.Field>
                                        </GridColumn>

                                        <GridColumn width={4}>
                                            <Form.Field>
                                                <label><font color="red">* </font>First Name:</label>
                                                <Input
                                                    disabled
                                                    value={this.state.firstName}
                                                    placeholder='Enter First Name'
                                                    onChange={event =>
                                                        this.setState({ firstName: event.target.value, errorMessage: '' })}
                                                />
                                            </Form.Field>
                                        </GridColumn>

                                        <GridColumn width={4}>
                                            <Form.Field>
                                                <label><font color="red">* </font>Last Name:</label>
                                                <Input
                                                    disabled
                                                    value={this.state.lastName}
                                                    placeholder='Enter Last Name'
                                                    onChange={event =>
                                                        this.setState({ lastName: event.target.value, errorMessage: '' })}
                                                />
                                            </Form.Field>
                                        </GridColumn>

                                    </Grid.Row>

                                    <Grid.Row style={{ marginBottom: '15px' }}>

                                        <GridColumn width={4}>
                                            <Form.Field>
                                                <label><font color="red">* </font>Father Name:</label>
                                                <Input
                                                    disabled
                                                    value={this.state.fatherName}
                                                    placeholder='Enter Father Name'
                                                    onChange={event =>
                                                        this.setState({ fatherName: event.target.value, errorMessage: '' })}
                                                />
                                            </Form.Field>
                                        </GridColumn>

                                        <GridColumn width={4}>
                                            <Form.Field>
                                                <label><font color="red">* </font>Date of Birth:</label>
                                                <div className="ui calendar" id="dob">
                                                    <div className="ui input right icon">
                                                        <i className="calendar icon"></i>
                                                        <input
                                                            disabled
                                                            type="date"
                                                            placeholder="Enter Date of Birth"
                                                            value={this.state.dateOfBirth}
                                                            onChange={event =>
                                                                this.setState({ dateOfBirth: event.target.value, errorMessage: '' })} />
                                                    </div>
                                                </div>
                                            </Form.Field>
                                        </GridColumn>

                                        <GridColumn width={4}>
                                            <Form.Field>
                                                <Form.Field>
                                                    <label><font color="red">* </font>Gender:</label>
                                                </Form.Field>
                                                <Form.Field>
                                                    <div class="ui fluid segment" style={{ paddingTop: '9px', paddingBottom: '9px', marginTop: '-8px' }}>
                                                        <Radio
                                                            disabled
                                                            label='Male'
                                                            name='male'
                                                            value='Male'
                                                            checked={this.state.value === 'Male'}
                                                            onChange={this.handleChange}
                                                        />
                                                        <Radio
                                                            disabled
                                                            label='Female'
                                                            name='female'
                                                            value='Female'
                                                            style={{ marginLeft: '20px' }}
                                                            checked={this.state.value === 'Female'}
                                                            onChange={this.handleChange}
                                                        />
                                                    </div>
                                                </Form.Field>
                                            </Form.Field>
                                        </GridColumn>

                                        {this.state.imgIpfsHash === '' ?
                                            <GridColumn width={4}>
                                                <Form.Field>
                                                    <label>Employee Photo:</label>
                                                    <div class="ui fluid segment" style={{ paddingTop: '9px', paddingBottom: '9px', marginTop: '3px', fontSize: '13px' }}>
                                                        <input
                                                            id="empImage"
                                                            type="file"
                                                            accept=".gif,.jpg,.jpeg,.png,.bmp,.wmv"
                                                            onChange={this.onImageChange.bind(this)}
                                                        />
                                                    </div>
                                                </Form.Field>
                                            </GridColumn>
                                            : null}
                                        {this.state.imgIpfsHash !== '' ?
                                            <Grid.Column width={4}>
                                                <Form.Field>
                                                    <label>Employee Photo:</label>
                                                </Form.Field>
                                                <Form.Field>
                                                    <Image style={{ marginTop: '-10px' }} src={this.state.imgUrl} size='tiny' />
                                                </Form.Field>
                                            </Grid.Column>
                                            : null}

                                    </Grid.Row>

                                    <Grid.Row style={{ marginBottom: '15px' }}>
                                        <Grid.Column width={16} textAlign="bottom" verticalAlign="right">
                                            <Button onClick={this.empInfo} color='red' style={{ marginTop: '30px' }}>CANCEL</Button>
                                            <Button onClick={this.personalInfoSubmit} style={{ backgroundColor: '#184fa2', color: '#bed4e1', marginLeft: '10px' }}>NEXT</Button>
                                        </Grid.Column>
                                    </Grid.Row>

                                </Grid>
                                : null}

                            {this.state.steps === 'Employment Information' && this.state.typeOfEmp === 'Experienced' ?
                                <Grid >
                                    <Grid.Row>
                                        <GridColumn>
                                            <Message style={{ padding: '5px', textAlign: 'center', marginTop: '-20px', marginBottom: '-8px' }} error content={this.state.errorMessage} />
                                        </GridColumn>
                                    </Grid.Row>

                                    <Grid.Row style={{ marginBottom: '15px' }}>
                                        <GridColumn width={4}>
                                            <Form.Field>
                                                <label><font color="red">* </font>Date Of Joining:</label>
                                                <div className="ui calendar" id="joiningdate">
                                                    <div className="ui input right icon">
                                                        <i className="calendar icon"></i>
                                                        <input
                                                            type="date"
                                                            placeholder="Enter Date Of Joining"
                                                            value={this.state.fromDate}
                                                            onChange={event =>
                                                                this.setState({ fromDate: event.target.value, errorMessage: '' })} />
                                                    </div>
                                                </div>
                                            </Form.Field>
                                        </GridColumn>

                                        <GridColumn width={4}>
                                            <Form.Field>
                                                <label>Relieving Date:</label>
                                                <div className="ui calendar" id="relievingdate">
                                                    <div className="ui input Right icon">
                                                        <i className="calendar icon"></i>
                                                        <input
                                                            type="date"
                                                            placeholder="Enter From Date"
                                                            value={this.state.relDate}
                                                            onChange={event =>
                                                                this.setState({ relDate: event.target.value, errorMessage: '' })} />
                                                    </div>
                                                </div>
                                            </Form.Field>
                                        </GridColumn>

                                        <GridColumn width={4}>
                                            <Form.Field>
                                                <label><font color="red">* </font>Employment Type:</label>
                                                <div>
                                                    <Dropdown style={{ backgroundColor: '#F1EDED' }}
                                                        selection
                                                        className='icon right'
                                                        fluid
                                                        labeled
                                                        icon='dropdown'
                                                        right='true'
                                                        options={empTypeOptions}
                                                        placeholder='Select Employment Type'
                                                        value={this.state.empType}
                                                        onChange={this.handleEmpTypeDropDown}
                                                    />
                                                </div>
                                            </Form.Field>
                                        </GridColumn>

                                        <GridColumn width={4}>
                                            <Form.Field>
                                                <label>Exit Type:</label>
                                                <div>
                                                    <Dropdown style={{ backgroundColor: '#F1EDED' }}
                                                        selection
                                                        className='icon right'
                                                        fluid
                                                        labeled
                                                        icon='dropdown'
                                                        right='true'
                                                        options={extTypeOptions}
                                                        placeholder='Select Exit Type'
                                                        value={this.state.extType}
                                                        onChange={this.handleExitTypeDropDown}
                                                    />
                                                </div>
                                            </Form.Field>
                                        </GridColumn>


                                    </Grid.Row>

                                    <Grid.Row>
                                        <GridColumn width={4}>
                                            <Form.Field>
                                                <label><font color="red">* </font>Qualification:</label>
                                                <Input
                                                    value={this.state.qualification}
                                                    placeholder='Enter Qualification'
                                                    onChange={event =>
                                                        this.setState({ qualification: event.target.value, errorMessage: '' })}
                                                />
                                            </Form.Field>
                                        </GridColumn>


                                        <GridColumn width={4}>

                                            <Form.Field>
                                                <label><font color="red">* </font>Designation:</label>
                                                <div>
                                                    <Dropdown style={{ backgroundColor: '#F1EDED' }}
                                                        selection
                                                        className='icon right'
                                                        fluid
                                                        labeled
                                                        icon='dropdown'
                                                        right='true'
                                                        options={disignationOptions}
                                                        placeholder='Select Designation'
                                                        value={this.state.designation}
                                                        onChange={this.handledisignationDropDown}
                                                    />
                                                </div>
                                            </Form.Field>
                                        </GridColumn>

                                        <GridColumn width={4}>
                                            <Form.Field>
                                                <label><font color="red">* </font>Aadhar No:</label>
                                                <Input
                                                    value={this.state.panNo}
                                                    placeholder='Enter Aadhar No'
                                                    onChange={event =>
                                                        this.setState({ panNo: event.target.value, errorMessage: '' })}
                                                />
                                            </Form.Field>
                                        </GridColumn>

                                        <GridColumn width={4}>
                                            <Form.Field>
                                                <Form.Field>
                                                    <label><font color="red">* </font>Previous Employment Verified:</label>
                                                </Form.Field>
                                                <Form.Field>
                                                    <div class="ui fluid segment" style={{ paddingTop: '9px', paddingBottom: '9px', marginTop: '-8px' }}>
                                                        <Radio
                                                            label='Yes'
                                                            name='Yes'
                                                            values='Yes'
                                                            checked={this.state.values === 'Yes'}
                                                            onChange={this.handleFlagChange}
                                                        />
                                                        <Radio
                                                            label='No'
                                                            name='No'
                                                            values='No'
                                                            style={{ marginLeft: '20px' }}
                                                            checked={this.state.values === 'No'}
                                                            onChange={this.handleFlagChange}
                                                        />
                                                    </div>
                                                </Form.Field>
                                            </Form.Field>
                                        </GridColumn>
                                    </Grid.Row>

                                    <Grid.Row>
                                        <GridColumn width={8}>
                                            <Form.Field>
                                                <label><font color="red">* </font>Technical Expertise:</label>
                                                <TextArea
                                                    style={{ height: '30px' }}
                                                    value={this.state.techExpertise}
                                                    placeholder='Enter Technical Expertise'
                                                    onChange={event =>
                                                        this.setState({ techExpertise: event.target.value, errorMessage: '' })}
                                                />
                                            </Form.Field>
                                        </GridColumn>

                                        <GridColumn width={8} textAlign="bottom" verticalAlign="right">
                                            <Button onClick={this.empInfo} color='red' style={{ marginTop: '30px' }}>CANCEL</Button>
                                            <Button onClick={this.empInfoSubmit} loading={this.state.loading} color='green' style={{ marginTop: '30px' }}>SAVE</Button>
                                        </GridColumn>
                                    </Grid.Row>
                                </Grid>
                                : null}
                        </Form>
                        <Dimmer active={active} inverted >
                            <Loader content='Loading..' />
                        </Dimmer>
                        <Modal style={{ width: '500px', marginLeft: '-275px', marginTop: '-95px' }} open={this.state.modalOpen}
                            onClose={this.handleClose}>
                            <Modal.Content>
                                <p>Do you want to add employee record?</p>
                            </Modal.Content>
                            <Modal.Actions>
                                <Button negative onClick={this.handleClose}>No</Button>
                                <Button positive onClick={this.uploadImageToIpfs}>Yes</Button>
                            </Modal.Actions>
                        </Modal>
                    </div>
                    {/* <Footer /> */}
                </Layout >
            )
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

const empTypeOptions = [
    { key: 'Permanent', text: 'Permanent', value: '1' },
    { key: 'Temporary', text: 'Temporary', value: '2' },
    { key: 'Contract', text: 'Contract', value: '3' },
]

const extTypeOptions = [
    { key: 'N/A', text: 'N/A', value: '0' },
    { key: 'Normal', text: 'Normal', value: '1' },
    { key: 'Terminated', text: 'Terminated', value: '2' },
    { key: 'Absconding', text: 'Absconding', value: '3' },
]

const disignationOptions = [
    { key: 'Associate', text: 'Associate', value: '1' },
    { key: 'Software Engineer', text: 'Software Engineer', value: '2' },
    { key: 'Senior Software Engineer', text: 'Senior Software Engineer', value: '3' },
    { key: 'Team Lead ', text: 'Team Lead ', value: '4' },
    { key: 'Project Manager', text: 'Project Manager', value: '5' },
    { key: 'Senior Project Manager', text: 'Senior Project Manager', value: '6' },
    { key: 'Deputy General Manager', text: 'Deputy General Manager', value: '7' },
    { key: 'General Manager', text: 'General Manager', value: '8' },
    { key: 'Associate Director', text: 'Associate Director', value: '9' },
    { key: 'Director', text: 'Director', value: '10' },
]
export default AddEmployee;