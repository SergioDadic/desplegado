import * as React from "react";
import dayjs from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import { DesktopTimePicker } from "@mui/x-date-pickers/DesktopTimePicker";
import { StaticTimePicker } from "@mui/x-date-pickers/StaticTimePicker";

export default function ResponsiveTimePickers({ texto }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        components={[
          "TimePicker",
          "MobileTimePicker",
          "DesktopTimePicker",
          "StaticTimePicker",
        ]}
      >
        <DemoItem>
          <TimePicker label={texto} defaultValue={dayjs("2022-04-17T15:30")} />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
