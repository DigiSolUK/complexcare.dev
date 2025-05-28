"use client"

\`\`\`tsx file="components/invoicing/invoice-table.tsx"
[v0-no-op-code-block-prefix]import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Invoice } from '@/types';
import { useTenant } from "@/contexts"

interface InvoiceTableProps {
  invoices: Invoice[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const InvoiceTable: React.FC<InvoiceTableProps> = ({ invoices, onEdit, onDelete }) => {
  const { tenant } = useTenant();

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Invoice Number</TableCell>
            <TableCell align="right">Date</TableCell>
            <TableCell align="right">Amount</TableCell>
            <TableCell align="right">Status</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow
              key={invoice.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {invoice.invoiceNumber}
              </TableCell>
              <TableCell align="right">{invoice.date}</TableCell>
              <TableCell align="right">{invoice.amount}</TableCell>
              <TableCell align="right">{invoice.status}</TableCell>
              <TableCell align="right">
                <IconButton aria-label="edit" onClick={() => onEdit(invoice.id)}>
                  <EditIcon />
                </IconButton>
                <IconButton aria-label="delete" onClick={() => onDelete(invoice.id)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default InvoiceTable;
