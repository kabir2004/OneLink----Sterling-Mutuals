import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { ProductTable } from './ProductTable';

interface Product {
  code: string;
  name: string;
  marketValue: string;
  status: string;
}

interface Company {
  id: string;
  name: string;
  productsReviewed: string;
  value: string;
  products: Product[];
}

interface CompanyRowProps {
  company: Company;
  isExpanded: boolean;
  onToggle: () => void;
  logo?: string;
}

export function CompanyRow({ company, isExpanded, onToggle, logo }: CompanyRowProps) {
  return (
    <div className="border-b last:border-b-0">
      {/* Company Header */}
      <div 
        className={`p-4 flex items-center justify-between cursor-pointer bg-white hover:bg-gray-50 transition-all duration-200 ${
          isExpanded 
            ? 'border-l-4 border-blue-500' 
            : 'border-l-4 border-transparent'
        }`}
        onClick={onToggle}
      >
        <div className="flex-1 flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-blue-100 rounded-lg transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 text-blue-600" />
            ) : (
              <ChevronRight className="h-4 w-4 text-gray-600" />
            )}
          </Button>
          {logo && (
            <div className="h-10 w-10 flex items-center justify-center border-2 border-white rounded-md overflow-hidden bg-white">
              <img 
                src={logo} 
                alt={`${company.name} logo`} 
                className="h-full w-full object-cover" 
              />
            </div>
          )}
          <span className="text-sm font-semibold text-gray-900">{company.name}</span>
        </div>
        <div className="flex items-center gap-8">
          <div className="flex flex-col items-end">
            <span className="text-xs text-gray-500 font-medium">Products Reviewed</span>
            <span className="text-sm font-bold text-gray-900">{company.productsReviewed}</span>
          </div>
          <div className="flex flex-col items-end min-w-[140px]">
            <span className="text-xs text-gray-500 font-medium">Total Value</span>
            <span className="text-base font-bold text-blue-600">{company.value}</span>
          </div>
        </div>
      </div>

      {/* Products Table */}
      {isExpanded && company.products.length > 0 && (
        <div className="bg-white border-t border-gray-200">
          <ProductTable products={company.products} />
        </div>
      )}
    </div>
  );
}
