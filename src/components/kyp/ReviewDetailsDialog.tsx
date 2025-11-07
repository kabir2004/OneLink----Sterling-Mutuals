import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, CheckCircle2 } from "lucide-react";

interface ProductReview {
  code: string;
  name: string;
  provider: string;
  status: 'accepted' | 'rejected' | null;
  note: string;
}

interface ReviewDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productCode: string;
  productName: string;
}

export function ReviewDetailsDialog({
  open,
  onOpenChange,
  productCode,
  productName,
}: ReviewDetailsDialogProps) {
  // Mock review data - in a real app, this would come from an API
  const reviewData = {
    dateCompleted: "Mon Oct 27 17:32:55 EDT 2025",
    reviewNote: "All selected products meet the required criteria and align with client objectives.",
    original: { code: productCode, name: productName },
    products: [
      {
        code: "TDB909",
        name: "TD Canadian Aggregate Bond Index Fund",
        provider: "TD Asset Management Inc.",
        status: 'accepted' as const,
        note: "Strong alignment with investment objectives"
      },
      {
        code: "RBF556",
        name: "RBC Bond Fund",
        provider: "RBC Global Asset Management Inc.",
        status: 'accepted' as const,
        note: "Excellent risk profile match"
      },
      {
        code: "BMO200",
        name: "BMO Monthly Income Fund",
        provider: "BMO Investments Inc.",
        status: 'rejected' as const,
        note: "Risk level not aligned with requirements"
      },
    ]
  };

  const selectedCount = reviewData.products.filter(p => p.status === 'accepted').length;
  const notSelectedCount = reviewData.products.filter(p => p.status === 'rejected').length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div>
            <DialogTitle className="text-xl font-semibold">
              KYP Review Report: {productCode}
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Completed on {reviewData.dateCompleted}
            </p>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Review Info */}
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-semibold text-foreground">Description:</span>
                <div className="text-sm text-muted-foreground mt-1">KYP Research for {productCode}</div>
              </div>
              <div>
                <span className="text-sm font-semibold text-foreground">Review Note:</span>
                <div className="text-sm text-muted-foreground mt-1">{reviewData.reviewNote}</div>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-card rounded-lg border p-4">
              <div className="text-sm text-muted-foreground mb-1">Products Reviewed</div>
              <div className="text-2xl font-bold">{reviewData.products.length}</div>
              <div className="text-xs text-muted-foreground mt-1">Total products analyzed</div>
            </div>
            <div className="bg-card rounded-lg border p-4">
              <div className="text-sm text-muted-foreground mb-1">Selected</div>
              <div className="text-2xl font-bold text-green-600">{selectedCount}</div>
              <div className="text-xs text-muted-foreground mt-1">Approved products</div>
            </div>
            <div className="bg-card rounded-lg border p-4">
              <div className="text-sm text-muted-foreground mb-1">Not Selected</div>
              <div className="text-2xl font-bold text-red-600">{notSelectedCount}</div>
              <div className="text-xs text-muted-foreground mt-1">Rejected products</div>
            </div>
          </div>

          {/* Products Table */}
          <div className="rounded-lg border overflow-hidden">
            <div className="p-4 border-b bg-muted/50">
              <h3 className="text-base font-semibold">Products:</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Code</th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Name</th>
                    <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider">Target</th>
                    <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Note</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {/* Original Product */}
                  <tr className="bg-blue-50/30 dark:bg-blue-950/20">
                    <td className="px-4 py-3">
                      <span className="inline-flex px-3 py-1.5 bg-blue-100 dark:bg-blue-900 rounded-md text-xs font-bold text-blue-900 dark:text-blue-100 border border-blue-200 dark:border-blue-800">
                        {reviewData.original.code}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-sm">{reviewData.original.name}</div>
                      <Badge className="mt-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 border-blue-200 dark:border-blue-800 text-xs">
                        Original Product
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center">
                        <div className="w-4 h-4 rounded border-2 border-muted-foreground bg-background"></div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-muted-foreground text-sm">-</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-muted-foreground text-sm">-</span>
                    </td>
                  </tr>

                  {/* Comparison Products */}
                  {reviewData.products.map((product) => (
                    <tr 
                      key={product.code}
                      className={`${
                        product.status === 'accepted' ? 'bg-green-50/30 dark:bg-green-950/20' :
                        product.status === 'rejected' ? 'bg-red-50/30 dark:bg-red-950/20' :
                        ''
                      }`}
                    >
                      <td className="px-4 py-3">
                        <span className="inline-flex px-3 py-1.5 bg-muted rounded-md text-xs font-bold border">
                          {product.code}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-sm">{product.name}</div>
                        <div className="text-xs text-muted-foreground mt-1">{product.provider}</div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex justify-center">
                          {product.status === 'accepted' ? (
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                          ) : (
                            <div className="w-4 h-4 rounded border-2 border-muted-foreground bg-background"></div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {product.status === 'accepted' && (
                          <div className="inline-flex items-center gap-1 text-green-700 dark:text-green-400 text-sm font-semibold">
                            <CheckCircle2 className="h-4 w-4" />
                            Selected
                          </div>
                        )}
                        {product.status === 'rejected' && (
                          <div className="inline-flex items-center gap-1 text-red-700 dark:text-red-400 text-sm font-semibold">
                            <X className="h-4 w-4" />
                            Not Selected
                          </div>
                        )}
                        {!product.status && (
                          <span className="text-muted-foreground text-sm">No Decision</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {product.note ? (
                          <span className="text-sm">{product.note}</span>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
