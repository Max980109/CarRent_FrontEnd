import React from 'react';
import axios from 'axios';

class VehicleUpdate extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            vehicleLicence: this.props.previousLicense,
            make: this.props.make,
            model: this.props.model,
            year: this.props.year,
            status: this.props.status,
            vehicleTypeName: this.props.vehicleTypeName,
            location: this.props.location,
            city: this.props.city
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        const inputId =event.target.id;
        const input = event.target.value;
        if (inputId === 'vehicleLicenseInput') this.setState({vehicleLicence: input});
        if (inputId === 'makeInput') this.setState({make: input});
        if (inputId === 'yearInput') this.setState({year: input});
        if (inputId === 'statusInput') this.setState({vehicleTypeName: input});
        if (inputId === 'vehicleTypeNameInput') this.setState({location: input});
        if (inputId === 'cityInput') this.setState({city: input});
    }

    async handleSubmit(event) {
        event.preventDefault();
        const {vehicleLicence, make, model, year, status, vehicleTypeName, location, city} = this.state;
        await axios.put(`https://super-rent.appspot.com/vehicles/${this.props.previousLicense}`, {
            vehicleLicence,
            make,
            model,
            year,
            status,
            vehicleTypeName,
            location,
            city
        });
        this.props.finishUpdate();
    }


    render(){
        return (
            <form>
                <label>
                    Update Vehicle--
                    VehicleLicense:
                    <input type="text" id="vehicleLicenseInput" value={this.state.vehicleLicence} onChange={this.handleChange} />
                </label>
                <label>
                    Make:
                    <input type="text" id="makeInput" value={this.state.make} onChange={this.handleChange} />
                </label>
                <label>
                    Model:
                    <input type="text" id="modelInput" value={this.state.model} onChange={this.handleChange} />
                </label>
                <label>
                    Year:
                    <input type="text" id="yearInput" value={this.state.year} onChange={this.handleChange} />
                </label>
                <label>
                    Status:
                    <input type="text" id="statusInput" value={this.state.status} onChange={this.handleChange} />
                </label>
                <label>
                    Type:
                    <input type="text" id="typeInput" value={this.state.vehicleTypeName} onChange={this.handleChange} />
                </label>
                <label>
                    Location:
                    <input type="text" id="locationInput" value={this.state.location} onChange={this.handleChange} />
                </label>
                <label>
                    City:
                    <input type="text" id="cityInput" value={this.state.city} onChange={this.handleChange} />
                </label>
                <button onClick={this.handleSubmit}>Submit</button>
            </form>
        );
    }
}

export default VehicleUpdate;
