import React from "react";
import axios from "axios"
import RentUpdate from "./RentUpdate";
import TextField from "@material-ui/core/TextField";

class Returns extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            returns: [],
            date: '',
            rentId: '',
            price: ''
        };
        this.handleDeleteClick = this.handleDeleteClick.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleUpdateClick = this.handleUpdateClick.bind(this);
        this.handleReturnSubmit = this.handleReturnSubmit.bind(this);
    }


    async componentDidMount() {
        this.getReturns();
    }

    async getReturns() {
        const response = await axios.get('https://super-rent.appspot.com/returns');
        const returns = response.data;
        this.setState({returns});
    }

    async handleDeleteClick(event) {
        event.preventDefault();
        const id = event.target.id;
        await axios.delete(`https://super-rent.appspot.com/returns/${id}`);
        const returns = this.state.returns.filter(r => r.rentId !== id);
        this.setState({returns});
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
        if (inputId === 'rentIdInput') this.setState({rentId: input});
    }

    async handleReturnSubmit(event) {
        event.preventDefault();
        const {rentId, toDate} = this.state;
        let checkId = null;
        try {
            const res = await axios.get(`https://super-rent.appspot.com/rents/${rentId}`);
            checkId = res.data.rentId;
        } catch (e) {
            alert("wrong rent Id, enter again")
        }
        if (rentId === checkId) {
            let date = toDate;
            try {
                await axios.post("https://super-rent.appspot.com/returns", {
                    rentId,
                    date
                })
            } catch (e) {
                alert("error, the vehicle has been returned")
            }
            try {
                await axios.delete(`https://super-rent.appspot.com/rents/${rentId}`);
            } catch (e) {
                console.error("delete rent item for returned vehicle unsuccessfully ");
            }
            const rents = this.state.rents.filter(rent => rent.rentId !== rentId);
            this.setState({rents});
        }
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
        const response = await axios.get(`https://super-rent.appspot.com/rents/${id}`);
        const reservation = response.data;
        const { confNum,
            driversLicence,
            fromDate,
            toDate,
            rentId,
            vehicleLicence} = reservation;
        this.setState({updateView: <RentUpdate confNum={confNum} driversLicence={driversLicence}
                                               fromDate={fromDate} toDate={toDate} rentId={rentId}
                                               vehicleLicence={vehicleLicence} finishUpdate={this.finishUpdate}/>});
    }

    render() {
        const returns = this.state.returns;
        const returnsTable = returns.map(c => <li>
            <p>{`RentId: ${c.rentId} --- Return Date: ${c.date} --- Price: ${c.price}`}</p>
            <button onClick={this.handleDeleteClick} id={c.rentId}>Delete</button>
        </li>);

        return <div>
            <ul style={{listStyle: 'none'}}>
                <h4>Found {returnsTable.length} items</h4>
                {returnsTable}
            </ul>
        </div>
    }
}
export default Returns;