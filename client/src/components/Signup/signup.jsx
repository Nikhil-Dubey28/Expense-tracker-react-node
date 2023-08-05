import React, {useState} from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import axios from 'axios'
import './signup.css'

const Signup =() =>{
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
      });
      const handleNameChange = (event) => {
        setFormData(prevFormData => ({
          ...prevFormData,
          name: event.target.value
        }));
      }
      
      const handleEmailChange = (event) => {
        setFormData(prevFormData => ({
          ...prevFormData,
          email: event.target.value
        }));
      }
      
      const handlePasswordChange = (event) => {
        setFormData(prevFormData => ({
          ...prevFormData,
          password: event.target.value
        }));
      }
      
      const handleFormSubmit = async (event) => {
        event.preventDefault();
      
        try {
          const response = await axios.post('http://localhost:3000/users/signup', formData);
          console.log(response.data);
        } catch (error) {
          console.log(error);
        }
      }
      

    return(
        <div className="container d-flex align-items-center justify-content-center vh-100">
        <div className="row justify-content-center align-items-center">
          {/* <div className="col-md-12 col-lg-12"> */}
          <div className='form-container'>
            <form className="p-5 bg-light" onSubmit={handleFormSubmit}>
              <h2 className="text-center mb-5 register-text">Register</h2>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Name</label>
                <input type="text" className="form-control" id="name" placeholder="Enter your name" name='name' required onChange={handleNameChange}/>
              </div>
  
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email address</label>
                <input type="email" className="form-control" id="email" placeholder="Enter email" name='email' required onChange={handleEmailChange} />
              </div>
  
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input type="password" className="form-control" id="password" placeholder="Password" name='password' required onChange={handlePasswordChange}/>
              </div>
                <div className='d-flex justify-content-center'>
                <button type="submit" className="btn btn-dark btn-block text-center mt-5 w-50">Sign Up</button>
                </div>
              
            </form>
          </div>
        </div>
      </div>
    )
}


export default Signup


