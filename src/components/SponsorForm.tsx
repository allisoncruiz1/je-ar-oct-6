import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ExternalLink, Check } from 'lucide-react';
import { MobileActionBar } from '@/components/MobileActionBar';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

interface SponsorFormProps {
  onContinue?: () => void;
  onSaveResume?: () => void;
  onBack?: () => void;
  onFormValidChange?: (isValid: boolean) => void;
  canContinue?: boolean;
  showBack?: boolean;
}

interface SelectedSponsor {
  id: string;
  name: string;
  email?: string;
  city?: string;
  state?: string;
  country?: string;
}

export const SponsorForm: React.FC<SponsorFormProps> = ({
  onContinue,
  onSaveResume,
  onBack,
  onFormValidChange,
  canContinue,
  showBack
}) => {
  const [policyChecked, setPolicyChecked] = useState(false);
  const [policyAcknowledged, setPolicyAcknowledged] = useState(false);
  const [acknowledgedAt, setAcknowledgedAt] = useState<Date | null>(null);
  
  const [sponsorFirstName, setSponsorFirstName] = useState('');
  const [sponsorLastName, setSponsorLastName] = useState('');
  const [sponsorEmail, setSponsorEmail] = useState('');
  const [searchError, setSearchError] = useState('');
  const [selectedSponsor, setSelectedSponsor] = useState<SelectedSponsor | null>(null);
  const [pendingSponsor, setPendingSponsor] = useState<SelectedSponsor | null>(null);
  
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showNoSponsorDialog, setShowNoSponsorDialog] = useState(false);
  const [showManualConfirmation, setShowManualConfirmation] = useState(false);
  const [manualSponsorName, setManualSponsorName] = useState('');
  const [manualSponsorDetails, setManualSponsorDetails] = useState('');

  const resultsRef = useRef<HTMLDivElement>(null);
  const sponsorSectionRef = useRef<HTMLDivElement>(null);
  const actionBarRef = useRef<HTMLDivElement>(null);

  const handleAcknowledge = () => {
    setPolicyAcknowledged(true);
    setAcknowledgedAt(new Date());
  };

  // Scroll to top on mobile on mount, action bar on desktop after policy acknowledgement
  useEffect(() => {
    const timer = setTimeout(() => {
      if (window.innerWidth < 768) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (policyAcknowledged && window.innerWidth >= 768) {
      requestAnimationFrame(() => {
        actionBarRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      });
    }
  }, [policyAcknowledged]);

  const handleSearchSponsor = () => {
    const first = sponsorFirstName.trim();
    const last = sponsorLastName.trim();
    const email = sponsorEmail.trim();
    const hasAtLeastOneField = first || last || email;
    
    if (!hasAtLeastOneField) {
      setSearchError('Enter a first/last name or an eXp email to search.');
      return;
    }
    
    setSearchError('');
    setPendingSponsor(null); // ensure results view, not confirmation
    setShowManualConfirmation(false);
    setShowNoSponsorDialog(false);
    setShowSearchResults(true);
  };

  const handleSelectSponsor = (sponsor: SelectedSponsor) => {
    setPendingSponsor(sponsor);
  };

  const handleConfirmSponsor = () => {
    if (pendingSponsor) {
      setSelectedSponsor(pendingSponsor);
      setPendingSponsor(null);
      setShowSearchResults(false);
      onFormValidChange?.(true);
    }
  };

  const handleCancelSelection = () => {
    setPendingSponsor(null);
  };

  const handleNoSponsor = () => {
    setShowSearchResults(false);
    setShowNoSponsorDialog(true);
  };

  const confirmManualSponsor = () => {
    if (manualSponsorName.trim()) {
      setPendingSponsor({
        id: 'manual-sponsor',
        name: manualSponsorName,
        email: manualSponsorDetails || undefined
      });
      setShowManualConfirmation(true);
    }
  };

  const handleConfirmManualSponsor = () => {
    if (pendingSponsor) {
      setSelectedSponsor(pendingSponsor);
      setPendingSponsor(null);
      setShowNoSponsorDialog(false);
      setShowManualConfirmation(false);
      setManualSponsorName('');
      setManualSponsorDetails('');
      onFormValidChange?.(true);
    }
  };

  const handleBackToManualForm = () => {
    setShowManualConfirmation(false);
    setPendingSponsor(null);
  };

  const cancelManualSponsor = () => {
    setShowNoSponsorDialog(false);
    setShowManualConfirmation(false);
    setManualSponsorName('');
    setManualSponsorDetails('');
    setPendingSponsor(null);
  };

  const handleClearSponsor = () => {
    setSelectedSponsor(null);
    setPendingSponsor(null);
    setSponsorFirstName('');
    setSponsorLastName('');
    setSponsorEmail('');
    onFormValidChange?.(false);
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZoneName: 'short'
    });
  };

  // Mock search results - expanded dataset
  const allMockResults: SelectedSponsor[] = [
    { id: '1', name: 'James Miller', email: 'james.miller@exprealty.com', city: 'Seattle', state: 'WA', country: 'United States' },
    { id: '2', name: 'James Miller', email: 'j.miller@exprealty.com', city: 'Los Angeles', state: 'CA', country: 'United States' },
    { id: '3', name: 'Sarah Johnson', email: 'sarah.johnson@exprealty.com', city: 'Miami', state: 'FL', country: 'United States' },
    { id: '4', name: 'Michael Smith', email: 'michael.smith@exprealty.com', city: 'Austin', state: 'TX', country: 'United States' },
    { id: '5', name: 'Jennifer Davis', email: 'jennifer.davis@exprealty.com', city: 'Denver', state: 'CO', country: 'United States' },
  ];

  // Filter results based on search criteria
  const getFilteredResults = () => {
    const first = sponsorFirstName.toLowerCase().trim();
    const last = sponsorLastName.toLowerCase().trim();
    const email = sponsorEmail.toLowerCase().trim();

    return allMockResults.filter((result) => {
      const name = result.name.toLowerCase();
      const resultEmail = (result.email || '').toLowerCase();

      const firstNameMatch = !first || name.includes(first);
      const lastNameMatch = !last || name.includes(last);
      const emailMatch = !email || resultEmail.includes(email);

      return firstNameMatch && lastNameMatch && emailMatch;
    });
  };
  const mockResults = getFilteredResults();

  // Auto-scroll to results when they appear
  useEffect(() => {
    if (showSearchResults && !pendingSponsor && resultsRef.current) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }, 100);
    }
  }, [showSearchResults, pendingSponsor, mockResults.length]);

  const handleReadPolicy = () => {
    // Open policy document in new tab - replace with actual policy URL
    window.open('https://www.exprealty.com/sponsor-policy', '_blank');
  };

  const handleWatchVideo = () => {
    // Open video in new tab - replace with actual video URL
    window.open('https://www.youtube.com/watch?v=example', '_blank');
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-200px)] w-full overflow-x-hidden">
      <div className="space-y-6 flex-1 md:pb-0">
        <div className="mb-6 mt-8 max-md:mt-2">
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Understanding Your eXp Sponsor
          </h2>
        </div>

        {/* Section A: Understanding + Video + Key Points */}
        <div className="space-y-6 mb-6">
          {/* Sponsor Definition */}
          <div>
            <p className="text-foreground">
              Your sponsor is the person <span className="font-semibold">most influential</span> in your decision to join eXp Realty. They are not simply a mentor or team partner, unless that person was also most influential in your decision to join.
            </p>
          </div>

          {/* Optional Video Section */}
          <div className="bg-muted rounded p-4 md:p-6 flex flex-col items-center justify-center space-y-3 min-h-[200px] w-full max-w-xl mx-auto">
            <p className="text-muted-foreground text-center text-sm">
              Optional: Watch this video to learn more
            </p>
            <Button
              variant="outline"
              onClick={handleWatchVideo}
              size="sm"
              className="bg-background hover:bg-background/90"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Watch Video
            </Button>
          </div>

          {/* Key Points */}
          <div className="space-y-4 w-full">
            <ul className="space-y-3 list-disc pl-6 md:pl-12 text-foreground">
              <li>
                Without a sponsor selection, eXp Realty will be assigned as your permanent sponsor.
              </li>
              <li>
                If you are uncertain about your sponsor, do not proceed until you are 100% sure.
              </li>
              <li className="font-semibold italic">
                Sponsor selections are final and cannot be changed after submission.
              </li>
            </ul>
          </div>

          {/* Acknowledgment Section OR Success Row */}
          {!policyAcknowledged ? (
            <div className="border border-border rounded-lg p-4 md:p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-2">
                    <Checkbox 
                      id="sponsor-policy" 
                      checked={policyChecked}
                      onCheckedChange={(checked) => setPolicyChecked(checked as boolean)}
                    />
                    <label 
                      htmlFor="sponsor-policy" 
                      className="text-foreground cursor-pointer select-none text-sm"
                    >
                      I have read and understood the sponsor policy.
                    </label>
                  </div>
                  
                  <button
                    onClick={handleReadPolicy}
                    className="text-foreground underline hover:no-underline block text-sm italic ml-7"
                  >
                    Read the full policy
                  </button>
                </div>
                
                <Button
                  onClick={handleAcknowledge}
                  disabled={!policyChecked}
                  size="lg"
                  className="w-full md:w-auto flex-shrink-0"
                >
                  I understand the sponsor policy
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg border border-border">
              <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3 text-white" />
              </div>
              <p className="text-sm text-foreground">
                <span className="font-semibold">Acknowledgement recorded</span> — Logged on {acknowledgedAt && formatTimestamp(acknowledgedAt)}
              </p>
            </div>
          )}
        </div>

        {/* Section B: Choose Your Sponsor */}
        {policyAcknowledged && (
          <div ref={sponsorSectionRef} className="space-y-6">
            {!selectedSponsor ? (
              <>
                {/* Helper Text */}
                <div>
                  <p className="text-foreground mb-4">
                    Please provide your Sponsor information — at least one field is required to search our database.
                  </p>
                </div>

                {/* Sponsor Search Fields */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sponsor-first-name">Sponsor First Name</Label>
                    <Input
                      id="sponsor-first-name"
                      placeholder="Enter First Name"
                      value={sponsorFirstName}
                      onChange={(e) => {
                        setSponsorFirstName(e.target.value);
                        setSearchError('');
                      }}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="sponsor-last-name">Sponsor Last Name</Label>
                    <Input
                      id="sponsor-last-name"
                      placeholder="Enter Last Name"
                      value={sponsorLastName}
                      onChange={(e) => {
                        setSponsorLastName(e.target.value);
                        setSearchError('');
                      }}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="sponsor-email">Sponsor eXp Email</Label>
                    <Input
                      id="sponsor-email"
                      type="email"
                      placeholder="Enter eXp Email"
                      value={sponsorEmail}
                      onChange={(e) => {
                        setSponsorEmail(e.target.value);
                        setSearchError('');
                      }}
                    />
                  </div>
                </div>

                {searchError && (
                  <p className="text-sm text-destructive">{searchError}</p>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={handleSearchSponsor}
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    Search Sponsor
                  </Button>
                  <Button
                    onClick={handleNoSponsor}
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    I don't have a Sponsor
                  </Button>
                </div>
              </>
            ) : (
              /* Selected Sponsor Summary */
              <div className="border border-border rounded-lg p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-1">Selected Sponsor:</p>
                    <p className="font-semibold text-foreground">{selectedSponsor.name}</p>
                    {selectedSponsor.email && (
                      <p className="text-sm text-muted-foreground">{selectedSponsor.email}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {selectedSponsor.id !== 'exp-default' ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleClearSponsor}
                        >
                          Change
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleClearSponsor}
                        >
                          Clear
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleClearSponsor}
                      >
                        Change decision
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Search Results Dialog */}
      <Dialog open={showSearchResults} onOpenChange={setShowSearchResults}>
        <DialogContent className="sm:max-w-[900px]">
          <DialogHeader>
            <DialogTitle>Sponsor Search</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {!pendingSponsor ? (
              <>
                {/* Results - Desktop Table / Mobile Cards */}
                <div ref={resultsRef}>
                  {/* Desktop Table View */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Name</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Email</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">City</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">State</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Country</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockResults.map((result) => (
                          <tr key={result.id} className="border-b border-border hover:bg-muted/50">
                            <td className="py-3 px-4 text-sm text-foreground">{result.name}</td>
                            <td className="py-3 px-4 text-sm text-foreground">{result.email}</td>
                            <td className="py-3 px-4 text-sm text-foreground">{result.city}</td>
                            <td className="py-3 px-4 text-sm text-foreground">{result.state}</td>
                            <td className="py-3 px-4 text-sm text-foreground">{result.country}</td>
                            <td className="py-3 px-4">
                              <Button
                                size="sm"
                                onClick={() => handleSelectSponsor(result)}
                              >
                                Select
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Card View */}
                  <div className="md:hidden space-y-3">
                    {mockResults.map((result) => (
                      <div key={result.id} className="border border-border rounded-lg p-4 space-y-3">
                        <div>
                          <p className="font-semibold text-foreground">{result.name}</p>
                          <p className="text-sm text-muted-foreground break-all">{result.email}</p>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {result.city}, {result.state} • {result.country}
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleSelectSponsor(result)}
                          className="w-full"
                        >
                          Select
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* My Sponsor isn't listed link */}
                <button
                  onClick={handleNoSponsor}
                  className="text-primary underline hover:no-underline font-semibold text-sm"
                >
                  My Sponsor isn't listed.
                </button>
              </>
            ) : (
              /* Confirmation Section Within Dialog */
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">Confirm Your Selection</h3>
                  <p className="text-sm text-muted-foreground">Please verify this is the correct sponsor before confirming.</p>
                </div>

                <div className="border border-border rounded-lg p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Name</p>
                      <p className="font-semibold text-foreground text-lg">{pendingSponsor.name}</p>
                    </div>
                    
                    {pendingSponsor.email && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Email</p>
                        <p className="text-foreground">{pendingSponsor.email}</p>
                      </div>
                    )}
                    
                    {(pendingSponsor.city || pendingSponsor.state) && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Location</p>
                        <p className="text-foreground">
                          {pendingSponsor.city}{pendingSponsor.city && pendingSponsor.state && ', '}{pendingSponsor.state}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-muted/50 border border-border rounded-lg p-4">
                  <p className="text-sm text-foreground">
                    <span className="font-semibold">Important:</span> Sponsor selections are final and cannot be changed after submission.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={handleConfirmSponsor}
                    size="lg"
                    className="w-full sm:flex-1"
                  >
                    Confirm This Sponsor
                  </Button>
                  <Button
                    onClick={handleCancelSelection}
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    Back to Results
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Manual Sponsor Entry Dialog */}
      <Dialog open={showNoSponsorDialog} onOpenChange={setShowNoSponsorDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <div className="space-y-6">
            {!showManualConfirmation ? (
              <>
                <div>
                  <p className="text-foreground">
                    Please provide your sponsor's information so we can help identify them.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="manual-sponsor-name">Sponsor Full Name</Label>
                    <Input
                      id="manual-sponsor-name"
                      placeholder="Sponsor Full Name"
                      value={manualSponsorName}
                      onChange={(e) => setManualSponsorName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="manual-sponsor-details">Additional Details</Label>
                    <Textarea
                      id="manual-sponsor-details"
                      placeholder="Any additional helpful details (location, email, phone number, etc)"
                      value={manualSponsorDetails}
                      onChange={(e) => setManualSponsorDetails(e.target.value)}
                      rows={4}
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={confirmManualSponsor}
                    disabled={!manualSponsorName.trim()}
                    size="lg"
                    className="w-full sm:flex-1"
                  >
                    Continue with this Sponsor
                  </Button>
                  <Button
                    onClick={cancelManualSponsor}
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
                </div>
              </>
            ) : (
              /* Confirmation Section for Manual Entry */
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">Confirm Your Selection</h3>
                  <p className="text-sm text-muted-foreground">Please verify this is the correct sponsor before confirming.</p>
                </div>

                <div className="border border-border rounded-lg p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Name</p>
                      <p className="font-semibold text-foreground text-lg">{pendingSponsor?.name}</p>
                    </div>
                    
                    {pendingSponsor?.email && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Additional Details</p>
                        <p className="text-foreground">{pendingSponsor.email}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-muted/50 border border-border rounded-lg p-4">
                  <p className="text-sm text-foreground">
                    <span className="font-semibold">Important:</span> Sponsor selections are final and cannot be changed after submission.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={handleConfirmManualSponsor}
                    size="lg"
                    className="w-full sm:flex-1"
                  >
                    Confirm This Sponsor
                  </Button>
                  <Button
                    onClick={handleBackToManualForm}
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    Back to Form
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Desktop action bar */}
      <div ref={actionBarRef} className="bg-background border-t border-border p-4 mt-6 max-md:hidden">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={onSaveResume}
            aria-label="Save and resume application later"
          >
            Save & Resume Later
          </Button>
          <div className="flex gap-3">
            {showBack && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                aria-label="Go back to previous step"
              >
                Back
              </Button>
            )}
            <Button
              type="button"
              size="sm"
              onClick={onContinue}
              disabled={!canContinue}
              aria-label="Continue to next step"
            >
              Continue
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile action bar */}
      <MobileActionBar
        onBack={onBack}
        onContinue={onContinue}
        onSaveResume={onSaveResume}
        canContinue={canContinue}
        showBack={showBack}
      />
    </div>
  );
};
