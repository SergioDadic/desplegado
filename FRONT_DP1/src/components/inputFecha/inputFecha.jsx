import * as React from "react";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export default function InputFecha({ texto, onCambiarFecha}) {
  const fechaActual = dayjs();
  const [value, setValue] = React.useState(fechaActual);

  const handleDateChange = (newDate) => {
    // Convierte el objeto dayjs a un objeto Date antes de llamar a onCambiarFecha
    const dateValue = newDate.toDate();
    setValue(newDate);
    onCambiarFecha(dateValue);
  };
  
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={["DatePicker", "DatePicker"]}>
        <DatePicker
          label={texto}
          value={value}
          onChange={handleDateChange}
          renderInput={(params) => (
            <input
              {...params.inputProps}
              value={dayjs(value).format("DD/MM/YYYY")}
              readOnly
              style={{ border: "none", width: "100%", outline: "none" }}
            />
          )}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
