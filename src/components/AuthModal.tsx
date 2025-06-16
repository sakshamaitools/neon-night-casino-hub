
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { User, Shield, Calendar } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

const AuthModal = ({ isOpen, onClose, onLogin }: AuthModalProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    acceptTerms: false,
    ageVerified: false
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
      onLogin();
      setIsLoading(false);
    }, 1500);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.acceptTerms || !formData.ageVerified) {
      toast({
        title: "Required Verification",
        description: "Please accept terms and verify your age to continue.",
        variant: "destructive"
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Account Created!",
        description: "Welcome to Neon Casino! Please verify your email.",
      });
      onLogin();
      setIsLoading(false);
    }, 2000);
  };

  const updateFormData = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-to-br from-gray-900 to-black border-purple-500/20 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Join Neon Casino
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-800 mb-6">
            <TabsTrigger value="login" className="text-white data-[state=active]:bg-purple-600">
              Login
            </TabsTrigger>
            <TabsTrigger value="signup" className="text-white data-[state=active]:bg-purple-600">
              Sign Up
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="loginEmail" className="text-gray-300">Email</Label>
                <Input
                  id="loginEmail"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData("email", e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white focus:border-purple-400"
                  required
                />
              </div>
              <div>
                <Label htmlFor="loginPassword" className="text-gray-300">Password</Label>
                <Input
                  id="loginPassword"
                  type="password"
                  value={formData.password}
                  onChange={(e) => updateFormData("password", e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white focus:border-purple-400"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
                disabled={isLoading}
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="text-gray-300">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => updateFormData("firstName", e.target.value)}
                    className="bg-gray-800 border-gray-600 text-white focus:border-purple-400"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-gray-300">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => updateFormData("lastName", e.target.value)}
                    className="bg-gray-800 border-gray-600 text-white focus:border-purple-400"
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="signupEmail" className="text-gray-300">Email</Label>
                <Input
                  id="signupEmail"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData("email", e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white focus:border-purple-400"
                  required
                />
              </div>

              <div>
                <Label htmlFor="dateOfBirth" className="text-gray-300 flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Date of Birth
                </Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => updateFormData("dateOfBirth", e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white focus:border-purple-400"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="signupPassword" className="text-gray-300">Password</Label>
                <Input
                  id="signupPassword"
                  type="password"
                  value={formData.password}
                  onChange={(e) => updateFormData("password", e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white focus:border-purple-400"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="confirmPassword" className="text-gray-300">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => updateFormData("confirmPassword", e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white focus:border-purple-400"
                  required
                />
              </div>

              <div className="space-y-3 pt-4 border-t border-gray-700">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="ageVerified"
                    checked={formData.ageVerified}
                    onCheckedChange={(checked) => updateFormData("ageVerified", checked as boolean)}
                    className="border-gray-600 data-[state=checked]:bg-purple-600"
                  />
                  <Label htmlFor="ageVerified" className="text-sm text-gray-300 flex items-center">
                    <Shield className="w-4 h-4 mr-2" />
                    I confirm I am 18+ years old
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="acceptTerms"
                    checked={formData.acceptTerms}
                    onCheckedChange={(checked) => updateFormData("acceptTerms", checked as boolean)}
                    className="border-gray-600 data-[state=checked]:bg-purple-600"
                  />
                  <Label htmlFor="acceptTerms" className="text-sm text-gray-300">
                    I accept the Terms & Conditions and Privacy Policy
                  </Label>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="text-center text-xs text-gray-500 mt-4 p-4 bg-gray-800/50 rounded">
          <Shield className="w-4 h-4 mx-auto mb-2" />
          Responsible Gaming: Only bet what you can afford to lose. 
          Gambling can be addictive - seek help if needed.
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
