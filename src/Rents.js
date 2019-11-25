import React from "react";
import axios from "axios"
import RentUpdate from "./RentUpdate";
import TextField from "@material-ui/core/TextField";



class Rents extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            rents: [],
            confNum: null,
            driverLicense: '',
            fromDate: '',
            toDate: '',
            rentId: '',
            vehicleLicense: '',
        };
        this.handleDeleteClick = this.handleDeleteClick.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleUpdateClick = this.handleUpdateClick.bind(this);
        this.finishUpdate = this.finishUpdate.bind(this);
        this.handleReturnSubmit = this.handleReturnSubmit.bind(this);
    }

    async componentDidMount() {
        this.getRents();
    }

    async getRents() {
        const response = await axios.get('http://localhost:5000/rents');
        const rents = response.data;
        this.setState({rents});
    }

    async handleDeleteClick(event) {
        event.preventDefault();
        const id = event.target.id;
        await axios.delete(`http://localhost:5000/rents/${id}`);
        const rents = this.state.rents.filter(rent => rent.rentId !== id);
        this.setState({rents});
        alert("delete successfully");
    }

    handleChange(event) {
        event.preventDefault();
        const inputId = event.target.id;
        const input = event.target.value;
        if (inputId === 'confNumInput') this.setState({confNum: input});
        if (inputId === 'driverLicenseInput') this.setState({driverLicense: input});
        if (inputId === 'vehicleLicenseInput') this.setState({vehicleLicense: input});
        if (inputId === 'fromDateInput') this.setState({fromDate: input});
        if (inputId === 'toDateInput') this.setState({toDate: input});
        if (inputId === 'rentIdInput') this.setState({rentId: input});
    }

    async handleReturnSubmit(event) {
        event.preventDefault();
        const {rentId, toDate} = this.state;
        let checkId = null;
        try {
           const res = await axios.get(`http://localhost:5000/rents/${rentId}`);
           checkId = res.data.rentId;
        } catch (e) {
            alert("wrong rent Id, enter again")
        }
        if (rentId === checkId) {
            let date = toDate;
            try {
                await axios.post("http://localhost:5000/returns", {
                    rentId,
                    date
                });
            } catch (e) {
                alert("error, the vehicle has been returned")
            }
            this.setState({rentId: '', toDate: ''});
        }
    }

    async handleSubmit(event) {
        event.preventDefault();
        const { confNum, driverLicense, vehicleLicense, fromDate, toDate } = this.state;
        let checkCustomer = null;
        let checkConf = true;
        if (confNum !== null && confNum !== '') {
            try {
                const res = await axios.get(`http://localhost:5000/reservations/${confNum}`);
            } catch (e) {
                alert("wrong confirmation number");
                checkConf = false;
            }
        }
        if (checkConf) {
            try {
                const res = await axios.get(`http://localhost:5000/customers/${driverLicense}`);
                checkCustomer = res.data.driverLicense;
            } catch (e) {
                alert("you should create customer first")
            }
            if (checkCustomer === driverLicense) {
                let checkVehicleAva = null;
                let city = null;
                let color = null;
                let location = null;
                let make = null;
                let model = null;
                let year = null;
                let vehicleTypeName = null;
                try {
                    const res = await axios.get(`http://localhost:5000/vehicles/${vehicleLicense}`);
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
                        await axios.put(`http://localhost:5000/vehicles/${vehicleLicense}`, {
                            status,
                            city,
                            color,
                            location,
                            make,
                            model,
                            year,
                            vehicleTypeName,
                            vehicleLicense
                        });
                    } catch (e) {
                        alert("unable to update vehicle status, check your connection");
                    }
                    try {
                        await axios.post(`http://localhost:5000/rents`, {confNum,driverLicense,vehicleLicense,
                            fromDate,toDate});
                    } catch (e) {
                        alert("unsuccessful");
                    }

                } else {
                    alert("vehicle is not available right now")
                }
            }
        }


        this.setState({ confNum: null, driverLicense: '', vehicleLicense: '', fromDate: '', toDate: ''});
    }

    async handleUpdateClick(event) {
        event.preventDefault();
        const id = event.target.id;
        const response = await axios.get(`http://localhost:5000/rents/${id}`);
        const reservation = response.data;
        const { confNum,
            driverLicense,
            fromDate,
            toDate,
            rentId,
            vehicleLicense} = reservation;
        this.setState({updateView: <RentUpdate confNum={confNum} driverLicense={driverLicense}
                                                   fromDate={fromDate} toDate={toDate} rentId={rentId}
                                                   vehicleLicense={vehicleLicense} finishUpdate={this.finishUpdate}/>});
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
            <p>{`RentId: ${c.rentId} --- ConfNum:${c.confNum}  --- DriversLicense: ${c.driverLicense}
            --- FromDate: ${c.fromDate} --- ToDate: ${c.toDate} --- VehicleLicense: ${c.vehicleLicense}`}</p>
            <button onClick={this.handleDeleteClick} id={c.rentId}>Delete</button>
            <button onClick={this.handleUpdateClick} id ={c.rentId}>Update</button>
        </li>);

        return <div>
            <h1>Rents</h1>
            <form>
                <h3> Rent a Vehicle</h3>
                <h5> (auto generate rentID, refresh to show result）</h5>
                <TextField id="confNumInput" label="confNum if exists" onChange={this.handleChange} />
                <TextField id="vehicleLicenseInput" label="Vehicle License" onChange={this.handleChange} />
                <TextField id="driverLicenseInput" label="Drivers License" onChange={this.handleChange} />
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
            <form>
                <h3> Return a Vehicle</h3>
                <h5> If the vehicle is return successfully, please go to returns to see details</h5>
                <TextField id="rentIdInput" label="Rent ID" onChange={this.handleChange} />
                <TextField onChange={this.handleChange}
                           id="toDateInput"
                           label="Return Date"
                           type="date"
                           InputLabelProps={{
                               shrink: true,
                           }}
                />
                <button onClick={this.handleReturnSubmit}>Submit</button>
            </form>
            <ul style={{listStyle: 'none'}}>
                <h4>Found {rentsTable.length} items</h4>
                {rentsTable}
            </ul>
        </div>
    }
}

export default Rents;