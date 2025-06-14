'use client'

import { resetPassword } from "@/app/api/auth";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";

export default function Page() {
  const [formData, setFormData] = useState({
    resetToken: '',
    newPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const param = useParams();
  const id = param.id;

  useEffect(() => {
    const fetchToken = async () => {
      if (typeof id !== 'string') {
        return;
      }
      setFormData(prev => ({ ...prev, resetToken: id }));
    }

    fetchToken();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      await resetPassword(formData);
      toast.success("Mật khẩu của bạn đã được cập nhật thành công. Vui lòng đăng nhập lại.");

      router.push("/auth/login");

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) { } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-20 sm:mx-auto sm:w-full sm:max-w-sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-xl font-bold text-gray-900">
            Mật khẩu
          </label>
          <div className="mt-1">
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              placeholder="Nhập mật khẩu mới..."
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
              'ĐẶT LẠI MẬT KHẨU'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}