import React from 'react';
import { useTranslation } from 'react-i18next';
import LocationMap from './LocationMap.jsx';
import { useTranslationLoader } from '../../hooks/useTranslationLoader';
import { Phone, Mail, Clock, MapPin } from 'lucide-react';

const Footer = () => {
  useTranslationLoader('footer');
  const { t } = useTranslation('footer');

  return (
    <footer className="relative mt-8">
      {/* Rounded top decoration */}
      <div className="absolute inset-x-0 -top-6">
        <div className="w-full h-6 bg-emerald-900 rounded-t-[30px]"></div>
      </div>

      <div className="bg-emerald-900 text-gray-100">
        <div className="max-w-screen-xl mx-auto px-4 pt-8 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-4 space-y-4">
              <h2 className="text-2xl font-bold text-amber-400 font-serif">
                Dương Dũng Wood Store
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3 group">
                  <MapPin className="w-4 h-4 text-amber-400" />
                  <p className="text-sm">123 Đường ABC, TP. Nam Định</p>
                </div>
                <div className="flex items-center gap-3 group">
                  <Phone className="w-4 h-4 text-amber-400" />
                  <p className="text-sm">+84 123 456 789</p>
                </div>
                <div className="flex items-center gap-3 group">
                  <Mail className="w-4 h-4 text-amber-400" />
                  <p className="text-sm">contact@duongdungwood.com</p>
                </div>
                <div className="flex items-center gap-3 group">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <p className="text-sm">8:00 - 17:00, Thứ 2 - CN</p>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="lg:col-span-2">
              <h3 className="text-lg font-semibold mb-4 text-amber-400">
                Về chúng tôi
              </h3>
              <ul className="space-y-2">
                {['Giới thiệu', 'Sản phẩm', 'Dịch vụ', 'Tin tức'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-gray-300 hover:text-amber-400 transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Links */}
            <div className="lg:col-span-2">
              <h3 className="text-lg font-semibold mb-4 text-amber-400">
                Hỗ trợ
              </h3>
              <ul className="space-y-2">
                {['FAQ', 'Chính sách', 'Bảo hành', 'Liên hệ'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-gray-300 hover:text-amber-400 transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Map */}
            <div className="lg:col-span-4">
              <h3 className="text-lg font-semibold mb-4 text-amber-400">
                Vị trí của chúng tôi
              </h3>
              <div className="rounded-lg overflow-hidden shadow-lg h-44 hover:shadow-amber-400/20 transition-shadow">
                <LocationMap />
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center mt-6 pt-6 border-t border-emerald-800">
            <p className="text-xs text-gray-400">
              © {new Date().getFullYear()} Dương Dũng Wood Store. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;