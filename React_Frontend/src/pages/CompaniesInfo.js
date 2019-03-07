
import React, { Component } from 'react';
import "react-tabs/style/react-tabs.css";
import Layout from '../components/Layout';
import { Button, Table, Grid, Image } from 'semantic-ui-react';
import logo from '../images/header-left.png';
import CompaniesData from '../components/CompaniesData';
import Footer from '../components/Footer';
import axios from 'axios';

require('../styles.css');
class CompaniesInfo extends Component {

    state = {
        companyInfo: [],
    };

    async componentDidMount() {
        this.getCompaniesList();
    }

    /**
     * This method is used to fetch the companies data from the database.
     */
    getCompaniesList = () => {
        var url = 'http://ec2-3-84-93-231.compute-1.amazonaws.com:3210/getCompList';
        axios.get(url)
            .then((compList) => {
                console.log(compList.data);
                this.setState({
                    companyInfo: compList.data,
                })
            })
    }

    /**
     * This method is used to handle logout button navigation.
     */
    logout = () => {
        this.props.history.push(`/`);
    }

    renderCompanyList() {
        const { Row, Cell } = Table;
        var rempid = -1;
        if (this.state.companyInfo.length > 0 && this.state.companyInfo !== undefined &&
            this.state.companyInfo !== null) {

            return this.state.companyInfo.map((company, index) => {
                rempid = rempid + 1;
                return (
                    <CompaniesData
                        key={index}
                        id={index}
                        sid={rempid}
                        companies={company}
                        history={this.props.history}
                    />
                );
            });
        } else {
            return (
                <Row>
                    <Cell colSpan="6" textAlign="center">
                        <p style={{ fontSize: '20px', textAlign: 'center', color: 'brown' }}>No records found</p>
                    </Cell>
                </Row>);
        }
    }

     /**
     * This method is used to handle Add Company button navigation.
     */
    addCompany = () => {
        this.props.history.push(`/AddCompany`);
    }

    render() {
        const { Row, HeaderCell, Body } = Table;
        return (
            <Layout>
                <div id="header-bg">
                <Grid>
                <Grid.Row columns={2} style={{ marginRight: '5px', paddingBottom: '0px', paddingTop: '10px' }}>
                    <Grid.Column width={9}>
                        <Image src={logo} alt="logo" />
                    </Grid.Column>
                    <Grid.Column textAlign='right' width={6}>
                        <div style={{ paddingTop: '45px', color: '#6f88c0' }}>Logged In User: <b style={{ color: 'white' }}>Admin</b></div>
                    </Grid.Column>
                    <Grid.Column style={{ cursor: 'pointer' }} textAlign='right' width={1} onClick={this.logout} >
                        <div style={{ paddingTop: '45px' }}><b style={{ color: '#92a5cf' }}>Logout</b></div>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
                </div>

                <Grid style={{ marginTop: '10px' }}>
                <Grid.Row>
                        <Grid.Column width={16} textAlign='right' style={{ marginLeft: '-20px' }}>
                            <Button onClick={this.addCompany} style={{ backgroundColor: '#184fa2', color: '#bed4e1' }} content="ADD COMPANY" icon="add circle" floated="right" />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>

                <div id='container' style={{ marginLeft: '20px', marginRight: '20px', marginBottom: '25px', marginTop: '15px' }}>
                    <Table celled striped size='large' style = {{ display: 'inline-table'}}>
                        <Table.Header>
                            <Row textAlign="center">
                                <HeaderCell style={{ textAlign: 'center', fontSize: '12px' }} singleLine>S.No</HeaderCell>
                                <HeaderCell style={{ textAlign: 'center', fontSize: '12px' }} singleLine>Company Name</HeaderCell>
                                <HeaderCell style={{ textAlign: 'center', fontSize: '12px' }} singleLine>Company Type</HeaderCell>
                                <HeaderCell style={{ textAlign: 'center', fontSize: '12px' }} singleLine>Website</HeaderCell>
                                <HeaderCell style={{ textAlign: 'center', fontSize: '12px' }} singleLine>Status</HeaderCell>
                                <HeaderCell style={{ textAlign: 'center', fontSize: '12px' }} singleLine>Action</HeaderCell>
                            </Row>
                        </Table.Header>
                        <Body>{this.renderCompanyList()}</Body>
                    </Table>
                </div>
                <Footer />
            </Layout>
        );
    }
}

export default CompaniesInfo;