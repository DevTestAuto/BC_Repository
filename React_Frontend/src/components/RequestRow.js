import React, { Component } from 'react';
import { Table, Button, Image, Modal, Loader, Dimmer } from 'semantic-ui-react';
import moment from 'moment';
import ConstantsList from "../constants/address.js";
import web3 from "../ethereum/web3";
import axios from 'axios';
const ipfsPrefixUrl = 'https://gateway.ipfs.io/ipfs/';

const Web3 = require('web3');
const EthereumTx = require('ethereumjs-tx');
const EMPContract = require('../ethereum/build/EMPContract.json');

/**
 * This class is used to create a row based on the request.
 */
class RequestRow extends Component {

    state = {
        loading: false,
        modalOpen: false,
        gasdialog: false,
        balance: ''
    };



    handleOpen = () => {
        this.setState({ modalOpen: true })
    }

    handleClose = () => this.setState({ modalOpen: false })

    handleGasOpen = () => {
        this.setState({ gasdialog: true })
    }

    handleGasClose = () => this.setState({ gasdialog: false })

    loadingShow = () => this.setState({ active: true })

    loadingHide = () => this.setState({ active: false })

    bcloadingShow = () => this.setState({ bcactive: true })

    bcloadingHide = () => this.setState({ bcactive: false })

    async componentDidMount() {
        const testAddr = ConstantsList.FromAddress;
        web3.eth.getBalance(testAddr, (error, result) => {
            if (!error) {
                const etherbalance = web3.utils.fromWei((result), 'ether');
                this.setState({ balance: etherbalance });
            } else {
                console.error(error);
            }
        });
    }

    /**
    * This method is used to handle the rendering of relieving date
    */
    renderRelDate() {
        const { employee } = this.props;
        if (((employee.relieving_date) === "") || (employee.relieving_date) === undefined) {
            return ("-");
        } else {
            return (moment((employee.relieving_date)).format('DD-MMM-YYYY'));
        }
    }

