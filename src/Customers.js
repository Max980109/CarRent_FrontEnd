import React from 'react';
import axios from 'axios';
import CustomerUpdate from "./CustomerUpdate";

class Customers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            customers: [],
            name: '',
            driversLicence: '',
            phone: '',
            updateView: null
        };
        // this.handleGetCustomerClick = this.handleGetCustomerClick.bind(this);
        this.handleDeleteClick = this.handleDeleteClick.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleUpdateClick = this.handleUpdateClick.bind(this);
        this.finishUpdate = this.finishUpdate.bind(this);
    }

    async componentDidMount() {
        this.getCustomers();
    }

    async componentDidUpdate() {
        this.getCustomers();
    }

    async getCustomers() {
        const response = await axios.get('https://super-rent.appspot.com/customers');
        const customers = response.data;
        this.setState({customers});
    }

    // async handleGetCustomerClick(event) {
    //     event.preventDefault();
    //     const response = await axios.get('https://super-rent.appspot.com/customers');
    //     const customers = response.data;
    //     alert('Loaded customer data from server!');
    //     console.log(customers);
    //     this.setState({ customers });
    // }

    async handleDeleteClick(event) {
        event.preventDefault();

        const id = event.target.id;
        alert(`id is ${id}`);

        await axios.delete(`https://super-rent.appspot.com/customers/${id}`);
        const customers = this.state.customers.filter(customer => customer.driversLicence !== id);
        this.setState({customers});
    }

    handleChange(event) {
        const inputId = event.target.id;
        const input = event.target.value;
        if (inputId === 'driversLicenceInput') this.setState({driversLicence: input});
        if (inputId === 'nameInput') this.setState({name: input});
        if (inputId === 'phoneInput') this.setState({phone: input});
    }

    async handleSubmit(event) {
        event.preventDefault();
        const { driversLicence, name, phone } = this.state;
        alert('submit will be sent');
        await axios.post('https://super-rent.appspot.com/customers', {
            driversLicence,
            name,
            phone
        });
        alert('submit was sent');
        this.setState({ driversLicence: '', name: '', phone: ''});
    }

    async handleUpdateClick(event) {
        event.preventDefault();
        const id = event.target.id;
        const response = await axios.get(`https://super-rent.appspot.com/customers/${id}`);
        const customer = response.data;
        const { name, phone, driversLicence } = customer;

        this.setState({updateView: <CustomerUpdate name={name} phone={phone} prevDriversLicence={driversLicence} finishUpdate={this.finishUpdate}/>});

        //this.setState({updateView: false});
    }

    finishUpdate() {
        //event.preventDefault();
        this.setState({updateView: null});
    }

        render() {
        if (this.state.updateView)
            return this.state.updateView;

        const customers = this.state.customers;

        // const customerTable = customers.map(function (c) {
        //     return <div key={c.driversLicence}><li>{c.driversLicence}</li>
        //     <button style={{cursor: 'pointer'}}>Delete</button> </div>
        // });

        const customerTable = customers.map(c => <li>
            <p>{`licence: ${c.driversLicence} --- name:${c.name}  --- phone: ${c.phone}`}</p>
            <button onClick={this.handleDeleteClick} id={c.driversLicence}>Delete</button>
            <button onClick={this.handleUpdateClick} id ={c.driversLicence}>Update</button>
        </li>);

        return <div>
            <h1>Customers</h1>
            <form>
                <label>
                    Add New Customer--
                    DriverLicence:
                    <input type="text" id="driversLicenceInput" value={this.state.driversLicence} onChange={this.handleChange} />
                </label>
                <label>
                    Name:
                    <input type="text" id="nameInput" value={this.state.name} onChange={this.handleChange} />
                </label>
                <label>
                    Phone:
                    <input type="text" id="phoneInput" value={this.state.phone} onChange={this.handleChange} />
                </label>
                <button onClick={this.handleSubmit}>Submit</button>
            </form>
            <ul style={{listStyle: 'none'}}>
                {customerTable}
            </ul>
        </div>
    }
}

export default Customers;

//