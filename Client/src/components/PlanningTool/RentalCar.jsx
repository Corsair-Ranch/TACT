import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography"; 
import React, { useState, useEffect } from "react";


function RentalCar() {
  // Rental Car data instance
  const [rentalCarData, setRentalCarData] = useState({
    carRequired: "Yes",
    carCount: 2,
    pickupDropoffLocation: "Airport",
    pickupDate: "2023-09-20",
    dropoffDate: "2023-09-25",
  });

  // Function to mock updating Rental Car data in the parent component
  const updateFileHandler = (updatedData) => {
    // For testing purposes, loggin the updated data
    console.log("Updated Rental Car Data:", updatedData);
  };

  const handleSaveClick = () => {
    // Perform actions to save the rental car data here
    // For testing purposes, you can use the `rentalCarData` state
    console.log("Saving Rental Car Data:", rentalCarData);
    // Calling API or other actions can be perfomed here.
  };

  // Function to handle changes in form inputs
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setRentalCarData({
      ...rentalCarData,
      [name]: value,
    });
  };

  // Function to save Rental Car data and update the parent component
  const saveRentalCarData = () => {
    // For testing purposes, we call the mock updateFileHandler with the current Rental Car data
    updateFileHandler(rentalCarData);
  };

  // Mimicing the behavior of automatically updating the parent component when data changes
  useEffect(() => {
    saveRentalCarData();
  }, [rentalCarData]);



  return (
    <div
      style={{ marginTop: "0px" }} 
      className="form-container"
    >
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">Rental Car</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <StyledTableCell align="center">
                <div className="form-inputs">
                  <div className="radio-input">
                    <label htmlFor="carRequired">
                      Are rental cars required for this mission?
                    </label>
                    <div className="radio-options">
                      <label>
                        <input
                          type="radio"
                          id="carRequired"
                          name="carRequired"
                          value="Yes"
                          onChange={handleInputChange} 
                          checked={rentalCarData.carRequired === "Yes"} 
                        />{" "}
                        Yes
                      </label>
                      <label>
                        <input
                          type="radio"
                          id="carNotRequired"
                          name="carRequired"
                          value="No"
                          onChange={handleInputChange}
                          checked={rentalCarData.carRequired === "No"}
                        />{" "}
                        No
                      </label>
                    </div>
                  </div>
                  <div className="input-field">
                    <label>How many cars needed?</label>
                    <input
                      type="number"
                      name="carCount"
                      value={rentalCarData.carCount}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="input-field">
                    <label>Pick-up/Drop-off location</label>
                    <input
                      type="text"
                      name="pickupDropoffLocation"
                      value={rentalCarData.pickupDropoffLocation}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="date-fields">
                    <div className="date-input">
                      <label>Pick-up Date</label>
                      <input
                        type="date"
                        name="pickupDate"
                        value={rentalCarData.pickupDate} 
                        onChange={handleInputChange} //
                      />
                    </div>
                    <div className="date-input">
                      <label>Drop-off Date</label>
                      <input
                        type="date"
                        name="dropoffDate"
                        value={rentalCarData.dropoffDate}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              </StyledTableCell>
            </TableRow>
          </TableBody>
        </Table>
        <span>
          <Button onClick={handleSaveClick}>Save</Button>
        </span>
        {/* Display total personnel */}
        <Typography variant="body1">
          Total Personnel: {rentalCarData.carCount}
        </Typography>
      </TableContainer>
    </div>
  );
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

export default RentalCar;
