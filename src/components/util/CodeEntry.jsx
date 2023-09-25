import React, { useState } from "react";
import { SquareArrowRight } from "tabler-icons-react";
import { TextField } from "@mui/material";

import "../../firebase";
import db from "../../config";

import { doc, getDoc, writeBatch } from "firebase/firestore";

const updatePoints = async (memberId, pointType, points, eventId) => {
  const attendanceRef = doc(db, "points", `${memberId}_${eventId}`);

  // Check if the user has already been credited points for this event
  const attendanceSnap = await getDoc(attendanceRef);
  if (attendanceSnap.exists()) {
    throw new Error("User has already been credited points for this event.");
  }

  // Start a batch
  const batch = writeBatch(db);

  batch.set(attendanceRef, { memberId, eventId, pointType, points });

  // Commit the batch
  await batch.commit();
};

const CodeEntry = ({ event, memberId, data, updateData }) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const submitCode = async () => {
    setError(null);
    setSuccessMessage(null);
    if (code === event.code) {
      try {
        await updatePoints(memberId, event.pointType, event.points, event.id);

        // Update local data
        const updatedPoints = [
          ...data.points,
          {
            memberId,
            eventId: event.id,
            pointType: event.pointType,
            points: event.points,
          },
        ];
        updateData({ ...data, points: updatedPoints });
        setSuccessMessage("Points updated.");
        setCode("");
      } catch (err) {
        console.log(err);
        setError("Failed to update points. Please try again.");
      }
    } else {
      setError("Incorrect code. Please try again.");
    }
  };

  return (
    <div>
      <div className="code-entry-container">
        <TextField
          id="outlined-helperText"
          label="Code"
          defaultValue=""
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <div className="submit-button-container" onClick={submitCode}>
          <SquareArrowRight
            className="login-button-icon"
            strokeWidth={2}
            color={"black"}
            size={30}
          />
        </div>
      </div>
      {successMessage && (
        <div className="success-message support-message">{successMessage}</div>
      )}
      {error && <div className="error-message support-message">{error}</div>}
    </div>
  );
};

export default CodeEntry;
