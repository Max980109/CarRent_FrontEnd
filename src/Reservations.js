import React from "react";
import axios from "axios";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import ReservationsUpdate from "./ReservationsUpdate";

class Reservations extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            reservations: [],
            confNum: '',
            driversLicence: '',
            fromDate: '',
            toDate: '',
            vehicleTypeName: '',
            updateView: null
        };
        this.handleDeleteClick = this.handleDeleteClick.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleUpdateClick = this.handleUpdateClick.bind(this);
        this.finishUpdate = this.finishUpdate.bind(this);
        this.handleTypeSelectChange = this.handleTypeSelectChange.bind(this);
        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
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
        await axios.delete(`https://super-rent.appspot.com/reservations/${id}`);
        const reservations = this.state.reservations.filter(r => r.driversLicence !== id);
        this.setState({reservations});
        alert("delete successfully");
    }

    handleChange(event) {
        event.preventDefault();
        const inputId = event.target.id;
        const input = event.target.value;
        if (inputId === 'driverLicenceInput') this.setState({driversLicence: input});
        if (inputId === 'fromDateInput') this.setState({fromDate: input});
        if (inputId === 'toDateInput') this.setState({toDate: input});
    }

    handleSearchChange(event) {
        event.preventDefault();
        this.setState({confNum: event.target.value });
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
        alert("add successfully");
    }

    async handleSearchSubmit(event) {
        event.preventDefault();
        const confNum = this.state.confNum;
        try {
            const res = await axios.get(`https://super-rent.appspot.com/reservations/${confNum}`);
            const reservations = res.data;
            this.setState({reservations: [reservations], confNum: ''});
        }catch (e) {
            alert("error: your confirmation number is incorrect or not exist");
        }
    }

    async handleUpdateClick(event) {
        event.preventDefault();
        const id = event.target.id;
        const response = await axios.get(`https://super-rent.appspot.com/reservations/${id}`);
        const reservations = response.data;
        const { confNum,
            driversLicence,
            fromDate,
            toDate,
            vehicleTypeName} = reservations;
        this.setState({updateView: <ReservationsUpdate prevconfNum={confNum} driversLicence={driversLicence} fromDate={fromDate}
                                                       toDate={toDate} vehicleTypeName = {vehicleTypeName} finishUpdate={this.finishUpdate}/>});
    }

    handleTypeSelectChange(event) {
        event.preventDefault();
        this.setState({vehicleTypeName: event.target.value });
    }

    finishUpdate() {
        this.setState({updateView: null});
        this.getReservations();
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
                <h5> (auto generate confNum, refresh to show result）</h5>
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
            <h3> Search Reservation by confNum (refresh to show initial results)</h3>
            <form>
                <TextField id="confNumInput" label="confNum" onChange={this.handleSearchChange} />
                <button onClick={this.handleSearchSubmit}>Search</button>
            </form>

            <ul style={{listStyle: 'none'}}>
                <h4>Found {reservationTable.length} items</h4>
                {reservationTable}
            </ul>
        </div>
    }
}

export default Reservations;