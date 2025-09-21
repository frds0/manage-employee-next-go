'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getEmployeeById, updateEmployee } from '../../lib/api';
import Link from 'next/link';
import '../../app/globals.css'

export default function EditEmployeePage() {
    const router = useRouter();
    const { id } = router.query;
    
    const [nama, setNama] = useState("");
    const [jabatan, setJabatan] = useState("");
    const [email, setEmail] = useState("");
    const [no_telp, setNoTelp] = useState("");

    useEffect(() => {
        if (!id) return;
        getEmployeeById(id).then((data) => {
            setNama(data.nama);
            setJabatan(data.jabatan);
            setEmail(data.email);
            setNoTelp(data.no_telp);
        });
    }, [id]);

    const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const updatedEmployee = { Nama: nama, Jabatan: jabatan, Email: email, NoTelp: no_telp };
        await updateEmployee(id, updatedEmployee);
        router.push("/employees");
    } catch (err) {
        alert(err.message);
    }
    };
    

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-900">
            <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center text-white">Edit Employee</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm text-gray-300">Nama</label>
                    <input
                        type="text"
                        value={nama}
                        onChange={(e) => setNama(e.target.value)}
                        required
                        className="w-full rounded-md bg-white/5 px-3 py-2 text-white"
                    />
                </div>

                <div>
                    <label className="block text-sm text-gray-300">Jabatan</label>
                    <input
                        type="text"
                        value={jabatan}
                        onChange={(e) => setJabatan(e.target.value)}
                        required
                        className="w-full rounded-md bg-white/5 px-3 py-2 text-white"
                    />
                </div>

                <div>
                    <label className="block text-sm text-gray-300">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full rounded-md bg-white/5 px-3 py-2 text-white"
                    />
                </div>

                <div>
                    <label className="block text-sm text-gray-300">No Telp</label>
                    <input
                        type="text"
                        value={no_telp}
                        onChange={(e) => setNoTelp(e.target.value)}
                        required
                        className="w-full rounded-md bg-white/5 px-3 py-2 text-white"
                    />
                </div>

                <div className="flex gap-3">
                    <Link href="/employees" className="w-full rounded-md bg-indigo-500 px-3 py-2 text-white font-semibold text-center hover:bg-indigo-400">
                        Back to List
                    </Link>
                    <button type="submit" className="w-full rounded-md bg-indigo-500 px-3 py-2 text-white font-semibold hover:bg-indigo-400 cursor-pointer">
                        Update
                    </button>
                </div>
            </form>
            </div>
        </div>
    );
}