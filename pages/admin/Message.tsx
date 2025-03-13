 import StaffAccountForm from '@/componnets/StaffAccountForm'
import React from 'react'
 
 const Message = () => {
   return (
     <div>
      <StaffAccountForm onClose={() => { /* handle close */ }} />
     </div>
   )
 }
 
 export default Message