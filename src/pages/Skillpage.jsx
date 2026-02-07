import React, { useEffect, useState } from "react";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";

const Skillpage = () => {
  const [skills, setskills] = useState([]);
  const [name, setname] = useState("");
  const [level, setlevel] = useState("Beginner");
  const [editId, seteditId] = useState(null);

  const token = localStorage.getItem("token");

  /* FETCH SKILLS */
  useEffect(() => {
    fetch("http://localhost:5000/api/skills", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setskills(Array.isArray(data) ? data : []));
  }, []);

  /* ADD / UPDATE */
  const submithandler = async (e) => {
    e.preventDefault();
    if (!name) return;

    try {
      const url = editId
        ? `http://localhost:5000/api/skills/${editId}`
        : "http://localhost:5000/api/skills";

      const method = editId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, level }),
      });

      const result = await res.json();

      if (editId) {
        setskills(skills.map((s) => (s._id === editId ? result : s)));
        seteditId(null);
      } else {
        setskills([...skills, result]);
      }

      setname("");
      setlevel("Beginner");
    } catch (err) {
      console.error(err);
      alert("Skills operation failed");
    }
  };

  /* EDIT */
  const editskills = (skill) => {
    setname(skill.name);
    setlevel(skill.level);
    seteditId(skill._id);
  };

  /* DELETE */
  const deleteskills = async (id) => {
    await fetch(`http://localhost:5000/api/skills/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setskills(skills.filter((s) => s._id !== id));
  };

  return (
    <div className="space-y-6 w-[150vh] ml-[5%]">
      <h1 className="text-2xl font-semibold">Skills</h1>

      {/* FORM */}
      <form
        onSubmit={submithandler}
        className="bg-white p-6 rounded-xl shadow-sm border grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <input
          placeholder="Skill name"
          className="border p-3 rounded-lg h-[6vh]"
          value={name}
          onChange={(e) => setname(e.target.value)}
        />

        <select
          className="border p-3 rounded-lg h-[6vh]"
          value={level}
          onChange={(e) => setlevel(e.target.value)}
        >
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Advanced</option>
        </select>

        <button className="bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2">
          <FaPlus />
          {editId ? "Update Skill" : "Add Skill"}
        </button>
      </form>

      {/* SKILL CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.map((skill) => (
          <div key={skill._id} className="bg-white border rounded-2xl p-5 shadow">
            <div className="flex justify-between">
              <h3 className="text-lg font-semibold">{skill.name}</h3>
              <div className="flex m-[12px] gap-[20px]">
                <FaEdit
                  onClick={() => editskills(skill)}
                  className="text-blue-600 cursor-pointer gap-3"
                />
                <FaTrash
                  onClick={() => deleteskills(skill._id)}
                  className="text-red-600 cursor-pointer"
                />
              </div>
            </div>

            <span className="inline-block mt-3 px-3 py-1 rounded-full bg-blue-100 text-blue-700">
              {skill.level}
            </span>
          </div>
        ))}
      </div>

      {skills.length === 0 && (
        <p className="text-center text-gray-500">No skills added yet</p>
      )}
    </div>
  );
};

export default Skillpage;
