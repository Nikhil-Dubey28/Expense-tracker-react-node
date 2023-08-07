import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import './expenses.css';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Food');
   // New state variable for handling errors
   const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token')
    // fetch expenses on component mount
    axios.get('http://localhost:3000/api/expense/getexpense',{
      headers: {
        Authorization: token
      }
    })
      .then((response) => {
        setExpenses(response.data)
        console.log(response.data)
      })
      .catch(error => console.error(error));
  }, []);

  // const handleSubmit = (event) => {
  //   event.preventDefault();
  //   // add expense on form submission
  //   axios.post('http://localhost:3000/api/expense/addexpense', { amount, description, category })
  //     .then(response => setExpenses(expenses => [...expenses, response.data]))
  //     .catch(error => console.error(error));
  //   // reset form fields
  //   setAmount('');
  //   setDescription('');
  //   setCategory('Food');
  // };
  const handleSubmit = (event) => {
    event.preventDefault();
    // Clear any previous errors
    setError(null);

    const token = localStorage.getItem('token'); // Get the token from local storage

    // add expense on form submission with the token in headers
    axios.post('http://localhost:3000/api/expense/addexpense', { amount, description, category }, {
      headers: {
        Authorization: token, // Pass the token in the Authorization header
      },
    })
      .then(response => {
        // Update expenses on successful response
        setExpenses(expenses => [...expenses, response.data]);
        // Reset form fields
        setAmount('');
        setDescription('');
        setCategory('Food');
      })
      .catch(error => {
        // Handle error and set the error state
        if (error.response && error.response.data && error.response.data.message) {
          setError(error.response.data.message);
        } else {
          setError('An error occurred while adding the expense.');
        }
      });
  };

  const deleteExpense  = async(id) => {
    try {
      const token = localStorage.getItem('token')
    const response =  await axios.delete(`http://localhost:3000/api/expense/${id}`,{
        headers: {
          Authorization: token
        }
      })
      if(response.status === 204){
        setExpenses((prevState) => prevState.filter((expense) => expense.id !== id ) )
      }
      
    }catch (err){
      console.log(err)
    }
  }

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
            <button type="submit" className="btn btn-dark mt-3 rounded-5">+ Add Expense</button>
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
              <span className='description-text'><b>Description:</b> {expense.description}</span>
              <br />
              <br />
              <b>Category:</b> <span className="badge bg-primary rounded-pill"> {expense.category}</span>
              <br />
              <br />
              <button className='btn btn-danger mt-3 mb-2 rounded-5' onClick={() => deleteExpense(expense.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Expenses;


