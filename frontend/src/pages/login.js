'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '../lib/api';

export default function LoginPage() {
const router = useRouter();
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');

const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        await login(email, password);
        router.push('/employees');   
    } catch (err) {
        alert(err.message);
    }
};

return (
    <div className="flex min-h-full flex-col justify-center px-6 py-2 lg:px-8 bg-[#171717]">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">Sign in to your account</h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="email" className="block text-sm/6 font-medium text-gray-100">Email</label>
                    <div className="mt-2">
                    <input id="email" type="email" name="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6" />
                    </div>
                </div>

                <div>
                    <div className="flex items-center justify-between">
                    <label htmlFor="password" className="block text-sm/6 font-medium text-gray-100">Password</label>
                    </div>
                    <div className="mt-2">
                    <input id="password" type="password" name="password" value={password}
                    onChange={e => setPassword(e.target.value)} required autoComplete="current-password" className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6" />
                    </div>
                </div>

                <div>
                    <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">Sign in</button>
                </div>
            </form>

        </div>
    </div>
);
}
