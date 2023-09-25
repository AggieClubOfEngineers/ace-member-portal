import React, { useState } from "react";

const QuickEditPopup = ({ users, onSave, onClose, eventPoints }) => {
  const [selectedUsers, setSelectedUsers] = useState([]);

  const toggleUser = (memberId) => {
    if (selectedUsers.includes(memberId)) {
      setSelectedUsers((prev) => prev.filter((id) => id !== memberId));
    } else {
      setSelectedUsers((prev) => [...prev, memberId]);
    }
  };
  const handleSave = () => {
    onSave(eventPoints, selectedUsers);
    onClose();
  };
  const [sortByLastName, setSortByLastName] = useState(false); // New state for sorting

  // Helper function to extract the last name from a full name.
  const getLastName = (name) => {
    const parts = name.split(" ");
    return parts[parts.length - 1];
  };

  // Sort users based on the toggle state.
  const sortedUsers = [...users].sort((a, b) => {
    if (sortByLastName) {
      return getLastName(a.name).localeCompare(getLastName(b.name));
    } else {
      return a.name.localeCompare(b.name);
    }
  });

  return (
    <div className="quick-edit-popup">
      <div className="sorting-toggle">
        <button onClick={() => setSortByLastName(!sortByLastName)}>
          Sort by {sortByLastName ? "First Name" : "Last Name"}
        </button>
      </div>
      <div className="quick-edit-content">
        {sortedUsers.map((user) => (
          <div key={user.id} onClick={() => toggleUser(user.id)}>
            <input
              type="checkbox"
              checked={selectedUsers.includes(user.id)}
              onChange={() => {}}
            />
            {user.name}
          </div>
        ))}
      </div>
      <button onClick={handleSave}>Save</button>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default QuickEditPopup;
