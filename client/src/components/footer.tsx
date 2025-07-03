import { Calendar, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-foreground text-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <Calendar className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold">RandevuSistem</span>
            </div>
            <p className="text-gray-300 mb-4">
              Profesyonel randevu yönetimi için güvenilir çözümünüz. 
              Hızlı, kolay ve güvenli randevu alma deneyimi.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Hizmetler</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">Randevu Alma</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Randevu Yönetimi</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Hatırlatma Servisi</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Raporlama</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">İletişim</h4>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-primary" />
                <span>0212 123 45 67</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-primary" />
                <span>info@randevusistem.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span>İstanbul, Türkiye</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; 2024 RandevuSistem. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
}
