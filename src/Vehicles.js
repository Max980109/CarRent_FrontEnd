import React from 'react';
import axios from 'axios';

class Vehicles extends React.Component {
    constructor(props) {
        super(props);
        this.state = { vehicles: [] };
        this.handleGetClick = this.handleGetClick.bind(this);
        this.handleDeleteClick = this.handleDeleteClick.bind(this);
    }

    async handleGetClick(event) {
        event.preventDefault();
        const response = await axios.get('https://super-rent.appspot.com/vehicles');
        const vehicles = response.data;
        alert('Loaded vehicle data from server!');
        console.log(vehicles);
        this.setState({ vehicles });
    }

    async handleDeleteClick(event) {
        event.preventDefault();

        const id = event.target.id;
        alert(`id is ${id}`);

        await axios.delete(`https://super-rent.appspot.com/vehicles/${id}`);
        const vehicles = this.state.vehicles.filter(vehicle => vehicle.vehicleLicence !== id);
        this.setState({vehicles});
    }

    render() {
        const vehicles = this.state.vehicles;

        const vehicleTable = vehicles.map(v => <li>
            <p>{v.vehicleLicence}</p>
            <p>{v.color}</p>
            <button onClick={this.handleDeleteClick} id={v.vehicleLicence}>Delete</button>
        </li>);

        return <div>
            <h1>vehicles</h1>
            <button onClick={this.handleGetClick} style={{cursor: 'pointer'}}>get all vehicles</button>
            <ul>
                {vehicleTable}
            </ul>
        </div>
    }
}

export default Vehicles;