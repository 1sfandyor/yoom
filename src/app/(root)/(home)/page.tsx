import MeetingTypeList from '@/components/MeetingTypeList/MeetingTypeList'
import React from 'react'

const Home = () => {
  const now = new Date()
  const time = now.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'})
  const date = (new Intl.DateTimeFormat('en-US', {dateStyle: 'full'})).format(now)
  
  
  return (
    <section className='flex size-full flex-col gap-10 text-white'>
      {/* BANNER */}
      <div className='w-full h-[450px] rounded-[20px] bg-hero bg-cover bg-no-repeat'>
        <div className='flex h-full flex-col justify-between max-md:px-5 max-md:py-8 lg:p-11'>
          <h2 className='glassmorphism py-2 rounded max-w-[270px] text-center text-base font-normal'>Upcoming Meeting at: {}</h2>
          <div className='flex flex-col gap-2'>
            <h1 className='text-4xl font-extrabold lg:text-7xl '>{time}</h1>
            <p className='text-lg font-medium text-sky-1 lg:text-2xl'>{date}</p>
          </div>
        </div>
      </div>

      <MeetingTypeList/>
    </section>
  )
}

export default Home