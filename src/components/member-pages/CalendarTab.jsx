import React, { useState, useContext } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import MemberContext from "../util/MemberContext"; // Update this to your MemberContext path

import { deleteEvent } from "../../firebase";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const CalendarTab = ({ events, role }) => {
  const { data, updateData } = useContext(MemberContext);

  const [open, setOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Convert Firebase Timestamps to Dates
  const eventsWithDates = events.map((event) => ({
    ...event,
    start: event.start.toDate(),
    end: event.end.toDate(),
    title: event.name,
  }));

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDeleteEvent = () => {
    // Check if selectedEvent exists and has an id property
    if (selectedEvent && selectedEvent.id) {
      const updatedEvents = events.filter(
        (event) => event.id !== selectedEvent.id
      );

      // Assuming deleteEvent and updateData are functions that handle backend operations and state updates.
      deleteEvent(selectedEvent.id);
      updateData({ ...data, events: updatedEvents });

      // Close the dialog after deleting
      setOpen(false);
      setSelectedEvent(null);
    } else {
      console.error("No selected event to delete");
    }
  };

  return (
    <div style={{ height: 500, color: "#123456" }}>
      <Calendar
        localizer={localizer}
        events={eventsWithDates}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500, width: "70vw", margin: "auto" }}
        onSelectEvent={handleEventClick}
      />
      {selectedEvent && (
        <Dialog open={open} onClose={handleClose}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <DialogTitle>{selectedEvent.title}</DialogTitle>
            {role === "officer" && (
              <IconButton onClick={handleDeleteEvent}>
                <DeleteIcon />
              </IconButton>
            )}
          </div>
          <DialogContent>
            <DialogContentText>
              Description: {selectedEvent.description} <br />
              Location: {selectedEvent.location} <br />
              Points: {selectedEvent.points} <br />
              Start: {moment(selectedEvent.start).format(
                "MMMM Do, h:mm A"
              )}{" "}
              <br />
              End: {moment(selectedEvent.end).format("MMMM Do, h:mm A")} <br />
            </DialogContentText>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default CalendarTab;
