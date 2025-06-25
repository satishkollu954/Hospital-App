import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function ALLLocations() {
  const [locations, setLocations] = useState([]);
  const [editBranch, setEditBranch] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = () => {
    axios
      .get("http://localhost:5000/admin/locations")
      .then((res) => setLocations(res.data))
      .catch((err) => console.error("Error fetching locations:", err));
  };

  const handleDeleteState = (state) => {
    if (window.confirm(`Are you sure you want to delete ${state}?`)) {
      axios
        .delete("http://localhost:5000/admin/delete-state", {
          data: { state },
        })
        .then(() => {
          alert("State deleted successfully");
          fetchLocations();
        })
        .catch((err) => console.error("Error deleting state:", err));
    }
  };

  const handleDeleteBranch = (state, branchId) => {
    if (window.confirm("Are you sure you want to delete this branch?")) {
      axios
        .delete("http://localhost:5000/admin/delete-branch", {
          data: { state, branchId },
        })
        .then(() => {
          alert("Branch deleted successfully");
          fetchLocations();
        })
        .catch((err) => console.error("Error deleting branch:", err));
    }
  };

  const handleEditChange = (branchId, key, value) => {
    setEditBranch((prev) => {
      const original = prev[branchId]?.original || {
        name: locations
          .flatMap((l) => l.branches)
          .find((b) => b._id === branchId)?.name,
        mapUrl: locations
          .flatMap((l) => l.branches)
          .find((b) => b._id === branchId)?.mapUrl,
      };

      const updated = {
        ...prev[branchId],
        original,
        [key]: value,
      };

      return {
        ...prev,
        [branchId]: updated,
      };
    });
  };

  const handleUpdateBranch = (state, branch) => {
    const updated = editBranch[branch._id];
    if (!updated?.name || !updated?.mapUrl) {
      alert("Both name and map URL are required");
      return;
    }

    axios
      .put("http://localhost:5000/admin/update-branch", {
        state,
        branchId: branch._id,
        newName: updated.name,
        newMapUrl: updated.mapUrl,
      })
      .then(() => {
        alert("Branch updated successfully");
        setEditBranch((prev) => ({ ...prev, [branch._id]: null }));
        fetchLocations();
      })
      .catch((err) => {
        console.error("Update failed:", err);
        alert("Update failed");
      });
  };

  return (
    <div className="container my-4">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="btn btn-outline-secondary mb-4"
      >
        ← Back
      </button>

      <h2 className="text-center mb-4">Hospital Locations</h2>

      {locations.map((loc) => (
        <div key={loc._id} className="card mb-4 shadow-sm">
          <div className="card-header d-flex justify-content-between align-items-center bg-secondary text-white">
            <h5 className="mb-0">{loc.State}</h5>
            <button
              className="btn btn-sm btn-danger"
              onClick={() => handleDeleteState(loc.State)}
            >
              Delete State
            </button>
          </div>

          <div className="card-body">
            <h6 className="fw-bold mb-3">Branches:</h6>
            {loc.branches.length === 0 && (
              <p className="text-muted">No branches available.</p>
            )}
            {loc.branches.map((branch) => {
              const isEditing = !!editBranch[branch._id];
              const edited = editBranch[branch._id];
              const hasChanges =
                edited?.name !== edited?.original?.name ||
                edited?.mapUrl !== edited?.original?.mapUrl;

              return (
                <div key={branch._id} className="border rounded p-3 mb-3">
                  {isEditing ? (
                    <>
                      <div className="mb-2">
                        <label className="form-label">Branch Name:</label>
                        <input
                          type="text"
                          value={edited.name}
                          onChange={(e) =>
                            handleEditChange(branch._id, "name", e.target.value)
                          }
                          className="form-control"
                          placeholder="Branch name"
                        />
                      </div>
                      <div className="mb-2">
                        <label className="form-label">Map URL:</label>
                        <input
                          type="text"
                          value={edited.mapUrl}
                          onChange={(e) =>
                            handleEditChange(
                              branch._id,
                              "mapUrl",
                              e.target.value
                            )
                          }
                          className="form-control"
                          placeholder="Map URL"
                        />
                      </div>
                      <div className="d-flex justify-content-center gap-3 mt-3">
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => handleUpdateBranch(loc.State, branch)}
                          disabled={!hasChanges}
                        >
                          Save
                        </button>

                        <button
                          className="btn btn-sm btn-success"
                          onClick={() =>
                            setEditBranch((prev) => ({
                              ...prev,
                              [branch._id]: null,
                            }))
                          }
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <p className="mb-1">
                          <strong>Name:</strong> {branch.name}
                        </p>
                        <p className="mb-1">
                          <strong>Map:</strong>{" "}
                          <a
                            href={branch.mapUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View Location
                          </a>
                        </p>
                      </div>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() =>
                            setEditBranch((prev) => ({
                              ...prev,
                              [branch._id]: {
                                name: branch.name,
                                mapUrl: branch.mapUrl,
                                original: {
                                  name: branch.name,
                                  mapUrl: branch.mapUrl,
                                },
                              },
                            }))
                          }
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() =>
                            handleDeleteBranch(loc.State, branch._id)
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
