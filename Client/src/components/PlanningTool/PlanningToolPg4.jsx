// hooks
import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import TactApi from "../../api/TactApi";
import { styled } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";

//styles
import "../../styles/PlanningToolPg4.css";
import { statesObj } from "../Util/states";
import { Paper, TableContainer, TableHead, Typography } from "@mui/material";
import { calculateTotalDays, convertToCurrency } from "./utils";
import { SaveButton } from "./save-button";

//perdiem data = []{
//   city, ex "Denver / Aurora"
//   county, "Denver / Adams / Arapahoe / Jefferson"
//   meals, 79
//   standardRate, "false"
//   zip, null
//   months [] {
//     value, this is the dollar amount for the lodging
//     number, month number
//     short, 'Jan'
//     long, 'January'
//   }
// }

// Oconus perdiem data = []
//   {
//     "country": "ITALY",
//     "location": "Ferrara",
//     "lodging": "163",
//     "mAndI": "107",
//     "perDiem": "270",
//     "locationCode": "11460"
// }

const getPerDiem = async (params) => {
  // console.log("params in getPerDiem", params);
  if (params.country === "none") {
    return;
  }

  if (params.country === "United States") {
    const stateAbbv = statesObj.find((state) => {
      return state.name === params.state;
    }).abbreviation;
    params.state = stateAbbv;
    const response = await TactApi.getConus(params);
    return response;
  } else {
    //get OCONUS perdiems
    const response = await TactApi.getOconus(params);
    // console.log("OCONUS perdiem response", response);
    return response;
  }
};

const parseOcousPerdiem = (props) => {
  const { raw, perdiemCity } = props;
  const result = { mealPerDiem: 0, lodgingPerDiem: 0, city: "Standard Rate" };
  let temp;
  let standardRate;
  //if there is only one element in the array => use that one element
  if (raw.length === 1) {
    result.mealPerDiem = raw[0].mAndI;
    result.lodgingPerDiem = raw[0].lodging;
    result.city = raw[0].location;
  } else if (raw.length > 1) {
    raw.forEach((rate) => {
      if (rate.location.includes(perdiemCity)) {
        temp = rate;
        return;
      }
      if (rate.location === "Standard Rate") standardRate = rate;
    });
    if (temp?.location) {
      result.mealPerDiem = temp.mAndI;
      result.lodgingPerDiem = temp.lodging;
      result.city = temp.location;
    } else if (standardRate.location) {
      result.mealPerDiem = standardRate.mAndI;
      result.lodgingPerDiem = standardRate.lodging;
      result.city = standardRate.location;
    } else {
      //didn't find the city or standard rate
      result.mealPerDiem = 0;
      result.lodgingPerDiem = 0;
      result.city = "No city found";
    }
  }
  return result;
};

const parsePerdiem = (props) => {
  //TODO return all of the results for the perdiem to allow drop down in UI
  const { raw, perdiemCity, perdiemStartMonth, perDiemStopMonth } = props;
  //process the array of results to find the correct city
  const result = { mealPerDiem: 0, lodgingPerDiem: 0, city: "Standard Rate" };
  let temp;
  let standardRate;
  //if there is only one element in the array => use that one element
  if (raw.length === 1) {
    const hotelPerdiemStart = raw[0].months.month.find((month) => {
      return month.number === perdiemStartMonth;
    }).value;
    const hotelPerdiemStop = raw[0].months.month.find((month) => {
      return month.number === perDiemStopMonth;
    }).value;
    const hotelPerdiem = (hotelPerdiemStart + hotelPerdiemStop) / 2;

    result.mealPerDiem = raw[0].meals;
    result.lodgingPerDiem = hotelPerdiem;
    result.city = raw[0].city;
    return result;
  } else if (raw.length > 1) {
    raw.forEach((rate) => {
      const cities = rate.city.split("/");
      cities.forEach((city) => {
        if (perdiemCity.includes(city)) {
          temp = rate;
        }
        if (city === "Standard Rate") standardRate = rate;
      });
    });
    if (temp?.city && temp?.meals) {
      const hotelPerdiemStart = temp.months.month.find((month) => {
        return month.number === perdiemStartMonth;
      }).value;
      const hotelPerdiemStop = temp.months.month.find((month) => {
        return month.number === perDiemStopMonth;
      }).value;
      const hotelPerdiem = (hotelPerdiemStart + hotelPerdiemStop) / 2;
      result.mealPerDiem = temp.meals;
      result.lodgingPerDiem = hotelPerdiem;
      result.city = temp.city;
    } else if (standardRate?.city && standardRate.meals) {
      const hotelPerdiemStart = standardRate.months.month.find((month) => {
        return month.number === perdiemStartMonth;
      }).value;
      const hotelPerdiemStop = standardRate.months.month.find((month) => {
        return month.number === perDiemStopMonth;
      }).value;
      const hotelPerdiem = (hotelPerdiemStart + hotelPerdiemStop) / 2;
      result.mealPerDiem = standardRate.meals;
      result.lodgingPerDiem = hotelPerdiem;
      result.city = standardRate.city;
    } else {
      //didn't find the city or standard rate
      result.mealPerDiem = 0;
      result.lodgingPerDiem = 0;
      result.city = "No city found";
    }
  }
  return result;
};

