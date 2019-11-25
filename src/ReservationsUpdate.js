import React from "react";
import axios from "axios";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

class ReservationsUpdate extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            driverLicense: this.props.driverLicense,
            confNum: this.props.prevconfNum,
            fromDate: this.props.fromDate,
            toDate: this.props.toDate,
            vehicleTypeName: this.props.vehicleTypeName
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleTypeSelectChange = this.handleTypeSelectChange.bind(this);
    }

    handleChange(event) {
        const inputId = event.target.id;
        const input = event.target.value;
        if (inputId === 'driverLicenseInput') this.setState({driverLicense: input});
        if (inputId === 'fromDateInput') this.setState({fromDate: input});
        if (inputId === 'toDateInput') this.setState({toDate: input});
    }

    async handleSubmit(event) {
        event.preventDefault();
        const { driverLicense,  fromDate, toDate, vehicleTypeName } = this.state;
        let data = null;
        alert(`${fromDate}`);
        try {
            const res = await axios.get(`http://localhost:5000/customers/${driverLicense}`);
            data = res.data.driverLicense;
        } catch (e) {
            alert("should create customers first");
        }
        if (data === driverLicense) {
            try {
                await axios.put(`http://localhost:5000/customers/${this.state.confNum}`, {
                    driverLicense,
                    fromDate,
                    toDate,
                    vehicleTypeName
                });
            } catch (e) {
                alert("error: check you input before submit")
            }
            this.props.finishUpdate();
        }
    }

    handleTypeSelectChange(event) {
        event.preventDefault();
        this.setState({vehicleTypeName: event.target.value });
    }

    render() {
        return (
            <div>
                <form>
                    <h3> Update Reservations</h3>
                    <TextField id="driverLicenseInput" label="DriversLicense" value={this.state.driverLicense} onChange={this.handleChange} />
                    <Select id="vehicleTypeNameInput" onChange={this.handleTypeSelectChange} value={this.state.vehicleTypeName} >
                        <MenuItem value="Compact">Compact</MenuItem>
                        <MenuItem value="Mid-size">Mid-size</MenuItem>
                        <MenuItem value="Standard">Standard</MenuItem>
                        <MenuItem value="Full-size">Full-size</MenuItem>
                        <MenuItem value="SUV">SUV</MenuItem>
                        <MenuItem value="Truck">Truck</MenuItem>
                    </Select>

                    <TextField onChange={this.handleChange}
                               id="fromDateInput"
                               label="From"
                               type="date"
                               InputLabelProps={{
                                   shrink: true,
                               }}
                    />
                    <TextField onChange={this.handleChange}
                               id="toDateInput"
                               label="To"
                               type="date"
                               InputLabelProps={{
                                   shrink: true,
                               }}
                    />
                    <button onClick={this.handleSubmit}>Submit</button>
                </form>
            </div>
        );
    }




}

export default ReservationsUpdate;