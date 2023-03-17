import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import kosankuImg from '../public/assets/projects/kosanku.png';
import auditcampImg from '../public/assets/projects/auditcamp.png'
import netflixImg from '../public/assets/projects/netflix.jpg'
import twitchImg from '../public/assets/projects/twitch.jpg'
import ProjectItem from './ProjectItem';

const Projects = () => {
  return (
    <div id='projects' className='w-full'>
      <div className='max-w-[1240px] m-auto px-2 py-24 '>
        <p className='text-xl tracking-widest uppercase text-[#ff69b4]'>
          Projects
        </p>
        <h2 className='py-4'>What I&apos;ve Built</h2>
        <div className='grid md:grid-cols-2 gap-8'>
          <ProjectItem
            title='Kosanku'
            backgroundImg={kosankuImg}
            projectUrl='/kosanku'
            tech='Java Spring Boot'
          />
          <ProjectItem
            title='AuditCamp'
            backgroundImg={auditcampImg}
            projectUrl='/auditcamp'
            tech='Laravel'

          />
          <ProjectItem
            title='VIX BTPN'
            backgroundImg={auditcampImg}
            projectUrl='/btpn'
            tech='Java Spring Boot'

          />
          <ProjectItem
            title='VIX id/x partners'
            backgroundImg={auditcampImg}
            projectUrl='/idxpartners'
            tech='Jupyter Notebook'

          />
          <ProjectItem
            title='NontonLegal21 
            (Coming Soon)'
            backgroundImg={netflixImg}
            projectUrl='/nontonlegal21'
            tech='React JS + Java Spring Boot'

          />
          <ProjectItem
            title='Kalkulasi.tech 
            (Coming Soon)'
            backgroundImg={twitchImg}
            projectUrl='/kalkulasi'
            tech='Next JS + Java Spring Boot'

          />
        </div>
      </div>
    </div>
  );
};

export default Projects;
