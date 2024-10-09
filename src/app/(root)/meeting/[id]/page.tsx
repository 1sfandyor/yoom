'use client';
import MeetingRoom from '@/components/(Meetings)/MeetingRoom/MeetingRoom';
import MeetingSetup from '@/components/(Meetings)/MeetingSetup/MeetingSetup';
import Loader from '@/components/Loader/Loader';
import { useGetCallById } from '@/hooks/useGetCallById';
import { useUser } from '@clerk/nextjs'
import { StreamCall, StreamTheme } from '@stream-io/video-react-sdk';
import React, { useState } from 'react'

const Meeting = ({params: {id}}: {params: {id: string}}) => {

  const {isLoaded} = useUser();
  const [isSetupComplete, setIsSetupComplete] = useState(false)

  const {call, isCallLoading} = useGetCallById(id);

  if (!isLoaded || isCallLoading) return <Loader/>
  return (
    <main className='w-full h-screen'>
      <StreamCall call={call}>
        <StreamTheme>
          {
            !isSetupComplete 
            ? <MeetingSetup setIsSetupComplete={setIsSetupComplete}/>
            : <MeetingRoom/>
          }
        </StreamTheme>
      </StreamCall>
    </main>
  )
}

export default Meeting