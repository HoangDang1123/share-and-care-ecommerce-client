'use client'

import { createAddress, getAutoComplete } from '@/app/api/address';
import { City, District, Ward } from '@/interface/order';
import axios from 'axios';
import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, easeOut, motion } from 'framer-motion';
import ClipLoader from 'react-spinners/ClipLoader';
import { toast } from 'react-toastify';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { ChevronDownIcon, MapPinIcon } from '@heroicons/react/24/outline';
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

      const hcmCity = response.data.find((city: City) =>
        city.Name.toLowerCase().includes('hồ chí minh')
      );

      setCities(hcmCity ? [hcmCity] : []);
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
      const city = cities?.find(city => city.Id === selectedCity);
      const district = districts?.find(district => district.Id === selectedDistrict);
      const ward = wards?.find(ward => ward.Id === selectedWard);

      try {
        const response = await getAutoComplete(`${value}, ${ward?.Name}, ${district?.Name}, ${city?.Name}`);
        console.log(`${value}, ${ward?.Name}, ${district?.Name}, ${city?.Name}`)
        setAutoComplete(response);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) { }
    }, 500), [selectedCity, selectedDistrict, selectedWard]
  );

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cityId = e.target.value;
    setSelectedCity(cityId);
    const cityObj = cities?.find(city => city.Id === cityId);
    setDistricts(cityObj?.Districts || []);
    setWards([]);
    setSelectedDistrict('');

    setInputData(prev => ({
      ...prev,
      city: cityObj?.Name || '',
      district: '',
      ward: '',
    }));
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const districtId = e.target.value;
    setSelectedDistrict(districtId);
    const districtObj = districts?.find(d => d.Id === districtId);
    setWards(districtObj?.Wards || []);

    setInputData(prev => ({
      ...prev,
      district: districtObj?.Name || '',
      ward: '',
    }));
  };

  const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const wardId = e.target.value;
    setSelectedWard(wardId);
    const wardObj = wards?.find(w => w.Id === wardId);

    setInputData(prev => ({
      ...prev,
      ward: wardObj?.Name || '',
    }));
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
      [name]: value,
    }));

    debouncedFetch(value, setAutoComplete);
  }

  const handleSelectSuggestion = (selectedStreet: string) => {
    setInputData(prev => ({
      ...prev,
      street: selectedStreet,
    }));
    setStreet(selectedStreet);
    setAutoComplete([]);
  };

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
        toast.success("Thêm địa chỉ thành công.");

        setIsRefresh(true);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) { } finally {
        setLoading(false);
      }
    }
  }

  return (
    <Disclosure as="div" defaultOpen={existAddress} className="shadow-lg rounded-lg sm:p-2 md:p-4">
      {({ open }) => (
        <>
          <DisclosureButton className='flex group justify-between items-center w-full text-lg font-semibold md:px-4'>
            <span className="flex items-center gap-2 sm:text-lg md:text-xl font-bold text-gray-800">
              <MapPinIcon className="w-7 h-7" />
              Thêm địa chỉ mới
            </span>
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
                            Họ và tên
                          </label>
                          <input
                            id="name"
                            name="name"
                            type="text"
                            autoComplete="name"
                            className="block w-full rounded-xl border border-gray-300 py-2 sm:px-2 md:px-3 sm:text-sm md:text-base text-gray-900 shadow-sm placeholder:text-gray-400"
                            placeholder="Nhập họ và tên"
                            onChange={(e) => { handleInputChange(e) }}
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label htmlFor="phone" className="block sm:text-sm md:text-base font-semibold text-gray-700 mb-1">
                            Số điện thoại
                          </label>
                          <input
                            id="phone"
                            name="phone"
                            type="text"
                            autoComplete="tel"
                            className="block w-full rounded-xl border border-gray-300 py-2 sm:px-2 md:px-3 sm:text-sm md:text-base text-gray-900 shadow-sm placeholder:text-gray-400"
                            placeholder="Nhập số điện thoại"
                            onChange={(e) => { handleInputChange(e) }}
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label htmlFor="region" className="block sm:text-sm md:text-base font-semibold text-gray-700 mb-1">
                            Tỉnh / Thành phố
                          </label>
                          <select
                            id="city"
                            name="city"
                            value={selectedCity}
                            onChange={handleCityChange}
                            className="block w-full rounded-xl border border-gray-300 py-2 sm:px-2 md:px-3 sm:text-sm md:text-base text-gray-900 shadow-sm placeholder:text-gray-400"
                          >
                            <option value="">
                              Chọn tỉnh / thành phố
                            </option>
                            {cities?.map(city => (
                              <option key={city.Id} value={city.Id}>{city.Name}</option>
                            ))}
                          </select>
                        </div>

                        <div className="sm:col-span-2">
                          <label htmlFor="city" className="block sm:text-sm md:text-base font-semibold text-gray-700 mb-1">
                            Quận / Huyện
                          </label>
                          <select
                            id="district"
                            name="district"
                            value={selectedDistrict}
                            onChange={handleDistrictChange}
                            className="block w-full rounded-xl border border-gray-300 py-2 sm:px-2 md:px-3 sm:text-sm md:text-base text-gray-900 shadow-sm placeholder:text-gray-400"
                          >
                            <option value="">
                              Chọn quận / huyện
                            </option>
                            {districts?.map(district => (
                              <option key={district.Id} value={district.Id}>{district.Name}</option>
                            ))}
                          </select>
                        </div>

                        <div className="sm:col-span-2">
                          <label htmlFor="ward" className="block sm:text-sm md:text-base font-semibold text-gray-700 mb-1">
                            Phường / xã
                          </label>
                          <select
                            id="ward"
                            name="ward"
                            value={selectedWard}
                            onChange={handleWardChange}
                            className="block w-full rounded-xl border border-gray-300 py-2 sm:px-2 md:px-3 sm:text-sm md:text-base text-gray-900 shadow-sm placeholder:text-gray-400"
                          >
                            <option value="">
                              Chọn phường / xã
                            </option>
                            {wards?.map(ward => (
                              <option key={ward.Id} value={ward.Id}>{ward.Name}</option>
                            ))}
                          </select>
                        </div>

                        <div className="col-span-full">
                          <label htmlFor="street-address" className="block sm:text-sm md:text-base font-semibold text-gray-700 mb-1">
                            Địa chỉ
                          </label>
                          <input
                            id="street"
                            name="street"
                            type="text"
                            autoComplete="street"
                            value={street}
                            className="block w-full rounded-xl border border-gray-300 py-2 sm:px-2 md:px-3 sm:text-sm md:text-base text-gray-900 shadow-sm placeholder:text-gray-400"
                            placeholder="Nhập địa chỉ"
                            onChange={(e) => { handleStreetInputChange(e) }}
                          />

                          <div className={`absolute flex-col bg-white rounded-xl border border-gray-300 ${autoComplete.length === 0 ? 'hidden' : 'flex'}`}>
                            {autoComplete.map((item, index) => (
                              <span
                                key={index}
                                onClick={() => handleSelectSuggestion(item.street)}
                                className='sm:text-sm md:text-base p-2 hover:bg-gray-100 hover:cursor-pointer'
                              >
                                {item.street}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className='flex justify-end mt-8 mb-4'>
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
                            'Thêm'
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
    </Disclosure>
  );
}

export default AddressForm;