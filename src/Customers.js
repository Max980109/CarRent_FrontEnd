import React from 'react';
import axios from 'axios';
import CustomerUpdate from "./CustomerUpdate";

class Customers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            customers: [],
            name: '',
            driverLicense: '',
            phone: '',
            updateView: null
        };
        this.handleDeleteClick = this.handleDeleteClick.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleUpdateClick = this.handleUpdateClick.bind(this);
        this.finishUpdate = this.finishUpdate.bind(this);
    }

    async componentDidMount() {
        this.getCustomers();
    }

    async getCustomers() {
        const response = await axios.get('http://localhost:5000/customers');
        const customers = response.data;
        this.setState({customers});
    }

    async handleDeleteClick(event) {
        event.preventDefault();

        const id = event.target.id;
        alert(`id is ${id}`);

        await axios.delete(`http://localhost:5000/customers/${id}`);
        const customers = this.state.customers.filter(customer => customer.driverLicense !== id);
        this.setState({customers});
        alert("delete successfully");
    }

    handleChange(event) {
        const inputId = event.target.id;
        const input = event.target.value;
        if (inputId === 'driverLicenseInput') this.setState({driverLicense: input});
        if (inputId === 'nameInput') this.setState({name: input});
        if (inputId === 'phoneInput') this.setState({phone: input});
    }

    async handleSubmit(event) {
        event.preventDefault();
        const { driverLicense, name, phone } = this.state;
        alert('submit will be sent');
        await axios.post('http://localhost:5000/customers', {
            driverLicense,
            name,
            phone
        });
        alert('submit was sent');
        this.setState({ driverLicense: '', name: '', phone: ''});
        alert("add successfully");
    }

    async handleUpdateClick(event) {
        event.preventDefault();
        const id = event.target.id;
        const response = await axios.get(`http://localhost:5000/customers/${id}`);
        const customer = response.data;
        const { name, phone, driverLicense } = customer;
        this.setState({updateView: <CustomerUpdate name={name} phone={phone} prevDriversLicence={driverLicense} finishUpdate={this.finishUpdate}/>});
    }

    finishUpdate() {
        this.setState({updateView: null});
        this.getCustomers();
    }

        render() {
        if (this.state.updateView)
            return this.state.updateView;

        const customers = this.state.customers;

        const customerTable = customers.map(c => <li>
            <p>{`licence: ${c.driverLicense} --- name:${c.name}  --- phone: ${c.phone}`}</p>
            <button onClick={this.handleDeleteClick} id={c.driverLicense}>Delete</button>
            <button onClick={this.handleUpdateClick} id ={c.driverLicense}>Update</button>
        </li>);

        return <div>
            <h1>Customers</h1>
            <form>
                <label>
                    Add New Customer (refresh to show results)--
                    DriverLicence:
                    <input type="text" id="driverLicenseInput" value={this.state.driverLicense} onChange={this.handleChange} />
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