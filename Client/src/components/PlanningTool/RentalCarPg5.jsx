import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import React, { useState, useEffect } from "react";
import {
  calculateTotalDays,
  calculateUnitCostSum,
  convertToCurrency,
} from "./utils";
import { TextField } from "@mui/material";
import { SaveButton } from "./save-button";

//mocked cost of rental cars
const rentalCost = {
  costPerDay: 60,
  gasPerDay: 30,
};

function RentalCar(props) {
  const {
    data,
    updateFileHandler,
    saved,
    setSaved,
    aircraftData,
    setAircraftData,
    updateUnitExerciseAircraft,
  } = props;
  // Rental Car data instance
  const [rentalCarData, setRentalCarData] = useState({
    carRequired: aircraftData[0].rentalCost > 0 ? true : false,
    //assumes 4 people per car
    carCount:
      aircraftData[0].rentalCount > 0
        ? aircraftData[0].rentalCount
        : Math.round(data.personnelSum / 4),
    totalDays: calculateTotalDays(data.travelStartDate, data.travelEndDate),
  });
  const [localSaved, setLocalSaved] = useState(saved.pg5);

  const [totalCost, setTotalCost] = useState(0);

  const updateSaved = () => {
    if (saved.pg5 || saved.submitted) {
      setSaved({
        ...saved,
        submitted: false,
        pg5: false,
      });
    }

    setLocalSaved(false);
  };

  const handleSaveClick = () => {
    updateFileHandler({
      unitCostSum: calculateUnitCostSum(
        aircraftData[0],
        rentalCarData.totalDays
      ),
    });
    setSaved({
      ...saved,
      alert: "Saving rental car ",
      pg5: true,
    });
    setLocalSaved(true);
    updateUnitExerciseAircraft();
  };

  const handleRentalRequired = (e) => {
    const value = e.target.value === "true" ? true : false;
    setRentalCarData({
      ...rentalCarData,
      carRequired: value,
    });
    updateSaved();
  };

  const handleRentalNumber = (e) => {
    const value = isNaN(parseInt(e.target.value))
      ? 0
      : parseInt(e.target.value, 10);
    if (value < 0) {
      return;
    }
    setRentalCarData({
      ...rentalCarData,
      carCount: value,
    });
    updateSaved();
  };

  useEffect(() => {
    calculateCost();
  }, [rentalCarData]);

  const calculateCost = () => {
    let result;
    if (rentalCarData.carRequired) {
      // basic calculation using hard coded rental car costs
      result =
        rentalCarData.totalDays *
        rentalCarData.carCount *
        (rentalCost.costPerDay + rentalCost.gasPerDay);
    } else {
      result = 0;
    }
    setTotalCost(result);
    const temp = aircraftData[0];
    temp.rentalCost = result;
    temp.rentalCount = rentalCarData.carCount;
    setAircraftData([temp]);
  };

  const assumptionText = () => {
    return `* Assumes ${convertToCurrency(
      rentalCost.costPerDay
    )} per car and ${convertToCurrency(rentalCost.gasPerDay)} for fuel per day`;
  };

  return (
    <div style={{ marginTop: "0px" }} className="form-container">
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="center" sx={{ fontSize: 20 }}>
                {`Rental Cars for ${data.personnelSum} Personnel`}
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <StyledTableCell align="center">
                <div className="form-inputs">
                  <div className="radio-input">
                    <label htmlFor="carRequired">
                      Are rental cars required?
                    </label>
                    <div className="radio-options">
                      <label>
                        <input
                          type="radio"
                          id="carRequired"
                          name="carRequired"
                          value={true}
                          onChange={handleRentalRequired}
                          checked={rentalCarData.carRequired}
                        />{" "}
                        Yes
                      </label>
                      <label>
                        <input
                          type="radio"
                          id="carNotRequired"
                          name="carRequired"
                          value={false}
                          onChange={handleRentalRequired}
                          checked={!rentalCarData.carRequired}
                        />{" "}
                        No
                      </label>
                    </div>
                  </div>
                  <TextField
                    id="numRentalCars"
                    label="Number of Rental Cars"
                    variant="outlined"
                    margin="normal"
                    type="number"
                    value={rentalCarData.carCount}
                    onChange={handleRentalNumber}
                  />
                  <div></div>
                  <Typography>{`Estimated Cost for ${rentalCarData.totalDays} days`}</Typography>

                  <TextField
                    disabled
                    id="rentalCarCost"
                    variant="outlined"
                    margin="normal"
                    value={convertToCurrency(totalCost)}
                  />

                  <Typography>{assumptionText()}</Typography>
                </div>
              </StyledTableCell>
            </TableRow>
          </TableBody>
        </Table>
        <span>
          <SaveButton handleClick={handleSaveClick} saved={localSaved} />
        </span>
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
