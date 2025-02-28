import React, { useEffect } from "react";
import "./datepicker.css";
import { DayPicker } from "react-day-picker";

type Props = {
  setSelectedDate: (date: Date | null) => void;
  selectedDate: Date | null; // Allow null here
  closeCalendar: () => void;
};

const DatePickerCalendar: React.FC<Props> = ({
  selectedDate,
  setSelectedDate,
  closeCalendar,
}) => {
  useEffect(() => {
    const closeOnEscapeKey = (e: KeyboardEvent) =>
      e.key === "Escape" && closeCalendar();

    document.body.addEventListener("keydown", closeOnEscapeKey);
    return () => {
      document.body.removeEventListener("keydown", closeOnEscapeKey);
    };
  }, [closeCalendar]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div
      className="calendar-container"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          closeCalendar();
        }
      }}
    >
      <div className="calendar-card">
        <DayPicker
          mode="single"
          selected={selectedDate ?? undefined}
          onSelect={(date) => {
            setSelectedDate(date ?? null);
            closeCalendar();
          }}
          className="custom-calendar"
          fromDate={today}  
        />
      </div>
    </div>
  );
};

export default DatePickerCalendar;
