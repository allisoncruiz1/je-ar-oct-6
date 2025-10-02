import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ExternalLink, Check, X } from 'lucide-react';
import { MobileActionBar } from '@/components/MobileActionBar';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

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
  market?: string;
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
  const [policyCollapsed, setPolicyCollapsed] = useState(false);
  
  const [sponsorFirstName, setSponsorFirstName] = useState('');
  const [sponsorLastName, setSponsorLastName] = useState('');
  const [sponsorEmail, setSponsorEmail] = useState('');
  const [searchError, setSearchError] = useState('');
  const [selectedSponsor, setSelectedSponsor] = useState<SelectedSponsor | null>(null);
  
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showNoSponsorDialog, setShowNoSponsorDialog] = useState(false);

  const handleAcknowledge = () => {
    setPolicyAcknowledged(true);
    setAcknowledgedAt(new Date());
    setPolicyCollapsed(true);
  };

  const handleSearchSponsor = () => {
    const hasAtLeastOneField = sponsorFirstName.trim() || sponsorLastName.trim() || sponsorEmail.trim();
    
    if (!hasAtLeastOneField) {
      setSearchError('Enter a first/last name or an eXp email to search.');
      return;
    }
    
    setSearchError('');
    setShowSearchResults(true);
  };

  const handleSelectSponsor = (sponsor: SelectedSponsor) => {
    setSelectedSponsor(sponsor);
    setShowSearchResults(false);
    onFormValidChange?.(true);
  };

  const handleNoSponsor = () => {
    setShowNoSponsorDialog(true);
  };

  const confirmNoSponsor = () => {
    setSelectedSponsor({
      id: 'exp-default',
      name: 'eXp Realty (Assigned)'
    });
    setShowNoSponsorDialog(false);
    onFormValidChange?.(true);
  };

  const handleClearSponsor = () => {
    setSelectedSponsor(null);
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

  // Mock search results
  const mockResults: SelectedSponsor[] = [
    { id: '1', name: 'John Smith', email: 'john.smith@exprealty.com', market: 'California' },
    { id: '2', name: 'Jane Doe', email: 'jane.doe@exprealty.com', market: 'Texas' },
    { id: '3', name: 'Mike Johnson', email: 'mike.johnson@exprealty.com', market: 'Florida' },
  ];

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
      <div className="space-y-6 flex-1 pb-24 md:pb-0">
        <div className="mb-6 mt-8 max-md:mt-2">
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Understanding Your eXp Sponsor
          </h2>
        </div>

        {/* Section A: Policy Acknowledgement */}
        <Collapsible open={!policyCollapsed} onOpenChange={setPolicyCollapsed}>
          <CollapsibleContent>
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

              {/* Acknowledgment Section */}
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
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Section B: Choose Your Sponsor */}
        {policyAcknowledged && (
          <div className="space-y-6">
            {/* Success Row */}
            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg border border-border">
              <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3 text-white" />
              </div>
              <p className="text-sm text-foreground">
                <span className="font-semibold">Acknowledgement recorded</span> — Logged on {acknowledgedAt && formatTimestamp(acknowledgedAt)}
              </p>
            </div>

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
                    variant="ghost"
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
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Search Results</DialogTitle>
            <DialogDescription>
              Select your sponsor from the results below
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {mockResults.map((result) => (
              <div
                key={result.id}
                className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div>
                  <p className="font-semibold text-foreground">{result.name}</p>
                  <p className="text-sm text-muted-foreground">{result.email}</p>
                  <p className="text-sm text-muted-foreground">{result.market}</p>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleSelectSponsor(result)}
                >
                  Select
                </Button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* No Sponsor Confirmation Dialog */}
      <AlertDialog open={showNoSponsorDialog} onOpenChange={setShowNoSponsorDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm No Sponsor</AlertDialogTitle>
            <AlertDialogDescription>
              If you don't select a sponsor, eXp Realty will be assigned as your permanent sponsor. This cannot be changed later. Continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmNoSponsor}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Desktop action bar */}
      <div className="bg-background border-t border-border p-4 mt-6 max-md:hidden">
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
