import React, { Component } from 'react';
import { Step, Form, Button, Image, Input, Message, Radio, Grid, Modal, TextArea, Dimmer, Loader, Dropdown } from 'semantic-ui-react'
import Layout from "../components/Layout";
import moment from 'moment';
import axios from 'axios';
import logo from '../images/header-left.png';
import Footer from '../components/Footer'

const ipfsPrefixUrl = 'https://gateway.ipfs.io/ipfs/';
require('../styles.css');

class EditEmployee extends Component {

    state = {
        empUEN: '',
        empNumber: '',
        firstName: '',
        lastName: '',
        fatherName: '',
        dateOfBirth: '',
        qualification: '',
        panNo: '',
        designation: '',
        empName: '',
        fromDate: '',
        value: '',
        relDate: '',
        empType: '',
        extType: '',
        techExpertise: '',
        imgUrl: '',
        docUrl: '',
        loading: false,
        errorMessage: '',
        currentDate: new Date(),
        modalOpen: false,
        imgIpfsHash: '',
        docIpfsHash: '',
        user: '',
        bc_count: 0,
        steps: '',
        values: '',
        recordsCount: 0,
        typeOfEmp: '',
        uenList: [],
        duplicateEmp: false,
        empEditInfo: [],
        editInfo: false,
        bc_published_date : ''
    };