    /**
     * This method is used to handle the applying colors to the employee exit type
     */
    renderColor() {
        const { employee } = this.props;

        if ((employee.exit_type) === 1) {
            return 'green';
        } else if ((employee.exit_type) === 2) {
            return 'orange';
        } else if ((employee.exit_type) === 3) {
            return 'red';
        } else {
            return 'blue';
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
    * This method is used to handle the rendering of status.
    */
    getApprovalStatus(employee) {
        const { Cell } = Table;
        if (((employee.relieving_date) !== "") && ((employee.relieving_date) !== undefined)) {
            if (employee.mgmt_status === 0 && employee.mgr_status === 0) {
                return (
                    <Cell negative textAlign="center" singleLine title={'Management,Manager'}> Approval Pending</Cell>
                );
            } else if (employee.mgmt_status === 1 && employee.mgr_status === 0) {
                return (
                    <Cell negative textAlign="center" singleLine title={'Manager'}> Approval Pending</Cell>
                );
            } else if (employee.mgmt_status === 0 && employee.mgr_status === 1) {
                return (
                    <Cell negative textAlign="center" singleLine title={'Management'}> Approval Pending</Cell>
                );
            } else if (employee.mgmt_status === 1 && employee.mgr_status === 1 && employee.bc_status === 0) {
                return (
                    <Cell textAlign="center" singleLine warning>
                        <a style={{ cursor: 'pointer' }} onClick={() => this.etherBalanceCheck()}><u>Publish to Blockchain</u></a>
                    </Cell>
                );
            } else {
                return (
                    <Cell textAlign="center" singleLine positive>
                        Published to Blockchain
                </Cell>
                );
            }
        } else {
            return (
                <Cell textAlign="center" singleLine>  N/A </Cell>
            );
        }
    }

    /**
    * This method is used to handle the Management approval mechanism.
    */
    managementApprove = async () => {
        const { employee } = this.props;
        this.handleClose();
        this.setState({ loading: true });
        this.loadingShow();
        var url = 'http://192.168.10.40:3210/UpdateReq/' + employee.emp_id + '/' + employee.comp_id;
        axios.post(url, {
            emp_uid: employee.emp_uid,
            emp_id: employee.emp_id,
            emp_fname: employee.emp_fname,
            emp_lname: employee.emp_lname,
            emp_fathername: employee.emp_fathername,
            emp_avatar: employee.emp_avatar,
            gender: employee.gender,
            date_of_birth: moment(employee.date_of_birth).format('YYYY-MM-DD'),
            qualification: employee.qualification,
            pan_number: employee.pan_number,
            date_of_joining: moment(employee.date_of_joining).format('YYYY-MM-DD'),
            relieving_date: moment(employee.relieving_date).format('YYYY-MM-DD'),
            emp_type: employee.emp_type,
            exit_type: employee.exit_type,
            designation: employee.designation,
            tech_expertise: employee.tech_expertise,
            flag_verification: employee.flag_verification,
            mgmt_status: 1,
            mgr_status: employee.mgr_status,
            bc_status: 0,
            comp_id: employee.comp_id,
            bc_count: employee.bc_count,
            created_date: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
            modified_date: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
            bc_published_date: employee.bc_published_date
        }).then(function (response) {
            window.location.reload(); // to refresh the page.
            this.setState({ loading: false });
            this.loadingHide();
        }).catch(function (error) {
            window.location.reload(); // to refresh the page.
            this.setState({ loading: false });
            this.loadingHide();
        });
    }

    /**
    * This method is used to handle the manager approval mechanism.
    */
    managerApprove = async () => {
        const { employee } = this.props;
        this.handleClose();
        this.setState({ loading: true });
        this.loadingShow();
        var url = 'http://192.168.10.40:3210/UpdateReq/' + employee.emp_id + '/' + employee.comp_id;
        axios.post(url, {
            emp_uid: employee.emp_uid,
            emp_id: employee.emp_id,
            emp_fname: employee.emp_fname,
            emp_lname: employee.emp_lname,
            emp_fathername: employee.emp_fathername,
            emp_avatar: employee.emp_avatar,
            gender: employee.gender,
            date_of_birth: moment(employee.date_of_birth).format('YYYY-MM-DD'),
            qualification: employee.qualification,
            pan_number: employee.pan_number,
            date_of_joining: moment(employee.date_of_joining).format('YYYY-MM-DD'),
            relieving_date: moment(employee.relieving_date).format('YYYY-MM-DD'),
            emp_type: employee.emp_type,
            exit_type: employee.exit_type,
            designation: employee.designation,
            tech_expertise: employee.tech_expertise,
            flag_verification: employee.flag_verification,
            mgmt_status: employee.mgmt_status,
            mgr_status: 1,
            bc_status: 0,
            comp_id: employee.comp_id,
            bc_count: employee.bc_count,
            created_date: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
            modified_date: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
            bc_published_date: employee.bc_published_date
        }).then(function (response) {
            console.log(response);
            window.location.reload(); // to refresh the page.
            this.setState({ loading: false });
            this.loadingHide();
        }).catch(function (error) {
            console.log(error);
            window.location.reload(); // to refresh the page.
            this.setState({ loading: false });
            this.loadingHide();
        });
    }

    /**
    * This method is used to handle the updating blockchain status in DB.
    */
    updateBlockChainStatus = async (employee) => {
        var url = 'http://192.168.10.40:3210/UpdateReq/' + employee.emp_id + '/' + employee.comp_id;
        axios.post(url, {
            emp_uid: employee.emp_uid,
            emp_id: employee.emp_id,
            emp_fname: employee.emp_fname,
            emp_lname: employee.emp_lname,
            emp_fathername: employee.emp_fathername,
            emp_avatar: employee.emp_avatar,
            gender: employee.gender,
            date_of_birth: moment(employee.date_of_birth).format('YYYY-MM-DD'),
            qualification: employee.qualification,
            pan_number: employee.pan_number,
            date_of_joining: moment(employee.date_of_joining).format('YYYY-MM-DD'),
            relieving_date: moment(employee.relieving_date).format('YYYY-MM-DD'),
            emp_type: employee.emp_type,
            exit_type: employee.exit_type,
            designation: employee.designation,
            tech_expertise: employee.tech_expertise,
            flag_verification: employee.flag_verification,
            mgmt_status: employee.mgmt_status,
            mgr_status: employee.mgr_status,
            bc_status: 1,
            comp_id: employee.comp_id,
            bc_count: (employee.bc_count + 1),
            created_date: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
            modified_date: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
            bc_published_date: moment(new Date()).format('DD-MMM-YYYY HH:mm:ss')
        }).then(function (response) {
            console.log(response);
            window.location.reload(); // to refresh the page.
            this.setState({ loading: false });
            this.bcloadingHide();
        }).catch(function (error) {
            console.log(error);
            window.location.reload(); // to refresh the page.
            this.setState({ loading: false });
            this.bcloadingHide();
        });
    }

    etherBalanceCheck() {
        if (this.state.balance > 0) {
            this.handleOpen();
        } else {
            this.handleGasOpen();
        }
    }

    /**
    * This method is used to handle uploading data to the Blockchain .
    */
    uploadPersonalInfoToBlockChain = async () => {
        const { employee } = this.props;
        this.state.modalOpen = false;
        this.setState({ loading: true });
        this.bcloadingShow();
        try {
            const infura = ConstantsList.TestNetWork;
            const web3 = new Web3(new Web3.providers.HttpProvider(infura));
            web3.eth.defaultAccount = ConstantsList.FromAddress;
            var abi = EMPContract.interface;
            var pk = ConstantsList.PrivateKey;
            var address = ConstantsList.contractAddress;
            const contract = new web3.eth.Contract(JSON.parse(abi), address, {
                from: web3.eth.defaultAccount,
                gas: 3000000,
            })
            const functionAbi = contract.methods.addEmpPersonalInfo((employee.emp_uid).toString(), (employee.emp_id).toString(), (employee.emp_fname).toString(), (employee.emp_lname).toString(), (employee.emp_avatar).toString(), (employee.emp_fathername).toString(), (employee.gender).toString(), (employee.date_of_birth).toString(), (employee.qualification).toString(), (employee.pan_number).toString(), (employee.comp_id).toString()).encodeABI();
            web3.eth.getTransactionCount(web3.eth.defaultAccount, function (err, nonce) {
                console.log("nonce value is ", nonce);
                var details = {
                    "nonce": nonce,
                    "gasPrice": web3.utils.toHex(web3.utils.toWei('47', 'gwei')),
                    "gas": ConstantsList.gasAmount + nonce,
                    "to": address,
                    "value": 0,
                    "data": functionAbi,
                };
                const transaction = new EthereumTx(details);
                transaction.sign(Buffer.from(pk, 'hex'))
                var rawData = '0x' + transaction.serialize().toString('hex');
                web3.eth.sendSignedTransaction(rawData)
                    .on('transactionHash', function (hash) {
                        console.log(['transferToStaging Trx Hash:' + hash]);
                    })
                    .on('receipt', function (receipt) {
                        console.log(["transferToStaging Receipt:", receipt]);
                    })
                    .on('error', console.error);
            });
            setTimeout(async event => {
                this.uploadEmpInfoToBlockChain();
            }, 60000)
        } catch (err) {
            if ('No "from" address specified in neither the given options, nor the default options.' === err.message) {
                // this.setState({ errorMessage: 'Please verify the user account' });
            }
            this.setState({ loading: false });
            this.bcloadingHide();
        }
    }

    /**
    * This method is used to handle uploading data to the Blockchain .
    */
    uploadEmpInfoToBlockChain = async () => {
        const { employee } = this.props;
        this.state.modalOpen = false;
        this.setState({ loading: true });
        this.bcloadingShow();
        try {
            const infura = ConstantsList.TestNetWork;
            const web3 = new Web3(new Web3.providers.HttpProvider(infura));
            web3.eth.defaultAccount = ConstantsList.FromAddress;
            var abi = EMPContract.interface;
            var pk = ConstantsList.PrivateKey;
            var address = ConstantsList.contractAddress;
            const contract = new web3.eth.Contract(JSON.parse(abi), address, {
                from: web3.eth.defaultAccount,
                gas: 3000000,
            })
            const functionAbi = contract.methods.addEmpProfInfo((employee.date_of_joining).toString(), (employee.relieving_date).toString(), (employee.emp_type).toString(), (employee.exit_type).toString(), (employee.tech_expertise).toString(), (employee.designation).toString(), (employee.flag_verification).toString(), (moment(new Date()).format('DD-MMM-YYYY HH:mm:ss')).toString()).encodeABI();

            web3.eth.getTransactionCount(web3.eth.defaultAccount, function (err, nonce) {
                console.log("nonce value is ", nonce);
                var details = {
                    "nonce": nonce,
                    "gasPrice": web3.utils.toHex(web3.utils.toWei('47', 'gwei')),
                    "gas": ConstantsList.gasAmount + nonce,
                    "to": address,
                    "value": 0,
                    "data": functionAbi,
                };
                const transaction = new EthereumTx(details);
                transaction.sign(Buffer.from(pk, 'hex'))
                var rawData = '0x' + transaction.serialize().toString('hex');
                web3.eth.sendSignedTransaction(rawData)
                    .on('transactionHash', function (hash) {
                        console.log(['transferToStaging Trx Hash:' + hash]);
                    })
                    .on('receipt', function (receipt) {
                        console.log(["transferToStaging Receipt:", receipt]);
                    })
                    .on('error', console.error);
            });
            setTimeout(async event => {
                this.updateBlockChainStatus(employee);
            }, 50000)
        } catch (err) {
            if ('No "from" address specified in neither the given options, nor the default options.' === err.message) {
                // this.setState({ errorMessage: 'Please verify the user account' });
            }
            this.setState({ loading: false });
            this.bcloadingHide();
        }

    }

    /**
    * This method is used to handle the edit employee page navigation.
    */
    editEmployee = () => {
        const { employee, user, loginCompany } = this.props;
        this.props.history.push({
            pathname: `/EditEmployee`,
            state: { loginCompany: loginCompany, companyName: loginCompany, role: user, emp_id: employee.emp_id, selectedIndex: 0 }
        })
    }

    /**
    * This method is used to handle the display employee profile page navigation.
    */
    viewProfile = () => {
        const { employee, user, loginCompany } = this.props;
        this.props.history.push({
            pathname: `/ViewProfile`,
            state: { loginCompany: loginCompany, companyName: loginCompany, role: user, emp_id: employee.emp_id, selectedIndex: 0 }
        })
    }



    render() {
        const { active, bcactive } = this.state
        const { Row, Cell } = Table;
        const { employee, status, user, isUser, nodata, sno } = this.props;
        if (!nodata) {
            if (user === ConstantsList.HRUser) {
                return (
                    <Row >
                        <Cell textAlign="center">{sno + 1} </Cell>
                        <Cell textAlign="center" singleLine>{employee.emp_id}</Cell>
                        <Cell textAlign="center" singleLine>{employee.emp_uid}</Cell>
                        {this.renderImage(employee)}
                        {this.renderGender(employee)}
                        <Cell textAlign="left" singleLine>{(employee.qualification)}</Cell>
                        <Cell textAlign="center" singleLine>{moment((employee.date_of_joining)).format('DD-MMM-YYYY')}</Cell>
                        <Cell textAlign="center" singleLine>{this.renderRelDate()}</Cell>
                        {this.renderEmpType(employee)}
                        {this.renderExitType(employee)}
                        {this.getApprovalStatus(employee)}
                        {status ? true : (
                            <Cell textAlign="center">
                                <p><a style={{ cursor: 'pointer' }} onClick={() => this.editEmployee()}><u>Edit</u></a>/<span><a style={{ cursor: 'pointer' }} onClick={() => this.viewProfile()}><u>View</u></a></span></p>
                            </Cell>)}
                        <Dimmer active={active} inverted >
                            <Loader content='Loading..' />
                        </Dimmer>

                        <Dimmer active={bcactive} inverted >
                            <Loader content='Transaction is submitting to Blockchain, Please wait..' />
                        </Dimmer>

                        <Modal style={{ width: '500px', marginLeft: '-275px', marginTop: '-95px' }} open={this.state.modalOpen}
                            onClose={this.handleClose}>
                            <Modal.Content>
                                <p>The minimum fee (Gas) is chargeable to perform this transaction. Do you want to continue?</p>
                            </Modal.Content>
                            <Modal.Actions>
                                <Button negative onClick={this.handleClose}>No</Button>
                                <Button positive onClick={this.uploadPersonalInfoToBlockChain}>Yes</Button>
                            </Modal.Actions>
                        </Modal>

                        <Modal style={{ width: '500px', marginLeft: '-275px', marginTop: '-95px' }} open={this.state.gasdialog}
                            onClose={this.handleGasClose}>
                            <Modal.Content>
                                <p>You don't have enough fee(gas) to complete this transaction.</p>
                            </Modal.Content>
                            <Modal.Actions>
                                <Button style={{ backgroundColor: '#184fa2', color: '#bed4e1' }} onClick={this.handleGasClose}>OK</Button>
                            </Modal.Actions>
                        </Modal>
                    </Row>
                );
            } else if (user === ConstantsList.ManagementUser && employee.mgmt_status === 0 && employee.relieving_date !== "" && employee.relieving_date !== undefined) {
                return (
                    <Row >
                        <Cell textAlign="center">{sno + 1}</Cell>
                        <Cell textAlign="center" singleLine>{(employee.emp_id)}</Cell>
                        <Cell textAlign="center" singleLine>{employee.emp_uid}</Cell>
                        {this.renderImage(employee)}
                        {this.renderGender(employee)}
                        <Cell textAlign="left" singleLine>{(employee.qualification)}</Cell>
                        <Cell textAlign="center" singleLine>{moment((employee.date_of_joining)).format('DD-MMM-YYYY')}</Cell>
                        <Cell textAlign="center" singleLine>{this.renderRelDate()}</Cell>
                        {this.renderEmpType(employee)}
                        {this.renderExitType(employee)}
                        {isUser ? false : (
                            <Cell textAlign="center" singleLine negative>
                                <a style={{ cursor: 'pointer' }} onClick={() => this.handleOpen()}><u>Approve</u></a>
                            </Cell>
                        )}
                        <Dimmer active={active} inverted >
                            <Loader content='Loading..' />
                        </Dimmer>
                        <Modal style={{ width: '500px', marginLeft: '-275px', marginTop: '-95px' }} open={this.state.modalOpen}
                            onClose={this.handleClose}>
                            <Modal.Content>
                                <p>Do you want to approve?</p>
                            </Modal.Content>
                            <Modal.Actions>
                                <Button negative onClick={this.handleClose}>No</Button>
                                <Button positive onClick={this.managementApprove}>Yes</Button>
                            </Modal.Actions>
                        </Modal>
                    </Row >

                );
            } else if (user === ConstantsList.ManagerUser && employee.mgr_status === 0 && employee.relieving_date !== "" && employee.relieving_date !== undefined) {
                return (
                    <Row >
                        <Cell textAlign="center">{sno + 1}</Cell>
                        <Cell textAlign="center" singleLine>{(employee.emp_id)}</Cell>
                        <Cell textAlign="center" singleLine>{employee.emp_uid}</Cell>
                        {this.renderImage(employee)}
                        {this.renderGender(employee)}
                        <Cell textAlign="left" singleLine>{(employee.qualification)}</Cell>
                        <Cell textAlign="center" singleLine>{moment((employee.date_of_joining)).format('DD-MMM-YYYY')}</Cell>
                        <Cell textAlign="center" singleLine>{this.renderRelDate()}</Cell>
                        {this.renderEmpType(employee)}
                        {this.renderExitType(employee)}
                        {isUser ? false : (
                            <Cell textAlign="center" singleLine negative >
                                <a style={{ cursor: 'pointer' }} onClick={() => this.handleOpen()}><u>Approve</u></a>
                            </Cell>
                        )}
                        <Dimmer active={active} inverted >
                            <Loader content='Loading..' />
                        </Dimmer>
                        <Modal style={{ width: '500px', marginLeft: '-275px', marginTop: '-95px' }} open={this.state.modalOpen}
                            onClose={this.handleClose}>
                            <Modal.Content>
                                <p>Do you want to approve?</p>
                            </Modal.Content>
                            <Modal.Actions>
                                <Button negative onClick={this.handleClose}>No</Button>
                                <Button positive onClick={this.managerApprove}>Yes</Button>
                            </Modal.Actions>
                        </Modal>
                    </Row>
                );
            } else {
                return null;
            }
        } else {
            return (<Row>
                <Cell colSpan="11" textAlign="center">
                    <p style={{ fontSize: '20px', textAlign: 'center', color: 'brown' }}>No records found</p>
                </Cell>
            </Row>);
        }
    }
}

export default RequestRow;