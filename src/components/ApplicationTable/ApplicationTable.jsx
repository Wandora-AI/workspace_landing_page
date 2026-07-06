import { getIconEmoji } from "../../utils/icons";
import "./ApplicationTable.css";

export default function ApplicationTable({ applications, onEdit, onDelete }) {
  if (applications.length === 0) {
    return <p className="app-table__empty">No applications yet. Add one above.</p>;
  }

  return (
    <div className="app-table__wrapper">
      <table className="app-table">
        <thead>
          <tr>
            <th>Icon</th>
            <th>Name</th>
            <th>Category</th>
            <th>Description</th>
            <th>URL</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app.id}>
              <td data-label="Icon">
                <span className="app-table__icon">{getIconEmoji(app.icon)}</span>
              </td>
              <td data-label="Name">{app.name}</td>
              <td data-label="Category">{app.category}</td>
              <td data-label="Description">{app.description}</td>
              <td data-label="URL">
                <a href={app.url} target="_blank" rel="noopener noreferrer">
                  {app.url}
                </a>
              </td>
              <td data-label="Actions">
                <div className="app-table__actions">
                  <button
                    type="button"
                    className="btn btn--small btn--ghost"
                    onClick={() => onEdit(app)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn btn--small btn--danger"
                    onClick={() => onDelete(app)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
