import { Button } from "@mui/material";

export function SaveButton(props) {
  const { handleClick, saved } = props;

  if (saved) {
    return <Button variant="contained">Saved</Button>;
  } else {
    return (
      <Button
        variant="outlined"
        sx={{ backgroundColor: "white" }}
        onClick={handleClick}
      >
        Save
      </Button>
    );
  }
}

export function SubmitButton(props) {
  const { handleClick, saved } = props;

  if (saved) {
    return <Button variant="contained">Submitted</Button>;
  } else {
    return (
      <Button
        variant="outlined"
        sx={{ backgroundColor: "white" }}
        onClick={handleClick}
      >
        Submit
      </Button>
    );
  }
}
