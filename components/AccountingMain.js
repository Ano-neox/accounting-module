import React, { useState } from 'react';
import {
  Box, Typography, Card, CardContent, Grid, Button, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Dialog,
  DialogTitle, DialogContent, TextField, DialogActions, IconButton
} from '@mui/material';
import { IconTrendingUp, IconTrendingDown, IconCreditCard, IconReceipt, IconPlus, IconEdit, IconTrash } from '@tabler/icons-react';
import PageContainer from '../../../../modernize-dashboard/src/components/container/PageContainer';

const AccountingMain = () => {
  const [transactions, setTransactions] = useState([
    { id: 1, type: 'Income', description: 'Product Sale', amount: 1200, date: '2024-01-15', category: 'Revenue' },
    { id: 2, type: 'Expense', description: 'Office Rent', amount: -800, date: '2024-01-14', category: 'Operating' },
    { id: 3, type: 'Income', description: 'Service Fee', amount: 350, date: '2024-01-13', category: 'Revenue' },
    { id: 4, type: 'Expense', description: 'Utilities', amount: -150, date: '2024-01-12', category: 'Operating' }
  ]);

  const [open, setOpen] = useState(false);
  const [editTransaction, setEditTransaction] = useState(null);
  const [formData, setFormData] = useState({ type: 'Income', description: '', amount: 0, category: '' });

  const totalIncome = transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = Math.abs(transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0));
  const netProfit = totalIncome - totalExpenses;

  const handleAdd = () => {
    setEditTransaction(null);
    setFormData({ type: 'Income', description: '', amount: 0, category: '' });
    setOpen(true);
  };

  const handleEdit = (transaction) => {
    setEditTransaction(transaction);
    setFormData({ ...transaction, amount: Math.abs(transaction.amount) });
    setOpen(true);
  };

  const handleSave = () => {
    const amount = formData.type === 'Expense' ? -Math.abs(formData.amount) : Math.abs(formData.amount);
    const newTransaction = { ...formData, amount, date: new Date().toISOString().split('T')[0] };
    
    if (editTransaction) {
      setTransactions(transactions.map(t => t.id === editTransaction.id ? { ...newTransaction, id: editTransaction.id } : t));
    } else {
      setTransactions([...transactions, { ...newTransaction, id: Date.now() }]);
    }
    setOpen(false);
  };

  const handleDelete = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  return (
    <PageContainer title="Accounting" description="Financial Management System">
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4">Accounting Dashboard</Typography>
          <Button variant="contained" startIcon={<IconPlus />} onClick={handleAdd}>
            Add Transaction
          </Button>
        </Box>

        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1}>
                  <IconTrendingUp color="green" />
                  <Typography variant="h6">Total Income</Typography>
                </Box>
                <Typography variant="h4" color="success.main">₹{totalIncome.toLocaleString()}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1}>
                  <IconTrendingDown color="red" />
                  <Typography variant="h6">Total Expenses</Typography>
                </Box>
                <Typography variant="h4" color="error.main">₹{totalExpenses.toLocaleString()}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1}>
                  <IconCreditCard />
                  <Typography variant="h6">Net Profit</Typography>
                </Box>
                <Typography variant="h4" color={netProfit >= 0 ? "success.main" : "error.main"}>
                  ₹{netProfit.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1}>
                  <IconReceipt />
                  <Typography variant="h6">Transactions</Typography>
                </Box>
                <Typography variant="h4" color="primary">{transactions.length}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Card>
          <CardContent>
            <Typography variant="h6" mb={2}>Recent Transactions</Typography>
            <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'primary.main' }}>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Type</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Description</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Category</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Amount</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Date</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions.map((transaction, index) => (
                    <TableRow key={transaction.id} sx={{ '&:nth-of-type(odd)': { backgroundColor: 'action.hover' }, '&:hover': { backgroundColor: 'action.selected' } }}>
                      <TableCell>
                        <Chip 
                          label={transaction.type} 
                          color={transaction.type === 'Income' ? 'success' : 'error'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'medium' }}>{transaction.description}</TableCell>
                      <TableCell sx={{ color: 'text.secondary' }}>{transaction.category}</TableCell>
                      <TableCell>
                        <Typography color={transaction.amount >= 0 ? "success.main" : "error.main"} sx={{ fontWeight: 'bold' }}>
                          ₹{Math.abs(transaction.amount).toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleEdit(transaction)} size="small">
                          <IconEdit />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(transaction.id)} size="small" color="error">
                          <IconTrash />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>{editTransaction ? 'Edit Transaction' : 'Add Transaction'}</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              select
              label="Type"
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              margin="normal"
              SelectProps={{ native: true }}
            >
              <option value="Income">Income</option>
              <option value="Expense">Expense</option>
            </TextField>
            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Category"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Amount"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value) || 0})}
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} variant="contained">Save</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </PageContainer>
  );
};

export default AccountingMain;