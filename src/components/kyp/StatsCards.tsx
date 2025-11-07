import { Card } from '@/components/ui/card';
import { TrendingUp, Users, CheckCircle, DollarSign } from 'lucide-react';

interface StatsCardsProps {
  totalClients: number;
  totalProducts: number;
  reviewedProducts: number;
  totalValue: string;
}

export function StatsCards({ totalClients, totalProducts, reviewedProducts, totalValue }: StatsCardsProps) {
  const reviewPercentage = Math.round((reviewedProducts / totalProducts) * 100);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="p-5 bg-gradient-to-br from-blue-50 to-white border-blue-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Clients</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{totalClients}</p>
          </div>
          <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </Card>

      <Card className="p-5 bg-gradient-to-br from-purple-50 to-white border-purple-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Products</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{totalProducts}</p>
          </div>
          <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
            <TrendingUp className="h-6 w-6 text-purple-600" />
          </div>
        </div>
      </Card>

      <Card className="p-5 bg-gradient-to-br from-green-50 to-white border-green-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Review Progress</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{reviewPercentage}%</p>
            <p className="text-xs text-gray-500 mt-1">{reviewedProducts} of {totalProducts}</p>
          </div>
          <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
        </div>
      </Card>

      <Card className="p-5 bg-gradient-to-br from-orange-50 to-white border-orange-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Value</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{totalValue}</p>
          </div>
          <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
            <DollarSign className="h-6 w-6 text-orange-600" />
          </div>
        </div>
      </Card>
    </div>
  );
}
