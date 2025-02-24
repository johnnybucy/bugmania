import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

function AddBug({ onBugAdded }) {
  const [newBug, setNewBug] = useState({
    bug_title: "",
    severity: "Low",
    project_id: "",
    priority_id: "",
    status_id: "",
    assigned_user_id: "",
    created_by_user_id: "", // Automatically set this if possible
  });

  const [projects, setProjects] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchDropdownData();
  }, []);

  async function fetchDropdownData() {
    const projectsData = await supabase.from("projects").select("*");
    const prioritiesData = await supabase.from("priorities").select("*");
    const statusesData = await supabase.from("statuses").select("*");
    const usersData = await supabase.from("users").select("*");

    setProjects(projectsData.data || []);
    setPriorities(prioritiesData.data || []);
    setStatuses(statusesData.data || []);
    setUsers(usersData.data || []);
  }

  async function addBug() {
    if (!newBug.bug_title || !newBug.project_id || !newBug.priority_id) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("bugs").insert([newBug]);
    setLoading(false);

    if (error) {
      setErrorMessage("Error adding bug: " + error.message);
      console.error(error);
    } else {
      setNewBug({
        bug_title: "",
        severity: "Low",
        project_id: "",
        priority_id: "",
        status_id: "",
        assigned_user_id: "",
        created_by_user_id: "", // Reset after submission
      });
      setErrorMessage(""); // Clear any previous errors
      onBugAdded(); // Refresh Bug List
    }
  }

  return (
    <div>
      <h2>Add New Bug</h2>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      <input
        placeholder="Bug Title"
        value={newBug.bug_title}
        onChange={(e) => setNewBug({ ...newBug, bug_title: e.target.value })}
      />
      <select
        value={newBug.severity}
        onChange={(e) => setNewBug({ ...newBug, severity: e.target.value })}
      >
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
        <option value="Critical">Critical</option>
      </select>
      <select
        value={newBug.project_id}
        onChange={(e) => setNewBug({ ...newBug, project_id: e.target.value })}
      >
        <option value="">Select Project</option>
        {projects.map((project) => (
          <option key={project.project_id} value={project.project_id}>
            {project.project_name}
          </option>
        ))}
      </select>
      <select
        value={newBug.priority_id}
        onChange={(e) => setNewBug({ ...newBug, priority_id: e.target.value })}
      >
        <option value="">Select Priority</option>
        {priorities.map((priority) => (
          <option key={priority.priority_id} value={priority.priority_id}>
            {priority.priority_name}
          </option>
        ))}
      </select>
      <select
        value={newBug.status_id}
        onChange={(e) => setNewBug({ ...newBug, status_id: e.target.value })}
      >
        <option value="">Select Status</option>
        {statuses.map((status) => (
          <option key={status.status_id} value={status.status_id}>
            {status.status_name}
          </option>
        ))}
      </select>
      <select
        value={newBug.assigned_user_id}
        onChange={(e) => setNewBug({ ...newBug, assigned_user_id: e.target.value })}
      >
        <option value="">Select Assignee</option>
        {users.map((user) => (
          <option key={user.user_id} value={user.user_id}>
            {user.username}
          </option>
        ))}
      </select>
      <button onClick={addBug} disabled={loading}>
        {loading ? "Adding..." : "Submit Bug"}
      </button>
    </div>
  );
}

export default AddBug;
