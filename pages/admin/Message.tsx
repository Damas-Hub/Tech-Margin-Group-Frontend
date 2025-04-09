import MessageForm from '@/componnets/MessageForm';
import React, { useState } from 'react';

const Message = () => {
  const [isFormOpen, setIsFormOpen] = useState(true);  

  return (
    <div>
      {/* {isFormOpen && <StaffAccountForm onClose={() => setIsFormOpen(false)} />} */}

        {<MessageForm isVisible={isFormOpen} onClose={() => setIsFormOpen(false)} />}
    </div>
  );
};

export default Message;
