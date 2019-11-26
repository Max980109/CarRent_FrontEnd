import React from "react";
import axios from "axios";


class RentDaily extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            reports: [],
            city: '',
            location: ''
        };
        this.getReports = this.getReports.bind(this);
    }

    async componentDidMount() {
        this.getReports();
    }

    async getReports() {
        const response = await axios.get('http://localhost:5000/reports/rents');
        const  reports= response.data;
        this.setState({reports});
    }

    render() {
        const reports = this.state.reports;
        const rentsTable = reports.map(function (c) {
            const detail = c.dailyRents.map(e =>
                <li>
                    <p>{`rentId: ${e.rentId} ---- vehicleId: ${e.vehicleLicense}`}</p>
                </li>);
            return <li>
                <h4>{`Branch_City: ${c.branch.city} --- Branch_Location:${c.branch.location} ---NumRents: ${c.dailyRents.length}`}</h4>
                <h5>Detail for this branch</h5>
                <ul>
                    {detail}
                </ul>
            </li>
        });

        return <div>
            <h1>Rents Report</h1>
            <h3>Do not close, wait for refresh</h3>
            <h2>Found {rentsTable.length} Item </h2>
            <ul style={{listStyle: 'none'}}>
                {rentsTable}
            </ul>
        </div>
    }

}
export default RentDaily;