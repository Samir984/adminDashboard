/* eslint-disable @typescript-eslint/no-explicit-any */
import { User } from "@/context/AuthProvider";
import { BASE_URL } from "@/utils/constant";
import axios from "axios";
import React, { useState } from "react";

interface EditUserModalProps {
  user: User;
  onClose: () => void;
  onSave: (updatedUser: any) => void;
}

const Model: React.FC<EditUserModalProps> = ({ user, onClose, onSave }) => {
  const [fullName, setFullName] = useState(user.fullName);
  const [email, setEmail] = useState(user.email);
  const [isActive, setIsActive] = useState(user.isActive);
  const [role, setRole] = useState(user.role);

  const handleSave = async () => {
    const updatedUser = { ...user, fullName, email, isActive, role };

    try {
      await axios.put(`${BASE_URL}/users/${user._id}`, updatedUser, {
        withCredentials: true,
      });
      onSave(updatedUser); // Update user in parent component
      onClose(); // Close the modal after saving
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h2 className="text-lg font-bold mb-4">Edit User</h2>
        <label className="block mb-2">
          Full Name
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full border p-2 mb-2"
          />
        </label>
        <label className="block mb-2">
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 mb-2"
          />
        </label>
        <label className="block mb-4">
          Role
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as User["role"])}
            className="w-full border p-2"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </label>
        <label className="block mb-2 ">
          isActive
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="ml-2"
          />
        </label>
        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Model;
