import React from 'react';

class Menu extends React.Component {

    render() {

        const style = {
            width: '50%'
        };

        return <div style={style}>
            <p>Super Rent</p>
            <ul style={{listStyle: 'none'}}>
                <li> <button style={style} id="customers" onClick={this.props.changeActiveTableTo}>Customers</button></li>
                <li> <button style={style} id="vehicles" onClick={this.props.changeActiveTableTo}>Vehicles</button></li>
            </ul>
        </div>
    }

}


export default Menu;