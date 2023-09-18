import React, { useState } from "react";

const QuickEditPopup = ({ users, onSave, onClose, eventPoints }) => {
  const [selectedUsers, setSelectedUsers] = useState([]);

  const toggleUser = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers((prev) => prev.filter((id) => id !== userId));
    } else {
      setSelectedUsers((prev) => [...prev, userId]);
    }
  };
  const handleSave = () => {
    onSave(eventPoints, selectedUsers);
    console.log(selectedUsers);
    onClose();
  };

  return (
    <div className="quick-edit-popup">
      {users.map((user) => (
        <div key={user.id} onClick={() => toggleUser(user.id)}>
          <input
            type="checkbox"
            checked={selectedUsers.includes(user.id)}
            onChange={() => {}}
          />
          {user.name}
        </div>
      ))}
      <button onClick={handleSave}>Save</button>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default QuickEditPopup;
