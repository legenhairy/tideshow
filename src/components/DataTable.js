import React from 'react';
import Table from 'react-bootstrap/Table';

function DataTable({ data, units, zone }) {
    
    const renderTideRow = (tide, index) => {
      return(
        <tr key={index}>
          <td>{tide.t}</td>
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
              <th>Predicted</th>
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