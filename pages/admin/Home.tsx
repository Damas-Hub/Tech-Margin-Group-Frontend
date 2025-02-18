 import LiveData from '@/componnets/LiveData'
import { MessageCircle, Users } from 'lucide-react'
import React from 'react'
 
 const Home = () => {
   return (
   <div className="flex gap-4">
      <LiveData icon={<Users className="w-8 h-8 text-blue-600" />} number={50} text="Clients Today" />
      <LiveData icon={<Users className="w-8 h-8 text-green-600" />} number={5} text="Staffs" />
      <LiveData icon={<MessageCircle className="w-8 h-8 text-red-600" />} number={10} text="Messages" />
    </div>
   )
 }
 
 export default Home