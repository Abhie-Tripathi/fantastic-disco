import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { FileText } from 'lucide-react';

interface ExportEntry {
  id: string;
  name: string;
  type: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  createdAt: string;
  createdBy: string;
  totalRecords: number;
  processedRecords: number;
  downloadUrl?: string;
  user?: {
    firstname: string;
    lastname: string;
  };
  exportOf?: string;
}

interface ExportListProps {
  data?: ExportEntry[];
  onDownload?: (exportId: string) => void;
  onRetry?: (exportId: string) => void;
  isLoading?: boolean;
}

const ExportList: React.FC<ExportListProps> = ({ data, onDownload, onRetry, isLoading }) => {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Pending', className: 'bg-amber-100 text-amber-800 border-amber-200' },
      processing: { label: 'Processing', className: 'bg-blue-100 text-blue-800 border-blue-200' },
      completed: { label: 'Completed', className: 'bg-green-100 text-green-800 border-green-200' },
      failed: { label: 'Failed', className: 'bg-red-100 text-red-800 border-red-200' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

    return (
      <Badge className={`${config.className} hover:${config.className}`}>
        {config.label}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center px-5 pb-5 rounded-lg">
        <div className="w-6 h-6 border-4 border-gray-300 rounded-full animate-spin" style={{ borderTopColor: 'var(--primary-color)' }}/>
        <span className="ml-3 text-gray-500">Loading export data...</span>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="border rounded-lg p-8 text-center mb-5 mx-5">
        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No export entries yet</p>
        <p className="text-sm text-gray-400 mt-1">Your exported files will appear here</p>
      </div>
    );
  }

  // ✅ Main Table View
  return (
    <div className="border rounded-lg max-h-[240px] mb-5 mx-5 overflow-scroll">
      <Table>
        <TableHeader className="p-2">
          <TableRow>
            <TableHead>Requested</TableHead>
            <TableHead>What Export</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((exportEntry) => (
            <TableRow key={exportEntry.id}>
              <TableCell className="p-2">
                {formatDate(exportEntry.createdAt)}
                <div className="text-[var(--secondary-text-color)]">
                  {`By: ${exportEntry.user?.firstname || ''} ${exportEntry.user?.lastname || ''}`}
                </div>
              </TableCell>
              <TableCell className="p-2">
                <div className="space-y-1">
                  <div className="font-medium">{exportEntry.type}</div>
                  <div className="text-sm text-gray-500">
                    {exportEntry.exportOf
                      ? exportEntry.exportOf.split('_')[1].charAt(0).toUpperCase() +
                        exportEntry.exportOf.split('_')[1].slice(1).toLowerCase()
                      : ''}
                  </div>
                </div>
              </TableCell>
              <TableCell className="p-2">
                {getStatusBadge(exportEntry.status.toLowerCase())}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ExportList;
