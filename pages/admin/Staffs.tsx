import StaffProfile from '@/componnets/StaffProfile'
import React from 'react'

const Staffs = () => {
  return (
    <div>Staffs
  <StaffProfile
      profilePic="https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg"
      name="John Doe"
      staffId="ST12345"
      role="Secretary"
      contactNumber="+1234567890"
    />
    </div>
  )
}

export default Staffs