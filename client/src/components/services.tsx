import { Clock, Smartphone, Shield } from "lucide-react";

export default function Services() {
  const services = [
    {
      icon: Clock,
      title: "Hızlı Randevu",
      description: "Sadece birkaç tıklama ile randevunuzu alın",
      color: "bg-primary",
    },
    {
      icon: Smartphone,
      title: "Mobil Uyumlu",
      description: "Her cihazdan kolayca erişim sağlayın",
      color: "bg-secondary",
    },
    {
      icon: Shield,
      title: "Güvenli",
      description: "Verileriniz güvende ve korumalı",
      color: "bg-accent",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Hizmetlerimiz
          </h2>
          <p className="text-lg text-muted-foreground">
            Size en iyi hizmeti sunmak için buradayız
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-lg transition-shadow duration-300"
              >
                <div className={`${service.color} text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4`}>
                  <Icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-muted-foreground">{service.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
