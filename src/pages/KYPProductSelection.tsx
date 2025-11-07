import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Search } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { fundsData } from '@/data/fundsData';

interface Product {
  code: string;
  name: string;
  provider: string;
  providerCode: string;
}

export default function KYPProductSelection() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const productCode = searchParams.get('code') || '';
  const productName = searchParams.get('name') || '';
  const providersParam = searchParams.get('providers') || '';
  const selectedProviders = providersParam.split(',').filter(p => p);

  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  // Get all products from selected providers
  const availableProducts = useMemo(() => {
    const products: Product[] = [];
    
    selectedProviders.forEach(providerWithCode => {
      const codeMatch = providerWithCode.match(/\[([^\]]+)\]/);
      if (!codeMatch) return;
      
      const providerCode = codeMatch[1];
      
      fundsData.forEach(client => {
        const company = client.companies.find(c => 
          c.id === providerCode.toLowerCase() || 
          c.name.includes(providerCode)
        );
        
        if (company) {
          company.products.forEach(product => {
            products.push({
              code: product.code,
              name: product.name,
              provider: providerWithCode,
              providerCode: providerCode
            });
          });
        }
      });
    });
    
    return products;
  }, [selectedProviders]);

  // Filter products based on search
  const filteredProducts = useMemo(() => {
    if (!searchQuery) return availableProducts;
    
    const query = searchQuery.toLowerCase();
    return availableProducts.filter(p => 
      p.code.toLowerCase().includes(query) ||
      p.name.toLowerCase().includes(query) ||
      p.provider.toLowerCase().includes(query)
    );
  }, [availableProducts, searchQuery]);

  // Group products by provider
  const productsByProvider = useMemo(() => {
    const grouped: Record<string, Product[]> = {};
    
    filteredProducts.forEach(product => {
      if (!grouped[product.provider]) {
        grouped[product.provider] = [];
      }
      grouped[product.provider].push(product);
    });
    
    return grouped;
  }, [filteredProducts]);

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

  const handleSelectAllForProvider = (provider: string) => {
    const providerProducts = productsByProvider[provider];
    const allSelected = providerProducts.every(p => selectedProducts.has(p.code));
    
    setSelectedProducts(prev => {
      const newSet = new Set(prev);
      providerProducts.forEach(p => {
        if (allSelected) {
          newSet.delete(p.code);
        } else {
          newSet.add(p.code);
        }
      });
      return newSet;
    });
  };

  const handleNextStep = () => {
    if (selectedProducts.size === 0) return;
    
    const selectedProductsList = Array.from(selectedProducts).join(',');
    navigate(`/kyp-comparison?code=${productCode}&name=${encodeURIComponent(productName)}&providers=${encodeURIComponent(providersParam)}&products=${encodeURIComponent(selectedProductsList)}`);
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
              <h1 className="text-2xl font-semibold text-gray-900">Select Products</h1>
              <p className="text-sm text-gray-600 mt-1">Step 2 of 3: Choose specific products to compare</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate('/kyp-tool')}>Cancel</Button>
            <Button 
              onClick={handleNextStep}
              disabled={selectedProducts.size === 0}
              className="gap-2 h-12 px-8 text-base font-semibold"
            >
              Next: Comparison
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

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

        {/* Search and Stats */}
        <div className="mb-6 flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search products by code or name..." 
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-semibold text-gray-900">{selectedProducts.size}</span> products selected from{' '}
            <span className="font-semibold text-gray-900">{selectedProviders.length}</span> providers
          </div>
        </div>

        {/* Products by Provider */}
        <div className="space-y-6">
          {Object.entries(productsByProvider).map(([provider, products]) => {
            const selectedCount = products.filter(p => selectedProducts.has(p.code)).length;
            const allSelected = selectedCount === products.length;
            
            return (
              <div key={provider} className="bg-white rounded-lg border">
                {/* Provider Header */}
                <div className="p-4 bg-gray-50 border-b flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={allSelected}
                      onCheckedChange={() => handleSelectAllForProvider(provider)}
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">{provider}</h3>
                      <p className="text-sm text-gray-600">
                        {selectedCount} of {products.length} products selected
                      </p>
                    </div>
                  </div>
                  <Badge variant={selectedCount > 0 ? "default" : "outline"}>
                    {selectedCount}/{products.length}
                  </Badge>
                </div>

                {/* Products Grid */}
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {products.map(product => (
                    <div
                      key={product.code}
                      className={`flex items-start gap-3 p-3 rounded-lg border-2 transition-all cursor-pointer hover:shadow-md ${
                        selectedProducts.has(product.code)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                      onClick={() => handleProductToggle(product.code)}
                    >
                      <Checkbox
                        checked={selectedProducts.has(product.code)}
                        onCheckedChange={() => handleProductToggle(product.code)}
                        className="mt-0.5"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm text-gray-900 mb-1">
                          {product.code}
                        </div>
                        <div className="text-sm text-gray-600 line-clamp-2">
                          {product.name}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {Object.keys(productsByProvider).length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border">
            <p className="text-gray-500">No products found matching your search.</p>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
