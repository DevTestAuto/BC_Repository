import React, { Component } from 'react';
import { Table, Image } from 'semantic-ui-react';
import moment from 'moment';
import ConstantsList from "../constants/address.js";
import axios from 'axios';

const ipfsPrefixUrl = 'https://gateway.ipfs.io/ipfs/';
/**
 * This class is used to create a row based on the request.
 */
class BlockChainData extends Component {

    state = {
        maxCount: 0
    }

    /**
      * This method is used to handle the rendering of relieving date
      */
    renderRelDate() {
        const { employee } = this.props;
        if (employee.relieving_date === "") {
            return ("-");
        } else {
            return (moment(employee.relieving_date).format('DD-MMM-YYYY'));
        }
    }

    /**
    * This method is used to handle the applying colors to the employee exit type
    */
    renderColor() {
        const { employee } = this.props;

        if (employee.exit_type === "Normal") {
            return 'green';
        } else if (employee.exit_type === "Absconding") {
            return 'orange';
        } else if (employee.exit_type === "Terminated") {
            return 'red';
        } else {
            return 'blue';
        }
    }

    /**
     * This method is used to handle the rendering of previous employment verified
     */
    renderVerification(employee) {
        const { Cell } = Table;
        if (employee.flag_verification !== "" && employee.flag_verification !== " " && employee.flag_verification !== null) {
            if (employee.flag_verification === '2' || employee.flag_verification === 2) {
                return (
                    <Cell textAlign="center" singleLine style={{ color: 'red' }}>No</Cell>
                );
            } else {
                return (
                    <Cell textAlign="center" singleLine style={{ color: 'green' }}>Yes</Cell>
                );
            }
        } else {
            return (
                <Cell textAlign="center" singleLine>  - </Cell>
            );
        }
    }

    /**
       * This method is used to handle the rendering of exit type
       */
    renderExitType(employee) {
        const { Cell } = Table;
        if (employee.exit_type !== "" && employee.exit_type !== " " && employee.exit_type !== null) {
            if (employee.exit_type === 1) {
                return (
                    <Cell textAlign="center" singleLine style={{ color: 'green' }}>Normal</Cell>
                );
            } else if (employee.exit_type === 2) {
                return (
                    <Cell textAlign="center" singleLine style={{ color: 'orange' }}>Terminated</Cell>
                );
            } else if (employee.exit_type === 3) {
                return (
                    <Cell textAlign="center" singleLine style={{ color: 'red' }}>Absconding</Cell>
                );
            } else {
                return (
                    <Cell textAlign="center" singleLine style={{ color: 'blue' }}>N/A</Cell>
                );
            }
        } else {
            return (
                <Cell textAlign="center" singleLine>  - </Cell>
            );
        }
    }

    /**
    * This method is used to handle the rendering of Designation
    */
    renderDesignation(employee) {
        const { Cell } = Table;

        if (employee.designation !== "" && employee.designation !== " " && employee.designation !== null) {
            if (employee.designation === '1') {
                return (
                    <Cell textAlign="center" singleLine>Associate</Cell>
                );
            } else if (employee.designation === '2') {
                return (
                    <Cell textAlign="center" singleLine>Software Engineer</Cell>
                );
            } else if (employee.designation === '3') {
                return (
                    <Cell textAlign="center" singleLine>Senior Software Engineer</Cell>
                );
            } else if (employee.designation === '4') {
                return (
                    <Cell textAlign="center" singleLine>Team Lead</Cell>
                );
            } else if (employee.designation === '5') {
                return (
                    <Cell textAlign="center" singleLine>Project Manager</Cell>
                );
            } else if (employee.designation === '6') {
                return (
                    <Cell textAlign="center" singleLine>Senior Project Manager</Cell>
                );
            } else if (employee.designation === '7') {
                return (
                    <Cell textAlign="center" singleLine>Deputy General Manager</Cell>
                );
            } else if (employee.designation === '8') {
                return (
                    <Cell textAlign="center" singleLine>General Manager</Cell>
                );
            } else if (employee.designation === '9') {
                return (
                    <Cell textAlign="center" singleLine>Associate Director</Cell>
                );
            } else if (employee.designation === '10') {
                return (
                    <Cell textAlign="center" singleLine>Director</Cell>
                );
            } else {
                return (
                    <Cell textAlign="center" singleLine style={{ color: 'blue' }}>N/A</Cell>
                );
            }
        } else {
            return (
                <Cell textAlign="center" singleLine>  - </Cell>
            );
        }
    }

