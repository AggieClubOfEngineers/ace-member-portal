import React, { useContext, useState, useEffect } from "react";
import MemberContext from "../util/MemberContext";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@material-ui/core";
// import "../../styles/points-tab.css";
import { updateEvents } from "../../firebase";

import PointsSummary from "../util/PointsSummary";

const pointCategories = ["Social", "Service", "Family", "Committee", "Meeting"];

const AllPointsTab = () => {
  const { data, updateData } = useContext(MemberContext);

  const [editableData, setEditableData] = useState({});
  const [initialData, setInitialData] = useState({});

  const attendedEvents = data.points;

  // Group all attendedEvents by category
  const attendedEventsByCategory = pointCategories.map((category) => {
    const events = data.events.filter((event) => event.pointType === category);
    const points = events.reduce((total, event) => {
      // Check if there's a corresponding entry in data.points for this event
      const attendedEvent = data.points.find((p) => p.eventId === event.id);
      return total + (attendedEvent ? attendedEvent.points : 0);
    }, 0);
    return {
      category,
      events,
      points,
    };
  });

  useEffect(() => {
    // Convert data.points to the structure we need
    const pointsByUserAndEvent = data.allPoints.reduce((acc, event) => {
      if (!acc[event.memberId]) acc[event.memberId] = {};
      acc[event.memberId][event.eventId] = event.points;
      return acc;
    }, {});

    setEditableData(pointsByUserAndEvent);
    setInitialData(pointsByUserAndEvent);
  }, [data]);

  const handleEdit = (event, memberId, eventId) => {
    setEditableData((prevData) => ({
      ...prevData,
      [memberId]: {
        ...prevData[memberId],
        [eventId]: event.target.value,
      },
    }));
  };

  const handleSave = () => {
    // This will hold only the changed entries
    const updatedPoints = {};

    for (let memberId in editableData) {
      for (let eventId in editableData[memberId]) {
        // Check if member or event does not exist in initialData or if the points have changed
        if (
          !initialData[memberId] ||
          !initialData[memberId][eventId] ||
          initialData[memberId][eventId] !== editableData[memberId][eventId]
        ) {
          if (!updatedPoints[memberId]) {
            updatedPoints[memberId] = {};
          }
          // Find the corresponding event to get the pointType
          const correspondingEvent = data.events.find(
            (event) => event.id === eventId
          );
          const pointType = correspondingEvent
            ? correspondingEvent.pointType
            : "Unknown";

          updatedPoints[memberId][eventId] = {
            points: Number(editableData[memberId][eventId]),
            pointType,
          };
        }
      }
    }

    // Replace with your database update operation
    updateEvents(updatedPoints);

    // After saving, update the initial data
    setInitialData(editableData);
  };

  console.log(editableData);

  return (
    <div className="points-container">
      <h2>My Points</h2>
      <hr />
      <PointsSummary
        pointCategories={pointCategories}
        attendedEventsByCategory={attendedEventsByCategory}
      />

      <h2>All Points</h2>
      <hr />
      {pointCategories.map((category) => {
        const eventsInCategory = data.events.filter(
          (event) => event.pointType === category
        );
        return (
          <div className="all-points-category-container" key={category}>
            <h3>{category}</h3>
            <TableContainer className="scrollable-table">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>User ID</TableCell>
                    {eventsInCategory.map((event) => (
                      <TableCell key={event.id} className="wide-cell">
                        {event.name}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      {eventsInCategory.map((event) => {
                        const pointValue =
                          editableData[user.id] &&
                          editableData[user.id][event.id]
                            ? editableData[user.id][event.id]
                            : "";
                        return (
                          <TableCell key={event.id}>
                            <TextField
                              value={pointValue}
                              onChange={(e) => handleEdit(e, user.id, event.id)}
                            />
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        );
      })}

      <button className="save-button" onClick={handleSave}>
        Save
      </button>
    </div>
  );
};

export default AllPointsTab;
