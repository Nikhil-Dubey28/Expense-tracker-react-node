import React from 'react'

const Report = () => {
  return (
    <>
    <h1 className='text-center'>Daily Report</h1>
    <div className='container-fluid d-flex justify-content-center align-items-center'>
        
        <table className='table table-primary'>
            <thead>
                <tr>
                    <th scope='col'>DATE</th>
                    <th scope='col'>DESCRIPTION</th>
                    <th scope='col'>CATEGORY</th>
                    <th scope='col'>INCOME</th>
                    <th scope='col'>EXPENSES</th>
                </tr>
            </thead>
        </table>
    </div>

    <h1 className='text-center'>Weekly Report</h1>
    <div className='container-fluid d-flex justify-content-center align-items-center'>
        
        <table className='table table-primary'>
            <thead>
                <tr>
                    <th scope='col'>DATE</th>
                    <th scope='col'>DESCRIPTION</th>
                    <th scope='col'>CATEGORY</th>
                    <th scope='col'>INCOME</th>
                    <th scope='col'>EXPENSES</th>
                </tr>
            </thead>
        </table>
    </div>
    <br />
    <br />
    <br />
    <br />
    <br />
    <div className='d-flex justify-content-center'>
    <button className='btn btn-success rounded-3'>Download</button>
    </div>
    </>
  )
}

export default Report