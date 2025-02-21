import Form from '@/componnets/Form'
import StaffAccountForm from '@/componnets/StaffAccountForm'
import React from 'react'

const Message = () => {
  const [showModal, setShowModal] = React.useState(false);

  return (
    <div> 
      <StaffAccountForm />
      {<Form onClose={() => setShowModal(false)} />}


       
    </div>
  )
}

export default Message