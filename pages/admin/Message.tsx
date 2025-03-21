import MessageForm from '@/componnets/MessageForm';
import StaffAccountForm from '@/componnets/StaffAccountForm';
import React, { useState } from 'react';

const Message = () => {
  const [isFormOpen, setIsFormOpen] = useState(true);  

  return (
    <div>
      {/* {isFormOpen && <StaffAccountForm onClose={() => setIsFormOpen(false)} />} */}

        <MessageForm isVisible={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </div>
  );
};

export default Message;
