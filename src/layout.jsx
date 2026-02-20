import React from 'react'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { Outlet } from 'react-router-dom'

export default function layout() {
  return (
    <div>
       <Header />
       
       <div className='py-25'>
        <Outlet/>
       </div>
       <Footer/>
     
    </div>
  )
}