    /**
    * This method is used to handle the rendering of employee avatar.
    */
    renderImage(employee) {
        const { Cell } = Table;
        var uname = employee.emp_fname + " " + employee.emp_lname;
        if (employee.emp_avatar !== "" && employee.emp_avatar === 'https://gateway.ipfs.io/ipfs/') {
            return (
                <Cell textAlign="left" singleLine>{uname}</Cell>
            );
        } else if (employee.emp_avatar !== "") {
            return (
                <Cell textAlign="left" singleLine><Image src={ipfsPrefixUrl + employee.emp_avatar} avatar /> {uname}</Cell>
            );
        } else {
            return (
                <Cell textAlign="left" singleLine> {uname}</Cell>
            );
        }
    }

    /**
 * This method is used to handle the rendering of gender based on id
 */
    renderGender(employee) {
        const { Cell } = Table;
        if (employee.gender !== "" && employee.gender !== " " && employee.gender !== null) {
            if (employee.gender === '1' || employee.gender === 1) {
                return (
                    <Cell textAlign="center" singleLine >Male</Cell>
                );
            } else {
                return (
                    <Cell textAlign="center" singleLine >Female</Cell>
                );
            }
        } else {
            return (
                <Cell textAlign="center" singleLine>  - </Cell>
            );
        }
    }

    /**
     * This method is used to handle the rendering of employment type
     */
    renderEmpType(employee) {
        const { Cell } = Table;
        if (employee.emp_type !== "" && employee.emp_type !== " " && employee.emp_type !== null) {
            if (employee.emp_type === 1) {
                return (
                    <Cell textAlign="center" singleLine >Permanent</Cell>
                );
            } else if (employee.emp_type === 2) {
                return (
                    <Cell textAlign="center" singleLine >Temporary</Cell>
                );
            } else {
                return (
                    <Cell textAlign="center" singleLine >Contract</Cell>
                );
            }
        } else {
            return (
                <Cell textAlign="center" singleLine>  - </Cell>
            );
        }
    }

    /**
    * This method is used to handle the rendering of employee Id.
    */
    renderEmpId(employee) {
        const { Cell } = Table;
        if (employee.bc_count > 1) {
            return (
                <Cell textAlign="center" singleLine>
                    <a onClick={() => this.loadBCDataonId(employee.emp_id)} style={{ cursor: 'pointer' }}><u>{employee.emp_id}</u></a>
                </Cell>
            );
        } else {
            return (
                <Cell textAlign="center" singleLine>{employee.emp_id}</Cell>
            );
        }
    }

    renderEmpUid(employee) {
        const { Cell } = Table;
        if (this.state.maxCount > 1) {
            return (
                <Cell textAlign="center" singleLine>
                    <a onClick={() => this.loadBCDataonUid(employee.emp_uid)} style={{ cursor: 'pointer' }}><u>{employee.emp_uid}</u></a>
                </Cell>
            );
        } else {
            return (
                <Cell textAlign="center" singleLine>{employee.emp_uid}</Cell>
            );
        }
    }
    /**
   * This method is used to fetch the record count based on UEN from the database.
   */
    getRecordCount = async () => {
        const { employee } = this.props;
        var url = 'http://ec2-34-209-178-145.us-west-2.compute.amazonaws.com:3210/recordCount/' + employee.emp_uid;
        axios.get(url)
            .then((empData) => {
                if (empData.data[0].totalCount > empData.data[0].bcCount) {
                    this.setState({
                        maxCount: empData.data[0].totalCount
                    })
                } else {
                    this.setState({
                        maxCount: empData.data[0].bcCount
                    })
                }
            })
    }

    /**
   * This method is used to handle the page navigation to BCDataInfo screen.
   */
    loadBCDataonId(emp_id) {
        const { user, company, loginCompany } = this.props;
        this.props.history.push({
            pathname: `/BcDataInfo`,
            state: { loginCompany: loginCompany, companyName: company, role: user, emp_id: emp_id }
        })
    }

    /**
       * This method is used to handle the page navigation to BCDataInfo screen.
       */
    loadBCDataonUid(emp_uid) {
        const { user, company, loginCompany } = this.props;
        this.props.history.push({
            pathname: `/UENBcDataInfo`,
            state: { loginCompany: loginCompany, companyName: company, role: user, emp_uid: emp_uid }
        })
    }

