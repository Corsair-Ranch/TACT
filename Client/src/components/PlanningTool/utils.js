import { DateTime } from "luxon";

export const dedupedAircraft = (list) => {
  const result = [];
  const temp = [];
  list &&
    list.forEach((airframe) => {
      if (!temp.includes(airframe.aircraftName)) {
        temp.push(airframe.aircraftName);
        result.push({
          value: result.length,
          label: airframe.aircraftName,
          numbers: [
            {
              label: airframe.aircraftCount,
              value: airframe.personnelCount,
            },
          ],
        });
      } else {
        result[result.length - 1].numbers.push({
          label: airframe.aircraftCount,
          value: airframe.personnelCount,
        });
      }
    });
  return result;
};

export function calculateUnitCostSum(input, totalDays) {
  // `input` is the unitExerciseAircraft that the cost needs to be determined from
  //will need to do the math on the total cost when saving it here
  //need to cycle through all the fields in the aircraftData and calcuate
  //commercialAirfare - done
  //commercialLodging - done
  //govelodginCost - done
  //rentalCost - done
  //perDiemTotal - done
  //rental car - done
  let result = 0;
  result += input.commercialAirfareCost
    ? input.commercialAirfareCost * input.commercialAirfareCount
    : 0;
  result += input.commercialLodgingCost
    ? input.lodgingPerDiem * input.commercialLodgingCount
    : 0;
  result += input.governmentLodgingCost
    ? input.lodgingPerDiem * input.governmentLodgingCount
    : 0;
  result += input.rentalCost ? input.rentalCost : 0;
  result += input.mealPerDiem * input.mealNotProvidedCount * totalDays;
  return result;
}

export const convertToCurrency = (input, decimals = 0) => {
  const currencyParams = {
    locales: "en-US",
    options: {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    },
  };

  return Math.round(input).toLocaleString(
    currencyParams.locales,
    currencyParams.options
  );
};

export const dateToString = (date, formatTemplate = "dd LLL yyyy") => {
  return DateTime.fromJSDate(date).toLocal().toFormat(formatTemplate);
};

export const calculateTotalDays = (start, stop) => {
  return Math.round(
    1 + (new Date(stop) - new Date(start)) / (1000 * 60 * 60 * 24)
  );
};

export const convertToNumber = (input, type = "integer") => {
  let result = input;
  if (typeof input !== "number") {
    if (type === "integer") result = parseInt(input);
    if (type === "float") result = parseFloat(input);
  }
  return result;
};
