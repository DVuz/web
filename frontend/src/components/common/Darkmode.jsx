import { useContext, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { ThemeContext } from '../../contexts/ThemeContext';

const Darkmode = () => {
  const { darkmode, toggleDarkmode } = useContext(ThemeContext);
  useEffect(() => {}, [darkmode]);

  return (
    <div
      className={`${darkmode ? 'bg-gray-800' : ''} hover:bg-gray-500 cursor-pointer w-5 h-5 rounded-xl flex items-center justify-center`}
      onClick={toggleDarkmode} // Toggle on click
    >
      {darkmode ? <Sun size={32} /> : <Moon size={32} />}
    </div>
  );
};

export default Darkmode;
