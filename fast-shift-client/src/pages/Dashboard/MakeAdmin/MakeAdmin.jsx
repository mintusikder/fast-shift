import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { axiosSecure } from "../../../hooks/useAxiosSecure";

const MakeAdmin = () => {
  const [searchEmail, setSearchEmail] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Auto-search (debounced)
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (!searchEmail.trim()) {
        setUsers([]);
        return;
      }
      searchUsers();
    }, 500); // 500ms debounce delay

    return () => clearTimeout(delayDebounce);
  }, [searchEmail]);

  const searchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axiosSecure.get(`/users/search?email=${encodeURIComponent(searchEmail)}`);
      if (Array.isArray(res.data)) {
        setUsers(res.data);
      } else {
        setUsers([]);
        setError("Invalid data format received");
      }
    } catch (err) {
      setUsers([]);
      setError("Failed to search users");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleAdmin = async (email, currentRole) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    const result = await Swal.fire({
      title: `Are you sure?`,
      text: `You want to ${newRole === "admin" ? "make" : "remove"} admin for ${email}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
    });

    if (!result.isConfirmed) return;

    try {
      await axiosSecure.patch(`/users/${encodeURIComponent(email)}/role`, { role: newRole });
      Swal.fire("Success", `User role updated to ${newRole}`, "success");
      setUsers((prev) =>
        prev.map((u) => (u.email === email ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      Swal.fire("Error", "Failed to update user role", "error");
      console.error(err);
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Make Admin</h2>

      <div className="mb-4">
        <input
          type="email"
          placeholder="Search user by email"
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
          className="input input-bordered w-full"
        />
      </div>

      {loading && <p className="text-gray-500 mb-2">Searching...</p>}
      {error && <p className="text-error mb-4">{error}</p>}

      {users.length > 0 ? (
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Email</th>
              <th>Created At</th>
              <th>Role</th>
              <th>Toggle Admin</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.email}>
                <td>{user.email}</td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>{user.role || "user"}</td>
                <td>
                  <button
                    className={`btn btn-sm ${
                      user.role === "admin" ? "btn-error" : "btn-success"
                    }`}
                    onClick={() => toggleAdmin(user.email, user.role)}
                  >
                    {user.role === "admin" ? "Remove Admin" : "Make Admin"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !loading && <p>No users found.</p>
      )}
    </div>
  );
};

export default MakeAdmin;
