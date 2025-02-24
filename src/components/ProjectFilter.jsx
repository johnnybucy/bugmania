// ProjectFilter.jsx
import React from "react";

function ProjectFilter({ projects, projectFilter, onProjectFilterChange }) {
  return (
    <div>
      <label>Filter by Project: </label>
      <select value={projectFilter} onChange={onProjectFilterChange}>
        <option value="">All Projects</option>
        {projects.map((project) => (
          <option key={project.project_id} value={project.project_id}>
            {project.project_name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default ProjectFilter;
