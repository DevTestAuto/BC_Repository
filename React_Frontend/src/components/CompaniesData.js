import React, { Component } from 'react';
import { Table } from 'semantic-ui-react';

/**
 * This class is used to create a row based on the request.
 */
class CompaniesData extends Component {

    /**
      * This method is used to handle the rendering of company status
      */
    renderCompStatus() {
        const { Cell } = Table;
        const { companies } = this.props;
        if (companies.status === "2" || companies.status === 2) {
            return (
                <Cell textAlign="center" singleLine style={{ color: 'red' }}>In Active</Cell>
            );
        } else if (companies.status === "1" || companies.status === 1) {
            return (
                <Cell textAlign="center" singleLine style={{ color: 'green' }}>Active</Cell>
            );
        } else {
            return (
                <Cell textAlign="center" singleLine >-</Cell>
            );
        }
    }

    /**
    * This method is used to handle the edit company page navigation.
    */
    editCompany = () => {
        const { companies, history } = this.props;
        history.push({
            pathname: `/EditCompany`,
            state: { comp_id: companies.comp_id }
        })
    }

    render() {
        const { Row, Cell } = Table;
        const { companies, sid } = this.props;
        return (
            <Row >
                <Cell textAlign="center">{sid + 1} </Cell>
                <Cell textAlign="left" singleLine>{(companies.comp_name)}</Cell>
                <Cell textAlign="center" singleLine>{(companies.comp_type)}</Cell>
                <Cell textAlign="center" singleLine><a href={(companies.website)} target="_blank">{(companies.website)}</a></Cell>
                {this.renderCompStatus()}
                <Cell textAlign="center"><a style={{ cursor: 'pointer' }} onClick={() => this.editCompany()}><u>Edit</u></a></Cell>
            </Row>
        );
    }
}

export default CompaniesData;