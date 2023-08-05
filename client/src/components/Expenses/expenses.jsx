import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import './expenses.css';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Food');

  useEffect(() => {
    // fetch expenses on component mount
    axios.get('http://localhost:3000/api/expense/getexpense')
      .then(response => setExpenses(response.data))
      .catch(error => console.error(error));
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    // add expense on form submission
    axios.post('http://localhost:3000/api/expense/addexpense', { amount, description, category })
      .then(response => setExpenses(expenses => [...expenses, response.data]))
      .catch(error => console.error(error));
    // reset form fields
    setAmount('');
    setDescription('');
    setCategory('Food');
  };

  return (
    <>
      <nav className="navbar bg-body-tertiary">
        <div className="container-fluid d-flex justify-content-center">
          <span className="navbar-brand mb-0 expenses-title">Day to Day Expenses</span>
        </div>
      </nav>
      <br />
      <div className="container bg-light p-4 rounded">
        <form className="row g-3" onSubmit={handleSubmit}>
          <div className="col-sm">
            <label htmlFor="expenseAmount" className="form-label">Expense Amount</label>
            <input type="number" className="form-control" id="expenseAmount" name='amount' value={amount} onChange={event => setAmount(event.target.value)} />
          </div>
          <div className="col-sm">
            <label htmlFor="description" className="form-label">Description</label>
            <input type="text" className="form-control" id="description" name='description' value={description} onChange={event => setDescription(event.target.value)} />
          </div>
          <div className="col-sm">
            <label htmlFor="category" className="form-label">Category</label>
            <select className="form-select" id="category" name='category' value={category} onChange={event => setCategory(event.target.value)}>
              <option>Food</option>
              <option>Petrol</option>
              <option>Salary</option>
              <option>Movie</option>
              <option>Grocery</option>
              <option>Others</option>
            </select>
          </div>
          <div className="col-12">
            <button type="submit" className="btn btn-dark">Add Expense</button>
          </div>
        </form>
        {/* display list of expenses */}
        <ul className="list-group mt-4">
          {expenses.map(expense => (
            // <li key={expense.id} className="list-group-item d-flex justify-content-between align-items-center">
             <li key={expense.id} className="list-group-item"> 
            <b>Amount:</b>  <span className="badge bg-primary rounded-pill"> {expense.amount}</span>
              <br />
              <br />
              <span><b>Description:</b> {expense.description}</span>
              <br />
              <br />
              <b>Category:</b> <span className="badge bg-primary rounded-pill"> {expense.category}</span>
              <br />
              <br />
              <button className='btn btn-danger mt-3'>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Expenses;