    handleClick = (e, { title }) => {
        if (title === "Employment Information") {
            this.personalInfoSubmit();
        } else {
            this.setState({ steps: title });
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
        this.setState({ empType: data.value });
    }

    handleExitTypeDropDown = (e, data) => {
        this.setState({ extType: data.value });
    }

    handledisignationDropDown = (e, data) => {
        this.setState({ designation: data.value, errorMessage: '' });
    }

    async componentDidMount() {
        document.body.style.backgroundColor = "#e5e7f4";
        if (this.props.location.state !== 'undefined' && this.props.location.state !== undefined) {
            this.setState({ user: this.props.location.state.role });
            this.setState({ steps: 'Personal Information' });
            this.getEmpData();
        }
    }

    /**
    * This method is used to fetch the selected employee data from the database
    */
    getEmpData() {
        var url = 'http://ec2-3-84-93-231.compute-1.amazonaws.com:3210/data/' + this.props.location.state.emp_id + '/' + this.props.location.state.companyName;
        axios.get(url).then((empData) => {
            console.log(empData.data);
            if (empData.data.length > 0) {
                this.setState({ empEditInfo: empData.data[0] });
                if (empData.data[0].emp_uid !== null) {
                    this.setState({ empUEN: empData.data[0].emp_uid });
                }
                if (empData.data[0].emp_id !== null) {
                    this.setState({ empNumber: empData.data[0].emp_id });
                }
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
                if (empData.data[0].date_of_joining !== null) {
                    this.setState({ fromDate: moment(empData.data[0].date_of_joining).format('YYYY-MM-DD') });
                }
                if (empData.data[0].bc_published_date !== null) {
                    this.setState({ bc_published_date: moment(empData.data[0].bc_published_date).format('YYYY-MM-DD') });
                }
                if (empData.data[0].relieving_date !== null && empData.data[0].relieving_date !== undefined) {
                    this.setState({ relDate: empData.data[0].relieving_date });
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
                if (empData.data[0].bc_count !== null) {
                    this.setState({ bc_count: empData.data[0].bc_count });
                }
                if (empData.data[0].tech_expertise !== null) {
                    this.setState({ techExpertise: empData.data[0].tech_expertise });
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
                if (empData.data[0].bc_count !== null) {
                    this.setState({ bc_count: empData.data[0].bc_count });
                }
                if (empData.data[0].flag_verification !== null && empData.data[0].flag_verification !== undefined && (empData.data[0].flag_verification === 1 || empData.data[0].flag_verification === '1')) {
                    this.setState({ values: 'Yes' });
                } else if (empData.data[0].flag_verification !== null && empData.data[0].flag_verification !== undefined && (empData.data[0].flag_verification === 2 || empData.data[0].flag_verification === '2')) {
                    this.setState({ values: 'No' });
                }
            }
        })
    }

    /**
   * This method is used to check employee record duplication.
   */
    checkDuplicateRecord = async event => {
        var url = '';
        const { firstName, lastName, fatherName, value, dateOfBirth, panNo } = this.state;
        if (value === 'Male') {
            url = 'http://ec2-3-84-93-231.compute-1.amazonaws.com:3210/checkDuplicate/' + firstName + '/' + lastName + '/' + fatherName + '/1/' + dateOfBirth + '/' + panNo;
        } else {
            url = 'http://ec2-3-84-93-231.compute-1.amazonaws.com:3210/checkDuplicate/' + firstName + '/' + lastName + '/' + fatherName + '/2/' + dateOfBirth + '/' + panNo;
        }
        axios.get(url)
            .then((empData) => {
                if (empData.data.length > 0 && (empData.data[0].emp_uid !== this.state.empUEN)) {
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

    personalInfoSubmit = async event => {
        const { empUEN, empNumber, extEmpId, firstName, lastName, fatherName, dateOfBirth, currentDate, qualification, panNo, value } = this.state;
        if (empUEN === "") {
            this.setState({ errorMessage: 'Unique Employee Number should not be blank' })
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
        const { fromDate, relDate, empType, extType, techExpertise, currentDate, designation, values } = this.state;

        var prevDOBFormat = moment(this.state.empEditInfo.date_of_birth).format('YYYY-MMM-DD');
        var currentDOBFormat = moment(this.state.dateOfBirth).format('YYYY-MMM-DD');
        var prevDOJFormat = moment(this.state.empEditInfo.date_of_joining).format('YYYY-MMM-DD');
        var currentDOJFormat = moment(this.state.fromDate).format('YYYY-MMM-DD');
        var prevRelFormat = moment(this.state.empEditInfo.relieving_date).format('YYYY-MMM-DD');
        var currentRelFormat = moment(this.state.relDate).format('YYYY-MMM-DD');

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
        } else if (this.state.duplicateEmp === true) {
            this.setState({ errorMessage: 'Employee with this details already exists.' })
        } else if ((this.state.empEditInfo.emp_fname !== this.state.firstName) ||
            (this.state.empEditInfo.emp_lname !== this.state.lastName) ||
            (this.state.empEditInfo.emp_fathername !== this.state.fatherName) ||
            (prevDOBFormat !== currentDOBFormat) ||
            (this.state.empEditInfo.qualification !== this.state.qualification) ||
            (this.state.empEditInfo.pan_number !== this.state.panNo) ||
            (this.state.empEditInfo.emp_avatar !== this.state.imgIpfsHash) ||
            ((this.state.empEditInfo.gender === '1' || this.state.empEditInfo.gender === 1) && this.state.value !== 'Male') ||
            ((this.state.empEditInfo.gender === '2' || this.state.empEditInfo.gender === 2) && this.state.value !== 'Female') ||
            (prevDOJFormat !== currentDOJFormat) || (prevRelFormat !== currentRelFormat) ||
            ((this.state.empEditInfo.emp_type === '1' || this.state.empEditInfo.emp_type === 1) && this.state.empType !== 'Permanent') ||
            ((this.state.empEditInfo.emp_type === '2'  || this.state.empEditInfo.emp_type === 2) && this.state.empType !== 'Temporary') ||
            ((this.state.empEditInfo.emp_type === '3'  || this.state.empEditInfo.emp_type === 3) && this.state.empType !== 'Contract') ||
            ((this.state.empEditInfo.exit_type === '0' || this.state.empEditInfo.exit_type === 0) && this.state.extType !== 'N/A') ||
            ((this.state.empEditInfo.exit_type === '1' || this.state.empEditInfo.exit_type === 1) && this.state.extType !== 'Normal') ||
            ((this.state.empEditInfo.exit_type === '2' || this.state.empEditInfo.exit_type === 2) && this.state.extType !== 'Terminated') ||
            ((this.state.empEditInfo.exit_type === '3' || this.state.empEditInfo.exit_type === 3) && this.state.extType !== 'Absconding') ||
            (this.state.empEditInfo.tech_expertise !== this.state.techExpertise) ||
            (this.state.empEditInfo.designation === '1' && this.state.designation !== 'Associate') ||
            (this.state.empEditInfo.designation === '2' && this.state.designation !== 'Software Engineer') ||
            (this.state.empEditInfo.designation === '3' && this.state.designation !== 'Senior Software Engineer') ||
            (this.state.empEditInfo.designation === '4' && this.state.designation !== 'Team Lead') ||
            (this.state.empEditInfo.designation === '5' && this.state.designation !== 'Project Manager') ||
            (this.state.empEditInfo.designation === '6' && this.state.designation !== 'Senior Project Manager') ||
            (this.state.empEditInfo.designation === '7' && this.state.designation !== 'Deputy General Manager') ||
            (this.state.empEditInfo.designation === '8' && this.state.designation !== 'General Manager') ||
            (this.state.empEditInfo.designation === '9' && this.state.designation !== 'Associate Director') ||
            (this.state.empEditInfo.designation === '10' && this.state.designation !== 'Director') ||
            ((this.state.empEditInfo.flag_verification === '1' || this.state.empEditInfo.flag_verification === 1) && this.state.values !== 'Yes') ||
            ((this.state.empEditInfo.flag_verification === '2' || this.state.empEditInfo.flag_verification === 2) && this.state.values !== 'No')) {
            
            this.setState({ editInfo: true });
            this.state.flag = 'true';
            this.handleOpen();
        } else {
            this.setState({ loading: false, errorMessage: '' });
            this.setState({ errorMessage: 'Please update any information' });
        }
    };

    /**
    * This method is used to handle submit button.
    */
    onSubmit = async event => {
        setTimeout(async event => {
            const { empNumber, empName, value, fromDate, relDate, empType, extType, techExpertise, values } = this.state;
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
            } else if (moment(this.state.currentDate).format('YYYY-MM-DD') < moment(this.state.fromDate).format('YYYY-MM-DD')) {
                this.setState({ errorMessage: 'Date Of Joining should not be greater than current date' })
            } else if (relDate !== "" && moment(this.state.currentDate).format('YYYY-MM-DD') < moment(this.state.relDate).format('YYYY-MM-DD')) {
                this.setState({ errorMessage: 'Relieving Date should not be greater than current date' })
            } else if (relDate !== "" && moment(this.state.fromDate).format('YYYY-MM-DD') > moment(this.state.relDate).format('YYYY-MM-DD')) {
                this.setState({ errorMessage: 'Relieving Date should not be Less than Date Of Joining' })
            } else if (empType === "") {
                this.setState({ errorMessage: 'Employment Type should not be blank' })
            } else if (relDate !== "" && extType === 'N/A') {
                this.setState({ errorMessage: 'Please be select Exit Type other than N/A' })
            } else if (relDate !== "" && extType === "") {
                this.setState({ errorMessage: 'Exit Type should not be blank' })
            } else if ((relDate === "" && extType === "Terminated") || (relDate === "" && extType === "Normal") || (relDate === "" && extType === "Absconding")) {
                this.setState({ errorMessage: 'Relieving Date should not be blank else selct ExitType N/A' })
            } else if (techExpertise === "") {
                this.setState({ errorMessage: 'Technical Expertise should not be blank' })
            } else if (values === "") {
                this.setState({ errorMessage: 'Please select Previous Employment Verified' })
            } else if (!techExpertise.match(/^([\w\-,.+()-\s]{1,256})$/)) {
                this.setState({ errorMessage: 'Technical Expertise may only contain alphanumerics and (-,.+)' })
            } else {
                this.setState({ loading: false, errorMessage: '' });
                this.state.flag = 'true';
                this.handleOpen();
                this.loadingHide();
            }
        }, 1000)
    }

    /**
     * This method is used to handle the updating employee data in database.
     */
    updateEmployeeData = async () => {
        this.state.modalOpen = false;
        const { empUEN, empNumber, firstName, lastName, fatherName, dateOfBirth, qualification, panNo, value, fromDate, relDate, empType, extType, techExpertise, designation, values } = this.state;
        this.setState({ loading: true, errorMessage: '' });
        this.loadingShow();
        if (this.state.flag === 'true') {
            if (relDate === "" && (extType !== 'N/A')) {
                this.state.extType = '0';
            } else if (extType === 'N/A') {
                this.state.extType = '0';
            } else if (extType === 'Normal') {
                this.state.extType = '1';
            } else if (extType === 'Terminated') {
                this.state.extType = '2';
            } else if (extType === 'Absconding') {
                this.state.extType = '3';
            } else{
            }
            this.state.flag = 'false';
        }

        if (value === "Male") {
            this.state.value = "1";
        } else if (value === "Female") {
            this.state.value = "2";
        }

        if (empType === "Permanent") {
            this.state.empType = "1";
        } else if (empType === "Temporary") {
            this.state.empType = "2";
        } else if (empType === "Contract") {
            this.state.empType = "3";
        }

        if (designation === "Associate") {
            this.state.designation = "1";
        } else if (designation === "Software Engineer") {
            this.state.designation = "2";
        } else if (designation === "Senior Software Engineer") {
            this.state.designation = "3";
        } else if (designation === "Team Lead") {
            this.state.designation = "4";
        } else if (designation === "Project Manager") {
            this.state.designation = "5";
        } else if (designation === "Senior Project Manager") {
            this.state.designation = "6";
        } else if (designation === "Deputy General Manager") {
            this.state.designation = "7";
        } else if (designation === "General Manager") {
            this.state.designation = "8";
        } else if (designation === "Associate Director") {
            this.state.designation = "9";
        } else if (designation === "Director") {
            this.state.designation = "10";
        }

        if (values === "Yes") {
            this.state.values = "1";
        } else if (values === "No") {
            this.state.values = "2";
        }

        var url = 'http://ec2-3-84-93-231.compute-1.amazonaws.com:3210/UpdateReq/' + this.props.location.state.emp_id + '/' + this.props.location.state.companyName;
        axios.post(url, {
            emp_uid: empUEN,
            emp_id: empNumber,
            emp_fname: firstName,
            emp_lname: lastName,
            emp_fathername: fatherName,
            emp_avatar: this.state.imgIpfsHash,
            gender: this.state.value,
            date_of_birth: dateOfBirth,
            qualification: qualification,
            pan_number: panNo,
            date_of_joining: fromDate,
            relieving_date: relDate,
            emp_type: this.state.empType,
            exit_type: this.state.extType,
            designation: this.state.designation,
            tech_expertise: techExpertise,
            flag_verification: this.state.values,
            mgmt_status: 0,
            mgr_status: 0,
            bc_status: 0,
            comp_id: this.props.location.state.companyName,
            bc_count: this.state.bc_count,
            created_date: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
            modified_date: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
            bc_published_date:this.state.bc_published_date

        }).then(function (response) {
            console.log(response);
        }).catch(function (error) {
            console.log(error);
        });
        this.empInfo();
        this.setState({ loading: false });
        this.loadingHide();
    }

    /**
     * This method is used to check user avatar is available or not.
     */
    imageAvailable() {
        if (this.state.imgUrl !== "" && this.state.imgUrl !== 'https://gateway.ipfs.io/ipfs/') {
            return false;
        } else {
            return true;
        }
    }

    /**
     * This method is used to handle Employee data page navigation.
     */
    empInfo = () => {
        this.props.history.push({
            pathname: `/EmpInfo`,
            state: { loginCompany: this.props.location.state.loginCompany, companyName: this.props.location.state.companyName, role: this.props.location.state.role, selectedIndex: this.props.location.state.selectedIndex }
        })
    }

    /**
     * This method is used to handle logout button navigation.
     */
    logout = () => {
        this.props.history.push(`/`);
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
                        {/* <h3 style={{ display: 'inline-block', marginLleft: '-10px' }}>Edit Employee</h3> */}
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
                            {this.state.steps === 'Personal Information' ?
                                <Grid >
                                    <Grid.Row>
                                        <Grid.Column>
                                            <Message style={{ padding: '5px', textAlign: 'center', marginTop: '-20px', marginBottom: '-8px' }} error content={this.state.errorMessage} />
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row style={{ marginBottom: '15px' }}>

                                        <Grid.Column width={4}>
                                            <Form.Field>
                                                <label ><font color="red">* </font>Unique Employee Number:</label>
                                                <Input
                                                    disabled
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
                                        </Grid.Column>
                                        <Grid.Column width={4}>
                                            <Form.Field>
                                                <label ><font color="red">* </font> Employee Id:</label>
                                                <Input
                                                    disabled
                                                    value={this.state.empNumber}
                                                    placeholder='Enter Employee Id'
                                                    onChange={event =>
                                                        this.setState({ empNumber: event.target.value, errorMessage: '' })}
                                                />
                                            </Form.Field>
                                        </Grid.Column>

                                        <Grid.Column width={4}>
                                            <Form.Field>
                                                <label><font color="red">* </font>First Name:</label>
                                                <Input
                                                    value={this.state.firstName}
                                                    placeholder='Enter First Name'
                                                    onChange={event =>
                                                        this.setState({ firstName: event.target.value, errorMessage: '' })}
                                                />
                                            </Form.Field>
                                        </Grid.Column>

                                        <Grid.Column width={4}>
                                            <Form.Field>
                                                <label><font color="red">* </font>Last Name:</label>
                                                <Input
                                                    value={this.state.lastName}
                                                    placeholder='Enter Last Name'
                                                    onChange={event =>
                                                        this.setState({ lastName: event.target.value, errorMessage: '' })}
                                                />
                                            </Form.Field>
                                        </Grid.Column>

                                    </Grid.Row>

                                    <Grid.Row style={{ marginBottom: '15px' }}>

                                        <Grid.Column width={4}>
                                            <Form.Field>
                                                <label><font color="red">* </font>Father Name:</label>
                                                <Input
                                                    value={this.state.fatherName}
                                                    placeholder='Enter Father Name'
                                                    onChange={event =>
                                                        this.setState({ fatherName: event.target.value, errorMessage: '' })}
                                                />
                                            </Form.Field>
                                        </Grid.Column>

                                        <Grid.Column width={4}>
                                            <Form.Field>
                                                <label><font color="red">* </font>Date of Birth:</label>
                                                <div className="ui calendar" id="dob">
                                                    <div className="ui input right icon">
                                                        <i className="calendar icon"></i>
                                                        <input style={{ height: '35px' }}
                                                            type="date"
                                                            placeholder="Enter Date of Birth"
                                                            value={this.state.dateOfBirth}
                                                            onChange={event =>
                                                                this.setState({ dateOfBirth: event.target.value, errorMessage: '' })} />
                                                    </div>
                                                </div>
                                            </Form.Field>
                                        </Grid.Column>

                                        <Grid.Column width={4}>
                                            <Form.Field>
                                                <label><font color="red">* </font>Qualification:</label>
                                                <Input
                                                    value={this.state.qualification}
                                                    placeholder='Enter Qualification'
                                                    onChange={event =>
                                                        this.setState({ qualification: event.target.value, errorMessage: '' })}
                                                />
                                            </Form.Field>
                                        </Grid.Column>

                                        <Grid.Column width={4}>
                                            <Form.Field>
                                                <label><font color="red">* </font>Aadhar No:</label>
                                                <Input
                                                    value={this.state.panNo}
                                                    placeholder='Enter Aadhar No'
                                                    onChange={event =>
                                                        this.setState({ panNo: event.target.value, errorMessage: '' })}
                                                />
                                            </Form.Field>
                                        </Grid.Column>

                                    </Grid.Row>

                                    <Grid.Row style={{ marginBottom: '15px' }}>

                                        <Grid.Column width={4}>
                                            <Form.Field>
                                                <label>Employee Photo:</label>
                                            </Form.Field>
                                            <Form.Field>
                                                <Image style={{ marginTop: '-10px' }} src={this.state.imgUrl} size='tiny' />
                                            </Form.Field>
                                        </Grid.Column>

                                        <Grid.Column width={4}>
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
                                        </Grid.Column>

                                        <Grid.Column width={8} textAlign="bottom" verticalAlign="right">
                                        <Button onClick={this.empInfo} color='red' style={{ marginTop: '30px' }}>CANCEL</Button>
                                            <Button onClick={this.personalInfoSubmit} style={{ backgroundColor: '#184fa2', color: '#bed4e1', marginLeft: '10px' }}>NEXT</Button>
                                        </Grid.Column>
                                    </Grid.Row>

                                </Grid>

                                : null}

                            {this.state.steps === 'Employment Information' ?
                                <Grid >
                                    <Grid.Row>
                                        <Grid.Column>
                                            <Message style={{ padding: '5px', textAlign: 'center', marginTop: '-20px', marginBottom: '-8px' }} error content={this.state.errorMessage} />
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row style={{ marginBottom: '15px' }}>
                                        <Grid.Column width={4}>
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
                                        </Grid.Column>

                                        <Grid.Column width={4}>
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
                                        </Grid.Column>

                                        <Grid.Column width={4}>
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
                                        </Grid.Column>

                                        <Grid.Column width={4}>
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
                                        </Grid.Column>
                                    </Grid.Row>

                                    <Grid.Row>

                                        <Grid.Column width={8}>
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
                                        </Grid.Column>

                                        <Grid.Column width={4}>

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
                                        </Grid.Column>

                                        <Grid.Column width={4}>
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
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row>
                                        <Grid.Column width={16} textAlign="bottom" verticalAlign="right">
                                            <Button onClick={this.empInfo} color='red' style={{ marginTop: '30px' }}>CANCEL</Button>
                                            <Button onClick={this.empInfoSubmit} loading={this.state.loading} color='green' style={{ marginLeft: '10px', marginTop: '30px' }}>UPDATE</Button>
                                        </Grid.Column>
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
                                <p>Do you want to update employee record?</p>
                            </Modal.Content>
                            <Modal.Actions>
                                <Button negative onClick={this.handleClose}>No</Button>
                                <Button positive onClick={this.updateEmployeeData}>Yes</Button>
                            </Modal.Actions>
                        </Modal>
                    </div>
                    <Footer />
                </Layout>
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
    { key: 'Permanent', text: 'Permanent', value: 'Permanent' },
    { key: 'Temporary', text: 'Temporary', value: 'Temporary' },
    { key: 'Contract', text: 'Contract', value: 'Contract' },
]

const extTypeOptions = [
    { key: 'N/A', text: 'N/A', value: 'N/A' },
    { key: 'Normal', text: 'Normal', value: 'Normal' },
    { key: 'Terminated', text: 'Terminated', value: 'Terminated' },
    { key: 'Absconding', text: 'Absconding', value: 'Absconding' },
]

const disignationOptions = [
    { key: 'Associate', text: 'Associate', value: 'Associate' },
    { key: 'Software Engineer', text: 'Software Engineer', value: 'Software Engineer' },
    { key: 'Senior Software Engineer', text: 'Senior Software Engineer', value: 'Senior Software Engineer' },
    { key: 'Team Lead ', text: 'Team Lead', value: 'Team Lead' },
    { key: 'Project Manager', text: 'Project Manager', value: 'Project Manager' },
    { key: 'Senior Project Manager', text: 'Senior Project Manager', value: 'Senior Project Manager' },
    { key: 'Deputy General Manager', text: 'Deputy General Manager', value: 'Deputy General Manager' },
    { key: 'General Manager', text: 'General Manager', value: 'General Manager' },
    { key: 'Associate Director', text: 'Associate Director', value: 'Associate Director' },
    { key: 'Director', text: 'Director', value: 'Director' },
]
export default EditEmployee;