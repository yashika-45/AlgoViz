import React from 'react';
import '../styles/About.css';

const About = () => {
  return (
    <div className="about">
      <h1>About Disk Scheduling</h1>
      
      <section className="about-section">
        <h2>What is Disk Scheduling?</h2>
        <p>
          Disk scheduling is a crucial aspect of operating systems that determines the order in which
          disk I/O requests are serviced. Since disk operations are one of the slowest components in
          a computer system, efficient scheduling can significantly improve overall system performance.
        </p>
        <p>
          The goal of disk scheduling algorithms is to minimize seek time, which is the time taken to
          move the disk head from its current position to the desired cylinder where the data is located.
        </p>
      </section>
      
      <section className="about-section">
        <h2>Why is Disk Scheduling Important?</h2>
        <p>
          By optimizing disk access patterns, disk scheduling algorithms help to:
        </p>
        <ul>
          <li>Minimize head movement, reducing mechanical delays</li>
          <li>Improve throughput of the disk subsystem</li>
          <li>Reduce average response time for disk requests</li>
          <li>Ensure fairness so that no request suffers from starvation</li>
        </ul>
      </section>
      
      <section className="about-section">
        <h2>Common Disk Scheduling Algorithms</h2>
        
        <div className="algorithm-detail">
          <h3>First-Come, First-Served (FCFS)</h3>
          <p>
            The simplest approach that processes requests in the order they arrive. While fair, it often
            results in suboptimal performance due to potentially excessive head movement.
          </p>
        </div>
        
        <div className="algorithm-detail">
          <h3>Shortest Seek Time First (SSTF)</h3>
          <p>
            Selects the request that requires the least head movement from the current position. This
            approach reduces seek time but may lead to starvation of requests that are far from the head.
          </p>
        </div>
        
        <div className="algorithm-detail">
          <h3>SCAN (Elevator Algorithm)</h3>
          <p>
            The disk head moves in one direction servicing requests until it reaches the end, then
            reverses direction. This approach prevents starvation and provides better performance than FCFS.
          </p>
        </div>
        
        <div className="algorithm-detail">
          <h3>C-SCAN (Circular SCAN)</h3>
          <p>
            Similar to SCAN, but when the head reaches one end, it immediately returns to the other end
            without servicing requests on the return trip. This provides more uniform wait times than SCAN.
          </p>
        </div>
        
        <div className="algorithm-detail">
          <h3>LOOK and C-LOOK</h3>
          <p>
            Variations of SCAN and C-SCAN that only go as far as the last request in each direction,
            rather than going all the way to the physical end of the disk.
          </p>
        </div>
      </section>
      
      <section className="about-section">
        <h2>About This Visualizer</h2>
        <p>
          This disk scheduling algorithm visualizer was created to help students and professionals
          understand how different disk scheduling algorithms work. By visualizing the movement of the
          disk head and providing performance metrics, it makes it easier to compare the efficiency
          of different approaches.
        </p>
      </section>
    </div>
  );
};

export default About; 