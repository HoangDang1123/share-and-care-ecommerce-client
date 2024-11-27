'use client'

import { resetPassword } from "@/app/api/auth";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";

export default function Page() {
  const [loading, setLoading] = useState(false);
  const pathName = usePathname();
  const resetToken = pathName.split('/').pop();
  const [formData, setFormData] = useState({
    resetToken: resetToken,
    newPassword: '',
  });
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const response = await resetPassword(formData);
      toast.success("Your password has been updated successfully. Please log in again.");

      router.push("/auth/login")

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) { } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-xl font-bold text-gray-900">
            Password
          </label>
          <div className="mt-1">
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              placeholder="Enter your new password..."
              required
              onChange={handleChange}
              className="block w-full rounded-lg border-0 py-1.5 pl-2 text-gray-900 sm:text-sm sm:leading-6 md:text-lg shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-gray-700"
            />
          </div>
        </div>

        <div className='space-y-5'>
          <button
            disabled={loading}
            type="submit"
            className="flex w-full h-10 justify-center items-center rounded-lg bg-gray-900 mt-10 px-3 py-1.5 text-lg font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            {loading ? (
              <ClipLoader
                size={20}
                color='#ffffff'
                aria-label="Loading Spinner"
              />
            ) : (
              'RESET PASSWORD'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}