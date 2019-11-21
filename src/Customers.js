import React from 'react';
import axios from 'axios';

class Customers extends React.Component {
    constructor(props) {
        super(props);
        this.state = { customers: [] };
        this.handleGetCustomerClick = this.handleGetCustomerClick.bind(this);
        this.handleDeleteClick = this.handleDeleteClick.bind(this);
    }

    async handleGetCustomerClick(event) {
        event.preventDefault();
        const response = await axios.get('https://super-rent.appspot.com/customers');
        const customers = response.data;
        alert('Loaded customer data from server!');
        console.log(customers);
        this.setState({ customers });
    }

    async handleDeleteClick(event) {
        event.preventDefault();

        const id = event.target.id;
        alert(`id is ${id}`);

        await axios.delete(`https://super-rent.appspot.com/customers/${id}`);
        const customers = this.state.customers.filter(customer => customer.driversLicence !== id);
        this.setState({customers});
    }

    render() {
        const customers = this.state.customers;

        // const customerTable = customers.map(function (c) {
        //     return <div key={c.driversLicence}><li>{c.driversLicence}</li>
        //     <button style={{cursor: 'pointer'}}>Delete</button> </div>
        // });

        const customerTable = customers.map(c => <li>
            <p>{c.driversLicence}</p>
            <button onClick={this.handleDeleteClick} id={c.driversLicence}>Delete</button>
        </li>);

        return <div>
            <h1>Customers</h1>
            <button onClick={this.handleGetCustomerClick} style={{cursor: 'pointer'}}>get all customers</button>
            <ul>
                {customerTable}
            </ul>
        </div>
    }
}

export default Customers;

//