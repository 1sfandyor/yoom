import { cn } from '@/lib/utils';
import { CallControls, CallingState, CallParticipantsList, CallStatsButton, PaginatedGridLayout, SpeakerLayout, useCallStateHooks } from '@stream-io/video-react-sdk';
import React, { useState } from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LayoutList, Users } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import EndCallButton from '@/components/EndCallButton/EndCallButton';
import Loader from '@/components/Loader/Loader';

type CallLayoutType = "grid" | 'speaker-left' | 'speaker-right';


const MeetingRoom = () => {

  const [layout, setLayout] = useState<CallLayoutType>('speaker-left')
  const [showParticipants, setShowParticipants] = useState(false);
  
  const searchParams = useSearchParams()
  const isPersonalRoom = !!searchParams.get('personal');
  const {useCallCallingState} = useCallStateHooks();
  const router = useRouter();
  const callingState = useCallCallingState();

  if (callingState !== CallingState.JOINED) return <Loader/>

  const CallLayout = () => {
    switch(layout){
      case 'grid':
        return <PaginatedGridLayout/>
      case 'speaker-right': 
        return <SpeakerLayout participantsBarPosition={'left'}/>
      default: 
        return <SpeakerLayout participantsBarPosition={'right'}/>
    }
  }

  return (
    <section className='relative h-screen w-full overflow-hidden pt-4 text-white'>
      <div className='relative flex size-full items-center justify-center'>
        <div className="flex size-full max-w-[1000px] items-center">
          <CallLayout/>
        </div>
        <div className={cn(`h-[calc(100vh-86px)] hidden ml-2`, {'show-block': showParticipants})}>
          <CallParticipantsList onClose={() => setShowParticipants(false)}/>
        </div>
      </div>

      <div className="fixed bottom-0 flex w-full items-center justify-center gap-5 flex-wrap">
        <CallControls onLeave={() => {router.push('/')}}/>
        <DropdownMenu>
          <div className="flex items-center">
            <DropdownMenuTrigger className='bg-[#19232d] rounded-full p-2  hover:bg-[#323B44] cursor-pointer'>
              <LayoutList size={20} className=' text-white'/>
            </DropdownMenuTrigger>
          </div>
          <DropdownMenuContent className='border-dark-1 bg-dark-1 text-white '>
            {[
              'Grid',
              'Speaker-Left',
              'Speaker-Right'
            ].map((item, i) => (
              <div key={i}>
                <DropdownMenuItem className='hover:bg-dark-2 rounded-lg cursor-pointer' onClick={() => setLayout(item.toLocaleLowerCase() as CallLayoutType)}>
                  {item}
                </DropdownMenuItem> 
                <DropdownMenuSeparator className='border-dark-1'/>
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <CallStatsButton/>
        <button onClick={() => setShowParticipants(prev => !prev)}>
          <div className='bg-[#19232d] rounded-full p-2  hover:bg-[#323B44] cursor-pointer '>
            <Users size={20} className='text-white '/>
          </div>
        </button>
        {!isPersonalRoom && <EndCallButton/>}
      </div>
    </section>
  )
}

export default MeetingRoom