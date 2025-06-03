'use client'

import { createAddress, deleteAddress, getAllAddress, getAutoComplete, getDefaultAddress, setDefault } from '@/app/api/address';
import { AddressResponse, AutoCompleteResponse } from '@/interface/address';
import { City, District, Ward } from '@/interface/order';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, Radio, RadioGroup } from '@headlessui/react';
import { TrashIcon } from '@heroicons/react/20/solid';
import axios from 'axios';
import { debounce } from 'lodash';
import React, { useState, useEffect, useMemo } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import { toast } from 'react-toastify';

interface ShippingAddressProps {
  userId: string,
  accessToken: string,
}

export const ShippingAddress: React.FC<ShippingAddressProps> = ({ userId, accessToken }) => {
  const [isRefresh, setIsRefresh] = useState<boolean>(false);
  const [addressList, setAddressList] = useState<Array<AddressResponse>>([]);
  const [address, setAddress] = useState<AddressResponse | undefined>();
  const [selected, setSelected] = useState<AddressResponse>();
  const [loadingItems, setLoadingItems] = useState<boolean[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
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

  useEffect(() => {
    const fetchAddress = async () => {
      if (userId !== "" && accessToken !== "") {
        try {
          const response = await getAllAddress(userId, accessToken);
          setAddressList(response);
          setSelected(address ? address : response[0]);
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) { }
      }
    }

    fetchAddress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setAddressList, userId, accessToken, isRefresh]);

  useEffect(() => {
    const fetchAddress = async () => {
      if (userId !== "" && accessToken !== "" && selected && selected.id) {
        try {
          await setDefault(selected.id, userId, accessToken);
          const response = await getDefaultAddress(userId, accessToken);
          setAddress(response);
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchAddress();
  }, [userId, accessToken, selected]);

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

  const handleDeleteAddress = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: string, index: number) => {
    e.stopPropagation();

    const fetchDeleteItem = async () => {
      const newLoadingItems = [...loadingItems];
      newLoadingItems[index] = true;
      setLoadingItems(newLoadingItems);

      if (userId !== "" && accessToken !== "") {
        try {
          await deleteAddress(id, userId, accessToken);
          try {
            const response = await getAllAddress(userId, accessToken);
            setAddressList(response);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (error) { }

          toast.success("Delete address successful.");
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          toast.error("Failed to delete address.");
        } finally {
          newLoadingItems[index] = false;
          setLoadingItems(newLoadingItems);
        }
      }
    };

    fetchDeleteItem();
  };

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
        setOpenDialog(false);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) { } finally {
        setLoading(false);
      }
    }
  }

  return (
    <div className='flex flex-col items-end gap-y-4'>
      <button
        onClick={() => setOpenDialog(true)}
        className='w-fit px-3 py-1 bg-teal-600 text-white font-medium text-base rounded-lg hover:bg-teal-700'
      >
        New Address
      </button>

      <div className='w-full'>
        {addressList.length === 0 ? (
          <div className='flex justify-center items-center w-full text-lg py-4'>There&apos;s no address.</div>
        ) : (
          <RadioGroup className="grid" value={selected} onChange={setSelected} aria-label="Address">
            {addressList.map((address, index) => (
              <Radio
                key={index}
                value={address}
                className="group flex cursor-pointer"
              >
                <div className="flex w-full items-center justify-between sm:space-x-4 md:space-x-10 px-4 py-2 rounded-xl hover:bg-gray-100 group-data-[checked]:bg-gray-100">
                  <span role="radio" aria-checked className="sm:size-3 md:size-5 rounded-full flex justify-center items-center border border-gray-700 bg-white">
                    <div className="invisible bg-gray-700 sm:size-1 md:size-2 rounded-full group-data-[checked]:visible" />
                  </span>

                  <div className='flex flex-col w-full'>
                    <h4 className='sm:text-sm md:text-base'>{`${address.name}, ${address.phone}`}</h4>
                    <h4 className='font-normal col-span-3 sm:text-sm md:text-base'>{`${address.street}, ${address.ward}, ${address.district}, ${address.city}`}</h4>
                  </div>

                  <button
                    onClick={(e) => handleDeleteAddress(e, address.id, index)}
                    className='hover:bg-gray-300 rounded-lg'
                  >
                    {loadingItems[index] ? (
                      <ClipLoader
                        size={20}
                        color='#000000'
                        aria-label="Loading Spinner"
                      />
                    ) : (
                      <TrashIcon className='size-6 text-red-500' />
                    )}
                  </button>
                </div>
              </Radio>
            ))}
          </RadioGroup>
        )}
      </div>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} className="relative z-50">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-400/50 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
        />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="space-y-4 border bg-white p-12 rounded-xl">
            <DialogTitle className="font-bold">Create New Address</DialogTitle>

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
                  className="flex w-full h-10 justify-center items-center rounded-lg bg-teal-600 sm:px-2 md:px-3 py-1.5 text-lg font-semibold text-white shadow-sm hover:bg-teal-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
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
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  )
}
