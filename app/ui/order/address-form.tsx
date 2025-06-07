'use client'

import { createAddress, getAutoComplete } from '@/app/api/address';
import { City, District, Ward } from '@/interface/order';
import axios from 'axios';
import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, easeOut, motion } from 'framer-motion';
import ClipLoader from 'react-spinners/ClipLoader';
import { toast } from 'react-toastify';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { AutoCompleteResponse } from '@/interface/address';
import { debounce } from 'lodash';

interface AddressFormProps {
  setIsRefresh: (isRefresh: boolean) => void;
  existAddress: boolean;
}

const AddressForm: React.FC<AddressFormProps> = ({ setIsRefresh, existAddress }) => {
  const [cities, setCities] = useState<Array<City> | undefined>([]);
  const [districts, setDistricts] = useState<Array<District> | undefined>([]);
  const [wards, setWards] = useState<Array<Ward> | undefined>([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedWard, setSelectedWard] = useState('');
  const [street, setStreet] = useState('');
  const [autoComplete, setAutoComplete] = useState<Array<AutoCompleteResponse>>([]);
  const [loading, setLoading] = useState(false);
  const [inputData, setInputData] = useState({
    name: '',
    phone: '',
    street: '',
    ward: '',
    district: '',
    city: '',
  })

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get('https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json');
      setCities(response.data);
    };
    fetchData();
  }, []);

  useEffect(() => {
      return () => {
        debouncedFetch.cancel();
      };
    }, []);
  
    const debouncedFetch = useMemo(() =>
      debounce(async (value: string, setAutoComplete: (data: Array<AutoCompleteResponse>) => void) => {
        try {
          const response = await getAutoComplete(value);
          setAutoComplete(response);
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) { }
      }, 500), []
    );

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

  const handleStreetInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStreet(value);
    setInputData(prevData => ({
      ...prevData,
      [name]: value.split(',')[0],
    }));

    debouncedFetch(value, setAutoComplete);
  }

  const handleSelectSuggestion = (street: string) => {
    setStreet(street);
    setAutoComplete([]);
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const city = cities?.find(city => city.Id === selectedCity);
    const district = districts?.find(district => district.Id === selectedDistrict);
    const ward = wards?.find(ward => ward.Id === selectedWard);
    if (userId !== "" && accessToken !== "" && city && district && ward) {
      try {
        setLoading(true);
        
        await createAddress({
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
    <Disclosure as="div" defaultOpen={existAddress} className="bg-gray-100 rounded-lg sm:p-2 md:p-4">
      {({ open }) => (
        <>
          <DisclosureButton className='flex group justify-between items-center w-full text-lg font-semibold md:px-4'>
            <h1 className='sm:text-lg md:text-xl'>Create Address</h1>
            <ChevronDownIcon className='size-5 group-data-[open]:rotate-180' />
          </DisclosureButton>

          <div className='flex justify-between items-center w-full text-base md:px-4 rounded-b-lg'>
            <AnimatePresence>
              {open && (
                <DisclosurePanel static as={Fragment}>
                  <motion.div
                    initial={{ opacity: 0, y: -24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -24 }}
                    transition={{ duration: 0.2, ease: easeOut }}
                    className="mt-4 w-full"
                  >
                    <form onSubmit={handleSubmit} className='mt-4'>
                      <div className="grid sm:gap-4 md:gap-6 sm:grid-cols-6">
                        <div className="sm:col-span-4">
                          <label htmlFor="full-name" className="block sm:text-sm md:text-base font-semibold text-gray-700 mb-1">
                            Full Name
                          </label>
                          <input
                            id="name"
                            name="name"
                            type="text"
                            autoComplete="name"
                            className="block w-full rounded-xl border border-gray-300 py-2 sm:px-2 md:px-3 sm:text-sm md:text-base text-gray-900 shadow-sm placeholder:text-gray-400"
                            placeholder="Enter your full name"
                            onChange={(e) => { handleInputChange(e) }}
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label htmlFor="phone" className="block sm:text-sm md:text-base font-semibold text-gray-700 mb-1">
                            Phone Number
                          </label>
                          <input
                            id="phone"
                            name="phone"
                            type="text"
                            autoComplete="tel"
                            className="block w-full rounded-xl border border-gray-300 py-2 sm:px-2 md:px-3 sm:text-sm md:text-base text-gray-900 shadow-sm placeholder:text-gray-400"
                            placeholder="Enter your phone number"
                            onChange={(e) => { handleInputChange(e) }}
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label htmlFor="region" className="block sm:text-sm md:text-base font-semibold text-gray-700 mb-1">
                            Province / City
                          </label>
                          <select
                            id="city"
                            name="city"
                            value={selectedCity}
                            onChange={handleCityChange}
                            className="block w-full rounded-xl border border-gray-300 py-2 sm:px-2 md:px-3 sm:text-sm md:text-base text-gray-900 shadow-sm placeholder:text-gray-400"
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
                          <label htmlFor="city" className="block sm:text-sm md:text-base font-semibold text-gray-700 mb-1">
                            City / District
                          </label>
                          <select
                            id="district"
                            name="district"
                            value={selectedDistrict}
                            onChange={handleDistrictChange}
                            className="block w-full rounded-xl border border-gray-300 py-2 sm:px-2 md:px-3 sm:text-sm md:text-base text-gray-900 shadow-sm placeholder:text-gray-400"
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
                          <label htmlFor="ward" className="block sm:text-sm md:text-base font-semibold text-gray-700 mb-1">
                            Ward
                          </label>
                          <select
                            id="ward"
                            name="ward"
                            value={selectedWard}
                            onChange={handleWardChange}
                            className="block w-full rounded-xl border border-gray-300 py-2 sm:px-2 md:px-3 sm:text-sm md:text-base text-gray-900 shadow-sm placeholder:text-gray-400"
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
                          <label htmlFor="street-address" className="block sm:text-sm md:text-base font-semibold text-gray-700 mb-1">
                            Street Address
                          </label>
                          <input
                            id="street"
                            name="street"
                            type="text"
                            autoComplete="street"
                            value={street}
                            className="block w-full rounded-xl border border-gray-300 py-2 sm:px-2 md:px-3 sm:text-sm md:text-base text-gray-900 shadow-sm placeholder:text-gray-400"
                            placeholder="Enter your street address"
                            onChange={(e) => { handleStreetInputChange(e) }}
                          />

                          <div className={`absolute flex-col bg-white rounded-xl border border-gray-300 ${autoComplete.length === 0 ? 'hidden' : 'flex'}`}>
                            {autoComplete.map((item, index) => (
                              <span
                                key={index}
                                onClick={() => handleSelectSuggestion(item.description)}
                                className='sm:text-sm md:text-base p-2 hover:bg-gray-100 hover:cursor-pointer'
                              >
                                {item.description}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className='flex justify-end mt-8'>
                        <button
                          disabled={loading}
                          type="submit"
                          className="flex w-full h-10 justify-center items-center rounded-lg bg-gray-800 sm:px-2 md:px-3 py-1.5 text-lg font-semibold text-white shadow-sm hover:bg-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
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
                    </form>
                  </motion.div>
                </DisclosurePanel>
              )}
            </AnimatePresence>
          </div>
        </>
      )}
    </Disclosure >
  );
}

export default AddressForm;