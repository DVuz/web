import React from 'react';
import { Annotation } from 'react-simple-maps';
import provinceCoordinates from '../../data/provinceCoordinates';

const Markers = () => {
  // Hà Nội, TP.HCM, Thái Bình
  const specialProvinces = ['Hà Nội', 'TP.HCM', 'Thái Bình'];

  return (
    <>
      {provinceCoordinates.map((province, index) => (
        <Annotation
          key={index}
          subject={province.coordinates}
          dx={120} // Điều chỉnh giá trị dx để di chuyển marker theo trục X
          dy={-20} // Điều chỉnh giá trị dy để di chuyển marker theo trục Y
          connectorProps={{
            stroke: 'green',
            strokeWidth: 2,
            strokeLinecap: 'round',
          }}
        >
          {/* Dấu chấm nhỏ cho các tỉnh đặc biệt */}
          {specialProvinces.includes(province.name) && (
            <g>
              <circle
                cx={0} // Tọa độ X
                cy={0} // Tọa độ Y
                r={5} // Bán kính dấu chấm
                fill='green' // Màu của dấu chấm
              />
              <text
                x={15} // Điều chỉnh vị trí text theo trục X
                y={0} // Điều chỉnh vị trí text theo trục Y
                style={{ fontFamily: 'system-ui', fill: 'green' }}
              >
                {province.name}
              </text>
            </g>
          )}
        </Annotation>
      ))}
    </>
  );
};

export default Markers;
