import React from 'react';
import Head from 'next/head';
import { FaGithub, FaLinkedinIn } from 'react-icons/fa';

const resume = () => {
  return (
    <>
      <Head>
        <title>Jun Kevin | Resume</title>
        <meta
          name='description'
          content='I’m a front-end web developer specializing in building (and occasionally designing) exceptional digital experiences.'
        />
        <link rel='icon' href='/fav.png' />
      </Head>

      <div className='max-w-[940px] mx-auto p-2 pt-[120px]'>
        <h2 className='text-center'>Resume</h2>
        <div className='bg-gradient-to-r from-[#ff69b4] to-[#FFB6C1] my-4 p-4 w-full flex justify-between items-center'>
          <h2 className='text-center'>Jun Kevin</h2>
          <div className='flex'>
            <a
              href='https://www.linkedin.com/in/junkevin06/'
              target='_blank'
              rel='noreferrer'
            >
              <FaLinkedinIn size={20} style={{ marginRight: '1rem' }} />
            </a>
            <a
              href='https://github.com/junkevin88'
              target='_blank'
              rel='noreferrer'
            >
              <FaGithub size={20} style={{ marginRight: '1rem' }} />
            </a>
          </div>
        </div>
        <div className='text-center py-4 text-xl font-bold uppercase tracking-wider'>
          <div className='hidden sm:block'>
            <p>
            Backend Developer<span className='px-1'>|</span> ERP Consultant{' '}
              <span className='px-1'>|</span> Complex Problem Solving
            </p>
          </div>
          <div className='block sm:hidden'>
            <p>Backend Developer</p>
            <p className='py-2'>ERP Consultant</p>
            <p>Complex Problem Solving</p>
          </div>
        </div>
        <p className='text-justify'>
        Jun Kevin is a recent accounting graduate with a deep understanding of accounting, finance, and taxation. He is skilled in Java (Spring Boot), PHP (Laravel), and JavaScript (React.js, Next.js, Node.js), with experience in Enterprise Resource Planning and FAT (Finance, Accounting and Tax).
        </p>

        <p className='text-justify'>
        He is passionate about programming and interested in pursuing a career in IT roles. With strong problem-solving abilities and a willingness to learn, he is a valuable asset to any technical team. Currently, he is seeking opportunities to combine his programming skills and accounting knowledge to excel in a career as a programmer, analyst, or consultant.
        </p>

        {/* Skills */}
        <div className='text-center py-4'>
          <h5 className='text-center underline text-[18px] py-2'>Skills</h5>
          <p className='py-2'>
            <span className='font-bold'>IT Technical Skills</span>
            <span className='px-2'>|</span>Backend Engineer
            <span className='px-2'>|</span>Java 
            <span className='px-2'>|</span>Spring Boot 
            <span className='px-2'>|</span>PHP 
            <span className='px-2'>|</span>Laravel
            <span className='px-2'>|</span>Javascript
            <span className='px-2'>|</span>React
            <span className='px-2'>|</span>Next JS
            <span className='px-2'>|</span>Node JS
            <span className='px-2'>|</span>SQL
            <span className='px-2'>|</span>NoSQL
            <span className='px-2'>|</span>Tailwind
            <span className='px-2'>|</span> Firebase
            <span className='px-2'>|</span> RESTAPI
          </p>
          <p className='py-2'>
            <span className='font-bold'>Other Technical Skills</span>
            <span className='px-2'>|</span>Financial Accounting
            <span className='px-2'>|</span>Taxation and E-SPT
            <span className='px-2'>|</span>MS Office
            <span className='px-2'>|</span>Google Suite
            <span className='px-2'>|</span>Accounting Software
            <span className='px-2'>|</span>ERP Software
          </p>
        </div>

        <h5 className='text-center underline text-[18px] py-4'>
          Professional Experience
        </h5>
        {/* Experience */}
        <div className='py-6 text-justify'>
          <p className='italic '>
            <span className='font-bold italic'>
            HashMicro Pte. Ltd.
            </span>
            <span className='px-2'>|</span>Jakarta, Indonesia
          </p>
          <p className='py-1 italic'>ERP Consultant (Aug 2022 - Dec 2022)</p>
          <ul className='list-disc list-outside px-7 py-1 leading-relaxed'>
            <li >
            Work on 2 concurrent projects for a manufacturing company with 2 branches and a construction company with 1 parent and 11 subsidiaries
            </li>
            <li>
            Attend weekly client meetings to provide progress updates on projects and gather feedback
            </li>
            <li>
            Demonstrate proficiency in 5 modules including accounting, manufacturing, purchasing, construction, and sales
            </li>
            <li>
            Collaborate with cross-functional teams to ensure seamless integration of ERP systems
            </li>
            <li>
            Stay up-to-date with industry trends and best practices to continuously improve ERP solutions for clients
            </li>
          </ul>
        </div>


        {/* Personal Experience */}
        <div className='py-6'>
          <p className='italic'>
          <span className='font-bold italic'>
            PT. Catatbuku Indonesia
            </span>
            <span className='px-2'>|</span>Jakarta, Indonesia
          </p>
          <p className='py-1 italic'>Accountant (Jan 2022 - Jan 2023)</p>
          <ul className='list-disc list-outside px-7 py-1 leading-relaxed'>
            <li>
            Produced financial and tax report, analyzed and evaluated financial performance of 2 manufacturing SMEs from January to June
            </li>
            <li>
            Guide clients for the computed journal in accounting software and built calculator for a client using Excel to help them prioritize their financial projection
            </li>
            <li>
            Maintained company general ledger monthly close processes and account reconciliations through 20% YoY average revenue growth
            </li>
          </ul>
        </div>

        {/*  */}
        <h5 className='text-center underline text-[18px] py-4'>
          Other Professional Experience
        </h5>
      
        {/* Experience */}
        <div className='py-6'>
          <p className='italic'>
          <span className='font-bold italic'>
            SYNRGY Academy Batch 5
            </span>
            <span className='px-2'>|</span>Indonesia
          </p>
          <p className='py-1 italic'>Backend Engineering Java (Sep 2022 – Feb 2023)</p>
            <p className ='text-justify'>As a Backend Engineering Bootcamp graduate, I have gained hands-on experience in developing backend applications using Java programming language and Spring Boot framework. I have also acquired knowledge of various databases such as PostgreSQL, MySQL, SQLite, and NoSQL databases such as MongoDB. In addition, I have experience working with Apache Kafka for building scalable and distributed applications and implementing software design patterns such as MVC. I am also familiar with designing, implementing and deploying microservices-based applications and have experience using version control tools such as Git. Moreover, I have learned how to containerize and deploy applications using Docker for faster and easier deployment to different environments. I am now excited to apply my skills and knowledge to real-world projects in the industry.</p>
        </div>
      </div>
    </>
  );
};

export default resume;
