import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import "./EditBugForm.css"; // Import the CSS file

function EditBugForm({ bug, onCancel, onUpdate }) {
  const [formData, setFormData] = useState({
    bug_title: bug.bug_title,
    severity: bug.severity,
    status_id: bug.status_id,
    priority_id: bug.priority_id,
    assigned_user_id: bug.assigned_user_id,
  });

  const [users, setUsers] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [statuses, setStatuses] = useState([]);

  useEffect(() => {
    async function fetchDropdownData() {
      const usersData = await supabase.from("users").select("*");
      const prioritiesData = await supabase.from("priorities").select("*");
      const statusesData = await supabase.from("statuses").select("*");

      setUsers(usersData.data || []);
      setPriorities(prioritiesData.data || []);
      setStatuses(statusesData.data || []);
    }

    fetchDropdownData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error } = await supabase
      .from("bugs")
      .update({
        bug_title: formData.bug_title,
        severity: formData.severity,
        status_id: formData.status_id,
        priority_id: formData.priority_id,
        assigned_user_id: formData.assigned_user_id,
        updated_date: new Date().toISOString(),
      })
      .eq("bug_id", bug.bug_id);

    if (error) {
      console.error("Error updating bug:", error);
    } else {
      onUpdate();
    }
  };

  return (
    <div className="edit-bug-modal">
      <div className="edit-bug-container">
        <h2>Edit Bug</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Bug Title:
            <input
              type="text"
              name="bug_title"
              value={formData.bug_title}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Severity:
            <select name="severity" value={formData.severity} onChange={handleChange}>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </label>

          <label>
            Status:
            <select name="status_id" value={formData.status_id} onChange={handleChange}>
              {statuses.map((status) => (
                <option key={status.status_id} value={status.status_id}>
                  {status.status_name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Priority:
            <select name="priority_id" value={formData.priority_id} onChange={handleChange}>
              {priorities.map((priority) => (
                <option key={priority.priority_id} value={priority.priority_id}>
                  {priority.priority_name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Assigned User:
            <select
              name="assigned_user_id"
              value={formData.assigned_user_id}
              onChange={handleChange}
            >
              <option value="">Unassigned</option>
              {users.map((user) => (
                <option key={user.user_id} value={user.user_id}>
                  {user.username}
                </option>
              ))}
            </select>
          </label>

          <div className="button-group">
            <button type="submit" className="save-btn">Save</button>
            <button type="button" className="cancel-btn" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditBugForm;