    /**
    * This method is used to handle the edit employee page navigation.
    */
    editEmployee = () => {
        const { employee, user, loginCompany } = this.props;
        this.props.history.push({
            pathname: `/EditEmployee`,
            state: { loginCompany: loginCompany, companyName: loginCompany, role: user, emp_id: employee.emp_id, selectedIndex: 1 }
        })
    }


    /**
   * This method is used to handle the display employee profile page navigation.
   */
    viewProfile = () => {
        const { employee, user, loginCompany } = this.props;
        this.props.history.push({
            pathname: `/ViewProfile`,
            state: { loginCompany: loginCompany, companyName: loginCompany, role: user, emp_id: employee.emp_id, selectedIndex:1 }
        })
    }

    render() {
        const { Row, Cell } = Table;
        const { employee, sid, nodata, company, loginCompany, user } = this.props;
        if (this.state.maxCount === 0) {
            this.getRecordCount();
        }
        if (!nodata && (company != 0 || company != '0')) {
            return (
                <Row >
                    <Cell textAlign="center">{sid + 1} </Cell>
                    {this.renderEmpId(employee)}
                    <Cell textAlign="center" singleLine>{employee.emp_uid}</Cell>
                    {this.renderImage(employee)}
                    <Cell textAlign="left" singleLine>{(employee.emp_fathername)}</Cell>
                    {this.renderGender(employee)}
                    <Cell textAlign="center" singleLine>{moment(employee.date_of_birth).format('DD-MMM-YYYY')}</Cell>
                    <Cell textAlign="left" singleLine>{(employee.qualification)}</Cell>
                    <Cell textAlign="left" singleLine>{(employee.pan_number)}</Cell>
                    <Cell textAlign="center" singleLine>{moment(employee.date_of_joining).format('DD-MMM-YYYY')}</Cell>
                    <Cell textAlign="center" singleLine>{this.renderRelDate()}</Cell>
                    {this.renderEmpType(employee)}
                    {this.renderExitType(employee)}
                    {this.renderDesignation(employee)}
                    <Cell textAlign="left" singleLine>{employee.tech_expertise}</Cell>
                    {this.renderVerification(employee)}
                    <Cell textAlign="center" singleLine>{employee.bc_published_date}</Cell>
                    {loginCompany.toString() === company.toString() &&  (user === ConstantsList.HRUser) ?
                        <Cell textAlign="center">
                            <p><a style={{ cursor: 'pointer' }} onClick={() => this.editEmployee()}><u>Edit</u></a>/<span><a style={{ cursor: 'pointer' }} onClick={() => this.viewProfile()}><u>View</u></a></span></p>
                        </Cell>
                        : null}
                </Row>
            );
        } else if (!nodata && (company == 0 || company == '0')) {
            return (
                <Row >
                    <Cell textAlign="center">{sid + 1} </Cell>
                    {this.renderEmpUid(employee)}
                    {this.renderImage(employee)}
                    <Cell textAlign="left" singleLine>{(employee.emp_fathername)}</Cell>
                    {this.renderGender(employee)}
                    <Cell textAlign="center" singleLine>{moment(employee.date_of_birth).format('DD-MMM-YYYY')}</Cell>
                    <Cell textAlign="left" singleLine>{(employee.qualification)}</Cell>
                    <Cell textAlign="left" singleLine>{(employee.pan_number)}</Cell>
                    <Cell textAlign="center" singleLine>{moment(employee.date_of_joining).format('DD-MMM-YYYY')}</Cell>
                    <Cell textAlign="center" singleLine>{this.renderRelDate()}</Cell>
                    {this.renderEmpType(employee)}
                    {this.renderExitType(employee)}
                    {this.renderDesignation(employee)}
                    <Cell textAlign="left" singleLine>{(employee.tech_expertise)}</Cell>
                    {this.renderVerification(employee)}
                    <Cell textAlign="center" singleLine>{employee.bc_published_date}</Cell>
                </Row>
            );
        } else {
            return (<Row>
                <Cell colSpan="12" textAlign="center">
                    <p style={{ fontSize: '20px', textAlign: 'center', color: 'brown' }}>No records found</p>
                </Cell>
            </Row>);
        }
    }
}

export default BlockChainData;