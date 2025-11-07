import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle2, X, FileText } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

interface ProductReview {
  code: string;
  name: string;
  provider: string;
  classification: string;
  risk: string;
  investmentObjective: string;
  status: 'accepted' | 'rejected' | null;
  note: string;
}

interface ReviewData {
  original: { code: string; name: string };
  products: ProductReview[];
}

export default function KYPFinalReview() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();
  const reviewData = location.state as ReviewData;
  const [reviewNote, setReviewNote] = useState('');

  // If no review data, redirect back
  if (!reviewData) {
    navigate('/kyp-tool');
    return null;
  }

  const selectedCount = reviewData.products.filter(p => p.status === 'accepted').length;
  const notSelectedCount = reviewData.products.filter(p => p.status === 'rejected').length;

  const handleSaveReview = () => {
    // Store the reviewed product code in sessionStorage to update status
    sessionStorage.setItem('reviewedProduct', reviewData.original.code);
    
    toast({
      title: "Review Saved Successfully",
      description: `Saved review for ${reviewData.products.length} products`,
    });
    
    setTimeout(() => {
      navigate('/kyp-tool');
    }, 1500);
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
              onClick={() => window.history.back()}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Final Review</h1>
              <p className="text-sm text-gray-600 mt-1">Step 3 of 3: Review and confirm your product selections</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate('/kyp-tool')}>Cancel</Button>
            <Button onClick={handleSaveReview} className="gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Save Review
            </Button>
          </div>
        </div>

        {/* Description and Review Note */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg border p-6">
            <div className="mb-3">
              <span className="text-sm font-semibold text-gray-700">Description:</span>
              <div className="text-sm text-gray-900 mt-1">KYP Research for {reviewData.original.code}</div>
            </div>
            <div>
              <span className="text-sm font-semibold text-gray-700">Access Level:</span>
              <div className="text-sm text-gray-900 mt-1">(9823-2232) Antoine Marsh</div>
            </div>
          </div>
          <div className="bg-white rounded-lg border p-6">
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Review Note:</label>
            <Textarea 
              value={reviewNote}
              onChange={(e) => setReviewNote(e.target.value)}
              placeholder="Add overall review notes..."
              className="min-h-[80px]"
            />
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg border p-6">
            <div className="text-sm text-gray-600 mb-1">Products Reviewed</div>
            <div className="text-2xl font-bold text-gray-900">{reviewData.products.length}</div>
            <div className="text-xs text-gray-500 mt-1">Total products analyzed</div>
          </div>
          <div className="bg-white rounded-lg border p-6">
            <div className="text-sm text-gray-600 mb-1">Selected</div>
            <div className="text-2xl font-bold text-green-600">{selectedCount}</div>
            <div className="text-xs text-gray-500 mt-1">Approved products</div>
          </div>
          <div className="bg-white rounded-lg border p-6">
            <div className="text-sm text-gray-600 mb-1">Not Selected</div>
            <div className="text-2xl font-bold text-red-600">{notSelectedCount}</div>
            <div className="text-xs text-gray-500 mt-1">Rejected products</div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg border overflow-hidden">
          <div className="p-6 border-b bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">Products:</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Code</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Target</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {/* Original Product */}
                <tr className="bg-blue-50/30">
                  <td className="px-6 py-4">
                    <span className="inline-flex px-3 py-1.5 bg-blue-100 rounded-md text-xs font-bold text-blue-900 border border-blue-200">
                      {reviewData.original.code}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900 text-sm">{reviewData.original.name}</div>
                    <Badge className="mt-1 bg-blue-100 text-blue-800 border-blue-200 text-xs">
                      Original Product
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      <div className="w-4 h-4 rounded border-2 border-gray-400 bg-white"></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-gray-500 text-sm">-</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-500 text-sm">-</span>
                  </td>
                </tr>

                {/* Comparison Products */}
                {reviewData.products.map((product) => (
                  <tr 
                    key={product.code}
                    className={`${
                      product.status === 'accepted' ? 'bg-green-50/30' :
                      product.status === 'rejected' ? 'bg-red-50/30' :
                      ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <span className="inline-flex px-3 py-1.5 bg-gray-100 rounded-md text-xs font-bold text-gray-700 border border-gray-200">
                        {product.code}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900 text-sm">{product.name}</div>
                      <div className="text-xs text-gray-500 mt-1">{product.provider.split('[')[0].trim()}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        {product.status === 'accepted' ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        ) : (
                          <div className="w-4 h-4 rounded border-2 border-gray-400 bg-white"></div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {product.status === 'accepted' && (
                        <div className="inline-flex items-center gap-1 text-green-700 text-sm font-semibold">
                          <CheckCircle2 className="h-4 w-4" />
                          Selected
                        </div>
                      )}
                      {product.status === 'rejected' && (
                        <div className="inline-flex items-center gap-1 text-red-700 text-sm font-semibold">
                          <X className="h-4 w-4" />
                          Not Selected
                        </div>
                      )}
                      {!product.status && (
                        <span className="text-gray-400 text-sm">No Decision</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {product.note ? (
                        <div className="flex items-start gap-2">
                          <span className="text-sm text-gray-700">{product.note}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-between items-center">
          <Button variant="outline" onClick={() => window.history.back()} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Go Back to Comparison
          </Button>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate('/kyp-tool')}>
              Cancel
            </Button>
            <Button onClick={handleSaveReview} size="lg" className="gap-2">
              <FileText className="h-5 w-5" />
              Generate Report
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
