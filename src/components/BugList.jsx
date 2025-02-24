import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

function BugList() {
  const [bugs, setBugs] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const bugsData = await supabase.from("bugs").select("*");
      const projectsData = await supabase.from("projects").select("*");
      const usersData = await supabase.from("users").select("*");
      const prioritiesData = await supabase.from("priorities").select("*");
      const statusesData = await supabase.from("statuses").select("*");

      if (bugsData.error) throw bugsData.error;
      if (projectsData.error) throw projectsData.error;
      if (usersData.error) throw usersData.error;
      if (prioritiesData.error) throw prioritiesData.error;
      if (statusesData.error) throw statusesData.error;

      setBugs(bugsData.data);
      setProjects(projectsData.data);
      setUsers(usersData.data);
      setPriorities(prioritiesData.data);
      setStatuses(statusesData.data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  }

  // Create lookup objects for fast access
  const projectLookup = Object.fromEntries(
    projects.map((p) => [p.project_id, p.project_name])
  );
  const userLookup = Object.fromEntries(
    users.map((u) => [u.user_id, u.username])
  );
  const priorityLookup = Object.fromEntries(
    priorities.map((p) => [p.priority_id, p.priority_name])
  );
  const statusLookup = Object.fromEntries(
    statuses.map((s) => [s.status_id, s.status_name])
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Bug List</h2>
      <ul>
        {bugs.map((bug) => (
          <li key={bug.bug_id}>
            <h3>{bug.bug_title}</h3>
            <p>Severity: {bug.severity}</p>
            <p>Status: {statusLookup[bug.status_id] || "Unknown"}</p>
            <p>Priority: {priorityLookup[bug.priority_id] || "Unknown"}</p>
            <p>Project: {projectLookup[bug.project_id] || "Unknown"}</p>
            <p>Assigned To: {userLookup[bug.assigned_user_id] || "Unassigned"}</p>
            <p>Created: {new Date(bug.created_date).toLocaleString()}</p>
            <p>Updated: {new Date(bug.updated_date).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BugList;
