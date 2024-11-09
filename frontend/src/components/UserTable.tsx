import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import axios from "axios";
import Model from "./Model";
import { Button } from "./ui/button";
import { User } from "@/context/AuthProvider";
import { BASE_URL } from "@/utils/constant";

export function UserTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/users/`, {
          withCredentials: true,
        });
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };

    fetchUsers();
  }, []);

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (userId: string) => {
    try {
      await axios.delete(`${BASE_URL}/users/${userId}`, {
        withCredentials: true,
      });
      setUsers(users.filter((user) => user._id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleUserUpdate = (updatedUser: User) => {
    setUsers(
      users.map((user) => (user._id === updatedUser._id ? updatedUser : user))
    );
    handleModalClose();
  };

  return (
    <>
      <Table>
        <TableCaption>A list of registered users.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Full Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>isActive</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>createdAt</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading
            ? Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell className="animate-bounce bg-gray-300 h-8" />
                  <TableCell className="animate-bounce bg-gray-300 h-8" />
                  <TableCell className="animate-bounce bg-gray-300 h-8" />
                  <TableCell className="animate-bounce bg-gray-300 h-8" />
                  <TableCell className="animate-bounce bg-gray-300 h-8" />
                  <TableCell className="animate-bounce bg-gray-300 h-8" />
                </TableRow>
              ))
            : users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.fullName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.isActive ? "true" : "false"}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString()}{" "}
                    {new Date(user.createdAt).toLocaleTimeString()}
                  </TableCell>
                  <TableCell className="flex gap-6">
                    <Button
                      className="bg-green-600"
                      onClick={() => handleEditClick(user)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant={"destructive"}
                      onClick={() => handleDeleteClick(user._id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={6} className="text-right font-bold">
              Total Users: {users.length}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      {isModalOpen && selectedUser && (
        <Model
          user={selectedUser}
          onClose={handleModalClose}
          onSave={handleUserUpdate}
        />
      )}
    </>
  );
}
