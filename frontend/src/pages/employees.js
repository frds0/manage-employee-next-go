'use client'
import { useEffect, useState } from "react";
import { getEmployees, deleteEmployee, logout } from "../lib/api";
import { router } from 'next/router';
import Link from 'next/link';
import '../app/globals.css'

export default function Employees() {
    const [employees, setEmployees] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchData() {
        try {
            const data = await getEmployees();
            setEmployees(data);
        } catch (err) {
            setError(err.message);
        }
        }
        fetchData();
    }, []);

    const handleDelete = async (id) => {
        if (confirm("Yakin mau hapus?")) {
            await deleteEmployee(id);
            alert("Employee deleted");
            window.location.reload(); 
        }
    };

    const handleLogout = () => {
        if (confirm("Yakin ingin logout?")) {
            logout(); 
            router.push("/");
        }
    };

    if (error) return <p className="text-red-500">Error: {error}</p>;
    return (
    <div className="container max-w-5xl mx-auto p-6 ">
        <div className="p-4 flex justify-between">
            <h1 className="text-xl font-bold mb-4">Employees</h1>
            <button onClick={() => handleLogout()} className="mr-3 font-bold bg-red-500 hover:bg-red-600 transition-all text-white py-2 px-3 rounded focus:outline-none focus:shadow-outline cursor-pointer">Logout</button>
        </div>
        <div className="text-gray-900 bg-gray-200">
            <div className="p-4 flex">
                <h1 className="text-3xl">
                    Employees
                </h1>
            </div>
            <div className='p-4'>
                <Link href='/create' className='mr-3 font-bold bg-blue-500 hover:bg-blue-600 transition-all text-white py-2 px-3 rounded focus:outline-none focus:shadow-outline'>Create Employee</Link>
            </div>
            <div className="px-3 py-4 flex justify-center">
                <table className="w-full text-md bg-white shadow-md rounded mb-4">
                    <tbody>
                        <tr className="border-b">
                            <th className="text-center p-3 px-5">No</th>
                            <th className="text-left p-3 px-5">Nama</th>
                            <th className="text-left p-3 px-5">Jabatan</th>
                            <th className="text-left p-3 px-5">Email</th>
                            <th className="text-left p-3 px-5">No Telepon</th>
                            <th className="text-center p-3 px-5">Action</th>
                        </tr>
                        {employees.map((emp, i) => (
                            <tr key={i} className="border-b hover:bg-gray-200 bg-gray-100 transition-all">
                                <td className="p-3 px-5 text-center">{i + 1}</td>
                                <td className="p-3 px-5">{emp.nama}</td>
                                <td className="p-3 px-5">{emp.jabatan}</td>
                                <td className="p-3 px-5">{emp.email}</td>
                                <td className="p-3 px-5">{emp.no_telp}</td>
                                <td className="p-3 px-5 flex justify-center">
                                    <Link href={`/edit/${emp.id}`} className="mr-3 text-sm bg-yellow-500 hover:bg-yellow-700 transition-all text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline">Edit</Link>
                                    <button onClick={() => handleDelete(emp.id)}  className="text-sm bg-red-500 hover:bg-red-700 transition-all text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline cursor-pointer">Delete</button>
                                </td>
                            </tr>
                        ))}
                        
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    );
} 