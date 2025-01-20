import React, { useState, useEffect } from 'react';
import { MapPin, User, Phone, Mail } from 'lucide-react';
import { Input, Button } from '../../../common';
import { getGeoList, getAddressInfoUser } from '../../../../services/getApi';
import CustomSelect from '../../../shared/CustomSelect';
import countryFlagJson from '../../../../data/country/country_data.json';

const ModifiedAddressForm = ({ onAddressChange }) => {
  const [useExistingAddress, setUseExistingAddress] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [existingAddress, setExistingAddress] = useState(null);
  const [editExistingContact, setEditExistingContact] = useState(false);
  const [orderNote, setOrderNote] = useState('');
  
  const countryFlagOptions = countryFlagJson.map(({ country, flag_base64 }) => ({
    value: country,
    flag: flag_base64,
    label: country,
  }));

  const [formData, setFormData] = useState({
    country: 'Vietnam',
    city_id: '',
    district_id: '',
    ward_id: '',
    address: '',
    exact_address: '',
    note: '',
    longitude: '',
    latitude: '',
    user_name: '',
    phone: '',
    email: '',
    orderNote: ''
  });

  const [geoData, setGeoData] = useState([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const accessToken = localStorage.getItem('accessToken');
        
        const [geoResponse, addressResponse] = await Promise.all([
          getGeoList(),
          getAddressInfoUser(accessToken)
        ]);

        setGeoData(geoResponse.data);

        if (addressResponse.data) {
          const addressData = {
            country: addressResponse.data.country || 'Vietnam',
            city_id: addressResponse.data.city_id || '',
            district_id: addressResponse.data.district_id || '',
            ward_id: addressResponse.data.ward_id || '',
            address: addressResponse.data.address || '',
            exact_address: addressResponse.data.exact_address || '',
            note: addressResponse.data.note || '',
            longitude: addressResponse.data.longitude || '',
            latitude: addressResponse.data.latitude || '',
            user_name: addressResponse.data.user?.user_name || '',
            phone: addressResponse.data.user?.phone || '',
            email: addressResponse.data.user?.email || '',
            orderNote: ''
          };
          setExistingAddress(addressData);
          setFormData(addressData);
          
          if (!addressData.phone || !addressData.user_name) {
            setEditExistingContact(true);
          }
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load address information');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    // Update parent component with address data
    const addressData = {
      ...formData,
      useExistingAddress,
      recipientName: formData.user_name,
      phoneNumber: formData.phone,
      city: formData.country === 'Vietnam' ? 
        geoData.find(city => city.Id === formData.city_id)?.Name : 
        formData.address,
      orderNote: formData.orderNote
    };
    onAddressChange(addressData);
  }, [formData, useExistingAddress]);

  const handleCountrySelect = (value) => {
    setFormData(prev => ({
      ...prev,
      country: value,
      city_id: value === 'Vietnam' ? prev.city_id : '',
      district_id: value === 'Vietnam' ? prev.district_id : '',
      ward_id: value === 'Vietnam' ? prev.ward_id : '',
      address: value === 'Vietnam' ? '' : prev.address,
      exact_address: value === 'Vietnam' ? prev.exact_address : prev.address
    }));
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      exact_address: field === 'address' && prev.country !== 'Vietnam' ? value : prev.exact_address
    }));

    if (formData.country === 'Vietnam' && ['city_id', 'district_id', 'ward_id'].includes(field)) {
      updateExactAddress(field, value);
    }
  };

  const updateExactAddress = (field, value) => {
    const cityName = geoData.find(city => city.Id === (field === 'city_id' ? value : formData.city_id))?.Name;
    const districts = getCurrentDistricts();
    const districtName = districts.find(d => d.Id === (field === 'district_id' ? value : formData.district_id))?.Name;
    const wards = getCurrentWards();
    const wardName = wards.find(w => w.Id === (field === 'ward_id' ? value : formData.ward_id))?.Name;

    if (cityName && districtName && wardName) {
      setFormData(prev => ({
        ...prev,
        exact_address: `${wardName}, ${districtName}, ${cityName}, Vietnam`
      }));
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

  if (loading && !geoData.length) {
    return <div>Loading...</div>;
  }

  const handleOrderNoteChange = (value) => {
    setFormData(prev => ({
      ...prev,
      orderNote: value
    }));
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <MapPin className="w-5 h-5 text-blue-500" />
        Thông tin giao hàng
      </h3>

      <div className="flex items-center gap-4 mb-4">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            checked={useExistingAddress}
            onChange={() => setUseExistingAddress(true)}
            className="form-radio"
          />
          <span>Sử dụng địa chỉ của tôi</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            checked={!useExistingAddress}
            onChange={() => setUseExistingAddress(false)}
            className="form-radio"
          />
          <span>Nhập địa chỉ mới</span>
        </label>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {useExistingAddress && existingAddress ? (
        <div className="p-4 border rounded-lg space-y-3">
          {editExistingContact ? (
            <>
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="w-full md:w-1/2">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <p>Tên người nhận</p>
                  </div>
                  <Input 
                    typeInput="text"
                    inputValue={(value) => handleInputChange('user_name', value)}
                    value={formData.user_name}
                    placeholder="Nhập tên người nhận"
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <p>Số điện thoại</p>
                  </div>
                  <Input 
                    typeInput="tel"
                    inputValue={(value) => handleInputChange('phone', value)}
                    value={formData.phone}
                    placeholder="Nhập số điện thoại"
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-500" />
                <p className="font-medium">{existingAddress.user_name}</p>
              </div>
              {existingAddress.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <p>{existingAddress.phone}</p>
                </div>
              )}
              <div>
                <p className="font-medium">Địa chỉ hiện tại:</p>
                <p className="mt-2">{existingAddress.exact_address}</p>
              </div>
              {(!existingAddress.phone || !existingAddress.user_name) && (
                <div className="flex justify-end">
                  <Button 
                    context="Thêm thông tin liên hệ"
                    onClick={() => setEditExistingContact(true)}
                    color="blue"
                  />
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/2">
              <p className="mb-2">Tên người nhận</p>
              <Input 
                typeInput="text"
                inputValue={(value) => handleInputChange('user_name', value)}
                value={formData.user_name}
                placeholder="Nhập tên người nhận"
              />
            </div>
            <div className="w-full md:w-1/2">
              <p className="mb-2">Số điện thoại</p>
              <Input 
                typeInput="tel"
                inputValue={(value) => handleInputChange('phone', value)}
                value={formData.phone}
                placeholder="Nhập số điện thoại"
              />
            </div>
          </div>

          <div className="w-full">
            <p className="mb-2">Quốc gia</p>
            <CustomSelect
              options={countryFlagOptions}
              labelText="Chọn quốc gia"
              setlectValue={handleCountrySelect}
              value={formData.country}
            />
          </div>

          {formData.country === 'Vietnam' ? (
            <>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-1/2">
                  <p className="mb-2">Tỉnh/Thành phố</p>
                  <select
                    className="w-full p-2 border rounded"
                    value={formData.city_id}
                    onChange={(e) => handleInputChange('city_id', e.target.value)}
                  >
                    <option value="">Chọn Tỉnh/Thành phố</option>
                    {geoData.map(city => (
                      <option key={city.Id} value={city.Id}>
                        {city.Name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="w-full md:w-1/2">
                  <p className="mb-2">Quận/Huyện</p>
                  <select
                    className="w-full p-2 border rounded"
                    value={formData.district_id}
                    onChange={(e) => handleInputChange('district_id', e.target.value)}
                  >
                    <option value="">Chọn Quận/Huyện</option>
                    {getCurrentDistricts().map(district => (
                      <option key={district.Id} value={district.Id}>
                        {district.Name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="w-full">
                <p className="mb-2">Phường/Xã</p>
                <select
                  className="w-full p-2 border rounded"
                  value={formData.ward_id}
                  onChange={(e) => handleInputChange('ward_id', e.target.value)}
                >
                  <option value="">Chọn Phường/Xã</option>
                  {getCurrentWards().map(ward => (
                    <option key={ward.Id} value={ward.Id}>
                      {ward.Name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-full">
                <p className="mb-2">Địa chỉ chi tiết</p>
                <Input 
                  typeInput="text"
                  inputValue={(value) => handleInputChange('note', value)}
                  value={formData.note}
                  placeholder="Số nhà, tên đường..."
                />
              </div>
            </>
          ) : (
            <div className="w-full">
              <p className="mb-2">Địa chỉ đầy đủ</p>
              <Input 
                typeInput="text"
                inputValue={(value) => handleInputChange('address', value)}
                value={formData.address}
                placeholder="Nhập địa chỉ đầy đủ..."
              />
              <p className="mt-2 text-sm text-gray-500">* Vui lòng nhập địa chỉ đầy đủ bao gồm số nhà, tên đường, thành phố, khu vực...</p>
            </div>
          )}

          <div className="w-full">
            <p className="mb-2">Địa chỉ hiển thị</p>
            <Input 
              typeInput="text"
              value={formData.exact_address}
              disabled
            />
          </div>
        </div>
      )}

      {/* Order Note Section - Available for both existing and new addresses */}
      <div className="w-full mt-4">
        <p className="mb-2">Ghi chú đơn hàng (tùy chọn)</p>
        <textarea
          className="w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows={3}
          value={formData.orderNote}
          onChange={(e) => handleOrderNoteChange(e.target.value)}
          placeholder="Nhập ghi chú về đơn hàng của bạn (ví dụ: thời gian nhận hàng, hướng dẫn giao hàng...)"
        />
      </div>

      {/* Display current contact info if editing */}
      {editExistingContact && (
        <div className="flex justify-end mt-4">
          <Button 
            context="Cập nhật thông tin"
            onClick={() => setEditExistingContact(false)}
            color="blue"
          />
        </div>
      )}

      {/* Display complete address summary */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium mb-2">Thông tin giao hàng:</h4>
        <div className="space-y-2 text-sm text-gray-600">
          {formData.user_name && (
            <p><span className="font-medium">Người nhận:</span> {formData.user_name}</p>
          )}
          {formData.phone && (
            <p><span className="font-medium">Số điện thoại:</span> {formData.phone}</p>
          )}
          {formData.exact_address && (
            <p><span className="font-medium">Địa chỉ:</span> {formData.exact_address}</p>
          )}
          {formData.note && (
            <p><span className="font-medium">Địa chỉ chi tiết:</span> {formData.note}</p>
          )}
          {formData.orderNote && (
            <p><span className="font-medium">Ghi chú:</span> {formData.orderNote}</p>
          )}
        </div>
      </div>

      {!useExistingAddress && (
        <div className="flex justify-end mt-6">
          <Button 
            context="Lưu địa chỉ mới"
            onClick={() => {
              const addressData = {
                ...formData,
                useExistingAddress: false,
                recipientName: formData.user_name,
                phoneNumber: formData.phone,
                city: formData.country === 'Vietnam' ? 
                  geoData.find(city => city.Id === formData.city_id)?.Name : 
                  formData.address
              };
              onAddressChange(addressData);
            }}
            color="green"
          />
        </div>
      )}
    </div>
  );
};

export default ModifiedAddressForm;