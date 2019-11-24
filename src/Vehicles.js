import React from 'react';
import axios from 'axios';
import VechicleUpdate from "./VehicleUpdate";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

class Vehicles extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            vehicles: [],
            vehicleLicence: '',
            make: '',
            model: '',
            year: '',
            status: '',
            vehicleTypeName: '',
            location: '',
            city: '',
            updateView: null,
            filter_location: '',
            filter_fromDate: '',
            filter_toDate: '',
            filter_vehicleType: ''
        };
        this.handleDeleteClick = this.handleDeleteClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleAddSubmit = this.handleAddSubmit.bind(this);
        this.handleUpdateClick = this.handleUpdateClick.bind(this);
        this.getVehicles = this.getVehicles.bind(this);
        this.finishUpdate = this.finishUpdate.bind(this);
        this.handleFilterChange = this.handleFilterChange.bind(this);
        this.handleFilterSubmit = this.handleFilterChange.bind(this);
    }

    async componentDidMount() {
       this.getVehicles();
    }



    async handleDeleteClick(event) {
        event.preventDefault();
        const id = event.target.id;
        alert(`id is ${id}`);
        await axios.delete(`https://super-rent.appspot.com/vehicles/${id}`);
        const vehicles = this.state.vehicles.filter(vehicle => vehicle.vehicleLicence !== id);
        this.setState({vehicles});
    }

    async handleUpdateClick(event) {
        event.preventDefault();
        const id = event.target.id;
        const response = await axios.get(`https://super-rent.appspot.com/vehicles/${id}`);
        const vehicle = response.data;
        const {vehicleLicence, make, model, year, status, vehicleTypeName, location, city} = vehicle;
        this.setState({updateView: <VechicleUpdate
                previousLicense={vehicleLicence}
                make = {make}
                model={model}
                year={year}
                status={status}
                vehicleTypeName={vehicleTypeName}
                location={location}
                city={city}
                finishUpdate={this.finishUpdate}
            />
        });
    }

    finishUpdate() {
        this.setState({updateView: null});
        this.getVehicles();
    }

    async getVehicles() {
        const response = await axios.get('https://super-rent.appspot.com/vehicles');
        const vehicles = response.data;
        this.setState({vehicles});
    }

    handleChange(event) {
        event.preventDefault();
        const id = event.target.id;
        const value = event.target.value;
        if(id === "vehicleLicenseInput") this.setState({vehicleLicence: value});
        if(id === "makeInput") this.setState({make: value});
        if(id === "modelInput") this.setState({model: value});
        if(id === "yearInput") this.setState({year: value});
        if(id === "statusInput") this.setState({status: value});
        if(id === "typeInput") this.setState({vehicleTypeName: value});
        if(id === "locationInput") this.setState({location: value});
        if(id === "cityInput") this.setState({city: value});
    }

    async handleAddSubmit(event) {
        event.preventDefault();
        const { vehicleLicence, make, model, year, status, vehicleTypeName, location, city} = this.state;
        alert("will be submit");
        await axios.post('https://super-rent.appspot.com/vehicles', {
            vehicleLicence,
            make,
            model,
            year,
            status,
            vehicleTypeName,
            location,
            city
        });
        alert("submitted");
        this.setState({vehicleLicence: '', make: '', model: '', year: '', status: '', vehicleTypeName: '', location: '', city: ''});
    }

    async handleFilterSubmit(event) {
        alert("chech submit");
        event.preventDefault();
        const location = this.state.filter_location;
        const fromDate = this.state.filter_fromDate;
        const toDate = this.state.filter_toDate;
        const vehicleTypeName = this.state.filter_vehicleType;
        let url = `https://super-rent.appspot.com/vehicles?`;
        if (location !== '' && location !== null) url += `&${location}`;
        if (fromDate !== '' && fromDate !== null) url += `&${fromDate}`;
        if (toDate !== '' && fromDate !== null) url += `&${toDate}`;
        if (vehicleTypeName !== '' && fromDate !== null) url += `&${vehicleTypeName}`;
        alert("chech submit");
        const response = await axios.get(url);
        const vehicles = response.data;
        this.setState({vehicles});
        this.setState({filter_location: '', filter_fromDate: '', filter_toDate: '', filter_vehicleType: ''});
    }

    handleFilterChange(event) {
        event.preventDefault();
        const id = event.target.id;
        const value = event.target.value;
        if (id === "filter_location") this.setState({filter_location: value});
        if (id === "filter_fromDate") this.setState({filter_fromDate: value});
        if (id === "filter_toDate") this.setState({filter_toDate: value});
        if (id === "filter_vehicleType") this.setState({filter_vehicleType: value});
    }






    render() {
        if (this.state.updateView)
            return this.state.updateView;

        const vehicles = this.state.vehicles;

        const vehicleTable = vehicles.map(v => <li>
            <p>{`VehicleLicense: ${v.vehicleLicence}---Make: ${v.make}---Model: ${v.model}---Year: ${v.year}---
            Status: ${v.status}--- Type: ${v.vehicleTypeName}--- Location: ${v.location}--- City: ${v.city}`}</p>
            <button onClick={this.handleDeleteClick} id={v.vehicleLicence}>Delete</button>
            <button onClick={this.handleUpdateClick} id={v.vehicleLicence}>Update</button>
        </li>);

        return <div>
            <h1>Vehicles</h1>
            <h3>Add new Vehicles</h3>
            <form>
                <label>
                    Add New Vehicle--
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
                <button onClick={this.handleAddSubmit}>Submit</button>
            </form>
            <h3>Add Filter</h3>
            <form>
                <label>
                    Filter Vehicle
                    <TextField onChange={this.handleFilterChange}
                        id="filter_location"
                        label="Location"
                    />
                </label>
                <TextField onChange={this.handleFilterChange}
                           id="filter_fromDate"
                           label="From"
                           type="date"
                           defaultValue="2017-05-24"
                           InputLabelProps={{
                               shrink: true,
                           }}
                />
                <TextField onChange={this.handleFilterChange}
                    id="filter_toDate"
                    label="To"
                    type="date"
                    defaultValue="2017-06-24"
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <Select id="filter_vehicleType" onChange={this.handleFilterChange} >
                    <MenuItem value="Compact">Compact</MenuItem>
                    <MenuItem value="Mid-size">Mid-size</MenuItem>
                    <MenuItem value="Standard">Standard</MenuItem>
                    <MenuItem value="Full-size">Full-size</MenuItem>
                    <MenuItem value="SUV">SUV</MenuItem>
                    <MenuItem value="Truck">Truck</MenuItem>
                </Select>
                <button onClick={this.handleFilterSubmit}>Filter</button>
            </form>
            <h4>Found {vehicleTable.length} Results</h4>
            <ul style={{listStyle: 'none'}}>
                {vehicleTable}
            </ul>
        </div>
    }
}

export default Vehicles;