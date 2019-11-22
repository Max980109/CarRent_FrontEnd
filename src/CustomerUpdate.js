import React from 'react';
import axios from 'axios';

class CustomerUpdate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: this.props.name,
            driversLicence: this.props.prevDriversLicence,
            phone: this.props.phone
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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
        //alert('submit will be sent');
        await axios.put(`https://super-rent.appspot.com/customers/${this.props.prevDriversLicence}`, {
            driversLicence,
            name,
            phone
        });
        alert('submit was sent');
        this.props.finishUpdate();
       // this.setState({ driversLicence: '', name: '', phone: ''});
    }

    render() {
        return (
        <form>
            <label>
                Update Customer--
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
        </form>);
    }
}

export default CustomerUpdate;