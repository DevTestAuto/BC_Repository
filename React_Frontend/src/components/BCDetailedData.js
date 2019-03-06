import React, { Component } from 'react';
import { Table, Image } from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import moment from 'moment';
const ipfsPrefixUrl = 'https://gateway.ipfs.io/ipfs/';
/**
 * This class is used to create a row based on the request.
 */
class BCDetailedData extends Component {

    /**
    * This method is used to handle the rendering of QUALIFICATION
    */
    renderVerification(professional) {
        const { Cell } = Table;
        const { oldProfessional, sid, length } = this.props;
        if (professional.verificationFlag !== "" && professional.verificationFlag !== " " && professional.verificationFlag !== null) {
            if (oldProfessional.verificationFlag !== undefined && oldProfessional.verificationFlag !== "" && oldProfessional.verificationFlag !== " " 
            && oldProfessional.verificationFlag !== null) {
                var verificationFlag = (web3.utils.toAscii(professional.verificationFlag).replace(/\u0000/g, ''));
                if ((web3.utils.toAscii(professional.verificationFlag).replace(/\u0000/g, '')) !== (web3.utils.toAscii(oldProfessional.verificationFlag).replace(/\u0000/g, ''))  && sid != length) {
                    if (verificationFlag === 2 || verificationFlag === '2') {
                        return (
                            <Cell textAlign="center" singleLine style={{ background: '#e1e1ef', color: 'red' }}>No</Cell>
                        );
                    } else if (verificationFlag === 1 || verificationFlag === '1') {
                        return (
                            <Cell textAlign="center" singleLine style={{ background: '#e1e1ef', color: 'green' }}>Yes</Cell>
                        );
                    }

                } else {
                    if (verificationFlag === 2 || verificationFlag === '2') {
                        return (
                            <Cell textAlign="center" singleLine style={{ color: 'red' }}>No</Cell>
                        );
                    } else if (verificationFlag === 1 || verificationFlag === '1') {
                        return (
                            <Cell textAlign="center" singleLine style={{ color: 'green' }}>Yes</Cell>
                        );
                    }
                }
            } else {
                return (
                    <Cell textAlign="center" singleLine >{(web3.utils.toAscii(professional.verificationFlag).replace(/\u0000/g, ''))}</Cell>
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
    renderExitType(professional) {
        const { Cell } = Table;
        const { oldProfessional, sid, length } = this.props;
        if (professional.exitType !== "" && professional.exitType !== " " && professional.exitType !== null) {
            var exitType = web3.utils.toAscii(professional.exitType).replace(/\u0000/g, '');
            if (oldProfessional.exitType !== "" && oldProfessional.exitType !== " " && oldProfessional.exitType !== null) {
                var oldExitType = (web3.utils.toAscii(oldProfessional.exitType).replace(/\u0000/g, ''));
                if (oldExitType !== exitType  && sid != length) {
                    if (exitType === 1 || exitType === '1') {
                        return (
                            <Cell textAlign="center" singleLine style={{ background: '#e1e1ef', color: 'green' }}>Normal</Cell>
                        );
                    } else if (exitType === 2 || exitType === '2') {
                        return (
                            <Cell textAlign="center" singleLine style={{ background: '#e1e1ef', color: 'orange' }}>Terminated</Cell>
                        );
                    } else if (exitType === 3 || exitType === '3') {
                        return (
                            <Cell textAlign="center" singleLine style={{ background: '#e1e1ef', color: 'red' }}>Absconding</Cell>
                        );
                    } else {
                        return (
                            <Cell textAlign="center" singleLine style={{ background: '#e1e1ef', color: 'blue' }}>N/A</Cell>
                        );
                    }
                } else {
                    if (exitType === 1 || exitType === '1') {
                        return (
                            <Cell textAlign="center" singleLine style={{ color: 'green' }}>Normal</Cell>
                        );
                    } else if (exitType === 2 || exitType === '2') {
                        return (
                            <Cell textAlign="center" singleLine style={{ color: 'orange' }}>Terminated</Cell>
                        );
                    } else if (exitType === 3 || exitType === '3') {
                        return (
                            <Cell textAlign="center" singleLine style={{ color: 'red' }}>Absconding</Cell>
                        );
                    } else {
                        return (
                            <Cell textAlign="center" singleLine style={{ color: 'blue' }}>N/A</Cell>
                        );
                    }
                }
            } else {
                if (exitType === 1 || exitType === '1') {
                    return (
                        <Cell textAlign="center" singleLine style={{ color: 'green' }}>Normal</Cell>
                    );
                } else if (exitType === 2 || exitType === '2') {
                    return (
                        <Cell textAlign="center" singleLine style={{ color: 'orange' }}>Terminated</Cell>
                    );
                } else if (exitType === 3 || exitType === '3') {
                    return (
                        <Cell textAlign="center" singleLine style={{ color: 'red' }}>Absconding</Cell>
                    );
                } else {
                    return (
                        <Cell textAlign="center" singleLine style={{ color: 'blue' }}>N/A</Cell>
                    );
                }
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
        const { oldEmployee, sid, length } = this.props;
        var uname = employee.empFName + " " + employee.empLName;
        var oldName = oldEmployee.empFName + " " + oldEmployee.empLName;
        var editedFlag = false;
        if (oldName !== uname && sid != length) {
            editedFlag = true;
        }
        if (employee.empAvatar !== "" && employee.empAvatar === 'https://gateway.ipfs.io/ipfs/') {
            if (editedFlag) {
                return (
                    <Cell textAlign="left" style={{ background: '#e1e1ef' }} singleLine>{uname}</Cell>
                );
            } else {
                return (
                    <Cell textAlign="left" singleLine>{uname}</Cell>
                );
            }
        } else if (employee.empAvatar !== "") {
            if (editedFlag) {
                return (
                    <Cell textAlign="left" style={{ background: '#e1e1ef' }} singleLine><Image src={ipfsPrefixUrl + employee.empAvatar} avatar /> {uname}</Cell>
                );
            } else {
                return (
                    <Cell textAlign="left" singleLine><Image src={ipfsPrefixUrl + employee.empAvatar} avatar /> {uname}</Cell>
                );
            }
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
        const { oldEmployee, sid, length } = this.props;
        if (employee.gender !== "" && employee.gender !== " " && employee.gender !== null) {
            if (oldEmployee.gender !== undefined && oldEmployee.gender !== "" && oldEmployee.gender !== " " && oldEmployee.gender !== null ) {
                if ((web3.utils.toAscii(employee.gender).replace(/\u0000/g, '')) !== (web3.utils.toAscii(oldEmployee.gender).replace(/\u0000/g, '')) && sid != length) {
                    if ((web3.utils.toAscii(employee.gender).replace(/\u0000/g, '')) === '1' || (web3.utils.toAscii(employee.gender).replace(/\u0000/g, '')) === 1) {
                        return (
                            <Cell textAlign="center" style={{ background: '#e1e1ef' }} singleLine >Male</Cell>
                        );
                    } else {
                        return (
                            <Cell textAlign="center" style={{ background: '#e1e1ef' }} singleLine >Female</Cell>
                        );
                    }
                } else {
                    if ((web3.utils.toAscii(employee.gender).replace(/\u0000/g, '')) === '1' || (web3.utils.toAscii(employee.gender).replace(/\u0000/g, '')) === 1) {
                        return (
                            <Cell textAlign="center" singleLine >Male</Cell>
                        );
                    } else {
                        return (
                            <Cell textAlign="center" singleLine >Female</Cell>
                        );
                    }
                }
            } else {
                return (
                    <Cell textAlign="center" singleLine >{(web3.utils.toAscii(employee.gender).replace(/\u0000/g, ''))}</Cell>
                );
            }
        } else {
            return (
                <Cell textAlign="center" singleLine>  - </Cell>
            );
        }
    }

    renderFatherName(employee, oldEmployee) {
        const { Cell } = Table;
        const { sid, length } = this.props;
        if (employee.fatherName !== "" && employee.fatherName !== " "
            && employee.fatherName !== null) {
            if (oldEmployee.fatherName !== undefined && oldEmployee.fatherName !== "" &&
                oldEmployee.fatherName !== " " && oldEmployee.fatherName !== null ) {
                if (employee.fatherName !== oldEmployee.fatherName && sid != length) {
                    return (
                        <Cell textAlign="center" singleLine style={{ background: '#e1e1ef' }}>{employee.fatherName}</Cell>
                    );
                } else {
                    return (
                        <Cell textAlign="center" singleLine >{employee.fatherName}</Cell>
                    );
                }
            } else {
                return (
                    <Cell textAlign="center" singleLine >{employee.fatherName}</Cell>
                );
            }
        } else {
            return (
                <Cell textAlign="center" singleLine>  - </Cell>
            );
        }
    }

    renderTechExpertise() {
        const { Cell } = Table;
        const { professional, oldProfessional, sid, length } = this.props;
        if (professional.technicalExpertise !== "" && professional.technicalExpertise !== " "
            && professional.technicalExpertise !== null) {
            if (oldProfessional.technicalExpertise !== undefined && oldProfessional.technicalExpertise !== "" &&
                oldProfessional.technicalExpertise !== " " && oldProfessional.technicalExpertise !== null ) {
                if (professional.technicalExpertise !== oldProfessional.technicalExpertise && sid != length) {
                    return (
                        <Cell textAlign="center" singleLine style={{ background: '#e1e1ef' }}>{professional.technicalExpertise}</Cell>
                    );
                } else {
                    return (
                        <Cell textAlign="center" singleLine >{professional.technicalExpertise}</Cell>
                    );
                }
            } else {
                return (
                    <Cell textAlign="center" singleLine >{professional.technicalExpertise}</Cell>
                );
            }
        } else {
            return (
                <Cell textAlign="center" singleLine>  - </Cell>
            );
        }
    }

    /**
 * This method is used to handle the rendering of QUALIFICATION
 */
    renderQualification(employee) {
        const { Cell } = Table;
        const { oldEmployee, sid, length } = this.props;
        if (employee.qualification !== "" && employee.qualification !== " " && employee.qualification !== null) {
            if (oldEmployee.qualification !== undefined && oldEmployee.qualification !== "" && 
            oldEmployee.qualification !== " " && oldEmployee.qualification !== null) {
                if ((web3.utils.toAscii(employee.qualification).replace(/\u0000/g, '')) !== (web3.utils.toAscii(oldEmployee.qualification).replace(/\u0000/g, ''))  && sid != length) {
                    return (
                        <Cell textAlign="center" singleLine style={{ background: '#e1e1ef' }}>{(web3.utils.toAscii(employee.qualification).replace(/\u0000/g, ''))}</Cell>
                    );
                } else {
                    return (
                        <Cell textAlign="center" singleLine >{(web3.utils.toAscii(employee.qualification).replace(/\u0000/g, ''))}</Cell>
                    );
                }
            } else {
                return (
                    <Cell textAlign="center" singleLine >{(web3.utils.toAscii(employee.qualification).replace(/\u0000/g, ''))}</Cell>
                );
            }
        } else {
            return (
                <Cell textAlign="center" singleLine>  - </Cell>
            );
        }
    }

    /**
* This method is used to handle the rendering of DOB
*/
    renderDob() {
        const { Cell } = Table;
        const { employee, oldEmployee, sid, length } = this.props;
        if (employee.dateOfBirth !== "" && employee.dateOfBirth !== " " && employee.dateOfBirth !== null) {
            if (oldEmployee.dateOfBirth !== undefined && oldEmployee.dateOfBirth !== "" && 
            oldEmployee.dateOfBirth !== " " && oldEmployee.dateOfBirth !== null ) {
                if ((moment(web3.utils.toAscii(employee.dateOfBirth).replace(/\u0000/g, '')).format('DD-MMM-YYYY')) !== (moment(web3.utils.toAscii(oldEmployee.dateOfBirth).replace(/\u0000/g, '')).format('DD-MMM-YYYY')) && sid != length) {
                    return (
                        <Cell textAlign="center" singleLine style={{ background: '#e1e1ef' }}>{moment(web3.utils.toAscii(employee.dateOfBirth).replace(/\u0000/g, '')).format('DD-MMM-YYYY')}</Cell>
                    );
                } else {
                    return (
                        <Cell textAlign="center" singleLine >{moment(web3.utils.toAscii(employee.dateOfBirth).replace(/\u0000/g, '')).format('DD-MMM-YYYY')}</Cell>
                    );
                }
            } else {
                return (
                    <Cell textAlign="center" singleLine >{moment(web3.utils.toAscii(employee.dateOfBirth).replace(/\u0000/g, '')).format('DD-MMM-YYYY')}</Cell>
                );
            }
        } else {
            return (
                <Cell textAlign="center" singleLine>  - </Cell>
            );
        }
    }

    /**
* This method is used to handle the rendering of Published Date
*/
    renderPubDate() {
        const { Cell } = Table;
        const { professional } = this.props;
        if (professional.publishedDate !== "" && professional.publishedDate !== " " &&
            professional.publishedDate !== null) {
            return (
                <Cell textAlign="center" singleLine >{moment(web3.utils.toAscii(professional.publishedDate).replace(/\u0000/g, '')).format('DD-MMM-YYYY HH:MM:SS')}</Cell>
            );
        } else {
            return (
                <Cell textAlign="center" singleLine>  - </Cell>
            );
        }
    }

    /**
* This method is used to handle the rendering of DOJ
*/
    renderDoj() {
        const { Cell } = Table;
        const { professional, oldProfessional, sid, length } = this.props;
        if (professional.dateOfJoining !== "" && professional.dateOfJoining !== " " && professional.dateOfJoining !== null) {
            if (oldProfessional.dateOfJoining !== undefined && oldProfessional.dateOfJoining !== "" && oldProfessional.dateOfJoining !== " " && 
            oldProfessional.dateOfJoining !== null ) {
                if ((moment(web3.utils.toAscii(professional.dateOfJoining).replace(/\u0000/g, '')).format('DD-MMM-YYYY')) !== (moment(web3.utils.toAscii(oldProfessional.dateOfJoining).replace(/\u0000/g, '')).format('DD-MMM-YYYY')) && sid != length) {
                    return (
                        <Cell textAlign="center" singleLine style={{ background: '#e1e1ef' }}>{moment(web3.utils.toAscii(professional.dateOfJoining).replace(/\u0000/g, '')).format('DD-MMM-YYYY')}</Cell>
                    );
                } else {
                    return (
                        <Cell textAlign="center" singleLine >{moment(web3.utils.toAscii(professional.dateOfJoining).replace(/\u0000/g, '')).format('DD-MMM-YYYY')}</Cell>
                    );
                }
            } else {
                return (
                    <Cell textAlign="center" singleLine >{moment(web3.utils.toAscii(professional.dateOfJoining).replace(/\u0000/g, '')).format('DD-MMM-YYYY')}</Cell>
                );
            }
        } else {
            return (
                <Cell textAlign="center" singleLine>  - </Cell>
            );
        }
    }

    /**
* This method is used to handle the rendering of RELIEVING DATE
*/
    renderRelDate() {
        const { Cell } = Table;
        const { professional, oldProfessional, sid, length } = this.props;
        if (professional.dateOfRelieving !== "" && professional.dateOfRelieving !== " " && professional.dateOfRelieving !== null) {
            if (oldProfessional.dateOfRelieving !== undefined && oldProfessional.dateOfRelieving !== "" && 
            oldProfessional.dateOfRelieving !== " " && oldProfessional.dateOfRelieving !== null ) {
                if ((moment(web3.utils.toAscii(professional.dateOfRelieving).replace(/\u0000/g, '')).format('DD-MMM-YYYY')) !== (moment(web3.utils.toAscii(oldProfessional.dateOfRelieving).replace(/\u0000/g, '')).format('DD-MMM-YYYY')) && sid != length) {
                    return (
                        <Cell textAlign="center" singleLine style={{ background: '#e1e1ef' }}>{moment(web3.utils.toAscii(professional.dateOfRelieving).replace(/\u0000/g, '')).format('DD-MMM-YYYY')}</Cell>
                    );
                } else {
                    return (
                        <Cell textAlign="center" singleLine >{moment(web3.utils.toAscii(professional.dateOfRelieving).replace(/\u0000/g, '')).format('DD-MMM-YYYY')}</Cell>
                    );
                }
            } else {
                return (
                    <Cell textAlign="center" singleLine >{moment(web3.utils.toAscii(professional.dateOfRelieving).replace(/\u0000/g, '')).format('DD-MMM-YYYY')}</Cell>
                );
            }
        } else {
            return (
                <Cell textAlign="center" singleLine>  - </Cell>
            );
        }
    }


    /**
* This method is used to handle the rendering of AADHAR NO
*/
    renderAadharNo() {
        const { Cell } = Table;
        const { employee, oldEmployee, sid, length } = this.props;
        if (employee.aadhaar !== "" && employee.aadhaar !== " " && employee.aadhaar !== null) {
            if (oldEmployee.aadhaar !== undefined && oldEmployee.aadhaar !== "" && oldEmployee.aadhaar !== " " && 
            oldEmployee.aadhaar !== null ) {
                if ((web3.utils.toAscii(employee.aadhaar).replace(/\u0000/g, '')) !== (web3.utils.toAscii(oldEmployee.aadhaar).replace(/\u0000/g, '')) && sid != length) {
                    return (
                        <Cell textAlign="center" singleLine style={{ background: '#e1e1ef' }}>{(web3.utils.toAscii(employee.aadhaar).replace(/\u0000/g, ''))}</Cell>
                    );
                } else {
                    return (
                        <Cell textAlign="center" singleLine >{(web3.utils.toAscii(employee.aadhaar).replace(/\u0000/g, ''))}</Cell>
                    );
                }
            } else {
                return (
                    <Cell textAlign="center" singleLine >{(web3.utils.toAscii(employee.aadhaar).replace(/\u0000/g, ''))}</Cell>
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
    renderEmpType(professional) {
        const { Cell } = Table;
        const { oldProfessional, sid, length } = this.props;
        if (professional.employmentType !== "" && professional.employmentType !== " " && professional.employmentType !== null) {
            var empType = web3.utils.toAscii(professional.employmentType).replace(/\u0000/g, '');
            if (oldProfessional.employmentType !== "" && oldProfessional.employmentType !== " " && oldProfessional.employmentType !== null ) {
                var oldEmpType = web3.utils.toAscii(oldProfessional.employmentType).replace(/\u0000/g, '');
                if (empType !== oldEmpType && sid != length) {
                    if (empType === 1 || empType === '1') {
                        return (
                            <Cell textAlign="center" style={{ background: '#e1e1ef' }} singleLine >Permanent</Cell>
                        );
                    } else if (empType === 2 || empType === '2') {
                        return (
                            <Cell textAlign="center" style={{ background: '#e1e1ef' }} singleLine >Temporary</Cell>
                        );
                    } else if (empType === 3 || empType === '3') {
                        return (
                            <Cell textAlign="center" style={{ background: '#e1e1ef' }} singleLine >Contract</Cell>
                        );
                    } else {
                        return (
                            <Cell textAlign="center" style={{ background: '#e1e1ef' }} singleLine>  - </Cell>
                        );
                    }
                } else {
                    if (empType === 1 || empType === '1') {
                        return (
                            <Cell textAlign="center" singleLine >Permanent</Cell>
                        );
                    } else if (empType === 2 || empType === '2') {
                        return (
                            <Cell textAlign="center" singleLine >Temporary</Cell>
                        );
                    } else if (empType === 3 || empType === '3') {
                        return (
                            <Cell textAlign="center" singleLine >Contract</Cell>
                        );
                    } else {
                        return (
                            <Cell textAlign="center" singleLine>  - </Cell>
                        );
                    }
                }
            } else {

                if (empType === 1 || empType === '1') {
                    return (
                        <Cell textAlign="center" singleLine >Permanent</Cell>
                    );
                } else if (empType === 2 || empType === '2') {
                    return (
                        <Cell textAlign="center" singleLine >Temporary</Cell>
                    );
                } else if (empType === 3 || empType === '3') {
                    return (
                        <Cell textAlign="center" singleLine >Contract</Cell>
                    );
                } else {
                    return (
                        <Cell textAlign="center" singleLine>  - </Cell>
                    );
                }
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
    renderDesignation(professional) {
        const { Cell } = Table;
        const { oldProfessional, sid, length } = this.props;

        if (professional.designation !== "" && professional.designation !== " " &&
            professional.designation !== null) {
            if (oldProfessional.designation !== "" && oldProfessional.designation !== " " &&
                oldProfessional.designation !== null && professional.designation !== oldProfessional.designation && sid != length) {
                if (professional.designation === '1') {
                    return (
                        <Cell textAlign="center" style={{ background: '#e1e1ef' }} singleLine>Associate</Cell>
                    );
                } else if (professional.designation === '2') {
                    return (
                        <Cell textAlign="center" style={{ background: '#e1e1ef' }} singleLine>Software Engineer</Cell>
                    );
                } else if (professional.designation === '3') {
                    return (
                        <Cell textAlign="center" style={{ background: '#e1e1ef' }} singleLine>Senior Software Engineer</Cell>
                    );
                } else if (professional.designation === '4') {
                    return (
                        <Cell textAlign="center" style={{ background: '#e1e1ef' }} singleLine>Team Lead</Cell>
                    );
                } else if (professional.designation === '5') {
                    return (
                        <Cell textAlign="center" style={{ background: '#e1e1ef' }} singleLine>Project Manager</Cell>
                    );
                } else if (professional.designation === '6') {
                    return (
                        <Cell textAlign="center" style={{ background: '#e1e1ef' }} singleLine>Senior Project Manager</Cell>
                    );
                } else if (professional.designation === '7') {
                    return (
                        <Cell textAlign="center" style={{ background: '#e1e1ef' }} singleLine>Deputy General Manager</Cell>
                    );
                } else if (professional.designation === '8') {
                    return (
                        <Cell textAlign="center" style={{ background: '#e1e1ef' }} singleLine>General Manager</Cell>
                    );
                } else if (professional.designation === '9') {
                    return (
                        <Cell textAlign="center" style={{ background: '#e1e1ef' }} singleLine>Associate Director</Cell>
                    );
                } else if (professional.designation === '10') {
                    return (
                        <Cell textAlign="center" style={{ background: '#e1e1ef' }} singleLine>Director</Cell>
                    );
                } else {
                    return (
                        <Cell textAlign="center" style={{ background: '#e1e1ef', color: 'blue' }} singleLine>N/A</Cell>
                    );
                }
            } else {
                if (professional.designation === '1') {
                    return (
                        <Cell textAlign="center" singleLine>Associate</Cell>
                    );
                } else if (professional.designation === '2') {
                    return (
                        <Cell textAlign="center" singleLine>Software Engineer</Cell>
                    );
                } else if (professional.designation === '3') {
                    return (
                        <Cell textAlign="center" singleLine>Senior Software Engineer</Cell>
                    );
                } else if (professional.designation === '4') {
                    return (
                        <Cell textAlign="center" singleLine>Team Lead</Cell>
                    );
                } else if (professional.designation === '5') {
                    return (
                        <Cell textAlign="center" singleLine>Project Manager</Cell>
                    );
                } else if (professional.designation === '6') {
                    return (
                        <Cell textAlign="center" singleLine>Senior Project Manager</Cell>
                    );
                } else if (professional.designation === '7') {
                    return (
                        <Cell textAlign="center" singleLine>Deputy General Manager</Cell>
                    );
                } else if (professional.designation === '8') {
                    return (
                        <Cell textAlign="center" singleLine>General Manager</Cell>
                    );
                } else if (professional.designation === '9') {
                    return (
                        <Cell textAlign="center" singleLine>Associate Director</Cell>
                    );
                } else if (professional.designation === '10') {
                    return (
                        <Cell textAlign="center" singleLine>Director</Cell>
                    );
                } else {
                    return (
                        <Cell textAlign="center" singleLine style={{ color: 'blue' }}>N/A</Cell>
                    );
                }
            }
        } else {
            return (
                <Cell textAlign="center" singleLine>  - </Cell>
            );
        }
    }

    render() {
        const { Row, Cell } = Table;
        const { employee, oldEmployee, professional, sid, nodata } = this.props;
        if (!nodata) {
            return (
                <Row >
                    <Cell textAlign="center">{sid + 1} </Cell>
                    <Cell textAlign="center" singleLine>{web3.utils.toAscii(employee.empUid).replace(/\u0000/g, '')}</Cell>
                    {this.renderImage(employee)}
                    {this.renderFatherName(employee, oldEmployee)}
                    {this.renderGender(employee)}
                    {this.renderDob()}
                    {this.renderQualification(employee)}
                    {this.renderAadharNo()}
                    {this.renderDoj()}
                    {this.renderRelDate()}
                    {this.renderEmpType(professional)}
                    {this.renderExitType(professional)}
                    {this.renderDesignation(professional)}
                    {this.renderTechExpertise()}
                    {this.renderVerification(professional)}
                    {this.renderPubDate()}
                </Row>
            );
        } else {
            return (<Row>
                <Cell colSpan="11" textAlign="center">
                    <p style={{ fontSize: '20px', textAlign: 'center', color: 'brown' }}>No records found</p>
                </Cell>
            </Row>);
        }
    }
}

export default BCDetailedData;