import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Shield, ArrowRight, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AadhaarStepProps {
  onNext: (data: { aadhaarNumber: string; otp: string }) => void;
}

export const AadhaarStep = ({ onNext }: AadhaarStepProps) => {
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ aadhaar?: string; otp?: string }>({});
  const { toast } = useToast();

  const validateAadhaar = (value: string) => {
    const aadhaarRegex = /^\d{12}$/;
    if (!aadhaarRegex.test(value)) {
      return "Aadhaar number must be exactly 12 digits";
    }
    return null;
  };

  const validateOTP = (value: string) => {
    const otpRegex = /^\d{6}$/;
    if (!otpRegex.test(value)) {
      return "OTP must be exactly 6 digits";
    }
    return null;
  };

  const handleAadhaarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 12);
    setAadhaarNumber(value);
    if (errors.aadhaar) {
      setErrors(prev => ({ ...prev, aadhaar: undefined }));
    }
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(value);
    if (errors.otp) {
      setErrors(prev => ({ ...prev, otp: undefined }));
    }
  };

  const handleSendOtp = async () => {
    const aadhaarError = validateAadhaar(aadhaarNumber);
    if (aadhaarError) {
      setErrors({ aadhaar: aadhaarError });
      return;
    }

    setIsLoading(true);
    try {
      // Simulate OTP sending
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsOtpSent(true);
      toast({
        title: "OTP Sent Successfully",
        description: "Please check your registered mobile number for the OTP",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const aadhaarError = validateAadhaar(aadhaarNumber);
    const otpError = validateOTP(otp);
    
    if (aadhaarError || otpError) {
      setErrors({
        aadhaar: aadhaarError || undefined,
        otp: otpError || undefined,
      });
      return;
    }

    onNext({ aadhaarNumber, otp });
  };

  return (
    <Card className="shadow-form">
      <CardHeader className="space-y-4">
        <div className="flex items-center space-x-2">
          <Shield className="h-6 w-6 text-primary" />
          <CardTitle className="text-xl">Aadhaar Verification</CardTitle>
          <Badge variant="secondary">Step 1</Badge>
        </div>
        <CardDescription>
          Enter your 12-digit Aadhaar number to proceed with registration. 
          An OTP will be sent to your registered mobile number for verification.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="aadhaar" className="text-sm font-medium">
              Aadhaar Number <span className="text-destructive">*</span>
            </Label>
            <Input
              id="aadhaar"
              type="text"
              value={aadhaarNumber}
              onChange={handleAadhaarChange}
              placeholder="Enter 12-digit Aadhaar number"
              className={`transition-smooth ${errors.aadhaar ? 'border-destructive' : ''}`}
              maxLength={12}
            />
            {errors.aadhaar && (
              <div className="flex items-center space-x-2 text-destructive text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.aadhaar}</span>
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Your Aadhaar information is securely processed and not stored permanently.
            </p>
          </div>

          {!isOtpSent ? (
            <Button
              type="button"
              onClick={handleSendOtp}
              disabled={!aadhaarNumber || isLoading}
              className="w-full"
              variant="government"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Sending OTP...
                </>
              ) : (
                <>
                  Send OTP
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">
                  OTP has been sent to your registered mobile number ending with ****{aadhaarNumber.slice(-4)}
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="otp" className="text-sm font-medium">
                  Enter OTP <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={handleOtpChange}
                  placeholder="Enter 6-digit OTP"
                  className={`transition-smooth ${errors.otp ? 'border-destructive' : ''}`}
                  maxLength={6}
                />
                {errors.otp && (
                  <div className="flex items-center space-x-2 text-destructive text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.otp}</span>
                  </div>
                )}
              </div>

              <div className="flex space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOtpSent(false)}
                  className="flex-1"
                >
                  Change Aadhaar
                </Button>
                <Button
                  type="submit"
                  variant="success"
                  className="flex-1"
                  disabled={!otp}
                >
                  Verify & Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};