import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import React, { useState, useEffect } from "react";
import { calculateTotalDays, convertToCurrency, dateToString } from "./utils";
import TactApi from "../../api/TactApi";
import { SubmitButton } from "./save-button";

export function Summary(props) {
  const { data, updateFileHandler, saved, setSaved, aircraftData } = props;
  const [exerciseName, setExerciseName] = useState();
  const totalDays = calculateTotalDays(
    data.travelStartDate,
    data.travelEndDate
  );

  useEffect(() => {
    getExerciseName();
  }, []);

  const getExerciseName = async () => {
    await TactApi.getExercises(data.exerciseID).then((exercise) => {
      setExerciseName(exercise.exerciseName);
    });
  };

  const summaryData = {
    unitInfo: data.unit,
    exercise: exerciseName,
    exerciseID: data.exerciseID,
    startDate: dateToString(new Date(data.travelStartDate)),
    stopDate: dateToString(new Date(data.travelEndDate)),
    typeOfAircraft: aircraftData[0].aircraftType,
    numOfAircraft: aircraftData[0].aircraftCount,
    numOfPersonnel: aircraftData[0].personnelCount,
    commercialAirCost: aircraftData[0].commercialAirfareCost,
    lodgingCost:
      aircraftData[0].commercialLodgingCost +
      aircraftData[0].governmentLodgingCost,
    mealsCost:
      aircraftData[0].mealNotProvidedCount *
      aircraftData[0].mealPerDiem *
      totalDays,
    rentalCarCount: aircraftData[0].rentalCount,
    rentalCarCost: aircraftData[0].rentalCost,
    totalCost: data.unitCostSum,
  };
  const totalCost =
    summaryData.commercialAirCost +
    summaryData.lodgingCost +
    summaryData.mealsCost +
    summaryData.rentalCarCost;

  const handleSaveClick = () => {
    updateFileHandler({ unitCostSum: totalCost, status: true });
    setSaved({
      ...saved,
      submitted: true,
      alert: "Submitted to database",
    });
  };

  return (
    <div style={{ marginTop: "0px" }} className="form-container">
      <TableContainer component={Paper}>
        <Typography sx={{ fontSize: 22 }}>
          {`${summaryData.unitInfo} support for Exercise ${exerciseName}`}
        </Typography>
        <Typography>{`${summaryData.startDate} - ${summaryData.stopDate}`}</Typography>
        <Table sx={{ minWidth: 800 }} aria-label="customized table">
          <TableBody>
            <TableRow key="total-cost" sx={{ fontWeight: "bold" }}>
              <StyledTableCell component="th" scope="row">
                <Typography sx={{ fontWeight: "bold" }}>
                  Total Estimated Cost
                </Typography>
              </StyledTableCell>
              <StyledTableCell component="th" scope="row">
                <Typography sx={{ fontWeight: "bold" }}>{`${convertToCurrency(
                  totalCost
                )}`}</Typography>
              </StyledTableCell>
            </TableRow>
            <TableRow key="airfare-cost">
              <StyledTableCell component="th" scope="row">
                <Typography>Estimated Airfare Cost</Typography>
              </StyledTableCell>
              <StyledTableCell component="th" scope="row">
                <Typography>{`${convertToCurrency(
                  summaryData.commercialAirCost
                )}`}</Typography>
              </StyledTableCell>
            </TableRow>
            <TableRow key="lodging-cost">
              <StyledTableCell component="th" scope="row">
                <Typography>Estimated Lodging Cost</Typography>
              </StyledTableCell>
              <StyledTableCell component="th" scope="row">
                <Typography>{`${convertToCurrency(
                  summaryData.lodgingCost
                )}`}</Typography>
              </StyledTableCell>
            </TableRow>
            <TableRow key="meals-cost">
              <StyledTableCell component="th" scope="row">
                <Typography>Estimated Meals and Incidentals Cost</Typography>
              </StyledTableCell>
              <StyledTableCell component="th" scope="row">
                <Typography>{`${convertToCurrency(
                  summaryData.mealsCost
                )}`}</Typography>
              </StyledTableCell>
            </TableRow>
            <TableRow key="rental-car-cost">
              <StyledTableCell component="th" scope="row">
                <Typography>Estimated Rental Car Cost</Typography>
              </StyledTableCell>
              <StyledTableCell component="th" scope="row">
                <Typography>{`${convertToCurrency(
                  summaryData.rentalCarCost
                )}`}</Typography>
              </StyledTableCell>
            </TableRow>
            <TableRow key="days-row">
              <StyledTableCell component="th" scope="row">
                <Typography>Total Days</Typography>
              </StyledTableCell>
              <StyledTableCell component="th" scope="row">
                <Typography>{`${totalDays}`}</Typography>
              </StyledTableCell>
            </TableRow>
            <TableRow key="personnel-row">
              <StyledTableCell component="th" scope="row">
                <Typography>Total Personnel</Typography>
              </StyledTableCell>
              <StyledTableCell component="th" scope="row">
                <Typography>{`${summaryData.numOfPersonnel}`}</Typography>
              </StyledTableCell>
            </TableRow>
            <TableRow key="aircraft-row">
              <StyledTableCell component="th" scope="row">
                <Typography>Unit Aircraft</Typography>
              </StyledTableCell>
              <StyledTableCell component="th" scope="row">
                <Typography>{`${summaryData.numOfAircraft} x ${summaryData.typeOfAircraft}`}</Typography>
              </StyledTableCell>
            </TableRow>
          </TableBody>
        </Table>
        <span>
          <SubmitButton handleClick={handleSaveClick} saved={data.status} />
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
