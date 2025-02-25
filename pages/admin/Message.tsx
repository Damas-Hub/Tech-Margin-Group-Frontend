import Form from '@/componnets/Form'
import StaffAccountForm from '@/componnets/StaffAccountForm'
import React from 'react'

const Message = () => {
  const [showModal, setShowModal] = React.useState(false);
  const [showStaffForm, setShowStaffForm] = React.useState(false);

  return (
    <div> 
      {showModal && <Form onClose={() => setShowModal(false)} />}
      

      {/* Buttons to open different forms */}
      <button onClick={() => setShowModal(true)}>Open Form</button>
      <button onClick={() => setShowStaffForm(true)}>Open Staff Form</button>
    </div>
  )
}

export default Message