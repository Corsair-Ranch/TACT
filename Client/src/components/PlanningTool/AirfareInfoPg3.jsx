import { useState, useEffect } from "react";
import { LocationField } from "./location-field";
import FlightTable from "../FlightTable/FlightTable.js";
import { getFlightOffers } from "../../api/amadeus.api.js";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import LoadingButton from "@mui/lab/LoadingButton";
import InputLabel from "@mui/material/InputLabel";
import Grid from "@mui/material/Grid";
import Slider from "@mui/material/Slider";
import MuiInput from "@mui/material/Input";
import { styled } from "@mui/material/styles";
import { TextField, Paper } from "@mui/material";
import { convertToCurrency } from "./utils";
// styles
import "../../styles/PlanningToolPg3.css";
import { SaveButton } from "./save-button";

function PickAddOns(props) {
  const {
    data,
    updateFileHandler,
    saved,
    setSaved,
    aircraftData,
    setAircraftData,
    updateUnitExerciseAircraft,
  } = props;

  const [flightData, setFlightData] = useState([]);
  const [inputs, setInputs] = useState();
  const [flightdisable, setFlightDisable] = useState();
  const [flightsloading, setFlightsLoading] = useState(false);
  const [flightCost, setFlightCost] = useState();
  const [localSaved, setLocalSaved] = useState(saved.pg3);
  const currentDate = new Date();

  //TODO set saved to false if there are any changes on this page instead of
  // the default when page is loaded.
  // In the case that this was already built, and the user just wants to navigate
  // to the next page, then they should be able to do this

  useEffect(() => {
    setInputs({
      departureDate: dayjs(data.travelStartDate).format("YYYY-MM-DD"),
      returnDate: dayjs(data.travelEndDate).format("YYYY-MM-DD"),
      locationDeparture: data.locationFrom,
      locationArrival: data.locationTo,
    });
  }, [data]);

  useEffect(() => {
    if (
      aircraftData[0].commercialAirfareCount === 0 ||
      !inputs?.locationDeparture ||
      !inputs?.locationArrival ||
      currentDate > new Date(data.travelStartDate) ||
      currentDate > new Date(data.travelEndDate)
    ) {
      setFlightDisable(true);
    } else {
      setFlightDisable(false);
    }
    setFlightCost(aircraftData[0].commercialAirfareCost);
  }, [aircraftData]);

  //need to figure out if airfare is going to be per plane or per unit, will change which table/context we use here

  const Input = styled(MuiInput)`
    width: 42px;
  `;

  const updateSaved = () => {
    if (saved.pg3 || saved.submitted) {
      setSaved({
        ...saved,
        submitted: false,
        pg3: false,
      });
    }
    setLocalSaved(false);
  };

  const updateExerciseAircraft = (props) => {
    const { key, value } = props;
    const temp = aircraftData[0];
    temp[key] = value;
    setAircraftData([temp]);
  };

  const handleSliderChange = (_event, newValue) => {
    updateExerciseAircraft({ key: "commercialAirfareCount", value: newValue });
    updateExerciseAircraft({
      key: "governmentAirfareCount",
      value: data.personnelSum - newValue,
    });
    updateSaved();
  };

  const handleMilInputChange = (event) => {
    const newValue = event.target.value;
    updateExerciseAircraft({
      key: "commercialAirfareCount",
      value: data.personnelSum - newValue,
    });
    updateExerciseAircraft({
      key: "governmentAirfareCount",
      value: newValue,
    });
    updateSaved();
  };

  const handleComInputChange = (event) => {
    const newValue = event.target.value;
    updateExerciseAircraft({
      key: "commercialAirfareCount",
      value: newValue,
    });
    updateExerciseAircraft({
      key: "governmentAirfareCount",
      value: data.personnelSum - newValue,
    });
    updateSaved();
  };

  //For the flight finder
  const findFlights = async () => {
    setFlightsLoading(true);
    getFlightOffers(inputs)
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setFlightData(res.data);
        } else {
          alert("No flights found, try another day or city pairing");
        }
        setFlightsLoading(false);
      })
      .catch((err) => {
        alert(`error in finding flights ${err}`);
        setFlightsLoading(false);
      });
  };

  //TODO add a date checker prior to calling API for finding flights
  //TODO add option to exit the flight finder since it takes so long
  const updateStartDate = (e) => {
    updateFileHandler({ travelStartDate: e.$d });
    setInputs({ ...inputs, departureDate: dayjs(e.$d).format("YYYY-MM-DD") });
    updateExerciseAircraft({ key: "commercialAirfareCost", value: 0 });
    updateSaved();
  };

  const updateEndDate = (e) => {
    updateFileHandler({ travelEndDate: e.$d });
    setInputs({ ...inputs, returnDate: dayjs(e.$d).format("YYYY-MM-DD") });
    updateExerciseAircraft({ key: "commercialAirfareCost", value: 0 });
    updateSaved();
  };

  const changeDepartLocation = (e) => {
    updateFileHandler({ locationFrom: e.value });
    setInputs({ ...inputs, locationDeparture: e.value });
    updateExerciseAircraft({ key: "commercialAirfareCost", value: 0 });
    updateSaved();
  };

  const changeDestinationLocation = (e) => {
    updateFileHandler({ locationTo: e.value });
    setInputs({ ...inputs, locationArrival: e.value });
    updateExerciseAircraft({ key: "commercialAirfareCost", value: 0 });
    updateSaved();
  };

  const handleSaveClick = () => {
    setSaved({
      ...saved,
      alert: "Saving airfare",
      pg3: true,
    });
    setLocalSaved(true);
    updateUnitExerciseAircraft();
  };

  const datePickerSX = (date) => {
    if (currentDate > new Date(date)) {
      return { backgroundColor: "pink" };
    } else {
      return { backgroundColor: "white" };
    }
  };

  return (
    <div className="form-container new-gap">
      <Paper elevation={3} sx={{ backgroundColor: "white", p: 3 }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Depart Date"
            id="departure-date"
            defaultValue={dayjs(data.travelStartDate)}
            value={dayjs(data.travelStartDate)}
            sx={datePickerSX(data.travelStartDate)}
            onChange={updateStartDate}
          />
          <span> </span>
          <DatePicker
            label="Return Date"
            id="return-date"
            defaultValue={dayjs(data.travelEndDate)}
            value={dayjs(data.travelEndDate)}
            sx={datePickerSX(data.travelEndDate)}
            onChange={updateEndDate}
          />
          <Grid id="input-slider" container spacing={2} alignItems="center">
            <Grid item>
              <InputLabel htmlFor="mil-air-input">Mil Air</InputLabel>
              <Input
                id="mil-air-input"
                value={aircraftData[0].governmentAirfareCount}
                size="small"
                onChange={handleMilInputChange}
                inputProps={{
                  step: 1,
                  min: 0,
                  max: { totalpersonnel: data.personnelSum },
                  type: "number",
                  "aria-labelledby": "input-slider",
                }}
              />
            </Grid>
            <Grid item xs>
              <Slider
                value={aircraftData[0].commercialAirfareCount}
                onChange={handleSliderChange}
                aria-labelledby="input-slider"
                min={0}
                max={data.personnelSum}
              />
            </Grid>
            <Grid item>
              <InputLabel htmlFor="com-air-input" id="demo-simple-select-label">
                Comm Air
              </InputLabel>
              <Input
                id="com-air-input"
                value={aircraftData[0].commercialAirfareCount}
                size="small"
                onChange={handleComInputChange}
                inputProps={{
                  step: 1,
                  min: 0,
                  max: { totalpersonnel: data.personnelSum },
                  type: "number",
                  "aria-labelledby": "input-slider",
                }}
              />
            </Grid>
          </Grid>
          {/* <div>
            <br />
          </div> */}
          <LocationField
            inputLabel="Departing Location"
            name="departingLocation"
            id="locationFrom"
            onChange={changeDepartLocation}
            locationId={data.locationFrom}
          />
          <LocationField
            inputLabel="Destination Location"
            name="destination"
            id="locationTo"
            onChange={changeDestinationLocation}
            locationId={data.locationTo}
          />
          <div>
            <TextField
              value={convertToCurrency(flightCost)}
              disabled
              InputLabelProps={{ shrink: true }}
              id="filled-basic-per"
              label="Cost Per Person"
              variant="filled"
            />
            <span> </span>
            <TextField
              value={convertToCurrency(
                parseFloat(flightCost) * aircraftData[0].commercialAirfareCount
              )}
              disabled
              InputLabelProps={{ shrink: true }}
              id="filled-basic-total"
              label="Total Cost"
              variant="filled"
            />
          </div>
          <LoadingButton
            loading={flightsloading}
            variant="contained"
            loadingIndicator="Loading…"
            disabled={flightdisable}
            onClick={findFlights}
          >
            <span>Find Flights</span>
          </LoadingButton>
          <div></div>
          <SaveButton handleClick={handleSaveClick} saved={localSaved} />
          <FlightTable
            data={flightData}
            updateExerciseAircraft={updateExerciseAircraft}
          />
        </LocalizationProvider>
      </Paper>
    </div>
  );
}

export default PickAddOns;
