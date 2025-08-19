import { Shield, Users, Building2 } from "lucide-react";

export const UdyamHeader = () => {
  return (
    <header className="bg-gradient-government shadow-government">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-background p-3 rounded-lg shadow-card">
              <Shield className="h-8 w-8 text-government" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-government-foreground">
                Udyam Registration Portal
              </h1>
              <p className="text-government-foreground/80 text-sm">
                Ministry of Micro, Small and Medium Enterprises
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-6 text-government-foreground/90">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span className="text-sm">Digital India Initiative</span>
            </div>
            <div className="flex items-center space-x-2">
              <Building2 className="h-5 w-5" />
              <span className="text-sm">Government of India</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};