'use client'

import { createAddress } from '@/app/api/address';
import { City, District, Ward } from '@/interface/order';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import { toast } from 'react-toastify';

interface AddressFormProps {
  setIsRefresh: (isRefresh: boolean) => void;
}

const AddressForm: React.FC<AddressFormProps> = ({ setIsRefresh }) => {
  const [cities, setCities] = useState<Array<City> | undefined>([]);
  const [districts, setDistricts] = useState<Array<District> | undefined>([]);
  const [wards, setWards] = useState<Array<Ward> | undefined>([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedWard, setSelectedWard] = useState('');
  const [loading, setLoading] = useState(false);
  const [inputData, setInputData] = useState({
    name: '',
    phone: '',
    street: '',
    ward: '',
    district: '',
    city: '',
  })

  const userId = localStorage.getItem('userId');
  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get('https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json');
      setCities(response.data);
    };
    fetchData();
  }, []);

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cityId = e.target.value;
    setSelectedCity(cityId);
    setDistricts(cityId ? cities?.find(city => city.Id === cityId)?.Districts : []);
    setWards([]);
    setSelectedDistrict('');
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const districtId = e.target.value;
    setSelectedDistrict(districtId);
    setWards(districtId ? districts?.find(district => district.Id === districtId)?.Wards : []);
  };

  const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const wardId = e.target.value;
    setSelectedWard(wardId);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const city = cities?.find(city => city.Id === selectedCity);
    const district = districts?.find(district => district.Id === selectedDistrict);
    const ward = wards?.find(ward => ward.Id === selectedWard);
    if (userId !== null && accessToken !== null && city && district && ward) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const response = await createAddress({
          name: inputData.name,
          phone: inputData.phone,
          street: inputData.street,
          ward: ward.Name,
          district: district.Name,
          city: city.Name,
        }, userId, accessToken);
        toast.success("Create address successful.");

        setIsRefresh(true);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) { } finally {
        setLoading(false);
      }
    }
  }

  return (
    <div className="flex flex-col w-[1082px] space-y-4 mx-auto px-16 py-10 rounded-xl shadow-lg">
      <form onSubmit={handleSubmit}>
        <div className='flex justify-between'>
          <h1 className="mb-6">Address Information</h1>
          <button
            disabled={loading}
            type="submit"
            className="flex w-20 h-10 justify-center items-center rounded-lg bg-teal-600 px-3 py-1.5 text-lg font-semibold text-white shadow-sm hover:bg-teal-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            {loading ? (
              <ClipLoader
                size={20}
                color='#ffffff'
                aria-label="Loading Spinner"
              />
            ) : (
              'Save'
            )}
          </button>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-6">
          <div className="sm:col-span-4">
            <label htmlFor="full-name" className="block text-lg font-semibold text-gray-700 mb-1">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              className="block w-full rounded-xl border border-gray-300 py-2 px-3 text-md text-gray-900 shadow-sm placeholder:text-gray-400"
              placeholder="Enter your full name"
              onChange={(e) => { handleInputChange(e) }}
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="phone" className="block text-lg font-semibold text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="text"
              autoComplete="tel"
              className="block w-full rounded-xl border border-gray-300 py-2 px-3 text-md text-gray-900 shadow-sm placeholder:text-gray-400"
              placeholder="Enter your phone number"
              onChange={(e) => { handleInputChange(e) }}
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="region" className="block text-lg font-semibold text-gray-700 mb-1">
              Province / City
            </label>
            <select
              id="city"
              name="city"
              value={selectedCity}
              onChange={handleCityChange}
              className="block w-full rounded-xl border border-gray-300 py-2 px-3 text-md text-gray-900 shadow-sm placeholder:text-gray-400"
            >
              <option value="">
                Select your province or city
              </option>
              {cities?.map(city => (
                <option key={city.Id} value={city.Id}>{city.Name}</option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="city" className="block text-lg font-semibold text-gray-700 mb-1">
              City / District
            </label>
            <select
              id="district"
              name="district"
              value={selectedDistrict}
              onChange={handleDistrictChange}
              className="block w-full rounded-xl border border-gray-300 py-2 px-3 text-md text-gray-900 shadow-sm placeholder:text-gray-400"
            >
              <option value="">
                Select your city or district
              </option>
              {districts?.map(district => (
                <option key={district.Id} value={district.Id}>{district.Name}</option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="ward" className="block text-lg font-semibold text-gray-700 mb-1">
              Ward
            </label>
            <select
              id="ward"
              name="ward"
              value={selectedWard}
              onChange={handleWardChange}
              className="block w-full rounded-xl border border-gray-300 py-2 px-3 text-md text-gray-900 shadow-sm placeholder:text-gray-400"
            >
              <option value="">
                Select your ward
              </option>
              {wards?.map(ward => (
                <option key={ward.Id} value={ward.Id}>{ward.Name}</option>
              ))}
            </select>
          </div>

          <div className="col-span-full">
            <label htmlFor="street-address" className="block text-lg font-semibold text-gray-700 mb-1">
              Street Address
            </label>
            <input
              id="street"
              name="street"
              type="text"
              autoComplete="street"
              className="block w-full rounded-xl border border-gray-300 py-2 px-3 text-md text-gray-900 shadow-sm placeholder:text-gray-400"
              placeholder="Enter your street address"
              onChange={(e) => { handleInputChange(e) }}
            />
          </div>
        </div>
      </form>
    </div>
  );
}

export default AddressForm;