import React from "react";
import axios from "axios";
import CustomerUpdate from "./CustomerUpdate";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

class Reservations extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            reservations: [],
            confNum: '',
            driversLicence: '',
            fromDate: '',
            toDate: '',
            vehicleTypeName: ''
        };
        this.handleDeleteClick = this.handleDeleteClick.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleUpdateClick = this.handleUpdateClick.bind(this);
        this.finishUpdate = this.finishUpdate.bind(this);
        this.handleTypeSelectChange = this.handleTypeSelectChange.bind(this);
    }

    async componentDidMount() {
        this.getReservations();
    }

    async getReservations() {
        const response = await axios.get('https://super-rent.appspot.com/reservations');
        const reservations = response.data;
        this.setState({reservations});
    }

    async handleDeleteClick(event) {
        event.preventDefault();
        const id = event.target.id;
        await axios.delete(`http://localhost:5000/customers/${id}`);
        const customers = this.state.customers.filter(customer => customer.driverLicense !== id);
        this.setState({customers});
    }

    handleChange(event) {
        const inputId = event.target.id;
        const input = event.target.value;
        if (inputId === 'driverLicenceInput') this.setState({driversLicence: input});
        if (inputId === 'fromDateInput') this.setState({fromDate: input});
        if (inputId === 'toDateInput') this.setState({toDate: input});
    }

    async handleSubmit(event) {
        event.preventDefault();
        const driversLicence = this.state.driversLicence;
        const fromDate = this.state.fromDate;
        const toDate = this.state.toDate;
        const vehicleTypeName = this.state.vehicleTypeName;
        let  data = null;
        try {
            const response = await axios.get(`https://super-rent.appspot.com/customers/${driversLicence}`);
            data = response.data.driversLicence;
        }catch (e) {
            alert("you should create create the customer first")
        }
        if (data === driversLicence) {
            await axios.post('https://super-rent.appspot.com/reservations', {
                driversLicence,
                fromDate,
                toDate,
                vehicleTypeName
            });
        }
        this.setState({ driversLicence: '', fromDate: '', toDate: '', vehicleTypeName: ''});
    }

    async handleUpdateClick(event) {
        event.preventDefault();
        const id = event.target.id;
        const response = await axios.get(`http://localhost:5000/customers/${id}`);
        const customer = response.data;
        const { name, phone, driverLicense } = customer;
        this.setState({updateView: <CustomerUpdate name={name} phone={phone} prevDriversLicence={driverLicense} finishUpdate={this.finishUpdate}/>});
    }

    handleTypeSelectChange(event) {
        event.preventDefault();
        this.setState({vehicleTypeName: event.target.value });
    }

    finishUpdate() {
        this.setState({updateView: null});
        this.getCustomers();
    }

    render() {
        if (this.state.updateView)
            return this.state.updateView;

        const reservations = this.state.reservations;

        const reservationTable = reservations.map(r => <li>
            <p>{`ConfNum: ${r.confNum} --- DriversLicence:${r.driversLicence}  --- FromDate: ${r.fromDate} ---
            ToDate: ${r.toDate} ---VehicleType: ${r.vehicleTypeName}`}</p>
            <button onClick={this.handleDeleteClick} id={r.confNum}>Delete</button>
            <button onClick={this.handleUpdateClick} id ={r.confNum}>Update</button>
        </li>);

        return <div>
            <h1>Reservations</h1>
            <form>
                <h3> Add New Reservations</h3>
                <h5> (auto generate confNum）</h5>
                <TextField id="driverLicenceInput" label="DriversLicence" onChange={this.handleChange} />
                <Select id="vehicleTypeNameInput" onChange={this.handleTypeSelectChange} >
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
            <ul style={{listStyle: 'none'}}>
                <h4>Found {reservationTable.length} items</h4>
                {reservationTable}
            </ul>
        </div>
    }
}

export default Reservations;