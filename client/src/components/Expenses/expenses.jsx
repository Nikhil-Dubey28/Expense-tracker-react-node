import React, { useState, useEffect, useRef } from 'react';
import Login from '../Login/login';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactPaginate from 'react-paginate'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCrown } from '@fortawesome/free-solid-svg-icons';
import { faFire } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import './expenses.css';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';


const Expenses = () => {
  const [showEdit, setShowEdit] = useState(true)
  const [showSave,setShowSave] = useState(false)
  const [expenses, setExpenses] = useState([]);
  const [editState , setEditState] = useState(expenses.map(() => false))
  const [pageCount, setPageCount]= useState(1)
  const currentPage = useRef()
  const [limit,setLimit] = useState(5)
  const [leaderboard, setLeaderboard] = useState([])
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Food');
  
  const [error, setError] = useState(null);
  const [isPremium, setIsPremium] = useState(false)
  const [showBuy, setShowBuy] = useState(true)
  const [leader, setLeader] = useState(false)
  const [report, setReport] = useState(false)

  const navigate = useNavigate()

const user = JSON.parse(localStorage.getItem('user'))

  useEffect(() => {
    currentPage.current = 1
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');

        // Fetch user data to check if the user is premium
        const userString = localStorage.getItem('user');
        const user = JSON.parse(userString);
        setIsPremium(user.ispremiumuser);
        setShowBuy(!user.ispremiumuser);

        // Fetch expenses data
        const expensesResponse = await axios.get('http://3.111.217.82:3000/api/expense/getexpense', {
          headers: {
            Authorization: token,
          },
        });
        setExpenses(expensesResponse.data);
      } catch (error) {
        console.error(error);
      }
    };

    // fetchData();
    getPaginatedExpenses()
  }, [localStorage.getItem('user')]);


