import Link from 'next/link';
import React from 'react';
import { AiOutlineMail } from 'react-icons/ai';
import { BsFillPersonLinesFill } from 'react-icons/bs';
import { FaGithub, FaLinkedinIn } from 'react-icons/fa';
import dynamic from 'next/dynamic';
import Typewriter from 'typewriter-effect';




const Main = () => {
  return (
    <div id='home' className='w-full h-screen text-center'>
      <div className='max-w-[1240px] w-full h-full mx-auto p-2 flex justify-center items-center'>
        <div>
          <h1 className='py-4 text-gray-300'>
            Hi, I&#39;m <span className='text-[#ff69b4]'> Jun</span>
          </h1>


          <h1 className='py-2 text-gray-300'>
          <Typewriter
        options={{
          strings: ['Backend Developer', 'Accountant', 'ERP Consultant', 'Lifelong Learner'],
          autoStart: true,
          loop: true,
          deleteSpeed: 50,
          delay: 100,
        }}
      />
          </h1>
          <p className='py-4 text-gray-200 sm:max-w-[70%] m-auto'>
            I’m focused on developing back-end technologies and integrating finance world to IT. I’m also interested in learning to build something that is useful for others.
          </p>
          <div className='flex items-center justify-between max-w-[330px] m-auto py-4'>
            <a
              href='https://www.linkedin.com/in/junkevin06/'
              target='_blank'
              rel='noreferrer'
            >
              <div className='rounded-full shadow-lg  shadow-pink-400 p-6 cursor-pointer hover:scale-110 ease-in duration-300'>
                <FaLinkedinIn />
              </div>
            </a>
            <a
              href='https://github.com/junkevin88'
              target='_blank'
              rel='noreferrer'
            >
              <div className='rounded-full shadow-lg  shadow-pink-400 p-6 cursor-pointer hover:scale-110 ease-in duration-300'>
                <FaGithub />
              </div>
            </a>
            <Link href='mailto:junkevin88@gmail.com'>
              <div className='rounded-full shadow-lg  shadow-pink-400 p-6 cursor-pointer hover:scale-110 ease-in duration-300'>
                <AiOutlineMail />
              </div>
            </Link>
            <Link href='/resume'>
              <div className='rounded-full shadow-lg  shadow-pink-400 p-6 cursor-pointer hover:scale-110 ease-in duration-300'>
                <BsFillPersonLinesFill />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
