'use client'
import React, { useState } from 'react';
import HomeCard from '../HomeCard/HomeCard';
import { useRouter } from 'next/navigation';
import MeetingModal from '../MeetingModal/MeetingModal';
import { useUser } from '@clerk/nextjs';
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '../ui/textarea';
import ReactDatePicker from 'react-datepicker';
import { Input } from "@/components/ui/input"


const MeetingTypeList = () => {
  const router = useRouter();
  const {toast} = useToast();

  const [meetingState, setMeetingState] = useState<'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstatnMeeting' | undefined>()
  const {user} = useUser();
  const client = useStreamVideoClient();
  const [values, setValues] = useState({
    dateTime: new Date(),
    description: '',
    link: ''
  });

  const [callDetail, setCallDetails] = useState<Call>();
  
  // CREATE A CALL
  const createMeeting = async () => {
    if(!client || !user) return;

    try {
      if (!values.dateTime) {
        toast({title: 'Please select a date and time'})
        return;
      }

      const callId = crypto.randomUUID();
      const call = client.call('default', callId);
      
      if (!call) throw new Error('Failed to create call');

      const startsAt = values.dateTime.toISOString() || new Date(Date.now()).toISOString();
      const description = values.description || "InstatnMeeting";

      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: {
            description
          }
        }
      })

      setCallDetails(call);
      
      if (!values.description) {
        router.push(`/meeting/${call.id}`)
      };

      toast({title: 'Meeting Created'})
    } catch (error) {
      toast({title: "Failed to create meeting", description: error instanceof Error ? error.message : String(error)})
    }
  };

  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetail?.id}`


  return (
    <section className='grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4'>
      {/* MAIN CARDS */}
      <HomeCard title='New Meeting' subtitle='Start an instant meeting' icon='/icons/add-meeting.svg' className="bg-orange-1" handleClick={() => setMeetingState('isInstatnMeeting')}/>
      <HomeCard title='Schedule Meeting' subtitle='Plan your meeting' icon='/icons/schedule.svg' className="bg-blue-1" handleClick={() => setMeetingState('isScheduleMeeting')}/>
      <HomeCard title='View Recording' subtitle='Check out your recordings' icon='/icons/recordings.svg' className="bg-purple-1" handleClick={() => router.push('/recordings')}/>
      <HomeCard title='Join Meeting' subtitle='via invitation link' icon='/icons/join-meeting.svg' className="bg-yellow-1" handleClick={() => setMeetingState('isJoiningMeeting')}/>

      {/* MODAL */}
      {!callDetail 
        ? <MeetingModal isOpen={meetingState === 'isScheduleMeeting'} onClose={() => setMeetingState(undefined)} title={'Create Meeting'} handleClick={createMeeting}>
          <div className="flex flex-col gap-2 5">
            <label className='text-normal text-base leading-[22px] text-sky-2'>Add a description</label>
            <Textarea className='border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0' onChange={e => {setValues({...values, description: e.target.value})}}/>
          </div>
          <div className="flex flex-col gap-2 5">
            <label className='text-normal text-base leading-[22px] text-sky-2'>Select date and time</label>
            <ReactDatePicker showTimeSelect timeFormat='HH:mm' timeIntervals={15} timeCaption='time' dateFormat="MMMM d, yyyy h:mm aa" selected={values.dateTime} 
              onChange={(date) => setValues({...values, dateTime: date!})} className='w-full rounded bg-dark-3 p-2 focus:outline-none'
            />
          </div>
        </MeetingModal> 
        : <MeetingModal isOpen={meetingState === 'isScheduleMeeting'} onClose={() => setMeetingState(undefined)} title={'Meeting Created'} className="text-center"  handleClick={() => {
          navigator.clipboard.writeText(meetingLink)
          toast({title: 'Link copied'})
        }}
        image='/icons/checked.svg'
        buttonIcon='/icons/copy.svg'
        buttonText="Copy meeting Link"
        />
      }
      <MeetingModal isOpen={meetingState === 'isInstatnMeeting'} onClose={() => setMeetingState(undefined)} title={'Start an Instant Meeting'} className="text-center" buttonText="Start Meeting" handleClick={createMeeting}/>
      <MeetingModal isOpen={meetingState === 'isJoiningMeeting'} onClose={() => setMeetingState(undefined)} title={'Type the link here'} className="text-center" buttonText="Join Meeting" handleClick={() => router.push(values.link)}>
        <Input placeholder='Meeting link' className='border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0' onChange={(e) => setValues({...values, link: e.target.value})}/>
      </MeetingModal>
    
    </section>
  )
}

export default MeetingTypeList