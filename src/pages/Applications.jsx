import React, { useState,useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const statusColor = {
  Applied: "bg-blue-100 text-blue-700",
  Interview: "bg-yellow-100 text-yellow-700",
  Offer: "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-700"
};

const Applications = () => {
  const [applications, setapplications] = useState([]);
  const [company, setcompany] = useState("");
  const [role, setrole] = useState("");
  const [status, setstatus] = useState("Applied");
  const [editId, seteditId] = useState(null);
useEffect(() => {
  fetch("http://localhost:5000/api/applications", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
    .then((res) => {
      if (!res.ok) throw new Error("Unauthorized");
      return res.json();
    })
    .then((data) => {
      setapplications(Array.isArray(data) ? data : []);
    })
    .catch(() => setapplications([]));
}, []);


const submithandler = async (e) => {
  e.preventDefault();
  if (!company || !role) return;
  try {
    if (editId) {
      // UPDATE
      const res = await fetch(
        `http://localhost:5000/api/applications/${editId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ company, role, status }),
        }
      );

      const updatedApp = await res.json();
      setapplications(
        applications.map((a) =>
          a._id === editId ? updatedApp : a
        )
      );
      seteditId(null);
    } else {
      // ADD
      const res = await fetch("http://localhost:5000/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ company, role, status }),
      });

      const newApp = await res.json();
      setapplications([...applications, newApp]);
    }

    setcompany("");
    setrole("");
    setstatus("Applied");
  } catch (err) {
    console.error(err);
    alert("Application action failed");
  }
};


  const editapp = (app) => {
    setcompany(app.company);
    setrole(app.role);
    setstatus(app.status);
    seteditId(app._id);
  };

  const deleteapp = async (id) => {
await fetch(`http://localhost:5000/api/applications/${id}`, {
  method: "DELETE",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});
    setapplications(applications.filter((a) => a._id !== id));
  };

  return (
    <div className="space-y-6 w-[72vw] ml-[5%]">
      <div>
        <h1 className="text-2xl font-semibold">Applications</h1>
        <p className="text-gray-500">
          Track all your job & internship applications
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={submithandler}
        className="bg-white border rounded-2xl p-6 grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <input
          className="border p-3 rounded-lg h-[30px]"
          placeholder="Company"
          value={company}
          onChange={(e) => setcompany(e.target.value)}
        />

        <input
          className="border p-3 rounded-lg h-[30px]"
          placeholder="Role"
          value={role}
          onChange={(e) => setrole(e.target.value)}
        />

        <select
          className="border p-3 rounded-lg h-[30px]"
          value={status}
          onChange={(e) => setstatus(e.target.value)}
        >
          <option>Applied</option>
          <option>Interview</option>
          <option>Offer</option>
          <option>Rejected</option>
        </select>

        <button
          type="submit"
          className="bg-blue-600 text-white rounded-lg"
        >
          {editId ? "Update" : "Add"}
        </button>
      </form>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {applications.map((app) => (
          <div
            key={app._id}
            className="bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{app.company}</h3>
                <p className="text-gray-500">{app.role}</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => editapp(app)}
                  className="text-blue-600"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => deleteapp(app._id)}
                  className="text-red-600"
                >
                  <FaTrash />
                </button>
              </div>
            </div>

            <span
              className={`inline-block mt-4 px-3 py-1 rounded-full text-sm font-medium ${statusColor[app.status]}`}
            >
              {app.status}
            </span>
          </div>
        ))}
      </div>

      {applications.length === 0 && (
        <p className="text-center text-gray-500">
          No applications added yet
        </p>
      )}
    </div>
  );
};

export default Applications;
