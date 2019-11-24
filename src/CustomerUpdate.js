import React from 'react';
import axios from 'axios';

class CustomerUpdate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: this.props.name,
            driverLicense: this.props.prevDriversLicence,
            phone: this.props.phone
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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
        await axios.put(`http://localhost:5000/customers/${this.props.prevDriversLicence}`, {
            driverLicense,
            name,
            phone
        });
        alert('submit was sent');
        this.props.finishUpdate();
    }

    render() {
        return (
        <form>
            <label>
                Update Customer--
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
        </form>);
    }
}

export default CustomerUpdate;