const Lodging = (props) => {
  const {
    data,
    aircraftData,
    saved,
    setSaved,
    setAircraftData,
    updateUnitExerciseAircraft,
  } = props;
  const [startDate, setStartDate] = useState(); // {year, month}
  const [stopDate, setStopDate] = useState(); // {year, month}
  //TODO set location to a default value to process when there is none selected from previous steps
  const [location, setLocation] = useState(); // {city, state, country}
  const [totalLodgingCost, setTotalLodgingCost] = useState(0);
  const [totalMealCost, setTotalMealCost] = useState(0);
  const [totalPerdiemCost, setTotalPerdiemCost] = useState(0);
  const [totalDays, setTotalDays] = useState(0);
  const [comLodgeCost, setComLodgeCost] = useState();
  const [govLodgeCost, setGovLodgeCost] = useState();
  const [localSaved, setLocalSaved] = useState(saved.pg4);

  const updateSaved = () => {
    if (saved.pg4 || saved.submitted) {
      setSaved({
        ...saved,
        submitted: false,
        pg4: false,
      });
    }

    setLocalSaved(false);
  };

  useEffect(() => {
    initializeData();
  }, [data]);

  useEffect(() => {
    calculateCost();
  }, [aircraftData]);

  useEffect(() => {
    setAircraftData([
      {
        ...aircraftData[0],
        commercialLodgingCost: comLodgeCost,
        governmentLodgingCost: govLodgeCost,
      },
    ]);
  }, [comLodgeCost, govLodgeCost]);

  const initializeData = () => {
    setTotalDays(calculateTotalDays(data.travelStartDate, data.travelEndDate));

    setStartDate({
      year: parseInt(data.travelStartDate.slice(0, 4)),
      month: parseInt(data.travelStartDate.slice(5, 7)),
    });

    setStopDate({
      year: parseInt(data.travelEndDate.slice(0, 4)),
      month: parseInt(data.travelEndDate.slice(5, 7)),
    });

    if (data?.locationTo) {
      TactApi.getLocationByIata(data.locationTo).then((result) => {
        setLocation({
          city: result.airport,
          state: result.region,
          country: result.country,
        });
      });
    } else {
      setLocation({
        city: "none",
        state: "none",
        country: "none",
      });
    }

    calculateCost();
  };

  const [perdiemCity, setPerdiemCity] = useState("Not Defined");

  useEffect(() => {
    if (startDate && location) {
      const params = {
        year: startDate.year,
        city: location.city,
        state: location.state,
        country: location.country,
      };
      getPerDiem(params).then((perDiem) => {
        const perdiemParams = {
          raw: perDiem ? perDiem : [],
          perdiemCity: location.city,
          perdiemStartMonth: startDate.month,
          perDiemStopMonth: stopDate.month,
        };
        let result = {};
        if (params.country === "none") {
          setPerdiemCity("No Location Selected");
          result = {
            mealPerDiem: 0,
            lodgingPerDiem: 0,
            city: "No Location Selected",
          };
        } else if (params.country === "United States") {
          result = parsePerdiem(perdiemParams);
          setPerdiemCity(result.city);
        } else {
          perdiemParams.perdiemCity = location.state;
          result = parseOcousPerdiem(perdiemParams);
          setPerdiemCity(result.city);
        }
        setAircraftData([
          {
            ...aircraftData[0],
            lodgingPerDiem: result.lodgingPerDiem,
            mealPerDiem: result.mealPerDiem,
          },
        ]);
      });
    } else {
    }
    calculateCost();
  }, [startDate, stopDate, location]);

  const handleGovLodge = (e) => {
    const value = isNaN(parseInt(e.target.value))
      ? 0
      : parseInt(e.target.value);
    if (value > data.personnelSum || value < 0) {
      return;
    } else {
      const tempGov = value;
      let tempCom;
      let tempField;
      const checkSum =
        data.personnelSum -
        value -
        aircraftData[0].commercialLodgingCount -
        aircraftData[0].fieldLodgingCount;
      // IF reducing the number in gov lodging, those excess should go to commercial
      // IF adding to the number in gov lodging, those should come first from field, then commercial
      if (checkSum >= 0) {
        // reducing from gov lodging
        tempCom = aircraftData[0].commercialLodgingCount + checkSum;
        tempField = aircraftData[0].fieldLodgingCount;
      } else {
        //adding to gov lodging
        if (aircraftData[0].fieldLodgingCount >= -1 * checkSum) {
          //there are available field lodging to move to gov
          tempCom = aircraftData[0].commercialLodgingCount;
          tempField = aircraftData[0].fieldLodgingCount + checkSum;
        } else {
          tempCom = aircraftData[0].commercialLodgingCount + checkSum;
          tempField = 0;
        }
      }
      setAircraftData([
        {
          ...aircraftData[0],
          governmentLodgingCount: tempGov,
          commercialLodgingCount: tempCom,
          fieldLodgingCount: tempField,
        },
      ]);
    }
    updateSaved();
  };

  const handleComLodge = (e) => {
    const value = isNaN(parseInt(e.target.value))
      ? 0
      : parseInt(e.target.value);
    if (value > data.personnelSum || value < 0) {
      return;
    } else {
      const tempCom = value;
      //don't go below 0 in tempGov
      let tempGov;
      let tempField;
      const checkSum =
        data.personnelSum - value - aircraftData[0].fieldLodgingCount;
      if (checkSum >= 0) {
        tempGov = checkSum;
        tempField = aircraftData[0].fieldLodgingCount;
      } else {
        tempGov = 0;
        tempField = data.personnelSum - tempCom;
      }
      setAircraftData([
        {
          ...aircraftData[0],
          governmentLodgingCount: tempGov,
          commercialLodgingCount: tempCom,
          fieldLodgingCount: tempField,
        },
      ]);
    }
    updateSaved();
  };

  const handleFieldLodge = (e) => {
    const value = isNaN(parseInt(e.target.value))
      ? 0
      : parseInt(e.target.value);
    if (value > data.personnelSum || value < 0) {
      return;
    } else {
      const tempField = value;
      //don't go below 0 in tempGov
      let tempGov;
      let tempCom;
      const checkSum =
        data.personnelSum - value - aircraftData[0].commercialLodgingCount;
      if (checkSum >= 0) {
        tempGov = checkSum;
        tempCom = aircraftData[0].commercialLodgingCount;
      } else {
        tempGov = 0;
        tempCom = data.personnelSum - tempField;
      }
      setAircraftData([
        {
          ...aircraftData[0],
          governmentLodgingCount: tempGov,
          commercialLodgingCount: tempCom,
          fieldLodgingCount: tempField,
        },
      ]);
    }
    updateSaved();
  };

  const handleMealsProvided = (e) => {
    const value = isNaN(parseInt(e.target.value))
      ? 0
      : parseInt(e.target.value);
    if (value > data.personnelSum || value < 0) {
      return;
    } else {
      setAircraftData([
        {
          ...aircraftData[0],
          mealProvidedCount: value,
          mealNotProvidedCount: data.personnelSum - value,
        },
      ]);
    }
    updateSaved();
  };

  const calculateCost = () => {
    setComLodgeCost(
      aircraftData[0].commercialLodgingCount *
        aircraftData[0].lodgingPerDiem *
        (totalDays - 1)
    );
    setGovLodgeCost(
      aircraftData[0].governmentLodgingCount *
        aircraftData[0].lodgingPerDiem *
        (totalDays - 1)
    );
    const lodging = comLodgeCost + govLodgeCost;
    const meals =
      totalDays *
      aircraftData[0].mealNotProvidedCount *
      aircraftData[0].mealPerDiem;
    setTotalLodgingCost(lodging);
    setTotalMealCost(meals);
    setTotalPerdiemCost(lodging + meals);
  };

  const handleSaveClick = () => {
    setSaved({
      ...saved,
      alert: "Saving perdiem ",
      pg4: true,
    });
    setLocalSaved(true);
    updateUnitExerciseAircraft();
  };

  const card = (
    <div>
      <TableContainer component={Paper}>
        <TableHead>{`Perdiem for ${perdiemCity}`}</TableHead>
      </TableContainer>
      <StyledTableRow key="totals-row">
        <StyledTableCell component="th" scope="row">
          <Typography>{`Totals`}</Typography>
        </StyledTableCell>
        <StyledTableCell component="th" scope="row">
          <TextField
            disabled
            id="numDays"
            label="Days"
            margin="normal"
            value={totalDays}
          />
        </StyledTableCell>
        <StyledTableCell component="th" scope="row">
          <TextField
            disabled
            id="numPeopleTotal"
            label="Personnel"
            margin="normal"
            value={data.personnelSum}
          />
        </StyledTableCell>
        <StyledTableCell component="th" scope="row">
          <TextField
            disabled
            id="totalPerdiemCost"
            label="Cost"
            margin="normal"
            value={convertToCurrency(totalPerdiemCost)}
          />
        </StyledTableCell>
        <StyledTableCell component="th" scope="row">
          <TextField
            disabled
            id="total-cost-per-person"
            label="Cost/Person"
            variant="outlined"
            margin="normal"
            value={convertToCurrency(totalPerdiemCost / data.personnelSum)}
          />
        </StyledTableCell>
      </StyledTableRow>
      <StyledTableRow key="lodging-row">
        <StyledTableCell component="th" scope="row" />

        <StyledTableCell component="th" scope="row">
          <Typography>Lodging</Typography>
        </StyledTableCell>
        <StyledTableCell component="th" scope="row">
          <TextField
            disabled
            id="lodgingCost"
            label="Perdiem"
            variant="outlined"
            margin="normal"
            value={convertToCurrency(aircraftData[0].lodgingPerDiem)}
          />
        </StyledTableCell>
        <StyledTableCell component="th" scope="row">
          <TextField
            disabled
            id="hotelTotalCost"
            label="Cost"
            variant="outlined"
            margin="normal"
            value={convertToCurrency(totalLodgingCost)}
          />
        </StyledTableCell>
        <StyledTableCell component="th" scope="row">
          <TextField
            disabled
            id="lodging-cost-per-person"
            label="Cost/Person"
            variant="outlined"
            margin="normal"
            value={convertToCurrency(totalLodgingCost / data.personnelSum)}
          />
        </StyledTableCell>
      </StyledTableRow>
      <StyledTableRow key="meal-perdiem-row">
        <StyledTableCell component="th" scope="row" />
        <StyledTableCell component="th" scope="row">
          <Typography>Meals</Typography>
        </StyledTableCell>

        <StyledTableCell component="th" scope="row">
          <TextField
            disabled
            id="mealCost"
            label="Perdiem"
            variant="outlined"
            margin="normal"
            value={convertToCurrency(aircraftData[0].mealPerDiem)}
          />
        </StyledTableCell>
        <StyledTableCell component="th" scope="row">
          <TextField
            disabled
            id="mealTotalCost"
            label="Cost"
            variant="outlined"
            margin="normal"
            value={convertToCurrency(totalMealCost)}
          />
        </StyledTableCell>
        <StyledTableCell component="th" scope="row">
          <TextField
            disabled
            id="meals-cost-per-person"
            label="Cost/Person"
            variant="outlined"
            margin="normal"
            value={convertToCurrency(totalMealCost / data.personnelSum)}
          />
        </StyledTableCell>
      </StyledTableRow>
      <StyledTableRow key="perdiem-inputs-row">
        <StyledTableCell component="th" scope="row">
          <Typography>Inputs</Typography>
        </StyledTableCell>
        <StyledTableCell component="th" scope="row">
          <TextField
            id="numGovLodge"
            label="Government Lodging"
            variant="outlined"
            margin="normal"
            type="number"
            value={aircraftData[0].governmentLodgingCount}
            onChange={handleGovLodge}
          />
        </StyledTableCell>
        <StyledTableCell component="th" scope="row">
          <TextField
            id="numComLodge"
            label="Commercial Lodging"
            variant="outlined"
            margin="normal"
            type="number"
            value={aircraftData[0].commercialLodgingCount}
            onChange={handleComLodge}
          />
        </StyledTableCell>
        <StyledTableCell component="th" scope="row">
          <TextField
            id="numFieldCon"
            label="Field Conditions"
            variant="outlined"
            margin="normal"
            type="number"
            value={aircraftData[0].fieldLodgingCount}
            onChange={handleFieldLodge}
          />
        </StyledTableCell>
        <StyledTableCell component="th" scope="row">
          {/* <Typography>Government Meals Provided</Typography> */}
          <TextField
            id="numMealsProv"
            label="Government Meals Provided"
            variant="outlined"
            margin="normal"
            type="number"
            value={aircraftData[0].mealProvidedCount}
            onChange={handleMealsProvided}
          />
        </StyledTableCell>
      </StyledTableRow>
      <SaveButton handleClick={handleSaveClick} saved={localSaved} />
    </div>
  );

  return (
    <div>
      <Card>{card}</Card>
    </div>
  );
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default Lodging;
