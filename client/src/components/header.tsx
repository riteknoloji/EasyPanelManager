import { Link, useLocation } from "wouter";
import { Calendar, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Header() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: "Ana Sayfa", href: "/" },
    { name: "Randevu Al", href: "/#randevu" },
    { name: "Randevularım", href: "/appointments" },
    { name: "Admin", href: "/admin" },
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleNavClick = (href: string) => {
    if (href.startsWith("/#")) {
      const sectionId = href.substring(2);
      if (location !== "/") {
        window.location.href = href;
      } else {
        scrollToSection(sectionId);
      }
    }
    setIsOpen(false);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Calendar className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">RandevuSistem</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <div key={item.name}>
                {item.href.startsWith("/#") ? (
                  <button
                    onClick={() => handleNavClick(item.href)}
                    className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
                  >
                    {item.name}
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col space-y-4 mt-8">
                {navigation.map((item) => (
                  <div key={item.name}>
                    {item.href.startsWith("/#") ? (
                      <button
                        onClick={() => handleNavClick(item.href)}
                        className="text-foreground hover:text-primary transition-colors duration-200 font-medium block w-full text-left"
                      >
                        {item.name}
                      </button>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="text-foreground hover:text-primary transition-colors duration-200 font-medium block"
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
