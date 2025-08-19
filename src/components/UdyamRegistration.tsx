import { useState } from "react";
import { UdyamHeader } from "./UdyamHeader";
import { ProgressTracker } from "./ProgressTracker";
import { AadhaarStep } from "./AadhaarStep";
import { PANStep } from "./PANStep";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface RegistrationData {
  aadhaarNumber?: string;
  otp?: string;
  panNumber?: string;
  name?: string;
  dob?: string;
}

export const UdyamRegistration = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [registrationData, setRegistrationData] = useState<RegistrationData>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const { toast } = useToast();

  const steps = [
    "Aadhaar Verification",
    "PAN Verification",
    "Registration Complete"
  ];

  const handleAadhaarNext = (data: { aadhaarNumber: string; otp: string }) => {
    setRegistrationData(prev => ({ ...prev, ...data }));
    setCurrentStep(2);
    toast({
      title: "Aadhaar Verified",
      description: "Proceeding to PAN verification",
    });
  };

  const handlePANNext = (data: { panNumber: string; name: string; dob: string }) => {
    const finalData = { ...registrationData, ...data };
    setRegistrationData(finalData);
    
    // Simulate registration completion
    setTimeout(() => {
      setIsCompleted(true);
      setCurrentStep(3);
      toast({
        title: "Registration Successful!",
        description: "Your Udyam registration has been completed successfully",
      });
    }, 1000);
  };

  const handleDownloadCertificate = () => {
    toast({
      title: "Certificate Download",
      description: "Your Udyam certificate is being prepared for download",
    });
  };

  const handleShareCertificate = () => {
    toast({
      title: "Certificate Shared",
      description: "Certificate sharing link has been copied to clipboard",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <UdyamHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Progress Sidebar */}
          <div className="lg:col-span-1">
            <ProgressTracker 
              currentStep={currentStep} 
              totalSteps={3} 
              steps={steps} 
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {currentStep === 1 && (
              <AadhaarStep onNext={handleAadhaarNext} />
            )}
            
            {currentStep === 2 && (
              <PANStep onNext={handlePANNext} />
            )}

            {currentStep === 3 && isCompleted && (
              <Card className="shadow-form">
                <CardHeader className="text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="bg-success/10 p-4 rounded-full">
                      <CheckCircle2 className="h-12 w-12 text-success" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <CardTitle className="text-2xl text-success">Registration Successful!</CardTitle>
                    <Badge variant="secondary" className="text-sm">
                      Udyam Registration Number: UDYAM-{registrationData.panNumber}-{Date.now().toString().slice(-6)}
                    </Badge>
                  </div>
                  <CardDescription className="text-base">
                    Congratulations! Your Udyam registration has been completed successfully. 
                    You can now download your certificate and start availing government benefits.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-muted p-6 rounded-lg">
                    <h4 className="font-semibold text-foreground mb-4">Registration Summary</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Name:</span>
                        <p className="font-medium">{registrationData.name}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">PAN:</span>
                        <p className="font-medium">{registrationData.panNumber}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Date of Birth:</span>
                        <p className="font-medium">{registrationData.dob}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Registration Date:</span>
                        <p className="font-medium">{new Date().toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button 
                      onClick={handleDownloadCertificate}
                      variant="success"
                      className="flex-1"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download Certificate
                    </Button>
                    <Button 
                      onClick={handleShareCertificate}
                      variant="outline"
                      className="flex-1"
                    >
                      <Share2 className="mr-2 h-4 w-4" />
                      Share Certificate
                    </Button>
                  </div>

                  <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                    <h5 className="font-semibold text-primary mb-2">What's Next?</h5>
                    <ul className="text-sm text-primary/80 space-y-1">
                      <li>• Access government schemes and subsidies</li>
                      <li>• Apply for bank loans with preferential rates</li>
                      <li>• Participate in government tenders</li>
                      <li>• Get tax benefits and exemptions</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};