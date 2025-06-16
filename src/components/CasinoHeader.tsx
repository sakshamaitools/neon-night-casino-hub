
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Settings, Bell, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import AuthModal from "./AuthModal";

interface CasinoHeaderProps {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
}

const CasinoHeader = ({ isLoggedIn, setIsLoggedIn }: CasinoHeaderProps) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userBalance] = useState(1250.75);

  const navigation = [
    { name: "Games", href: "/games" },
    { name: "Live Casino", href: "/live" },
    { name: "Sports", href: "/sports" },
    { name: "Promotions", href: "/promotions" }
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-purple-500/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">N</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                NEON
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-gray-300 hover:text-white transition-colors duration-200 hover:scale-105 transform"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* User Section */}
            <div className="flex items-center space-x-4">
              {isLoggedIn ? (
                <>
                  {/* Balance */}
                  <div className="hidden sm:block">
                    <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-3 py-1">
                      ${userBalance.toFixed(2)}
                    </Badge>
                  </div>
                  
                  {/* Notifications */}
                  <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                    <Bell className="h-5 w-5" />
                  </Button>
                  
                  {/* User Menu */}
                  <div className="flex items-center space-x-2">
                    <Link to="/profile">
                      <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                        <User className="h-5 w-5" />
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setIsLoggedIn(false)}
                      className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                    >
                      Logout
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowAuthModal(true)}
                    className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                  >
                    Login
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => setShowAuthModal(true)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
                  >
                    Sign Up
                  </Button>
                </div>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden text-gray-300"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-purple-500/20">
              <nav className="flex flex-col space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="text-gray-300 hover:text-white py-2 px-4 rounded transition-colors duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                {isLoggedIn && (
                  <div className="px-4 py-2">
                    <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
                      Balance: ${userBalance.toFixed(2)}
                    </Badge>
                  </div>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={() => {
          setIsLoggedIn(true);
          setShowAuthModal(false);
        }}
      />
    </>
  );
};

export default CasinoHeader;
