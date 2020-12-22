import React from 'react';
import Table from 'react-bootstrap/Table';

function DataTable({ data, units, zone }) {
    /*split each tide.t into 2 seperate td elements and show the time and day seperately*/
    const renderTideRow = (tide, index) => {
      let splitstrings = tide.t.split(' ');
      return(
        <tr key={index}>
          <td>{splitstrings[0]}</td>
          <td>{splitstrings[1]}</td>
          <td>{tide.v}</td>
          <td>{tide.type}</td>
        </tr> 
      )
    }

    return (
        <Table striped bordered hover variant="dark">
          <thead>
            <tr>
              <th>Date</th>
              <th>Time({zone})</th>
              <th>Predicted({units})</th>
              <th>High/Low</th>
            </tr>
          </thead>
          <tbody>
            {data.map(renderTideRow)}
          </tbody>
        </Table>
    ); 
}

export default DataTable;