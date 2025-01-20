import React, { useState } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import vietnamMap from '../../data/vietnam.json'; // Đường dẫn tới file JSON
import Markers from './Markers'; // Import the Markers component

const VietNamMap = () => {
  const [tooltipContent, setTooltipContent] = useState({
    name: '',
    x: 0,
    y: 0,
  });

  const handleMouseMove = (event) => {
    const { clientX, clientY } = event;
    setTooltipContent((prev) => ({
      ...prev,
      x: clientX,
      y: clientY,
    }));
  };

  return (
    <div className='flex mt-40'>
      {/* Bản đồ */}
      <div
        style={{ width: '50%', position: 'relative' }}
        onMouseMove={handleMouseMove} // Lắng nghe sự kiện chuột di chuyển
      >
        <ComposableMap
          projection='geoMercator'
          projectionConfig={{
            center: [105.8, 16], // Tâm bản đồ
            scale: 2000, // Tỷ lệ zoom
          }}
          style={{ width: '100%', height: '100%' }}
        >
          <Geographies geography={vietnamMap}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onMouseEnter={(event) => {
                    const { clientX, clientY } = event; // Tọa độ chuột
                    setTooltipContent({
                      name: geo.properties.name || 'Unknown', // Tên tỉnh hoặc Unknown nếu không có tên
                      x: clientX,
                      y: clientY,
                    });
                  }}
                  onMouseMove={(event) => {
                    const { clientX, clientY } = event; // Tọa độ chuột
                    setTooltipContent((prev) => ({
                      ...prev,
                      x: clientX,
                      y: clientY,
                    }));
                  }}
                  onMouseLeave={() => {
                    setTooltipContent({ name: '', x: 0, y: 0 }); // Xóa tooltip khi rời khỏi
                  }}
                  style={{
                    default: {
                      fill: 'red', // Màu đỏ cho bản đồ
                      outline: 'none',
                      stroke: '#000', // Màu viền
                      strokeWidth: 0.5, // Độ dày viền
                    },
                    hover: {
                      fill: 'darkred', // Màu đỏ đậm khi hover
                      outline: 'none',
                      stroke: '#000', // Màu viền
                      strokeWidth: 0.5, // Độ dày viền
                    },
                    pressed: {
                      fill: 'maroon', // Màu đỏ sẫm khi nhấn
                      outline: 'none',
                      stroke: '#000', // Màu viền
                      strokeWidth: 0.5, // Độ dày viền
                    },
                  }}
                />
              ))
            }
          </Geographies>
          <Markers /> {/* Add the Markers component here */}
        </ComposableMap>
      </div>

      {/* Tooltip hiển thị tên tỉnh tại vị trí chuột */}
      {tooltipContent.name && (
        <div
          style={{
            position: 'fixed', // Dùng position fixed để tooltip luôn hiển thị ở vị trí cố định trên màn hình
            top: `${tooltipContent.y + 20}px`, // Hiển thị dưới chuột một chút
            left: `${tooltipContent.x + 20}px`, // Hiển thị bên phải chuột một chút
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: '#fff',
            padding: '5px 10px',
            borderRadius: '5px',
            pointerEvents: 'none', // Không để tooltip bị hover
            zIndex: 1000,
          }}
        >
          {tooltipContent.name}
        </div>
      )}
    </div>
  );
};

export default VietNamMap;
