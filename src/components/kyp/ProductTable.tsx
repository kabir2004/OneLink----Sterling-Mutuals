import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lightbulb } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ReviewDetailsDialog } from './ReviewDetailsDialog';

interface Product {
  code: string;
  name: string;
  marketValue: string;
  status: string;
}

interface ProductTableProps {
  products: Product[];
}

export function ProductTable({ products }: ProductTableProps) {
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState<{ code: string; name: string } | null>(null);

  const handleReviewClick = (product: Product) => {
    if (product.status === 'Reviewed') {
      setSelectedProduct({ code: product.code, name: product.name });
    }
  };

  return (
    <>
      <ReviewDetailsDialog
        open={!!selectedProduct}
        onOpenChange={(open) => !open && setSelectedProduct(null)}
        productCode={selectedProduct?.code || ''}
        productName={selectedProduct?.name || ''}
      />
    <div className="overflow-hidden">
      {/* Table Header */}
      <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-white border-b-2 border-gray-200 text-gray-700 text-xs font-semibold uppercase tracking-wider">
        <div className="col-span-2">Product Code</div>
        <div className="col-span-5">Product Name</div>
        <div className="col-span-2 text-right">Market Value</div>
        <div className="col-span-2 text-center">Status</div>
        <div className="col-span-1 text-center">Insights</div>
      </div>

      {/* Product Rows */}
      <div className="divide-y divide-gray-100">
        {products.map((product, index) => (
          <div 
            key={product.code}
            className="grid grid-cols-12 gap-4 px-6 py-4 text-sm transition-colors bg-white hover:bg-gray-50"
          >
            <div className="col-span-2 flex items-center">
              <span className="px-3 py-1.5 bg-gray-100 rounded-md text-xs font-semibold text-gray-700">
                {product.code}
              </span>
            </div>
            <div className="col-span-5 flex items-center font-medium text-gray-900">
              {product.name}
            </div>
            <div className="col-span-2 text-right font-bold text-gray-900 flex items-center justify-end">
              {product.marketValue}
            </div>
            <div className="col-span-2 flex justify-center items-center">
              {product.status === 'Reviewed' ? (
                <Badge 
                  className="bg-green-100 text-green-800 border-green-200 hover:bg-green-200 text-xs font-semibold px-3 py-1 shadow-sm cursor-pointer transition-colors rounded-sm"
                  onClick={() => handleReviewClick(product)}
                >
                  ✓ Reviewed
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-xs font-medium px-3 py-1 rounded-sm">
                  Pending
                </Badge>
              )}
            </div>
            <div className="col-span-1 flex items-center justify-center">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-9 w-9 p-0 hover:bg-yellow-100 rounded-lg transition-all hover:scale-110 group"
                title="Get insights"
                onClick={() => navigate(`/kyp-review?code=${product.code}&name=${encodeURIComponent(product.name)}`)}
              >
                <Lightbulb className="h-4 w-4 text-yellow-600 group-hover:text-yellow-700" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
}
