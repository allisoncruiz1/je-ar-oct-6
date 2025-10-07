import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Phone, Mail, HelpCircle, FileText, Home, ChevronDown } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [showAllSteps, setShowAllSteps] = useState(false);

  const applicationSteps = [
    { name: 'Submit the Join Application', completed: true },
    { name: 'License Verification', completed: false },
    { name: 'Broker Approval', completed: false },
    { name: 'Document Review', completed: false },
    { name: 'License Transfer', completed: false },
    { name: 'Become an Active Agent', completed: false },
    { name: 'Convert to Active', completed: false },
  ];

  const visibleSteps = showAllSteps ? applicationSteps : applicationSteps.slice(0, 4);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-52 bg-[#1a1d2e] text-white flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <span className="text-2xl font-bold">MY</span>
            <span className="text-2xl font-bold">eXp</span>
          </div>
        </div>
        
        <nav className="flex-1 px-3">
          <button 
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-white/10 text-white mb-2"
            onClick={() => navigate('/application', { state: { showReview: true } })}
          >
            <Home className="w-5 h-5" />
            <span>Guest Home</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 text-white/80 mb-2">
            <FileText className="w-5 h-5" />
            <span>Documents</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 text-white/80 mb-2">
            <Bell className="w-5 h-5" />
            <span>Notifications</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 text-white/80 mb-2">
            <HelpCircle className="w-5 h-5" />
            <span>Help Center</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {/* Header */}
        <header className="bg-white border-b px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-2xl font-semibold">Welcome to eXp!</h1>
            <p className="text-muted-foreground">Hi W9 Legak!</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2 bg-muted px-3 py-2 rounded-full">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                W
              </div>
              <span className="font-medium">W9 Legak</span>
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8">
          {/* Info Cards */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            {/* Expert Care Desk Card */}
            <Card className="bg-gradient-to-br from-[#1e3a8a] to-[#1e40af] text-white border-0">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold">Expert Care Desk</h3>
                      <HelpCircle className="w-5 h-5" />
                    </div>
                    <p className="text-white/80 text-sm">World : Exp world</p>
                  </div>
                  <div className="w-24 h-24 bg-white p-2 rounded">
                    {/* QR Code placeholder */}
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                      QR Code
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 mt-6">
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                    <Phone className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                    <Mail className="w-5 h-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* US Residential Agents Card */}
            <Card className="bg-gradient-to-br from-[#1e3a8a] to-[#1e40af] text-white border-0">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">US Residential Agents</h3>
                <p className="text-white/80 text-sm mb-4">eXp Residential US Onboarding Guide</p>
                <a href="#" className="text-white underline text-sm hover:text-white/80">
                  Click here to view Onboarding Guide.
                </a>
              </CardContent>
            </Card>
          </div>

          {/* Under Process Notice */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full border-2 border-gray-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Under process</h3>
                  <p className="text-muted-foreground text-sm">
                    You will be an active agent in no time. Meanwhile, get yourself familiar with the app & keep an eye on the application status.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Application Status */}
          <div>
            <h2 className="text-xl font-semibold mb-6">Application status</h2>
            <div className="space-y-0">
              {visibleSteps.map((step, index) => (
                <div key={index} className="flex items-start gap-4">
                  {/* Timeline indicator */}
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      step.completed 
                        ? 'bg-black border-black' 
                        : 'border-gray-300 bg-white'
                    }`}>
                      {step.completed && (
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    {index < visibleSteps.length - 1 && (
                      <div className="w-0.5 h-12 bg-gray-300"></div>
                    )}
                  </div>
                  
                  {/* Step content */}
                  <div className="flex-1 pb-8">
                    <div className="flex items-center justify-between">
                      <span className={`font-medium ${step.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {step.name}
                      </span>
                      {index === 0 && (
                        <Button variant="ghost" size="icon">
                          <ChevronDown className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {!showAllSteps && (
              <Button 
                variant="ghost" 
                onClick={() => setShowAllSteps(true)}
                className="text-sm -mt-4"
              >
                View Less
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