const toggleEditState = (index) => {
  const newEditState = [...editState]
  newEditState[index] = !newEditState[index]
  setEditState(newEditState)
}

  const handleSubmit = (event) => {
    event.preventDefault();
    
    setError(null);

    const token = localStorage.getItem('token'); // Get the token from local storage

    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();

    // add leading zeros to day and month if needed
    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;

    // create the date string in date-month-year format
    const dateStr = `${formattedDay}-${formattedMonth}-${year}`;

    // add expense on form submission with the token in headers
    axios.post('http://3.111.217.82:3000/api/expense/addexpense', { amount, description, category,date:dateStr }, {
      headers: {
        Authorization: token, // Pass the token in the Authorization header
      },
    })
      .then(response => {
      
        const updatedExpenses = [...expenses]
        updatedExpenses.unshift(response.data)
        // setExpenses(expenses => [...expenses, response.data]);
        // setExpenses(updatedExpenses)
        // Reset form fields

         // Check if the total number of expenses exceeds the current page's limit
         if (updatedExpenses.length > limit) {
          // Fetch the latest expenses with updated pagination
          getPaginatedExpenses();
      } else {
          // Update the expenses state without fetching
          setExpenses(updatedExpenses);
      }
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
      const response = await axios.delete(`http://3.111.217.82:3000/api/expense/${id}`, {
        headers: {
          Authorization: token
        }
      })
      if (response.status === 204) {
        setExpenses((prevState) => prevState.filter((expense) => expense.id !== id))
        // Check if the total number of expenses after deletion falls below the limit
      //   if (expenses.length - 1 < limit * (currentPage.current - 1)) {
      //     // Fetch the latest expenses with updated pagination
      //     getPaginatedExpenses();
      // } else {
      //     // Update the expenses state without fetching
      //     setExpenses((prevState) => prevState.filter((expense) => expense.id !== id));
      // }
      getPaginatedExpenses()
      }

    } catch (err) {
      console.log(err)
    }
  }

  const editExpense = async(id,e) => {
    try {
      // deleteExpense(id)
      console.log(e)
      const token = localStorage.getItem('token')
     const response = await axios.get(`http://3.111.217.82:3000/api/expense/getexpense/${id}`,{
      headers: {
        Authorization : token
      }
     })
     console.log(response.data)
     setAmount(response.data.amount)
     setCategory(response.data.category)
     setDescription(response.data.description)



   
    }catch(err) {

    }
  }

 const handleSave = async(e) => {
e.preventDefault()
 }






  



  const handlePageClick = async(e) => {
    console.log(e)
   currentPage.current = e.selected+1
    getPaginatedExpenses()
  }

  const getPaginatedExpenses = async () => {
    try {
      

      const token = localStorage.getItem('token');

      const userString = localStorage.getItem('user');
      const user = JSON.parse(userString);
      setIsPremium(user.ispremiumuser);
      setShowBuy(!user.ispremiumuser);

      // Fetch expenses data
      const response = await axios.get(`http://3.111.217.82:3000/api/expense/paginated?page=${currentPage.current}&limit=${limit}`, {
        headers: {
          Authorization: token,
        },
      });
      setPageCount(response.data.pageCount);
      setExpenses(response.data.result)
      console.log(response.data)
    } catch (error) {
      console.error(error);
    }
  }

 

  const changeLimit = () => {
  

      getPaginatedExpenses()
    
  }

  return (
    <>
        {/* <div className="container-fluid d-flex justify-content-center align-items-center"> */}
      {/* <nav className="navbar justify-content-center main-nav">

        <div className='d-flex justify-content-center align-items-center text-center mt-2'>
          <span className="navbar-brand mb-0  text-center"><h1 className="fw-light expense-title mx-3" style={{}}><span style={{ color: "teal" }}>E</span>xpense <span style={{ color: "teal" }}>T</span>racker</h1></span>

        </div>
       
      <button className='btn btn-outline-dark text-danger rounded-5 mx-2 py-2 px-5' onClick={() => handleLogout()}>Logout</button>
      </nav> */}
      <Navbar />
    

      <h3 className='mt-5 text-center fw-light'>Welcome {user.name}!</h3>
        {/* {showBuy && (

          <button className='btn btn-outline-dark text-warning rounded-5 mx-2 py-2 px-5 mt-3' onClick={() => handleBuy(50)}>Buy Premium <FontAwesomeIcon icon={faCrown} /></button>
        )} */}
        





      <div className='container-fluid d-flex justify-content-center align-items-center mt-4'>

        {isPremium && (

          <p className='mt-5'>YOU ARE A PREMIUM USER! <FontAwesomeIcon icon={faCrown} /></p>


        )}
      </div>


      {/* {(<><div className='container-fluid d-flex justify-content-center align-items-center mt-2'>
        <button className='btn btn-outline-dark rounded-5 text-warning pt-2 px-5' onClick={() => {
          setLeader(prev => !prev)
          handleLeader()
          }}>
          {leader ? 'HIDE LEADERBOARD' : 'SHOW LEADERBOARD'}
          
          </button>
          
      </div>
      
     
      </>
      )} */}

{/* {(<><div className='container-fluid d-flex justify-content-center align-items-center mt-2'>
        <button className='btn btn-outline-dark rounded-5 text-warning pt-2 px-5' onClick={handleLeader}>
          {leader ? 'HIDE LEADERBOARD' : 'SHOW LEADERBOARD'}
          
          </button>
          
      </div>
      
     
      </>
      )} */}
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
        {isPremium && (<h1>LeaderBoard: </h1>)}
        <br />
       
    </div>

        <ul className="list-group">
            {isPremium ? leaderboard.map(item => (
                <li key={item.id} className="list-group-item"><b>Name:</b> {item.name}, <b>Expenses</b> {item.totalexpenses}</li>
            )): <p>You are not a premium user</p> }
        </ul>
       </>
)}





      <br />
      <div className="container p-4 rounded div-main">
        <form className="row g-3" onSubmit={handleSubmit}>
       
          <div className="col-sm mx-2 rounded-2 px-3 py-2 div-amount">
            <label htmlFor="expenseAmount" className="form-label"></label>
            <input type="number" placeholder='Enter Amount' className="form-control mb-3 input-expense" id="expenseAmount" name='amount' value={amount} onChange={event => setAmount(event.target.value)} required />
          </div>
          <div className="col-sm mx-2 rounded-2 px-3 py-2 div-desc">
            <label htmlFor="description" className="form-label"></label>
            <input type="text" placeholder='Write a Description' className="form-control mb-3 input-desc" id="description" name='description' value={description} onChange={event => setDescription(event.target.value)} required/>
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
          <div className='d-flex justify-content-center'>
          {/* <div className="col-12"> */}
            
            
              {/* <button type="btn" className="btn btn-dark mt-3 rounded-5 py-3 px-5" onClick={handleSave}>Save</button> */}
            <button type="submit" className="btn btn-dark mt-3 rounded-5 py-3 px-5">+ Add Expense</button>
          </div>
          {/* </div> */}
        </form>
        {/* display list of expenses */}
        {/* <ul className="list-group mt-4">
          
          {expenses.length?expenses.map(expense => (
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
          )) : <h2 className='fw-light text-center mt-5'>No Expenses Added</h2> }
        </ul> */}
         <div className="container mt-4 p-3 justify-content-evenly" id="table">
    <table id="example" className="table table-hover" style={{ width: '100%' }}>
      <thead id="tableHead">
        <tr>
          <th scope="col" className="rounded-start">Date</th>
          <th scope="col">Amount</th>
          <th scope="col">Description</th>
          <th scope="col">Category</th>
          <th scope="col" className="rounded-end"></th>
        </tr>
      </thead>
      {/* <br /> */}
      
      <tbody id="tbodyId">
      {expenses.map((expense,index) => (
    <tr key={expense.id}>
      <td><h5 className='fw-light mt-2'>{expense.createdAt.slice(0,-14).toString().split('-').reverse().join('-')}</h5></td>
      <td> <h5 className='fw-light mt-2'>{expense.amount}</h5></td>
      <td> <h5 className='fw-light mt-2'>{expense.description}</h5></td>
      <td> <h5 className='fw-light mt-2'>{expense.category}</h5></td>
      <td>
        {showEdit && (<button className="editDelete btn btn-secondary rounded-5 mx-2" onClick={() => {
          // toggleEditState(index)
          // if(!editState[index])
          // editExpense(expense.id)
          navigate(`/edit/${expense.id}`)
         
          }}>Edit</button>)}
      
        <button className='btn btn-danger mx-2 rounded-5' onClick={() => deleteExpense(expense.id)}>Delete</button>
      </td>
    </tr>
  ))}
      </tbody>
    </table>
    
    {!expenses.length && (
      <h2 className='fw-light text-center mt-5'>No expenses to show</h2>
    )}
