import StaffAccountForm from '@/componnets/StaffAccountForm';
import React, { useState } from 'react';

const Message = () => {
  const [isFormOpen, setIsFormOpen] = useState(true);  

  return (
    <div>
      {isFormOpen && <StaffAccountForm onClose={() => setIsFormOpen(false)} />}
    </div>
  );
};

export default Message;
