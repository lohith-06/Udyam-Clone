import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CreditCard, ArrowRight, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PANStepProps {
  onNext: (data: { panNumber: string; name: string; dob: string }) => void;
}

export const PANStep = ({ onNext }: PANStepProps) => {
  const [panNumber, setPanNumber] = useState("");
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [errors, setErrors] = useState<{ pan?: string; name?: string; dob?: string }>({});
  const { toast } = useToast();

  const validatePAN = (value: string) => {
    const panRegex = /^[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}$/;
    if (!panRegex.test(value)) {
      return "PAN must be in format ABCDE1234F (5 letters, 4 digits, 1 letter)";
    }
    return null;
  };

  const validateName = (value: string) => {
    if (value.trim().length < 2) {
      return "Name must be at least 2 characters long";
    }
    if (!/^[a-zA-Z\s]+$/.test(value)) {
      return "Name can only contain letters and spaces";
    }
    return null;
  };

  const validateDOB = (value: string) => {
    if (!value) {
      return "Date of birth is required";
    }
    const today = new Date();
    const birthDate = new Date(value);
    const age = today.getFullYear() - birthDate.getFullYear();
    if (age < 18) {
      return "Must be at least 18 years old";
    }
    if (age > 100) {
      return "Invalid date of birth";
    }
    return null;
  };

  const handlePanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10);
    setPanNumber(value);
    setIsVerified(false);
    if (errors.pan) {
      setErrors(prev => ({ ...prev, pan: undefined }));
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^a-zA-Z\s]/g, "");
    setName(value);
    if (errors.name) {
      setErrors(prev => ({ ...prev, name: undefined }));
    }
  };

  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDob(e.target.value);
    if (errors.dob) {
      setErrors(prev => ({ ...prev, dob: undefined }));
    }
  };

  const handleVerifyPAN = async () => {
    const panError = validatePAN(panNumber);
    if (panError) {
      setErrors({ pan: panError });
      return;
    }

    setIsVerifying(true);
    try {
      // Simulate PAN verification
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsVerified(true);
      toast({
        title: "PAN Verified Successfully",
        description: "Your PAN details have been validated",
      });
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: "Unable to verify PAN. Please check and try again.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const panError = validatePAN(panNumber);
    const nameError = validateName(name);
    const dobError = validateDOB(dob);
    
    if (panError || nameError || dobError) {
      setErrors({
        pan: panError || undefined,
        name: nameError || undefined,
        dob: dobError || undefined,
      });
      return;
    }

    if (!isVerified) {
      toast({
        title: "PAN Verification Required",
        description: "Please verify your PAN before proceeding",
        variant: "destructive",
      });
      return;
    }

    onNext({ panNumber, name, dob });
  };

  return (
    <Card className="shadow-form">
      <CardHeader className="space-y-4">
        <div className="flex items-center space-x-2">
          <CreditCard className="h-6 w-6 text-primary" />
          <CardTitle className="text-xl">PAN Verification</CardTitle>
          <Badge variant="secondary">Step 2</Badge>
        </div>
        <CardDescription>
          Enter your PAN details for verification. This information will be used to validate your identity 
          and business registration.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="pan" className="text-sm font-medium">
              PAN Number <span className="text-destructive">*</span>
            </Label>
            <div className="flex space-x-2">
              <Input
                id="pan"
                type="text"
                value={panNumber}
                onChange={handlePanChange}
                placeholder="ABCDE1234F"
                className={`transition-smooth ${errors.pan ? 'border-destructive' : ''} ${isVerified ? 'border-success' : ''}`}
                maxLength={10}
              />
              <Button
                type="button"
                onClick={handleVerifyPAN}
                disabled={!panNumber || isVerifying || isVerified}
                variant={isVerified ? "success" : "government"}
                size="sm"
              >
                {isVerifying ? (
                  "Verifying..."
                ) : isVerified ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Verified
                  </>
                ) : (
                  "Verify"
                )}
              </Button>
            </div>
            {errors.pan && (
              <div className="flex items-center space-x-2 text-destructive text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.pan}</span>
              </div>
            )}
            {isVerified && (
              <div className="flex items-center space-x-2 text-success text-sm">
                <CheckCircle2 className="h-4 w-4" />
                <span>PAN verified successfully</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Full Name (as per PAN) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={handleNameChange}
              placeholder="Enter full name as per PAN card"
              className={`transition-smooth ${errors.name ? 'border-destructive' : ''}`}
            />
            {errors.name && (
              <div className="flex items-center space-x-2 text-destructive text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.name}</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="dob" className="text-sm font-medium">
              Date of Birth <span className="text-destructive">*</span>
            </Label>
            <Input
              id="dob"
              type="date"
              value={dob}
              onChange={handleDobChange}
              className={`transition-smooth ${errors.dob ? 'border-destructive' : ''}`}
              max={new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
            />
            {errors.dob && (
              <div className="flex items-center space-x-2 text-destructive text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.dob}</span>
              </div>
            )}
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              variant="success"
              className="w-full"
              disabled={!panNumber || !name || !dob || !isVerified}
            >
              Complete Registration
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};