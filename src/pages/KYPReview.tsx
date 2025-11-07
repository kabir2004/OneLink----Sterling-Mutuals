import { PageLayout } from '@/components/layout/PageLayout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, ArrowLeft, HelpCircle, ChevronDown, Save } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Slider } from '@/components/ui/slider';

const fundProviders = [
  "Prime Funds Inc. [000]",
  "AXA Assurances Inc. [AAA]",
  "Alternative Asset Funds [AAF]",
  "BMO Deposit Products [AAT]",
  "ABC Funds [ABC]",
  "Abria Alternative Investments Inc. [ABR]",
  "Accumulus Investment -Now JOV Funds [ACC]",
  "All Canadian Management Inc [ACF]",
  "Foresters Financial Investment Management Company [AFM]",
  "AGF Investments Inc. [AGF]",
  "Aston Hill Asset Management Inc. [AHF]",
  "Arrow Hedge Partners Inc [AHP]"
];

export default function KYPReview() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const productCode = searchParams.get('code') || '';
  const productName = searchParams.get('name') || '';
  
  const [selectedProviders, setSelectedProviders] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [autoMode, setAutoMode] = useState(false);
  const [gradingRulesOpen, setGradingRulesOpen] = useState(false);
  const [merWeight, setMerWeight] = useState(40);
  const [oneYearWeight, setOneYearWeight] = useState(20);
  const [threeYearWeight, setThreeYearWeight] = useState(20);
  const [fiveYearWeight, setFiveYearWeight] = useState(20);
  const [numBetterProducts, setNumBetterProducts] = useState(3);
  const [numWorseProducts, setNumWorseProducts] = useState(3);

  const handleProviderToggle = (provider: string) => {
    setSelectedProviders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(provider)) {
        newSet.delete(provider);
      } else {
        newSet.add(provider);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedProviders.size === fundProviders.length) {
      setSelectedProviders(new Set());
    } else {
      setSelectedProviders(new Set(fundProviders));
    }
  };

  const handleNextStep = () => {
    if (!autoMode && selectedProviders.size === 0) {
      return; // Could add toast notification here
    }
    
    const providersParam = autoMode ? 'auto' : Array.from(selectedProviders).join(',');
    
    if (autoMode) {
      // Auto mode goes directly to comparison
      navigate(`/kyp-comparison?code=${productCode}&name=${encodeURIComponent(productName)}&providers=${encodeURIComponent(providersParam)}`);
    } else {
      // Manual mode goes to product selection
      navigate(`/kyp-product-selection?code=${productCode}&name=${encodeURIComponent(productName)}&providers=${encodeURIComponent(providersParam)}`);
    }
  };

  const filteredProviders = fundProviders.filter(provider => 
    provider.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <PageLayout title="">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/kyp-tool')}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">KYP Review</h1>
              <p className="text-sm text-gray-600 mt-1">{productCode}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate('/kyp-tool')}>Cancel</Button>
            <Button 
              onClick={handleNextStep} 
              disabled={!autoMode && selectedProviders.size === 0}
              className="h-12 px-8 text-base font-semibold"
            >
              {autoMode ? 'Next: Product Comparison' : 'Next: Select Products'}
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-3 gap-8">
          {/* Left Panel - Form Fields */}
          <div className="col-span-2 space-y-6">
            <div className="bg-white rounded-lg border p-6 space-y-5">
              {/* Auto Mode Toggle */}
              <div className="pb-4 border-b">
                <div className="flex items-start gap-3">
                  <Checkbox 
                    id="auto-mode"
                    checked={autoMode}
                    onCheckedChange={(checked) => setAutoMode(checked as boolean)}
                    className="mt-0.5"
                  />
                  <div className="flex-1">
                    <Label htmlFor="auto-mode" className="text-sm font-medium cursor-pointer">
                      Auto Mode (recommended for quick reviews)
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      → We&apos;ll find better & worse peers automatically
                    </p>
                  </div>
                </div>

                {/* Better/Worse Product Count Selection - Only in Auto Mode */}
                {autoMode && (
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Better Products</Label>
                      <Select 
                        value={numBetterProducts.toString()} 
                        onValueChange={(value) => setNumBetterProducts(parseInt(value))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 product</SelectItem>
                          <SelectItem value="2">2 products</SelectItem>
                          <SelectItem value="3">3 products</SelectItem>
                          <SelectItem value="4">4 products</SelectItem>
                          <SelectItem value="5">5 products</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Worse Products</Label>
                      <Select 
                        value={numWorseProducts.toString()} 
                        onValueChange={(value) => setNumWorseProducts(parseInt(value))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 product</SelectItem>
                          <SelectItem value="2">2 products</SelectItem>
                          <SelectItem value="3">3 products</SelectItem>
                          <SelectItem value="4">4 products</SelectItem>
                          <SelectItem value="5">5 products</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>

              {!autoMode && (
                <>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Product Code / Name</Label>
                <div className="flex gap-3">
                  <Input defaultValue={productCode} className="flex-1" />
                  <Input defaultValue={productName} className="flex-1" />
                  <Button variant="ghost" size="icon" className="shrink-0 text-gray-400 hover:text-gray-600">
                    <HelpCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Fund Link ID</Label>
                <Input placeholder="Enter Fund Link ID" />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Classification</Label>
                <div className="flex gap-3">
                  <Select defaultValue="global-neutral">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="global-neutral">Global Neutral Balanced</SelectItem>
                      <SelectItem value="equity">Equity</SelectItem>
                      <SelectItem value="fixed-income">Fixed Income</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="ghost" size="icon" className="shrink-0 text-gray-400 hover:text-gray-600">
                    <HelpCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Security Type</Label>
                <div className="flex gap-3">
                  <Select defaultValue="mutual-fund">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mutual-fund">Mutual Fund</SelectItem>
                      <SelectItem value="etf">ETF</SelectItem>
                      <SelectItem value="stock">Stock</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="ghost" size="icon" className="shrink-0 text-gray-400 hover:text-gray-600">
                    <HelpCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Investment Objective</Label>
                <div className="flex gap-3">
                  <Select defaultValue="balanced">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="balanced">Balanced</SelectItem>
                      <SelectItem value="growth">Growth</SelectItem>
                      <SelectItem value="income">Income</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="ghost" size="icon" className="shrink-0 text-gray-400 hover:text-gray-600">
                    <HelpCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Currency</Label>
                  <div className="flex gap-3">
                    <Select defaultValue="all">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="cad">CAD</SelectItem>
                        <SelectItem value="usd">USD</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="ghost" size="icon" className="shrink-0 text-gray-400 hover:text-gray-600">
                      <HelpCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Risk</Label>
                  <div className="flex gap-3">
                    <Select defaultValue="lm">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lm">LM</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="ghost" size="icon" className="shrink-0 text-gray-400 hover:text-gray-600">
                      <HelpCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Series</Label>
                  <div className="flex gap-3">
                    <Input placeholder="Enter Series" />
                    <Button variant="ghost" size="icon" className="shrink-0 text-gray-400 hover:text-gray-600">
                      <HelpCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Class</Label>
                  <div className="flex gap-3">
                    <Input placeholder="Enter Class" />
                    <Button variant="ghost" size="icon" className="shrink-0 text-gray-400 hover:text-gray-600">
                      <HelpCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Save as Preset Button */}
              <div className="pt-4 border-t flex justify-end">
                <Button variant="outline" className="gap-2">
                  <Save className="h-4 w-4" />
                  Save as Preset
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
              </>
              )}
            </div>
          </div>

          {/* Right Panel - Fund Provider List & Grading Rules */}
          {!autoMode && (
            <div className="col-span-1 space-y-6">
            <div className="bg-white rounded-lg border p-6 sticky top-6 space-y-6">
              {/* Fund Providers Section */}
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-1">Fund Providers</h2>
                  <p className="text-sm text-gray-600">Select providers to compare</p>
                </div>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    placeholder="Search providers..." 
                    className="pl-9" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="max-h-[300px] overflow-y-auto space-y-1 pr-2">
                  {filteredProviders.map((provider, index) => (
                    <div key={index} className="flex items-start gap-2 p-2 hover:bg-gray-50 rounded transition-colors">
                      <Checkbox 
                        id={`provider-${index}`} 
                        className="mt-0.5"
                        checked={selectedProviders.has(provider)}
                        onCheckedChange={() => handleProviderToggle(provider)}
                      />
                      <label
                        htmlFor={`provider-${index}`}
                        className="text-sm text-blue-600 cursor-pointer leading-snug"
                      >
                        {provider}
                      </label>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-3 border-t">
                  <Checkbox 
                    id="select-all"
                    checked={selectedProviders.size === fundProviders.length && fundProviders.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                  <Label htmlFor="select-all" className="text-sm cursor-pointer font-medium">
                    Select All ({selectedProviders.size}/{fundProviders.length})
                  </Label>
                </div>
              </div>

              {/* Grading Rules Collapsible */}
              <Collapsible 
                open={gradingRulesOpen} 
                onOpenChange={setGradingRulesOpen}
                className="border-t pt-6"
              >
                <CollapsibleTrigger className="flex items-center justify-between w-full group">
                  <h3 className="text-base font-semibold text-gray-900">Grading Rules</h3>
                  <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${gradingRulesOpen ? 'rotate-180' : ''}`} />
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-4 space-y-4">
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium text-gray-700">MER</Label>
                        <span className="text-sm font-semibold text-gray-900">{merWeight}%</span>
                      </div>
                      <Slider 
                        value={[merWeight]} 
                        onValueChange={(value) => setMerWeight(value[0])}
                        max={100}
                        step={5}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium text-gray-700">1Y Return</Label>
                        <span className="text-sm font-semibold text-gray-900">{oneYearWeight}%</span>
                      </div>
                      <Slider 
                        value={[oneYearWeight]} 
                        onValueChange={(value) => setOneYearWeight(value[0])}
                        max={100}
                        step={5}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium text-gray-700">3Y Return</Label>
                        <span className="text-sm font-semibold text-gray-900">{threeYearWeight}%</span>
                      </div>
                      <Slider 
                        value={[threeYearWeight]} 
                        onValueChange={(value) => setThreeYearWeight(value[0])}
                        max={100}
                        step={5}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium text-gray-700">5Y Return</Label>
                        <span className="text-sm font-semibold text-gray-900">{fiveYearWeight}%</span>
                      </div>
                      <Slider 
                        value={[fiveYearWeight]} 
                        onValueChange={(value) => setFiveYearWeight(value[0])}
                        max={100}
                        step={5}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t">
                    <div className="flex items-center justify-between text-sm mb-3">
                      <span className="text-gray-600">Total Weight:</span>
                      <span className={`font-bold ${merWeight + oneYearWeight + threeYearWeight + fiveYearWeight === 100 ? 'text-green-600' : 'text-red-600'}`}>
                        {merWeight + oneYearWeight + threeYearWeight + fiveYearWeight}%
                      </span>
                    </div>
                    <Button size="sm" className="w-full gap-2">
                      <Save className="h-4 w-4" />
                      Save Rule Set
                    </Button>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
