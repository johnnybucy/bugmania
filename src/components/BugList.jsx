// BugList.jsx
import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import SortDropdown from "./SortDropdown";
import ProjectFilter from "./ProjectFilter";
import EditBugForm from "./EditBugForm"; // Import the new EditBugForm component

function BugList() {
  const [bugs, setBugs] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [projectFilter, setProjectFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const bugsPerPage = 5;

  const [editingBug, setEditingBug] = useState(null); // State for the bug being edited

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const bugsData = await supabase.from("bugs").select("*");
    const projectsData = await supabase.from("projects").select("*");
    const usersData = await supabase.from("users").select("*");
    const prioritiesData = await supabase.from("priorities").select("*");
    const statusesData = await supabase.from("statuses").select("*");

    if (bugsData.error) console.error(bugsData.error);
    else setBugs(bugsData.data);

    setProjects(projectsData.data || []);
    setUsers(usersData.data || []);
    setPriorities(prioritiesData.data || []);
    setStatuses(statusesData.data || []);
  }

  const sortBugs = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    const sortedBugs = [...bugs].sort((a, b) => {
      if (key === "created_date" || key === "updated_date") {
        const dateA = new Date(a[key]);
        const dateB = new Date(b[key]);
        return direction === "asc" ? dateA - dateB : dateB - dateA;
      } else {
        if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
        if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
        return 0;
      }
    });

    setBugs(sortedBugs);
    setSortConfig({ key, direction });
  };

  const filteredBugs = projectFilter
    ? bugs.filter((bug) => bug.project_id === projectFilter)
    : bugs;

  const indexOfLastBug = currentPage * bugsPerPage;
  const indexOfFirstBug = indexOfLastBug - bugsPerPage;
  const currentBugs = filteredBugs.slice(indexOfFirstBug, indexOfLastBug);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredBugs.length / bugsPerPage);

  const handleProjectFilterChange = (event) => {
    setProjectFilter(event.target.value);
    setCurrentPage(1);
  };

  // Set the selected bug for editing
  const startEditing = (bug) => {
    setEditingBug(bug);
  };

  // Cancel editing and close the form
  const cancelEditing = () => {
    setEditingBug(null);
  };

  // Refresh the list after update
  const handleBugUpdate = () => {
    fetchData(); // Reload bug list
    setEditingBug(null); // Close the edit form
  };

  return (
    <div>
      <h2>Bug List</h2>

      {/* Project Filter Dropdown */}
      <ProjectFilter
        projects={projects}
        projectFilter={projectFilter}
        onProjectFilterChange={handleProjectFilterChange}
      />

      {/* Sort Dropdown */}
      <SortDropdown sortBugs={sortBugs} sortConfig={sortConfig} />

      {/* Edit Form */}
      {editingBug && (
        <EditBugForm
          bug={editingBug}
          onCancel={cancelEditing}
          onUpdate={handleBugUpdate}
        />
      )}

      {/* Bug Table */}
      <table>
        <thead>
          <tr>
            <th>Bug Title</th>
            <th>Severity</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Project</th>
            <th>Assigned To</th>
            <th>Created Date</th>
            <th>Updated Date</th>
            <th>Actions</th> {/* Added Actions column */}
          </tr>
        </thead>
        <tbody>
          {currentBugs.map((bug) => (
            <tr key={bug.bug_id}>
              <td>{bug.bug_title}</td>
              <td>{bug.severity}</td>
              <td>
                {statuses.find((s) => s.status_id === bug.status_id)?.status_name || "Unknown"}
              </td>
              <td>
                {priorities.find((p) => p.priority_id === bug.priority_id)?.priority_name || "Unknown"}
              </td>
              <td>
                {projects.find((p) => p.project_id === bug.project_id)?.project_name || "Unknown"}
              </td>
              <td>
                {users.find((u) => u.user_id === bug.assigned_user_id)?.username || "Unassigned"}
              </td>
              <td>{new Date(bug.created_date).toLocaleString()}</td>
              <td>{new Date(bug.updated_date).toLocaleString()}</td>
              <td>
                <button onClick={() => startEditing(bug)}>Edit</button> {/* Edit button */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div>
        <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
          Prev
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
}

export default BugList;

