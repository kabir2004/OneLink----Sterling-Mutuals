import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight, User } from 'lucide-react';
import { CompanyRow } from './CompanyRow';

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

interface Client {
  id: string;
  name: string;
  productsReviewed: string;
  totalValue: string;
  companies: Company[];
}

interface ClientCardProps {
  client: Client;
  isExpanded: boolean;
  expandedCompanies: Set<string>;
  onToggleClient: () => void;
  onToggleCompany: (companyId: string) => void;
  companyLogos: Record<string, string>;
}

export function ClientCard({ 
  client, 
  isExpanded, 
  expandedCompanies,
  onToggleClient, 
  onToggleCompany,
  companyLogos 
}: ClientCardProps) {
  return (
    <Card className="border-0 overflow-hidden bg-white">
      {/* Client Header */}
      <div 
        className="bg-white border-b-2 border-gray-200 p-5 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-all duration-200"
        onClick={onToggleClient}
      >
        <div className="flex items-center gap-4 flex-1">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-9 w-9 p-0 hover:bg-gray-200 rounded-lg transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onToggleClient();
            }}
          >
            {isExpanded ? (
              <ChevronDown className="h-5 w-5 text-gray-700" />
            ) : (
              <ChevronRight className="h-5 w-5 text-gray-700" />
            )}
          </Button>
          <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-gray-700" />
          </div>
          <span className="text-base font-bold text-gray-900">{client.name}</span>
        </div>
        <div className="flex items-center gap-10">
          <div className="flex flex-col items-end">
            <span className="text-xs text-gray-600 font-medium">Products Reviewed</span>
            <span className="text-sm font-bold text-gray-900 mt-1">{client.productsReviewed}</span>
          </div>
          <div className="flex flex-col items-end min-w-[160px]">
            <span className="text-xs text-gray-600 font-medium">Total Value</span>
            <span className="text-xl font-bold text-green-600 mt-1">{client.totalValue}</span>
          </div>
        </div>
      </div>

      {/* Company List */}
      {isExpanded && (
        <div className="bg-gray-50">
          {client.companies.map((company) => (
            <CompanyRow
              key={company.id}
              company={company}
              isExpanded={expandedCompanies.has(company.id)}
              onToggle={() => onToggleCompany(company.id)}
              logo={companyLogos[company.id]}
            />
          ))}
        </div>
      )}
    </Card>
  );
}
