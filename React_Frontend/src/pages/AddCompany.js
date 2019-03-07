
import React, { Component } from 'react';
import Layout from '../components/Layout';
import { Button, Grid, Form, Message, Dropdown, Image } from 'semantic-ui-react';
import logo from '../images/header-left.png';
import Footer from '../components/Footer';
import axios from 'axios';
import moment from 'moment';
require('../styles.css');

/**
* This component is used to handle Adding new Company
*/
class AddCompany extends Component {

    state = {
        errorMessage: '',
        companyName: '',
        compType: '',
        website: '',
    };

    handleCompTypeDropDown = (e, data) => {
        this.setState({ compType: data.value, errorMessage: '' });
    }

    async componentDidMount() {
        document.body.style.backgroundColor = "#e5e7f4";
    }

    /**
     * This method is used to add the companies data to the database.
     */
    addCompany() {
        const { companyName, compType, website } = this.state;
        var url = 'http://ec2-3-84-93-231.compute-1.amazonaws.com:3210/addCompReq';
        axios.post(url, {
            comp_name: companyName,
            comp_type: compType,
            website: website,
            created_date: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
            modified_date: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        }).then(function (response) {
            console.log(response);
        })
            .catch(function (error) {
                console.log(error);
            });
        setTimeout(async event => {
            this.compInfo();
        }, 1000)
    }

    /**
   * This method is used to handle Company info page navigation
   */
    compInfo = () => {
        this.props.history.push(`/CompaniesInfo`);
    }

    /**
     * This method is used to handle View Records button navigation
     */
    submitRecord = async event => {

        const { companyName, compType, website } = this.state;

        if (companyName === "") {
            this.setState({ errorMessage: 'Please enter Company Name' });
        } else if (compType === "") {
            this.setState({ errorMessage: 'Please select Company Type' });
        } else if (website === "") {
            this.setState({ errorMessage: 'Please enter Website' });
        } else if (!this.isUrlValid(website)) {
            this.setState({ errorMessage: 'Please enter valid Website address' });
        } else {
            this.addCompany();
        }
    }

    isUrlValid = (website) => {
        var res = website.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
        if (res == null)
            return false;
        else
            return true;
    }

    /**
     * This method is used to handle logout button navigation.
     */
    logout = () => {
        this.props.history.push(`/`);
    }

    render() {
        return (
            <Layout >
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

                <div>
                    <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                        <div>
                            <Grid >
                                <Grid.Row style={{ marginLeft: '80px', marginRight: '80px', marginTop: '60px', marginBottom: '40px' }}>
                                    <Grid.Column>
                                        <Message style={{ padding: '5px', textAlign: 'center', marginTop: '-20px', marginBottom: '-8px' }} error content={this.state.errorMessage} />
                                    </Grid.Column>
                                </Grid.Row>

                                <Grid.Row style={{ marginLeft: '450px', padding: '6px' }}>
                                    <Grid.Column width={16}>
                                        <div style={{ width: '388px' }}>
                                            <label>Company Name:</label>
                                            <input style={{ marginTop: '5px' }}
                                                value={this.state.companyName}
                                                placeholder='Enter Company Name'
                                                onChange={event =>
                                                    this.setState({ companyName: event.target.value, errorMessage: '' })}
                                            />
                                        </div>
                                    </Grid.Column>
                                </Grid.Row>

                                <Grid.Row style={{ marginLeft: '450px', padding: '6px' }}>
                                    <Grid.Column width={16} >
                                        <div style={{ width: '388px' }}>
                                            <label>Company Type:</label>
                                            <Dropdown selection style={{ marginTop: '5px' }}
                                                className='icon right'
                                                fluid
                                                labeled
                                                icon='dropdown'
                                                right='true'
                                                options={compTypeOptions}
                                                placeholder='Select Company Type'
                                                value={this.state.compType}
                                                onChange={this.handleCompTypeDropDown}
                                            />
                                        </div>
                                    </Grid.Column>
                                </Grid.Row>

                                <Grid.Row style={{ marginLeft: '450px', padding: '6px' }}>
                                    <Grid.Column width={16}>
                                        <div style={{ width: '388px' }}>
                                            <label>Website:</label>
                                            <input style={{ marginTop: '5px' }}
                                                value={this.state.website}
                                                placeholder='Enter Website'
                                                onChange={event =>
                                                    this.setState({ website: event.target.value, errorMessage: '' })}
                                            />
                                        </div>
                                    </Grid.Column>
                                </Grid.Row>



                                < Grid.Row style={{ marginLeft: '450px' }}>
                                    <Grid.Column textAlign='right' width={8}>
                                        <Button color='red' style={{ marginRight: '10px', color: 'white' }} onClick={this.compInfo}>
                                            BACK
                                        </Button>
                                        <Button style={{ color: 'white', backgroundColor: '#3b896f' }} onClick={this.submitRecord}>
                                            SUBMIT
                                        </Button>

                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </div>
                    </Form>
                </div>
                <Footer />
            </Layout>

        );
    }

}

const compTypeOptions = [
    { key: 'Type1', text: 'Type1', value: 'Type1' },
    { key: 'Type2', text: 'Type2', value: 'Type2' },
    { key: 'Type3', text: 'Type3', value: 'Type3' }
]

export default AddCompany;