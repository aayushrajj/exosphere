
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Executive {
  id: string;
  full_name: string;
  executive_role: string;
  created_at: string;
}

interface ExecutivesTableProps {
  executives: Executive[];
}

const ExecutivesTable = ({ executives }: ExecutivesTableProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h4 className="text-lg font-semibold text-gray-900 mb-4">Organization Executives</h4>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User Name</TableHead>
            <TableHead>Role in Organisation</TableHead>
            <TableHead>Added Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {executives.map((executive) => (
            <TableRow key={executive.id}>
              <TableCell className="font-medium">{executive.full_name}</TableCell>
              <TableCell>{executive.executive_role}</TableCell>
              <TableCell>{formatDate(executive.created_at)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ExecutivesTable;
