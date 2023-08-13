import React, { useState, useEffect } from 'react';
import Login from '../Login/login';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCrown } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import './expenses.css';
import { useNavigate } from 'react-router-dom';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [leaderboard, setLeaderboard] = useState([])
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Food');
  
  const [error, setError] = useState(null);
  const [isPremium, setIsPremium] = useState(false)
  const [showBuy, setShowBuy] = useState(true)
  const [leader, setLeader] = useState(false)

  const navigate = useNavigate()



  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');

        // Fetch user data to check if the user is premium
        const userString = localStorage.getItem('user');
        const user = JSON.parse(userString);
        setIsPremium(user.ispremiumuser);
        setShowBuy(!user.ispremiumuser);

        // Fetch expenses data
        const expensesResponse = await axios.get('http://localhost:3000/api/expense/getexpense', {
          headers: {
            Authorization: token,
          },
        });
        setExpenses(expensesResponse.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [localStorage.getItem('user')]);




  const handleSubmit = (event) => {
    event.preventDefault();
    
    setError(null);

    const token = localStorage.getItem('token'); // Get the token from local storage

    // add expense on form submission with the token in headers
    axios.post('http://localhost:3000/api/expense/addexpense', { amount, description, category }, {
      headers: {
        Authorization: token, // Pass the token in the Authorization header
      },
    })
      .then(response => {
       

        setExpenses(expenses => [...expenses, response.data]);
        // Reset form fields
        setAmount('');
        setDescription('');
        setCategory('Food');
      })
      .catch(error => {
      
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

  const handleBuy = async (e) => {
    const userString = localStorage.getItem('user')
    const user = JSON.parse(userString)

    const token = localStorage.getItem('token')
    const { data: { key } } = await axios.get('http://localhost:3000/api/getkey')
    //  const {data : {order}} = await axios.post('http://localhost:3000/api/checkout',{
    //   amount 

    //  })
    const response = await axios.post('http://localhost:3000/api/checkout', {}, {
      headers: {
        Authorization: token
      }
    })
    console.log(response)
    const { data: { order } } = response
    const options = {
      key: key, // Enter the Key ID generated from the Dashboard
      amount: "50000", // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency: "INR",
      name: user.name,
      description: "Test Transaction",
      image: "https://example.com/your_logo",
      order_id: order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      // callback_url : "http://localhost:3000/api/paymentverification",
      handler: async function (response) {



        const res = await axios.post('http://localhost:3000/api/updatetransactionstatus', {
          order_id: options.order_id,
          payment_id: response.razorpay_payment_id,
          signature_id: response.razorpay_signature_id,
        }, { headers: { Authorization: token } })


        alert('You are a Premium User')
        setShowBuy(false)
        setIsPremium(true)
        localStorage.setItem('token', res.data.token)

        const userStr = localStorage.getItem('user');
        const userObj = JSON.parse(userStr);
        userObj.ispremiumuser = true; // 

        const updatedUserString = JSON.stringify(userObj);
        localStorage.setItem('user', updatedUserString);








      },
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


    razor.on('payment.failed', function (response) {
      console.log(response)
      alert('something went wrong')
    })
  }



  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');

    navigate('/login')
  }



  const handleLeader = async () => {
    try{ 
      const token = localStorage.getItem('token')
      const response = await axios.get('http://localhost:3000/api/premium/showleaderboard',{
        headers: {
          Authorization: token
        }
      })
      setLeaderboard(response.data)
      console.log(response)
    }catch(err) {
      console.log(err)
    }
  }

  return (
    <>
      <nav className="navbar justify-content-center bg-light main-nav">

        {/* <div className="container-fluid d-flex justify-content-center align-items-center"> */}
        <div className='d-flex justify-content-center align-items-center text-center mt-2'>
          <span className="navbar-brand mb-0 expenses-title text-center"><h1 className="fw-light" style={{}}><span style={{ color: "teal" }}>E</span>xpense <span style={{ color: "teal" }}>T</span>racker</h1></span>

        </div>
        {showBuy && (

          <button className='btn btn-dark text-warning rounded-5 mx-2 px-3 py-2' onClick={() => handleBuy(50)}>Buy Premium <FontAwesomeIcon icon={faCrown} /></button>
        )}
        <button className='btn btn-dark text-danger rounded-5 mx-2 mt-2 px-3 py-2' onClick={() => handleLogout()}>Logout</button>
      </nav>





      <div className='container-fluid d-flex justify-content-center align-items-center mt-4'>

        {isPremium && (

          <p>YOU ARE A PREMIUM USER!</p>


        )}
      </div>


      {isPremium && (<><div className='container-fluid d-flex justify-content-center align-items-center mt-2'>
        <button className='btn btn-dark rounded-5 text-warning' onClick={() => {
          setLeader(prev => !prev)
          handleLeader()
          }}>
          {leader ? 'HIDE LEADERBOARD' : 'SHOW LEADERBOARD'}
          
          </button>
          
      </div>
      
     
      </>
      )}
      <br />
      {/* {leader && (
        <div className='contianer-fluid d-flex justify-content-center align-items-center'>
          <h1>LeaderBoard Page</h1>
        {leaderboard.map(item => (
           <li key={item.id} className="list-group-item"></li>
        ))}
        </div>
      )} */}
      {leader && (
        <>
    <div className='container-fluid d-flex justify-content-center align-items-center'>
        <h1>LeaderBoard Page</h1>
        <br />
       
    </div>

        <ul className="list-group">
            {leaderboard.map(item => (
                <li key={item.id} className="list-group-item"><b>Name:</b> {item.name}, <b>Expenses</b> {item.totalexpenses}</li>
            ))}
        </ul>
       </>
)}





      <br />
      <div className="container p-4 rounded div-main">
        <form className="row g-3" onSubmit={handleSubmit}>
          <div className="col-sm mx-2 rounded-2 px-3 py-2 div-amount">
            <label htmlFor="expenseAmount" className="form-label"></label>
            <input type="number" placeholder='Enter Amount' className="form-control mb-3" id="expenseAmount" name='amount' value={amount} onChange={event => setAmount(event.target.value)} />
          </div>
          <div className="col-sm mx-2 rounded-2 px-3 py-2 div-desc">
            <label htmlFor="description" className="form-label"></label>
            <input type="text" placeholder='Write a Description' className="form-control mb-3" id="description" name='description' value={description} onChange={event => setDescription(event.target.value)} />
          </div>
          <div className="col-sm mx-2 rounded-2 px-3 py-2 div-category">
            <label htmlFor="category" className="form-label"></label>
            <select className="form-select mb-3" id="category" name='category' value={category} onChange={event => setCategory(event.target.value)}>
              <option>Food</option>
              <option>Fuel</option>
              <option>Electronics</option>
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
            <li key={expense.id} className="list-group-item li-main">
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
      {isPremium && (
        <div className='container-fluid d-flex justify-content-center align-items-center mt-4'> <button className='btn btn-success rounded-5 mb-5' onClick={() => navigate('/report')}>Generate Report</button></div>
      )}
    </>
  );
};

export default Expenses;


