import React from "react";
import axios from "axios"
import CustomerUpdate from "./CustomerUpdate";
import TextField from "@material-ui/core/TextField";



class Rents extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            rents: [],
            confNum: null,
            driversLicence: '',
            fromDate: '',
            toDate: '',
            rentId: '',
            vehicleLicence: '',
        };
        this.handleDeleteClick = this.handleDeleteClick.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleUpdateClick = this.handleUpdateClick.bind(this);
        this.finishUpdate = this.finishUpdate.bind(this);
    }

    async componentDidMount() {
        this.getRents();
    }

    async getRents() {
        const response = await axios.get('https://super-rent.appspot.com/rents');
        const rents = response.data;
        this.setState({rents});
    }

    async handleDeleteClick(event) {
        event.preventDefault();
        const id = event.target.id;
        await axios.delete(`https://super-rent.appspot.com/rents/${id}`);
        const rents = this.state.rents.filter(rent => rent.driverLicense !== id);
        this.setState({rents});
        alert("delete successfully");
    }

    handleChange(event) {
        event.preventDefault();
        const inputId = event.target.id;
        const input = event.target.value;
        if (inputId === 'confNumInput') this.setState({confNum: input});
        if (inputId === 'driversLicenceInput') this.setState({driversLicence: input});
        if (inputId === 'vehicleLicenceInput') this.setState({vehicleLicence: input});
        if (inputId === 'fromDateInput') this.setState({fromDate: input});
        if (inputId === 'toDateInput') this.setState({toDate: input});
    }

    async handleSubmit(event) {
        event.preventDefault();
        const { confNum, driversLicence, vehicleLicence, fromDate, toDate } = this.state;
        let checkCustomer = null;
        let checkConf = true;
        if (confNum !== null && confNum !== '') {
            try {
                const res = await axios.get(`https://super-rent.appspot.com/reservations/${confNum}`);
            } catch (e) {
                alert("wrong confirmation number");
                checkConf = false;
            }
        }
        if (checkConf) {
            try {
                const res = await axios.get(`https://super-rent.appspot.com/customers/${driversLicence}`);
                checkCustomer = res.data.driversLicence;
            } catch (e) {
                alert("you should create customer first")
            }
            if (checkCustomer === driversLicence) {
                let checkVehicleAva = null;
                let city = null;
                let color = null;
                let location = null;
                let make = null;
                let model = null;
                let year = null;
                let vehicleTypeName = null;
                try {
                    const res = await axios.get(`https://super-rent.appspot.com/vehicles/${vehicleLicence}`);
                    city = res.data.city;
                    color = res.data.color;
                    location = res.data.location;
                    make = res.data.make;
                    model = res.data.model;
                    year = res.data.year;
                    vehicleTypeName = res.data.vehicleTypeName;
                    checkVehicleAva = res.data.status;
                } catch (e) {
                    alert("check the vehicle license you entered")
                }
                alert(`${checkVehicleAva}`);
                if (checkVehicleAva === "available") {
                    const status = "rented";
                    try {
                        await axios.put(`https://super-rent.appspot.com/vehicles/${vehicleLicence}`, {
                            status,
                            city,
                            color,
                            location,
                            make,
                            model,
                            year,
                            vehicleTypeName,
                            vehicleLicence
                        });
                    } catch (e) {
                        alert("unable to update vehicle status, check your connection");
                    }
                    try {
                        await axios.post(`https://super-rent.appspot.com/rents`, {confNum,driversLicence,vehicleLicence,
                            fromDate,toDate});
                        alert("create successfully");
                    } catch (e) {
                        alert("unsuccessful");
                    }

                } else {
                    alert("vehicle is not available right now")
                }
            }
        }


        this.setState({ confNum: null, driversLicence: '', vehicleLicence: '', fromDate: '', toDate: ''});
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
        this.getRents();
    }

    render() {
        if (this.state.updateView)
            return this.state.updateView;

        const rents = this.state.rents;

        const rentsTable = rents.map(c => <li>
            <p>{`RentId: ${c.rentId} --- ConfNum:${c.confNum}  --- DriversLicence: ${c.driversLicence}
            --- FromDate: ${c.fromDate} --- ToDate: ${c.toDate} --- VehicleLicence: ${c.vehicleLicence}`}</p>
            <button onClick={this.handleDeleteClick} id={c.rentId}>Delete</button>
            <button onClick={this.handleUpdateClick} id ={c.rentId}>Update</button>
        </li>);

        return <div>
            <h1>Rents</h1>
            <form>
                <h3> Rent a Vehicle</h3>
                <h5> (auto generate rentID, refresh to show result）</h5>
                <TextField id="confNumInput" label="confNum if exists" onChange={this.handleChange} />
                <TextField id="vehicleLicenceInput" label="Vehicle Licence" onChange={this.handleChange} />
                <TextField id="driversLicenceInput" label="Drivers Licence" onChange={this.handleChange} />
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
                <h4>Found {rentsTable.length} items</h4>
                {rentsTable}
            </ul>
        </div>
    }
}

export default Rents;