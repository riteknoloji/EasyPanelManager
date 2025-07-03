import AdminPanel from "@/components/admin-panel";

export default function Admin() {
  return (
    <div className="py-16 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Admin Panel
          </h1>
          <p className="text-lg text-muted-foreground">
            Randevuları yönet ve sistem ayarlarını kontrol et
          </p>
        </div>
        
        <AdminPanel />
      </div>
    </div>
  );
}
