import Image from 'next/image'
import React from 'react'

interface HomeCardProps {
  title: string,
  subtitle: string;
  icon: string,
  className: string;
  handleClick: () => void;
}
const HomeCard = ({title, subtitle, icon, className, handleClick}: HomeCardProps) => {
  return (
    <div className={`${className} px-4 py-6 flex flex-col justify-between w-full xl:max-w-[320px] min-h-[270px] rounded-[14px] cursor-pointer`} onClick={handleClick}>
      <div className="flex-center glassmorphism size-12 rounded-[10px]">
        <Image src={icon} alt='icon' width={27} height={27}/>
      </div>
      <div className="flex flex-col gap-2">
        <h1 className='text-2xl font-bold'>{title}</h1>
        <p className='font-normal text-lg'>{subtitle}</p>
      </div>
    </div>
  )
}

export default HomeCard