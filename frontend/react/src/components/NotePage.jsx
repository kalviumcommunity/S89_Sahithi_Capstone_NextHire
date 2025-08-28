import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const NotePage = () => {
  const { date } = useParams();
  const [note, setNote] = useState("");
  const [savedNotes, setSavedNotes] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState("");

  // Load notes from localStorage when component mounts or date changes
  useEffect(() => {
    let saved = [];
    try {
      const raw = localStorage.getItem(`note-${date}`);
      saved = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(saved)) saved = [];
    } catch {
      saved = [];
    }
    setSavedNotes(saved);
    setNote("");
    setEditIndex(null);
    setEditValue("");
  }, [date]);

  // Save note to localStorage when Save button is clicked
  const handleSave = () => {
    if (note.trim() === "") return;
    const updatedNotes = [...savedNotes, note];
    localStorage.setItem(`note-${date}`, JSON.stringify(updatedNotes));
    setSavedNotes(updatedNotes);
    setNote("");
  };

  // Delete a note
  const handleDelete = (idx) => {
    const updatedNotes = savedNotes.filter((_, i) => i !== idx);
    localStorage.setItem(`note-${date}`, JSON.stringify(updatedNotes));
    setSavedNotes(updatedNotes);
    // If deleting the note being edited, reset edit state
    if (editIndex === idx) {
      setEditIndex(null);
      setEditValue("");
    }
  };

  // Start editing a note
  const handleEdit = (idx) => {
    setEditIndex(idx);
    setEditValue(savedNotes[idx]);
  };

  // Save the edited note
  const handleEditSave = (idx) => {
    if (editValue.trim() === "") return;
    const updatedNotes = savedNotes.map((n, i) => (i === idx ? editValue : n));
    localStorage.setItem(`note-${date}`, JSON.stringify(updatedNotes));
    setSavedNotes(updatedNotes);
    setEditIndex(null);
    setEditValue("");
  };

  // Cancel editing
  const handleEditCancel = () => {
    setEditIndex(null);
    setEditValue("");
  };

  return (
    <div style={{ maxWidth: 500, margin: "2rem auto" }}>
      <h2>Note for {date}</h2>
      <textarea
        rows={8}
        style={{ width: "100%" }}
        value={note}
        onChange={e => setNote(e.target.value)}
        placeholder="Write your note here..."
      />
      <button
        style={{
          marginTop: 10,
          padding: "8px 16px",
          background: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: 4,
          cursor: "pointer"
        }}
        onClick={handleSave}
      >
        Save
      </button>
      {savedNotes.length > 0 && (
        <div
          style={{
            marginTop: 20,
            padding: 12,
            border: "1px solid #ccc",
            borderRadius: 4,
            background: "#f9f9f9"
          }}
        >
          <strong>Saved Notes:</strong>
          <ul style={{ marginTop: 6, paddingLeft: 18 }}>
            {savedNotes.map((n, idx) => (
              <li key={idx} style={{ marginBottom: 8, whiteSpace: "pre-wrap" }}>
                {editIndex === idx ? (
                  <>
                    <textarea
                      rows={4}
                      style={{ width: "100%" }}
                      value={editValue}
                      onChange={e => setEditValue(e.target.value)}
                    />
                    <button
                      style={{
                        marginRight: 8,
                        marginTop: 4,
                        background: "#28a745",
                        color: "#fff",
                        border: "none",
                        borderRadius: 4,
                        padding: "4px 10px",
                        cursor: "pointer"
                      }}
                      onClick={() => handleEditSave(idx)}
                    >
                      Save
                    </button>
                    <button
                      style={{
                        marginTop: 4,
                        background: "#dc3545",
                        color: "#fff",
                        border: "none",
                        borderRadius: 4,
                        padding: "4px 10px",
                        cursor: "pointer"
                      }}
                      onClick={handleEditCancel}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    {n}
                    <div style={{ marginTop: 4 }}>
                      <button
                        style={{
                          marginRight: 8,
                          background: "#ffc107",
                          color: "#333",
                          border: "none",
                          borderRadius: 4,
                          padding: "2px 10px",
                          cursor: "pointer"
                        }}
                        onClick={() => handleEdit(idx)}
                      >
                        Edit
                      </button>
                      <button
                        style={{
                          background: "#dc3545",
                          color: "#fff",
                          border: "none",
                          borderRadius: 4,
                          padding: "2px 10px",
                          cursor: "pointer"
                        }}
                        onClick={() => handleDelete(idx)}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotePage;