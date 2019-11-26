import React from "react";
import axios from "axios";

class ReturnsDaily extends React.Component{
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
        const response = await axios.get('http://localhost:5000/reports/returns');
        const  reports= response.data;
        this.setState({reports});
    }

    render() {
        const reports = this.state.reports;
        const returnTable = reports.map(function (c) {
            const detail = c.dailyReturns.map(e =>
                <li>
                    <p>{`rentId: ${e.rentId} ---- returnDate: ${e.date} ---price: ${e.price}`}</p>
                </li>);
            return <li>
                <h4>{`Branch_City: ${c.branch.city} --- Branch_Location:${c.branch.location} ---NumReturns: ${c.dailyReturns.length}`}</h4>
                <h5>Detail for this branch</h5>
                <ul>
                    {detail}
                </ul>
            </li>
        });

        return <div>
            <h1>Return Report</h1>
            <h3>Do not close, wait for refresh</h3>
            <h2>Found {returnTable.length} Item </h2>
            <ul style={{listStyle: 'none'}}>
                {returnTable}
            </ul>
        </div>
    }

}
export default ReturnsDaily;