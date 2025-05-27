import React, { useState } from "react";
import axios from "axios";

const AddPetModal = ({ onClose, onPetAdded }) => {
  const userData = JSON.parse(localStorage.getItem("user_info") || "null");

  const [formData, setFormData] = useState({
    user_id: userData?.id || null,
    name: "",
    breed: "",
    age: "",
    gender: "Male", // giá trị mặc định hợp lệ
    species: "Dog", // giá trị mặc định hợp lệ
    weight_kg: "",
    notes: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Ép kiểu age và weight_kg về số hoặc null nếu trống
    const submitData = {
      ...formData,
      age: formData.age === "" ? null : Number(formData.age),
      weight_kg:
        formData.weight_kg === "" ? null : parseFloat(formData.weight_kg),
    };

    axios
      .post("http://localhost:8000/api/userpets", submitData)
      .then((res) => {
        alert("Add Pet Success!");
        onPetAdded(res.data); // callback update danh sách

        onClose(); // đóng modal
        // Reset form
        setFormData({
          user_id: userData?.id || null,
          name: "",
          breed: "",
          age: "",
          gender: "Male",
          species: "Dog",
          weight_kg: "",
          notes: "",
        });
      })
      .catch((err) => {
        if (err.response && err.response.status === 422) {
          alert("Lỗi nhập liệu: " + JSON.stringify(err.response.data.errors));
        } else if (err.response && err.response.status === 401) {
          alert("Lỗi nhập liệu: " + JSON.stringify(err.response.data.errors));
        }
      });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>

      <div className="bg-white p-6 rounded-xl shadow-lg z-50 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-600 hover:text-red-500 text-xl"
        >
          ×
        </button>

        <h2 className="text-xl font-bold mb-4 text-center">Thêm Thú Cưng</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            placeholder="Tên thú cưng"
            value={formData.name}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />

          <input
            name="breed"
            placeholder="Giống"
            value={formData.breed}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />

          <select
            name="gender"
            onChange={handleChange}
            value={formData.gender}
            required
            className="w-full border rounded px-3 py-2"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Unknown">Unknown</option>
          </select>

          <select
            name="species"
            onChange={handleChange}
            value={formData.species}
            required
            className="w-full border rounded px-3 py-2"
          >
            <option value="Dog">Dog</option>
            <option value="Cat">Cat</option>
            <option value="Reptile">Reptile</option>
            <option value="Rodent">Rodent</option>
          </select>

          <input
            name="age"
            type="number"
            placeholder="Tuổi"
            value={formData.age}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            min={0}
          />

          <input
            name="weight_kg"
            type="number"
            placeholder="Cân nặng (kg)"
            value={formData.weight_kg}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            step="0.1"
            min={0}
          />

          <textarea
            name="notes"
            placeholder="Ghi chú (nếu có)"
            value={formData.notes}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          ></textarea>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Thêm thú cưng
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPetModal;
