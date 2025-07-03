import { Button } from "@/components/ui/button";

export default function Hero() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="bg-gradient-to-r from-primary to-blue-700 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Kolay Randevu Alma Sistemi
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Hızlı, güvenilir ve kullanıcı dostu randevu yönetimi
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              onClick={() => scrollToSection("randevu")}
              className="bg-white text-primary hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
            >
              Hemen Randevu Al
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.href = "/appointments"}
              className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-3 text-lg font-semibold"
            >
              Randevularımı Görüntüle
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
