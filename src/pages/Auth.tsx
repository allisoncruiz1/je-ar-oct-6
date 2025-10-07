import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Info } from 'lucide-react';

interface SignUpFormData {
  legalFirstName: string;
  legalLastName: string;
  emailAddress: string;
  confirmEmailAddress: string;
  multiStateLicense: string;
  phoneNumber: string;
  agreeToTerms: boolean;
  agreeToContact: boolean;
}

export default function Auth() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Sign up form state
  const [signUpData, setSignUpData] = useState<SignUpFormData>({
    legalFirstName: '',
    legalLastName: '',
    emailAddress: '',
    confirmEmailAddress: '',
    multiStateLicense: '',
    phoneNumber: '',
    agreeToTerms: false,
    agreeToContact: false,
  });

  // Sign in form state
  const [signInEmail, setSignInEmail] = useState('');

  // Check if user is already authenticated
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        navigate('/application', { replace: true });
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        navigate('/application', { replace: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!signUpData.legalFirstName.trim() || !signUpData.legalLastName.trim()) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please provide your legal first and last name.",
      });
      return;
    }

    if (!signUpData.emailAddress.trim() || !signUpData.confirmEmailAddress.trim()) {
      toast({
        variant: "destructive",
        title: "Missing Email",
        description: "Please enter and confirm your email address.",
      });
      return;
    }

    if (signUpData.emailAddress !== signUpData.confirmEmailAddress) {
      toast({
        variant: "destructive",
        title: "Email Mismatch",
        description: "Email addresses do not match.",
      });
      return;
    }

    if (!signUpData.agreeToTerms) {
      toast({
        variant: "destructive",
        title: "Terms Required",
        description: "You must agree to the Terms of Service and Privacy Policy.",
      });
      return;
    }

    setIsLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/application`;
      
      const { data, error } = await supabase.auth.signUp({
        email: signUpData.emailAddress,
        password: Math.random().toString(36).slice(-8) + 'Aa1!', // Temporary password
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            legal_first_name: signUpData.legalFirstName,
            legal_last_name: signUpData.legalLastName,
            phone_number: signUpData.phoneNumber,
            multi_state_license: signUpData.multiStateLicense,
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Account Created!",
        description: "Welcome to eXp Realty. Starting your application...",
      });

      // Navigate to application (starts at mailing address)
      navigate('/application', { replace: true });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Sign Up Failed",
        description: error.message || "Unable to create account. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!signInEmail.trim()) {
      toast({
        variant: "destructive",
        title: "Email Required",
        description: "Please enter your email address.",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: signInEmail,
        options: {
          emailRedirectTo: `${window.location.origin}/application`,
        }
      });

      if (error) throw error;

      toast({
        title: "Check Your Email",
        description: "We've sent you a sign-in link. Please check your inbox.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Sign In Failed",
        description: error.message || "Unable to sign in. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A1F5C] via-[#1B489B] to-[#2563A8]">
      {/* Header Section */}
      <div className="text-center py-12 px-4">
        <p className="text-white text-lg mb-4">We look forward to working with you.</p>
        <h1 className="text-white text-4xl md:text-5xl font-bold">
          Create an account, or sign in.
        </h1>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* New Agent Registration */}
          <div className="bg-white rounded-lg p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-foreground mb-4">New eXp Realty Agent</h2>
            <p className="text-muted-foreground mb-6">
              To begin, simply fill out the information below to create an account and start your application.
            </p>

            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Legal First Name</Label>
                  <Input
                    id="firstName"
                    value={signUpData.legalFirstName}
                    onChange={(e) => setSignUpData({ ...signUpData, legalFirstName: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Legal Last Name</Label>
                  <Input
                    id="lastName"
                    value={signUpData.legalLastName}
                    onChange={(e) => setSignUpData({ ...signUpData, legalLastName: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    Email Address
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={signUpData.emailAddress}
                    onChange={(e) => setSignUpData({ ...signUpData, emailAddress: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmEmail">Confirm Email Address</Label>
                  <Input
                    id="confirmEmail"
                    type="email"
                    value={signUpData.confirmEmailAddress}
                    onChange={(e) => setSignUpData({ ...signUpData, confirmEmailAddress: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="multiState">Are you licensed in multiple states?</Label>
                <Select
                  value={signUpData.multiStateLicense}
                  onValueChange={(value) => setSignUpData({ ...signUpData, multiStateLicense: value })}
                >
                  <SelectTrigger id="multiState">
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={signUpData.phoneNumber}
                  onChange={(e) => setSignUpData({ ...signUpData, phoneNumber: e.target.value })}
                />
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="terms"
                    checked={signUpData.agreeToTerms}
                    onCheckedChange={(checked) => 
                      setSignUpData({ ...signUpData, agreeToTerms: checked as boolean })
                    }
                  />
                  <Label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
                    By checking this box, I agree to eXp Realty's{' '}
                    <a href="#" className="text-brand-blue hover:underline">Terms of Service</a> and{' '}
                    <a href="#" className="text-brand-blue hover:underline">Privacy and Data Processing Policy</a>
                  </Label>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="contact"
                    checked={signUpData.agreeToContact}
                    onCheckedChange={(checked) => 
                      setSignUpData({ ...signUpData, agreeToContact: checked as boolean })
                    }
                  />
                  <Label htmlFor="contact" className="text-sm leading-relaxed cursor-pointer">
                    By checking this box, I consent to the collection and use of my contact information by eXp Realty for email and text messages and status updates regarding my application. Message frequency may vary, and standard message and data rates may apply. I may withdraw consent at any time by replying "STOP", clicking unsubscribe, or by contacting eXp Realty directly.
                  </Label>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#E8B55E] hover:bg-[#D9A54D] text-white font-semibold py-6 text-lg"
                disabled={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'CREATE ACCOUNT'}
              </Button>

              <div className="text-sm text-muted-foreground space-y-2 pt-4">
                <p className="italic">If you are applying for eXp Commercial, complete this application</p>
                <a href="#" className="text-brand-blue hover:underline block">
                  eXp Commercial Application Click Here
                </a>
                <p className="italic pt-2">If you are applying for eXp Referral Division, complete this application</p>
                <a href="#" className="text-brand-blue hover:underline block">
                  eXp Referral Division Application Click Here
                </a>
              </div>
            </form>
          </div>

          {/* Resume/Sign In */}
          <div className="bg-white rounded-lg p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-foreground mb-4">Resume/Manage Application</h2>
            <p className="text-muted-foreground mb-2">Already have an account?</p>
            <p className="text-muted-foreground mb-6">Sign in to pick up where you left off.</p>

            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signInEmail">Enter your Email</Label>
                <Input
                  id="signInEmail"
                  type="email"
                  placeholder="your.email@example.com"
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-[#E8B55E] hover:bg-[#D9A54D] text-white font-semibold py-6 text-lg"
                disabled={isLoading}
              >
                {isLoading ? 'Sending Link...' : 'SIGN IN'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
