import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Input, Button } from '../common';
import countryFlagJson from '../../data/country/country_data.json';
import { useTranslationLoader } from '../../hooks/useTranslationLoader';
import CustomSelect from './CustomSelect';
import { getGeoList, getAddressInfo } from '../../services/getApi';
import { createOrUpdateAddress } from '../../services/addressApi';

const AddressInformation = () => {
  // Form state
  const [formData, setFormData] = useState({
    country: '',
    city_id: '',
    district_id: '',
    ward_id: '',
    address: '',
    exact_address: '',
    note: '',
    longitude: '',
    latitude: ''
  });

  // Store initial data from API
  const [initialData, setInitialData] = useState(null);

  // Geographic data state
  const [geoData, setGeoData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const countryFlagOptions = countryFlagJson.map(({ country, flag_base64 }) => ({
    value: country,
    flag: flag_base64,
    label: country,
  }));

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const accessToken = localStorage.getItem('accessToken');
        
        const [geoResponse, addressResponse] = await Promise.all([
          getGeoList(),
          getAddressInfo(accessToken)
        ]);

        setGeoData(geoResponse.data);

        if (addressResponse.data) {
          const initialFormData = {
            country: addressResponse.data.country || 'Vietnam',
            city_id: addressResponse.data.city_id || '',
            district_id: addressResponse.data.district_id || '',
            ward_id: addressResponse.data.ward_id || '',
            address: addressResponse.data.address || '',
            exact_address: addressResponse.data.exact_address || '',
            note: addressResponse.data.note || '',
            longitude: addressResponse.data.longitude || '',
            latitude: addressResponse.data.latitude || ''
          };
          setInitialData(initialFormData);
          setFormData(initialFormData);
        } else {
          const defaultData = {
            country: 'Vietnam',
            city_id: '',
            district_id: '',
            ward_id: '',
            address: '',
            exact_address: '',
            note: '',
            longitude: '',
            latitude: ''
          };
          setInitialData(defaultData);
          setFormData(defaultData);
        }

      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load address information');
        const defaultData = {
          country: 'Vietnam',
          city_id: '',
          district_id: '',
          ward_id: '',
          address: '',
          exact_address: '',
          note: '',
          longitude: '',
          latitude: ''
        };
        setInitialData(defaultData);
        setFormData(defaultData);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Check if form data has changed from initial data
  const hasChanges = () => {
    if (!initialData) return false;
    
    return Object.keys(formData).some(key => {
      // Convert empty strings to null for comparison
      const initialValue = initialData[key] || '';
      const currentValue = formData[key] || '';
      return initialValue !== currentValue;
    });
  };

  const handleCountrySelect = (value) => {
    setFormData(prev => ({
      ...prev,
      country: value,
      city_id: value === 'Vietnam' ? prev.city_id : '',
      district_id: value === 'Vietnam' ? prev.district_id : '',
      ward_id: value === 'Vietnam' ? prev.ward_id : '',
      address: value === 'Vietnam' ? '' : prev.address
    }));
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Auto-update exact_address when Vietnam fields change
    if (formData.country === 'Vietnam' && ['city_id', 'district_id', 'ward_id'].includes(field)) {
      const cityName = geoData.find(city => city.Id === (field === 'city_id' ? value : formData.city_id))?.Name;
      const districts = getCurrentDistricts();
      const districtName = districts.find(d => d.Id === (field === 'district_id' ? value : formData.district_id))?.Name;
      const wards = getCurrentWards();
      const wardName = wards.find(w => w.Id === (field === 'ward_id' ? value : formData.ward_id))?.Name;

      if (cityName && districtName && wardName) {
        const newExactAddress = `${wardName}, ${districtName}, ${cityName}, Vietnam`;
        setFormData(prev => ({
          ...prev,
          exact_address: newExactAddress
        }));
      }
    }
  };

  const getCurrentDistricts = () => {
    const currentCity = geoData.find(city => city.Id === formData.city_id);
    return currentCity?.Districts || [];
  };

  const getCurrentWards = () => {
    const districts = getCurrentDistricts();
    const currentDistrict = districts.find(district => district.Id === formData.district_id);
    return currentDistrict?.Wards || [];
  };

  const handleSubmit = async () => {
    // Check if there are any changes before submitting
    if (!hasChanges()) {
      alert('No changes to save');
      return;
    }

    try {
      setLoading(true);
      const accessToken = localStorage.getItem('accessToken');
      
      const response = await createOrUpdateAddress(formData, accessToken);
      if (!response.success) {
        throw new Error(response.message || 'Failed to save address');
      }
      
      // Update initialData after successful save
      setInitialData({...formData});
      alert('Address saved successfully');
    } catch (err) {
      setError(err.message || 'An error occurred while saving');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !geoData.length) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full mt-2">
      <h1 className="text-3xl font-bold text-mainYellow">Address Information</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="mt-4">
        {/* Rest of the JSX remains the same */}
        <div className="flex flex-col gap-4">
          <div className="w-full">
            <p className="mb-2">Country</p>
            <CustomSelect
              options={countryFlagOptions}
              labelText="Select a Country"
              setlectValue={handleCountrySelect}
              value={formData.country}
            />
          </div>

          {formData.country === 'Vietnam' ? (
            <>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-1/2">
                  <p className="mb-2">City</p>
                  <select
                    className="w-full p-2 border rounded"
                    value={formData.city_id}
                    onChange={(e) => handleInputChange('city_id', e.target.value)}
                  >
                    <option value="">Select City</option>
                    {geoData.map(city => (
                      <option key={city.Id} value={city.Id}>
                        {city.Name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-full md:w-1/2">
                  <p className="mb-2">District</p>
                  <select
                    className="w-full p-2 border rounded"
                    value={formData.district_id}
                    onChange={(e) => handleInputChange('district_id', e.target.value)}
                  >
                    <option value="">Select District</option>
                    {getCurrentDistricts().map(district => (
                      <option key={district.Id} value={district.Id}>
                        {district.Name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="w-full">
                <p className="mb-2">Ward</p>
                <select
                  className="w-full p-2 border rounded"
                  value={formData.ward_id}
                  onChange={(e) => handleInputChange('ward_id', e.target.value)}
                >
                  <option value="">Select Ward</option>
                  {getCurrentWards().map(ward => (
                    <option key={ward.Id} value={ward.Id}>
                      {ward.Name}
                    </option>
                  ))}
                </select>
              </div>
            </>
          ) : (
            <div className="w-full">
              <p className="mb-2">Address</p>
              <Input 
                typeInput="text"
                inputValue={(value) => handleInputChange('address', value)}
                value={formData.address}
              />
            </div>
          )}

          <div className="w-full">
            <p className="mb-2">Street Name</p>
            <Input 
              typeInput="text"
              inputValue={(value) => handleInputChange('note', value)}
              value={formData.note}
            />
          </div>

          <div className="w-full">
            <p className="mb-2">Current Address</p>
            <Input 
              typeInput="text"
              inputValue={(value) => handleInputChange('exact_address', value)}
              value={formData.exact_address}
            />
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/2">
              <p className="mb-2">Longitude</p>
              <Input 
                typeInput="text"
                inputValue={(value) => handleInputChange('longitude', value)}
                value={formData.longitude}
              />
            </div>
            <div className="w-full md:w-1/2">
              <p className="mb-2">Latitude</p>
              <Input 
                typeInput="text"
                inputValue={(value) => handleInputChange('latitude', value)}
                value={formData.latitude}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button 
            context="Save Changes"
            onClick={handleSubmit}
            disabled={loading || !hasChanges()}
            color="green"
          />
        </div>
      </div>
    </div>
  );
};

// // PropTypes remain the same
// CustomSelect.propTypes = {
//   options: PropTypes.arrayOf(
//     PropTypes.shape({
//       value: PropTypes.string.isRequired,
//       flag: PropTypes.string,
//       label: PropTypes.string.isRequired,
//     })
//   ).isRequired,
//   labelText: PropTypes.string.isRequired,
//   setlectValue: PropTypes.func.isRequired,
//   value: PropTypes.string.isRequired,
// };

// Input.propTypes = {
//   typeInput: PropTypes.string.isRequired,
//   inputValue: PropTypes.func.isRequired,
//   value: PropTypes.string.isRequired,
// };

export default AddressInformation;