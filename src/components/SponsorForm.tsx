import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ExternalLink, Check } from 'lucide-react';
import { MobileActionBar } from '@/components/MobileActionBar';
import { Checkbox } from '@/components/ui/checkbox';

interface SponsorFormProps {
  onContinue?: () => void;
  onSaveResume?: () => void;
  onBack?: () => void;
  onFormValidChange?: (isValid: boolean) => void;
  canContinue?: boolean;
  showBack?: boolean;
}

export const SponsorForm: React.FC<SponsorFormProps> = ({
  onContinue,
  onSaveResume,
  onBack,
  onFormValidChange,
  canContinue,
  showBack
}) => {
  const [acknowledged, setAcknowledged] = useState(false);
  const [acknowledgementRecorded, setAcknowledgementRecorded] = useState(false);
  const [sponsorFirstName, setSponsorFirstName] = useState('');
  const [sponsorLastName, setSponsorLastName] = useState('');
  const [sponsorEmail, setSponsorEmail] = useState('');
  const [acknowledgementTimestamp, setAcknowledgementTimestamp] = useState('');

  const handleAcknowledge = () => {
    const now = new Date();
    const formattedDate = now.toLocaleString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      timeZoneName: 'short'
    });
    setAcknowledgementTimestamp(formattedDate);
    setAcknowledgementRecorded(true);
  };

  const handleCheckboxChange = (checked: boolean) => {
    setAcknowledged(checked);
  };

  const handleSearchSponsor = () => {
    // TODO: Implement sponsor search logic
    console.log('Search sponsor:', { sponsorFirstName, sponsorLastName, sponsorEmail });
    onFormValidChange?.(true);
  };

  const handleNoSponsor = () => {
    // TODO: Implement no sponsor logic
    console.log('User has no sponsor');
    onFormValidChange?.(true);
  };

  const isSponsorFormValid = sponsorFirstName.trim() !== '' || sponsorLastName.trim() !== '' || sponsorEmail.trim() !== '';

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
        {/* Intro + Video always on page */}
        <div className="mb-6 mt-8 max-md:mt-2">
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Understanding Your eXp Sponsor
          </h2>
        </div>

        {/* Sponsor Definition */}
        <div className="mb-6">
          <p className="text-foreground">
            Your sponsor is the person <span className="font-semibold">most influential</span> in your decision to join eXp Realty. They are not simply a mentor or team partner, unless that person was also most influential in your decision to join.
          </p>
        </div>

        {/* Optional Video Section */}
        <div className="bg-muted rounded p-4 md:p-6 flex flex-col items-center justify-center space-y-3 mb-6 min-h-[200px] w-full max-w-xl mx-auto">
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
        {!acknowledgementRecorded ? (
          <div className="mt-8 border border-border rounded-lg p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-0">
              <div className="flex-1">
                <div className="flex items-start gap-3 mb-2">
                  <Checkbox 
                    id="sponsor-policy" 
                    checked={acknowledged}
                    onCheckedChange={handleCheckboxChange}
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
                disabled={!acknowledged}
                size="lg"
                className="w-full md:w-auto flex-shrink-0"
              >
                I understand the sponsor policy
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-8 max-md:mt-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">
                Acknowledgement Recorded
              </h2>
            </div>
            <p className="text-foreground">
              Your acknowledgement of the sponsor rules and program have been logged on {acknowledgementTimestamp}
            </p>
          </div>
        )}

        {/* Sponsor Information Form (appears on same page after acknowledgement) */}
        {acknowledgementRecorded && (
          <div className="border-t border-border pt-6">
            {/* Sponsor Information Form */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Please provide your Sponsor information — at least one field(s) is required to search our database.
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="sponsor-first-name">Sponsor First Name</Label>
                  <Input
                    id="sponsor-first-name"
                    placeholder="Enter First Name"
                    value={sponsorFirstName}
                    onChange={(e) => setSponsorFirstName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sponsor-last-name">Sponsor Last Name</Label>
                  <Input
                    id="sponsor-last-name"
                    placeholder="Enter Last Name"
                    value={sponsorLastName}
                    onChange={(e) => setSponsorLastName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sponsor-email">Sponsor eXp Email</Label>
                  <Input
                    id="sponsor-email"
                    type="email"
                    placeholder="Enter eXp Email"
                    value={sponsorEmail}
                    onChange={(e) => setSponsorEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleSearchSponsor}
                  disabled={!isSponsorFormValid}
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
            </div>
          </div>
        )}
      </div>

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
