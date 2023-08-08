import React, { useState, useEffect } from 'react';
import Login from '../Login/login';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCrown } from '@fortawesome/free-solid-svg-icons';
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
    axios.get('http://localhost:3000/api/expense/getexpense', {
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

  const deleteExpense = async (id) => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.delete(`http://localhost:3000/api/expense/${id}`, {
        headers: {
          Authorization: token
        }
      })
      if (response.status === 204) {
        setExpenses((prevState) => prevState.filter((expense) => expense.id !== id))
      }

    } catch (err) {
      console.log(err)
    }
  }

  const handleBuy = async (amount) => {
    const userString = localStorage.getItem('user')
    const user = JSON.parse(userString)

    const token = localStorage.getItem('token')
    const {data :{key}} = await axios.get('http://localhost:3000/api/getkey')
  //  const {data : {order}} = await axios.post('http://localhost:3000/api/checkout',{
  //   amount 
    
  //  })
   const response = await axios.post('http://localhost:3000/api/checkout',{},{
    headers: {
      Authorization: token
    }
   })
   console.log(response)
   const {data: {order}} = response
   const options = {
    key : key, // Enter the Key ID generated from the Dashboard
    amount : "50000", // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
    currency : "INR",
    name : user.name,
    description : "Test Transaction",
    image : "https://example.com/your_logo",
    order_id : order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
    callback_url : "http://localhost:3000/api/paymentverification",
    prefill: {
        name: "Gaurav Kumar",
        email: "gaurav.kumar@example.com",
        contact: "9000090000"
    },
    notes: {
        address: "Razorpay Corporate Office"
    },
    theme: {
        "color": "#3399cc"
    }
};
const razor = new window.Razorpay(options);

    razor.open();

  }
  return (
    <>
      <nav className="navbar bg-light justify-content-center">
        
        {/* <div className="container-fluid d-flex justify-content-center align-items-center"> */}
        <div className='d-flex justify-content-center align-items-center text-center'>
          <span className="navbar-brand mb-0 expenses-title text-center"><h1 className="fw-light" style={{}}><span style={{color: "teal"}}>D</span>ay to <span style={{color: "teal"}}>D</span>ay Expenses</h1></span>
          
        </div>
        <button className='btn btn-dark text-warning rounded-5 mx-2 px-3 py-2' onClick={() => handleBuy(50)}>Buy Premium <FontAwesomeIcon icon={faCrown} /></button>
        <button className='btn btn-dark text-danger rounded-5 mx-2 px-3 py-2'>Logout</button>
      </nav>





      <div className='container-fluid d-flex justify-content-center align-items-center mt-4'>
           
          
           
         </div>

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
              <b className='fs-6 mt-3'>Amount:</b>  <span className="fs-6 badge bg-primary rounded-pill mt-3 fw-normal"> {expense.amount}</span>
              <br />
              <br />
              <b className='fs-6'>Description:</b> <span className='description-text fs-6 badge bg-warning rounded-pill fw-normal'> {expense.description}</span>
              <br />
              <br />
              <b className='fs-6'>Category:</b> <span className="fs-6 badge bg-info rounded-pill fw-normal"> {expense.category}</span>
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


