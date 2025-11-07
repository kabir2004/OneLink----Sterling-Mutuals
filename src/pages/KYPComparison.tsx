import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, LineChart, Table2, Check, X, TrendingUp, TrendingDown, Plus, Search, ChevronDown, Save, Download, Settings } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Slider } from '@/components/ui/slider';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { fundsData } from '@/data/fundsData';

interface ComparisonProduct {
  code: string;
  name: string;
  provider: string;
  classification: string;
  risk: string;
  matchScore: number;
  investmentObjective: string;
  note?: string;
  status?: 'accepted' | 'rejected' | null;
}

export default function KYPComparison() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const productCode = searchParams.get('code') || '';
  const productName = searchParams.get('name') || '';
  const providersParam = searchParams.get('providers') || '';
  const selectedProviders = providersParam.split(',').filter(p => p);

  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'graph' | 'allocations' | 'table' | 'grading'>('graph');
  const [productNotes, setProductNotes] = useState<Record<string, string>>({});
  const [productStatus, setProductStatus] = useState<Record<string, 'accepted' | 'rejected' | null>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [gradingRulesOpen, setGradingRulesOpen] = useState(true);
  const [merWeight, setMerWeight] = useState(40);
  const [oneYearWeight, setOneYearWeight] = useState(20);
  const [threeYearWeight, setThreeYearWeight] = useState(20);
  const [fiveYearWeight, setFiveYearWeight] = useState(20);

  // Generate comparison products from selected providers
  const comparisonProducts = useMemo(() => {
    if (!selectedProviders.length) return [];
    
    const products: ComparisonProduct[] = [];
    
    // For each selected provider, get their products from all clients
    selectedProviders.forEach(providerWithCode => {
      // Extract provider code from format "Provider Name [CODE]"
      const codeMatch = providerWithCode.match(/\[([^\]]+)\]/);
      if (!codeMatch) return;
      
      const providerCode = codeMatch[1];
      
      // Search through all clients to find companies matching this provider code
      fundsData.forEach(client => {
        const company = client.companies.find(c => c.id === providerCode.toLowerCase() || c.name.includes(providerCode));
        
        if (company) {
          // Get up to 2 products from each provider
          company.products.slice(0, 2).forEach((product) => {
            products.push({
              code: product.code,
              name: product.name,
              provider: providerWithCode,
              classification: 'Global Neutral Balanced',
              risk: 'M',
              matchScore: 75, // Neutral baseline score for selected products
              investmentObjective: 'Balanced Growth'
            });
          });
        }
      });
    });
    
    return products;
  }, [selectedProviders]);

  // Generate Better 3 products from OTHER providers (not selected)
  const betterProducts = useMemo(() => {
    const products: ComparisonProduct[] = [];
    const selectedCodes = new Set(selectedProviders.map(p => {
      const match = p.match(/\[([^\]]+)\]/);
      return match ? match[1] : '';
    }));
    
    // Get products from providers NOT in the selected list
    fundsData.forEach(client => {
      client.companies.forEach(company => {
        const companyCode = company.id.toUpperCase();
        if (!selectedCodes.has(companyCode)) {
          company.products.slice(0, 1).forEach(product => {
            products.push({
              code: product.code,
              name: product.name,
              provider: `${company.name} [${companyCode}]`,
              classification: 'Global Neutral Balanced',
              risk: 'M',
              matchScore: 80 + Math.floor(Math.random() * 15), // 80-95 (better)
              investmentObjective: 'Balanced Growth'
            });
          });
        }
      });
    });
    
    return products.slice(0, 3); // Only return top 3
  }, [selectedProviders]);

  // Generate Worse 3 products from OTHER providers (not selected)
  const worseProducts = useMemo(() => {
    const products: ComparisonProduct[] = [];
    const selectedCodes = new Set(selectedProviders.map(p => {
      const match = p.match(/\[([^\]]+)\]/);
      return match ? match[1] : '';
    }));
    
    // Get products from providers NOT in the selected list
    fundsData.forEach(client => {
      client.companies.forEach(company => {
        const companyCode = company.id.toUpperCase();
        if (!selectedCodes.has(companyCode)) {
          company.products.slice(1, 2).forEach(product => {
            products.push({
              code: product.code,
              name: product.name,
              provider: `${company.name} [${companyCode}]`,
              classification: 'Global Neutral Balanced',
              risk: 'M',
              matchScore: 50 + Math.floor(Math.random() * 15), // 50-65 (worse)
              investmentObjective: 'Balanced Growth'
            });
          });
        }
      });
    });
    
    return products.slice(0, 3); // Only return 3
  }, [selectedProviders]);

  const baselinePerformance = 75; // Original product's performance baseline

  // Mock performance data
  const performanceData = [
    { date: '2012', [productCode]: 100, ...Object.fromEntries(comparisonProducts.slice(0, 4).map((p, i) => [p.code, 100 + i * 5])) },
    { date: '2014', [productCode]: 150, ...Object.fromEntries(comparisonProducts.slice(0, 4).map((p, i) => [p.code, 145 + i * 8])) },
    { date: '2016', [productCode]: 180, ...Object.fromEntries(comparisonProducts.slice(0, 4).map((p, i) => [p.code, 175 + i * 6])) },
    { date: '2018', [productCode]: 210, ...Object.fromEntries(comparisonProducts.slice(0, 4).map((p, i) => [p.code, 200 + i * 10])) },
    { date: '2020', [productCode]: 190, ...Object.fromEntries(comparisonProducts.slice(0, 4).map((p, i) => [p.code, 180 + i * 8])) },
    { date: '2022', [productCode]: 240, ...Object.fromEntries(comparisonProducts.slice(0, 4).map((p, i) => [p.code, 230 + i * 12])) },
    { date: '2024', [productCode]: 280, ...Object.fromEntries(comparisonProducts.slice(0, 4).map((p, i) => [p.code, 270 + i * 15])) },
  ];

  const geographicData = [
    { name: 'US', value: 45 },
    { name: 'Canada', value: 25 },
    { name: 'Europe', value: 15 },
    { name: 'Asia', value: 10 },
    { name: 'Other', value: 5 },
  ];

  const sectorData = [
    { name: 'Technology', value: 20 },
    { name: 'Healthcare', value: 18 },
    { name: 'Finance', value: 15 },
    { name: 'Consumer', value: 12 },
    { name: 'Energy', value: 10 },
    { name: 'Other', value: 25 },
  ];

  const assetData = [
    { name: 'Stocks', value: 60 },
    { name: 'Bonds', value: 25 },
    { name: 'Cash', value: 10 },
    { name: 'Other', value: 5 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF6B9D'];

  const handleProductToggle = (productCode: string) => {
    setSelectedProducts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productCode)) {
        newSet.delete(productCode);
      } else {
        newSet.add(productCode);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedProducts.size === comparisonProducts.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(comparisonProducts.map(p => p.code)));
    }
  };

  const handleNextStep = () => {
    // Prepare data to pass to final review
    const reviewData = {
      original: { code: productCode, name: productName },
      products: comparisonProducts.map(product => ({
        code: product.code,
        name: product.name,
        provider: product.provider,
        classification: product.classification,
        risk: product.risk,
        investmentObjective: product.investmentObjective,
        status: productStatus[product.code] || null,
        note: productNotes[product.code] || ''
      }))
    };
    
    navigate('/kyp-final-review', { state: reviewData });
  };

  const handleNoteChange = (productCode: string, note: string) => {
    setProductNotes(prev => ({ ...prev, [productCode]: note }));
  };

  const handleStatusChange = (productCode: string, status: 'accepted' | 'rejected') => {
    setProductStatus(prev => ({ 
      ...prev, 
      [productCode]: prev[productCode] === status ? null : status 
    }));
  };

  const handleRemoveProduct = (productCode: string) => {
    // Since comparisonProducts is now a computed value, we can't directly modify it
    console.log('Remove product:', productCode);
  };

  const handleAddProduct = () => {
    // In real app, this would search and add actual products
    setIsAddDialogOpen(false);
  };

  const handleExportCSV = () => {
    // In real app, this would export the comparison data to CSV
    console.log('Exporting CSV...');
  };

  return (
    <PageLayout title="">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/kyp-review?code=${productCode}&name=${encodeURIComponent(productName)}`)}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Product Comparison</h1>
              <p className="text-sm text-gray-600 mt-1">Step 2 of 3: Compare products from selected providers</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate('/kyp-tool')}>Cancel</Button>
            <Button onClick={handleNextStep} className="gap-2 h-12 px-8 text-base font-semibold">
              Next: Final Review
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="max-w-5xl mx-auto">
          {/* Original Product */}
          <div className="mb-6 bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
              <h2 className="text-sm font-semibold text-blue-900 mb-2">Original Product</h2>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-lg font-bold text-gray-900">{productCode}</span>
                  <span className="text-gray-600 ml-3">{productName}</span>
                </div>
              </div>
            </div>

            {/* View Mode Toggle */}
            <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'graph' | 'allocations' | 'table' | 'grading')} className="mb-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="graph" className="gap-2">
                  <LineChart className="h-4 w-4" />
                  Graph View
                </TabsTrigger>
                <TabsTrigger value="allocations" className="gap-2">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                  </svg>
                  Allocations
                </TabsTrigger>
                <TabsTrigger value="table" className="gap-2">
                  <Table2 className="h-4 w-4" />
                  Table View
                </TabsTrigger>
                <TabsTrigger value="grading" className="gap-2">
                  <Settings className="h-4 w-4" />
                  Grading Rules
                </TabsTrigger>
              </TabsList>

              {/* Graph View */}
              <TabsContent value="graph" className="space-y-6">
                {/* Header with count and actions */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Products in Comparison</h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {comparisonProducts.length} products from {selectedProviders.length} providers
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleExportCSV} className="gap-2">
                      <Download className="h-4 w-4" />
                      Export CSV
                    </Button>
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm" className="gap-2">
                          <Plus className="h-4 w-4" />
                          Add Product
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add Product to Comparison</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input 
                              placeholder="Search products..." 
                              className="pl-9"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                            />
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Search functionality coming soon...
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                {/* Performance Chart */}
                <div className="bg-white rounded-lg border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Comparison</h3>
                  <ResponsiveContainer width="100%" height={400}>
                    <RechartsLineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey={productCode} stroke="#1e40af" strokeWidth={3} name={productCode} />
                      {comparisonProducts.slice(0, 4).map((product, index) => (
                        <Line 
                          key={product.code}
                          type="monotone" 
                          dataKey={product.code} 
                          stroke={COLORS[index]} 
                          strokeWidth={2}
                          name={product.code}
                        />
                      ))}
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>

                {/* Better Products Section */}
                <Collapsible defaultOpen={true}>
                  <div className="bg-white rounded-lg border">
                    <CollapsibleTrigger className="w-full p-6 bg-green-50/50 border-b hover:bg-green-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-left">
                          <ChevronDown className="h-5 w-5 text-green-700" />
                          <TrendingUp className="h-5 w-5 text-green-700" />
                          <h2 className="text-lg font-semibold text-green-900">
                            Better Than {productCode}
                          </h2>
                          <Badge className="bg-green-600 text-white">{betterProducts.length}</Badge>
                        </div>
                      </div>
                    </CollapsibleTrigger>

                  <CollapsibleContent>
                    <div className="p-4 grid grid-cols-3 gap-4">
                      {betterProducts.map((product) => {
                        const performanceDiff = product.matchScore - baselinePerformance;
                        const merDiff = 12; // Mock MER difference
                        return (
                          <div 
                            key={product.code}
                            className="relative bg-white border-2 border-green-200 rounded-lg p-4 hover:shadow-md transition-all group"
                          >
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleRemoveProduct(product.code)}
                              className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-4 w-4 text-gray-500" />
                            </Button>
                            
                            <div className="space-y-3">
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="px-2 py-1 bg-green-100 rounded text-xs font-bold text-green-800 border border-green-200">
                                    {product.code}
                                  </span>
                                </div>
                                <div className="text-sm font-medium text-gray-900 mb-2">
                                  {product.name}
                                </div>
                                <div className="flex items-center gap-1 text-xs text-green-700">
                                  <TrendingUp className="h-3 w-3" />
                                  <span className="font-semibold">+{merDiff}% MER</span>
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-between text-xs pt-2 border-t">
                                <span className="text-gray-600">Match</span>
                                <Badge className="bg-green-100 text-green-800 border-green-200">
                                  {product.matchScore}%
                                </Badge>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CollapsibleContent>
                  </div>
                </Collapsible>

                {/* Worse Products Section */}
                <Collapsible defaultOpen={true}>
                  <div className="bg-white rounded-lg border">
                    <CollapsibleTrigger className="w-full p-6 bg-red-50/50 border-b hover:bg-red-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-left">
                          <ChevronDown className="h-5 w-5 text-red-700" />
                          <TrendingDown className="h-5 w-5 text-red-700" />
                          <h2 className="text-lg font-semibold text-red-900">
                            Worse Than {productCode}
                          </h2>
                          <Badge className="bg-red-600 text-white">{worseProducts.length}</Badge>
                        </div>
                      </div>
                    </CollapsibleTrigger>

                  <CollapsibleContent>
                    <div className="p-4 grid grid-cols-3 gap-4">
                      {worseProducts.map((product) => {
                        const performanceDiff = baselinePerformance - product.matchScore;
                        const merDiff = 15; // Mock MER difference
                        return (
                          <div 
                            key={product.code}
                            className="relative bg-white border-2 border-red-200 rounded-lg p-4 hover:shadow-md transition-all group"
                          >
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleRemoveProduct(product.code)}
                              className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-4 w-4 text-gray-500" />
                            </Button>
                            
                            <div className="space-y-3">
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="px-2 py-1 bg-red-100 rounded text-xs font-bold text-red-800 border border-red-200">
                                    {product.code}
                                  </span>
                                </div>
                                <div className="text-sm font-medium text-gray-900 mb-2">
                                  {product.name}
                                </div>
                                <div className="flex items-center gap-1 text-xs text-red-700">
                                  <TrendingDown className="h-3 w-3" />
                                  <span className="font-semibold">-{merDiff}% MER</span>
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-between text-xs pt-2 border-t">
                                <span className="text-gray-600">Match</span>
                                <Badge className="bg-red-100 text-red-800 border-red-200">
                                  {product.matchScore}%
                                </Badge>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CollapsibleContent>
                  </div>
                </Collapsible>
              </TabsContent>

              {/* Allocations View */}
              <TabsContent value="allocations" className="space-y-6">
                {/* Allocation Pie Charts */}
                <div className="grid grid-cols-3 gap-6">
                  <div className="bg-white rounded-lg border p-6">
                    <div className="mb-4">
                      <h3 className="text-base font-semibold text-gray-900">Geographic Allocations</h3>
                      <p className="text-xs text-gray-600 mt-1">Distribution by region</p>
                    </div>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie 
                          data={geographicData} 
                          cx="50%" 
                          cy="50%" 
                          outerRadius={80} 
                          fill="#8884d8" 
                          dataKey="value"
                        >
                          {geographicData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value}%`} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="mt-4 space-y-2">
                      {geographicData.map((item, index) => (
                        <div key={item.name} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                            <span className="text-gray-700">{item.name}</span>
                          </div>
                          <span className="font-semibold text-gray-900">{item.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border p-6">
                    <div className="mb-4">
                      <h3 className="text-base font-semibold text-gray-900">Sector Allocations</h3>
                      <p className="text-xs text-gray-600 mt-1">Distribution by industry</p>
                    </div>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie 
                          data={sectorData} 
                          cx="50%" 
                          cy="50%" 
                          outerRadius={80} 
                          fill="#8884d8" 
                          dataKey="value"
                        >
                          {sectorData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value}%`} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="mt-4 space-y-2">
                      {sectorData.map((item, index) => (
                        <div key={item.name} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                            <span className="text-gray-700">{item.name}</span>
                          </div>
                          <span className="font-semibold text-gray-900">{item.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border p-6">
                    <div className="mb-4">
                      <h3 className="text-base font-semibold text-gray-900">Asset Allocations</h3>
                      <p className="text-xs text-gray-600 mt-1">Distribution by asset class</p>
                    </div>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie 
                          data={assetData} 
                          cx="50%" 
                          cy="50%" 
                          outerRadius={80} 
                          fill="#8884d8" 
                          dataKey="value"
                        >
                          {assetData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value}%`} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="mt-4 space-y-2">
                      {assetData.map((item, index) => (
                        <div key={item.name} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                            <span className="text-gray-700">{item.name}</span>
                          </div>
                          <span className="font-semibold text-gray-900">{item.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Table View */}
              <TabsContent value="table" className="space-y-6">
                <div className="bg-white rounded-lg border overflow-hidden">
                  <div className="p-6 border-b bg-gray-50">
                    <h2 className="text-lg font-semibold text-gray-900">Detailed Product Comparison</h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Review and evaluate {comparisonProducts.length} products • Accept or reject each product • Add notes
                    </p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                  <thead className="bg-gray-50 border-b-2 border-gray-200">
                    <tr>
                      <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Product Code
                      </th>
                      <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Product Name
                      </th>
                      <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Provider
                      </th>
                      <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Classification
                      </th>
                      <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Risk
                      </th>
                      <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Investment Objective
                      </th>
                      <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Notes
                      </th>
                      <th className="px-4 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Decision
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {/* Original Product Row */}
                    <tr className="bg-blue-50/30">
                      <td className="px-4 py-5">
                        <span className="inline-flex px-3 py-1.5 bg-blue-100 rounded-md text-xs font-bold text-blue-900 border border-blue-200">
                          {productCode}
                        </span>
                      </td>
                      <td className="px-4 py-5">
                        <div className="font-semibold text-gray-900 text-sm">{productName}</div>
                        <Badge className="mt-1 bg-blue-100 text-blue-800 border-blue-200 text-xs">
                          Original Product
                        </Badge>
                      </td>
                      <td className="px-4 py-5 text-sm text-gray-700">
                        Dynamic Funds
                      </td>
                      <td className="px-4 py-5 text-sm text-gray-700">
                        Global Neutral Balanced
                      </td>
                      <td className="px-4 py-5">
                        <Badge variant="outline" className="font-semibold bg-white">
                          LM
                        </Badge>
                      </td>
                      <td className="px-4 py-5 text-sm text-gray-700">
                        Income (65%), Growth (35%)
                      </td>
                      <td className="px-4 py-5">
                        <span className="text-gray-500 text-sm italic">Original product for comparison</span>
                      </td>
                      <td className="px-4 py-5">
                        <div className="flex gap-2 justify-center">
                          <Button
                            size="sm"
                            variant={productStatus[productCode] === 'accepted' ? 'default' : 'outline'}
                            onClick={() => handleStatusChange(productCode, 'accepted')}
                            className={`gap-1 ${
                              productStatus[productCode] === 'accepted' 
                                ? 'bg-green-600 hover:bg-green-700' 
                                : 'hover:bg-green-50 hover:border-green-300'
                            }`}
                            title="Accept product"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant={productStatus[productCode] === 'rejected' ? 'destructive' : 'outline'}
                            onClick={() => handleStatusChange(productCode, 'rejected')}
                            className={productStatus[productCode] !== 'rejected' ? 'hover:bg-red-50 hover:border-red-300' : ''}
                            title="Reject product"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                    
                    {/* Comparison Products */}
                    {comparisonProducts.map((product) => (
                      <tr 
                        key={product.code}
                        className={`transition-colors ${
                          productStatus[product.code] === 'accepted' ? 'bg-green-50/50' :
                          productStatus[product.code] === 'rejected' ? 'bg-red-50/50' :
                          'hover:bg-gray-50'
                        }`}
                      >
                        <td className="px-4 py-5">
                          <span className="inline-flex px-3 py-1.5 bg-gray-100 rounded-md text-xs font-bold text-gray-700 border border-gray-200">
                            {product.code}
                          </span>
                        </td>
                        <td className="px-4 py-5">
                          <div className="font-semibold text-gray-900 text-sm">{product.name}</div>
                          <div className="text-xs text-gray-500 mt-1">Match: <span className="font-semibold text-blue-600">{product.matchScore}%</span></div>
                        </td>
                        <td className="px-4 py-5 text-sm text-gray-700">
                          {product.provider.split('[')[0].trim()}
                        </td>
                        <td className="px-4 py-5 text-sm text-gray-700">
                          {product.classification}
                        </td>
                        <td className="px-4 py-5">
                          <Badge variant="outline" className="font-semibold bg-white">
                            {product.risk}
                          </Badge>
                        </td>
                        <td className="px-4 py-5 text-sm text-gray-700">
                          {product.investmentObjective}
                        </td>
                        <td className="px-4 py-5">
                          <Textarea 
                            value={productNotes[product.code] || ''}
                            onChange={(e) => handleNoteChange(product.code, e.target.value)}
                            placeholder="Enter notes..."
                            className="min-h-[70px] text-xs resize-none"
                          />
                        </td>
                        <td className="px-4 py-5">
                          <div className="flex gap-2 justify-center">
                            <Button
                              size="sm"
                              variant={productStatus[product.code] === 'accepted' ? 'default' : 'outline'}
                              onClick={() => handleStatusChange(product.code, 'accepted')}
                              className={`gap-1 ${
                                productStatus[product.code] === 'accepted' 
                                  ? 'bg-green-600 hover:bg-green-700' 
                                  : 'hover:bg-green-50 hover:border-green-300'
                              }`}
                              title="Accept product"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant={productStatus[product.code] === 'rejected' ? 'destructive' : 'outline'}
                              onClick={() => handleStatusChange(product.code, 'rejected')}
                              className={productStatus[product.code] !== 'rejected' ? 'hover:bg-red-50 hover:border-red-300' : ''}
                              title="Reject product"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    </tbody>
                    </table>
                  </div>

                  {/* Summary footer */}
                  <div className="px-6 py-4 bg-gray-50 border-t flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  {comparisonProducts.length} products total
                </div>
                <div className="flex gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
                    <span className="text-gray-600">
                      Accepted: <span className="font-semibold text-gray-900">
                        {Object.values(productStatus).filter(s => s === 'accepted').length}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-100 border border-red-300 rounded"></div>
                    <span className="text-gray-600">
                      Rejected: <span className="font-semibold text-gray-900">
                        {Object.values(productStatus).filter(s => s === 'rejected').length}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            </TabsContent>

              {/* Grading Rules Tab */}
              <TabsContent value="grading">
                <div className="bg-white rounded-lg border p-8">
                  <div className="max-w-2xl mx-auto">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Grading Rules</h2>
                    <div className="space-y-6">
                      <div className="space-y-3">
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

                      <div className="space-y-3">
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

                      <div className="space-y-3">
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

                      <div className="space-y-3">
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

                      <div className="pt-4 border-t">
                        <Button variant="outline" className="w-full gap-2">
                          <Save className="h-4 w-4" />
                          Save Rule Set
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageLayout>
  );
}
