import { useState } from 'react';
import {
  Darkmode,
  Input,
  SearchInput,
  FormSelect,
  Dropdown,
  Pagination,
  Switcher,
  MultiSelect,
  Checkbox,
  Upload,
  File,
  MessagePreview,
  Segment,
  Message,
  FooterInput,
} from '../components/common';
import { OTP, ForgetPassword, SetNewPassword } from '../components/auth';
import { UserDetail } from './user';
import { useTranslation } from 'react-i18next';
import VietnamMap from './map/VietNamMap';
import Footer from './shared/Footer';
import UserInfor from './shared/UserInfor';
import FileMessage from './shared/FileMessage';
import CustomAudioPlayer from './shared/Messenger/CustomAudioPlayer';
import FileUpload from '../ImageUpload';
import ProductDescriptionEditor from './page/adminpage/product/ProductDescriptionEditor';
import RichTextEditor from './page/adminpage/product/RichTextEditor';
import ToastDemo from './common/ToastDemo';
import ChatWidget from './page/userpage/ChatWidget';
import { useSocket } from '../contexts/SocketContext';

const Text = () => {
  const [inputValue, setInputValue] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const { t } = useTranslation('register');
  const toggleDisable = () => {
    setIsDisabled(!isDisabled);
  };
  const selectOptions = [
    { value: 'female', label: t('female') },
    { value: 'male', label: t('male') },
    { value: 'other', label: t('other') },
  ];
  const [selectedOption, setSelectedOption] = useState('');
  const handleSelect = (option) => setSelectedOption(option);
  const { onlineUsers } = useSocket();
  return (
    <div className=' dark:bg-darkBg mb-64 h-screen'>
      {/* <div className='w-full h-64 bg-[#1D644C] text-center'>22aaa22</div> */}

      {/* <Darkmode />
      // <Input inputValue={setInputValue} disabled={isDisabled} labelText={"Tìm kiếm"} typeInput={"password"} />
      <div className="mt-4 text-lg text-gray-900 dark:text-white">
        You entered: {inputValue}
      </div>
      <button 
        className="px-4 py-2 m-4 text-white bg-blue-500 rounded dark:bg-blue-700"
        onClick={toggleDisable}
      >
        {isDisabled ? 'Enable Input' : 'Disable Input'}
      </button>
      <SearchInput searchValue={setSearchValue}/>
      <div className="mt-4 text-lg text-gray-900 dark:text-white">
        You search entered: {searchValue}
      </div>
      <FormSelect options={selectOptions}/> */}
      {/* <OTP /> */}
      {/* <div className='my-4'></div>
      {/* <ForgetPassword /> */}
      {/* <SetNewPassword /> */}
      {/* <UserDetail /> */}
      {/* <Dropdown options={['5 / page', '10 / page', '10 / page']} onSelect={handleSelect} /> */}

      {/* <div className='w-1/2'>
        <Pagination
          totalItems={100}
          itemsPerPageOptions={['5 / page', '10 / page']}
        />
      </div>
      <Dropdown
        options={['5 / page', '10 / page', '10 / page']}
        onSelect={handleSelect}
      /> */}
      {/* <Switcher />
      <MultiSelect />
      // <Checkbox label='I agree to the terms and conditions' />
      <Upload /> */}
      {/* <File fileName={'Anh dep,jpg'} fileSize={'123 KB'} /> */}
      {/* <VietnamMap /> */}
      {/* <MessagePreview 
        avatar="https://image.tienphong.vn/w1966/Uploaded/2024/athlraungenat/2024_11_27/chae-soo-bin2-173254148959713532-4194.jpg"
        name="Nguyễn Văn A"
        message="Xin chào! Bạn có khỏe không? Hôm nay thời tiết đẹp quá."
        time="10:30 AM"
      />

      <Message  content={"Bạn có cần tôi giúp điều gì không? Bạn có cần tôi giúp điều gì không? Bạn có cần tôi giúp điều gì không?"}
      timestamp={"10:30 AM"}/> */}
      {/* <FooterInput /> */}
      <UserInfor />
      <Input
        inputValue={setInputValue}
        disabled={isDisabled}
        labelText={'Tìm kiếm'}
        typeInput={'password'}
      />
      {/* <File fileName={'Anh dep.jpg'} fileSize={'123 KB'} /> */}

      {/* <CustomAudioPlayer
        src={'https://192.168.0.102:3000/api/media/sound/nhaccachmang.mp3'}
      />
      <MessagePreview />
      <MultiSelect />
      <FileUpload uploadCategory='message' uploadType='img' />
      <FileUpload uploadCategory='message' uploadType='video' /> */}
      <div>ádasd</div>
      <Pagination
        totalItems={100}
        itemsPerPageOptions={['5 / page', '10 / page', '20 / page']}
      />
      <Checkbox label='I agree to the terms and conditions' />
      <h3>Users Online: {onlineUsers.count}</h3>
    </div>
  );
};

export default Text;
