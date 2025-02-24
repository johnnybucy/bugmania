// SortDropdown.jsx
import React from "react";

function SortDropdown({ sortBugs, sortConfig }) {
  return (
    <div>
      <label>Sort By: </label>
      <select
        value={sortConfig.key}
        onChange={(e) => sortBugs(e.target.value)}
      >
        <option value="bug_title">Bug Title</option>
        <option value="severity">Severity</option>
        <option value="status_id">Status</option>
        <option value="priority_id">Priority</option>
        <option value="project_id">Project</option>
        <option value="assigned_user_id">Assigned To</option>
        <option value="created_date">Created Date</option>
        <option value="updated_date">Updated Date</option>
      </select>

      {sortConfig.key && (
        <span>
          {" "}
          ({sortConfig.direction === "asc" ? "Ascending" : "Descending"})
        </span>
      )}
    </div>
  );
}

export default SortDropdown;
