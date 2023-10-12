import TactApi from "../../api/TactApi";

export const calcuateExerciseCost = (props) => {
  const { exercises, unitExercises } = props;

  exercises.forEach((exercise) => {
    const exerciseID = exercise.exerciseID;
    let costSum = 0;
    let personnelSum = 0;
    unitExercises.forEach((unitEx) => {
      if (unitEx.exerciseID === exerciseID) {
        costSum += parseFloat(unitEx.unitCostSum);
        personnelSum += parseInt(unitEx.personnelSum);
      }
    });
    TactApi.updateExercise({ exerciseID, personnelSum, costSum });
  });
};
