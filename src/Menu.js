import React from 'react';

class Menu extends React.Component {

    render() {

        const style = {
            width: '30%'
        };

        return <div style={style}>
            <ul style={{listStyle: 'none'}}>
                <li> <button id="customers" onClick={this.props.changeActiveTableTo}>Customers</button></li>
                <li> <button id="vehicles" onClick={this.props.changeActiveTableTo}>Vehicles</button></li>
            </ul>
        </div>
    }

}


export default Menu;