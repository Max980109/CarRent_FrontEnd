import React from 'react';
import Customers from './Customers';
import Vehicles from './Vehicles';
import './App.css';
import Menu from "./Menu";
import Reservations from "./Reservations";

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = { activeTable: '' };
    this.changeActiveTableTo = this.changeActiveTableTo.bind(this);
  }

  changeActiveTableTo(event) {
    const table = event.target.id;
    this.setState({activeTable: table});
  }

  render() {
    let table;
    const { activeTable } = this.state;
    if (activeTable === '') table = null;
    else if (activeTable === 'customers') table = <Customers/>;
    else if (activeTable === 'vehicles') table= <Vehicles />;
    else if (activeTable === 'reservations') table=<Reservations/>;

    return (
        <div className="App">
          <Menu changeActiveTableTo={this.changeActiveTableTo}/>
          {table}
        </div>
    );
  }
}

export default App;