</div>
<br />
<br />
<br />
 <ReactPaginate
        breakLabel="..."
        nextLabel="next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={pageCount}
        previousLabel="< previous"
        // renderOnZeroPageCount={}
        marginPagesDisplayed={2}
           
            containerClassName="pagination justify-content-center"
            pageClassName="page-item"
            pageLinkClassName="page-link"
            previousClassName="page-item"
            previousLinkClassName="page-link"
            nextClassName="page-item"
            nextLinkClassName="page-link"
            activeClassName="active"
      />
      <input type ='number' onChange={e => setLimit(e.target.value)}/>
        <button className='btn btn-outline-dark rounded-2 mx-2' onClick={changeLimit}>Set Limit per page</button>
      </div>

      {/* { (

        <div className='container-fluid d-flex justify-content-center align-items-center mt-4'> <button className='btn btn-success rounded-5 mb-5' onClick={() => navigate('/report')}>Generate Report</button></div>
      )}

      {showBuy && (
<div className='container-fluid d-flex justify-content-center align-items-center mb-4'><button className='btn btn-outline-dark text-warning rounded-5 mx-2 py-2 px-5 mt-3' onClick={() => handleBuy(50)}>Buy Premium <FontAwesomeIcon icon={faCrown} /></button></div>

)} */}
    </>
  );
};

export default Expenses;


