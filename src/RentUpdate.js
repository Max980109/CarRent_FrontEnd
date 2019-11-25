import React from "react";
import axios from "axios"
import TextField from "@material-ui/core/TextField";


class RentUpdate extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            confNum: this.props.confNum,
            driversLicence: this.props.driversLicence,
            fromDate: this.props.fromDate,
            toDate: this.props.toDate,
            rentId: this.props.rentId,
            vehicleLicence: this.props.vehicleLicence,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleTypeSelectChange = this.handleTypeSelectChange.bind(this);
    }

    handleChange(event) {
        const inputId = event.target.id;
        const input = event.target.value;
        if (inputId === 'driverLicenceInput') this.setState({driversLicence: input});
        if (inputId === 'vehicleLicenceInput') this.setState({vehicleLicenceInput: input});
        if (inputId === 'fromDateInput') this.setState({fromDate: input});
        if (inputId === 'toDateInput') this.setState({toDate: input});
    }

    async handleSubmit(event) {
        event.preventDefault();
        const {driversLicence, fromDate, toDate, vehicleLicence,confNum, rentId} = this.state;
        try {
            await axios.put(`https://super-rent.appspot.com/rents/${this.state.rentId}`, {
                confNum,
                driversLicence,
                fromDate,
                toDate,
                vehicleLicence,
                rentId
            });
        } catch (e) {
            alert("error: check you input before submit")
        }
        this.props.finishUpdate();
    }

    handleTypeSelectChange(event) {
        event.preventDefault();
        this.setState({vehicleTypeName: event.target.value });
    }

    render() {
        return (
            <div>
                <form>
                    <h3> Update Rent</h3>
                    <h5> (auto generate rentID, refresh to show result）</h5>
                    <TextField id="vehicleLicenceInput" value={this.state.vehicleLicence} label="Vehicle Licence" onChange={this.handleChange} />
                    <TextField id="driversLicenceInput" value={this.state.driversLicence} label="Drivers Licence" onChange={this.handleChange} />
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
export default RentUpdate;