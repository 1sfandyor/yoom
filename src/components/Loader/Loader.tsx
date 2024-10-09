import Image from 'next/image'
import React from 'react'

const Loader = () => {
  return (
    <div className='flex-center h-screen w-full animate-spin text-blue-1'>
      <Image src={'/icons/loading-circle.svg'} alt='loader' width={24} height={24}/>
    </div>
  )
}

export default Loader