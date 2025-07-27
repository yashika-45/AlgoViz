import React from 'react';
import { useLocation } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import '../styles/Learn.css';

const Learn = () => {
  const location = useLocation();
  const section = location.state?.section || 'both'; // default: show both
  const downloadPDF = () => {
  const input = document.getElementById('learn-content');
  html2canvas(input, { scale: 2 }).then((canvas) => {
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('OS_Algorithms_Learn_Guide.pdf');
  });
};

  return (
    <div className="learn-wrapper">
       <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
    <button onClick={downloadPDF} className="download-btn">Download PDF</button>
  </div>
  <div id='learn-content'>
    {(section === 'disk' || section === 'both') && (
        <section className="learn-section">
          <h2 className="section-heading">💽 Disk Scheduling Algorithms</h2>
          <p>
            Disk scheduling determines the sequence in which disk I/O requests are handled to minimize seek time, improve throughput, and optimize performance. In operating systems, this is critical for handling multiple disk access requests efficiently.
          </p>

          <h3>📌 Why Disk Scheduling Matters</h3>
          <ul>
            <li>Reduces average seek time and latency</li>
            <li>Improves system responsiveness and I/O throughput</li>
            <li>Optimizes performance in multitasking environments</li>
          </ul>

          <h3>⚙️ Common Disk Scheduling Algorithms</h3>
          <ul>
            <li><strong>FCFS (First-Come-First-Serve):</strong> Services requests in the order they arrive. Simple but can be inefficient due to long seeks.</li>
            <li><strong>SSTF (Shortest Seek Time First):</strong> Chooses the request closest to the current head position. Reduces seek time but may lead to starvation.</li>
            <li><strong>SCAN (Elevator Algorithm):</strong> Head moves in one direction, servicing requests until end, then reverses. Reduces starvation.</li>
            <li><strong>C-SCAN (Circular SCAN):</strong> Like SCAN, but returns to the start without servicing in reverse, ensuring uniform wait time.</li>
            <li><strong>LOOK / C-LOOK:</strong> Optimized SCAN variants that reverse or jump based on actual request positions.</li>
          </ul>

          <h3>📊 Algorithm Comparison</h3>
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Algorithm</th>
                <th>Efficiency</th>
                <th>Starvation Risk</th>
                <th>Fairness</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>FCFS</td>
                <td>Low</td>
                <td>None</td>
                <td>High</td>
              </tr>
              <tr>
                <td>SSTF</td>
                <td>Medium</td>
                <td>High</td>
                <td>Low</td>
              </tr>
              <tr>
                <td>SCAN</td>
                <td>High</td>
                <td>Low</td>
                <td>Medium</td>
              </tr>
              <tr>
                <td>C-SCAN</td>
                <td>High</td>
                <td>Low</td>
                <td>High</td>
              </tr>
            </tbody>
          </table>
        </section>
      )}

      {(section === 'page' || section === 'both') && (
        <section className="learn-section">
          <h2 className="section-heading">📄 Page Replacement Algorithms</h2>
          <p>
            Page replacement algorithms help an operating system manage memory efficiently by deciding which memory pages to evict when a new page needs to be loaded. They're essential for virtual memory systems where physical memory is limited.
          </p>

          <h3>📌 Why Page Replacement is Needed</h3>
          <ul>
            <li>Limited RAM means pages must be swapped in and out of memory</li>
            <li>Proper eviction policy reduces page faults</li>
            <li>Improves overall process execution and system performance</li>
          </ul>

          <h3>⚙️ Key Algorithms Explained</h3>
          <ul>
            <li><strong>FIFO (First-In-First-Out):</strong> Removes the oldest page in memory. Simple but can suffer from Belady’s Anomaly.</li>
            <li><strong>LRU (Least Recently Used):</strong> Removes the page that hasn’t been used in the longest time. Closer to optimal in practice.</li>
            <li><strong>Optimal:</strong> Evicts the page that won’t be used for the longest future time. Theoretical best but requires future knowledge.</li>
            <li><strong>Clock:</strong> Approximation of LRU using a circular queue and reference bits for performance.</li>
          </ul>

          <h3>📊 Algorithm Comparison</h3>
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Algorithm</th>
                <th>Complexity</th>
                <th>Page Fault Rate</th>
                <th>Practicality</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>FIFO</td>
                <td>Low</td>
                <td>High</td>
                <td>Easy</td>
              </tr>
              <tr>
                <td>LRU</td>
                <td>High</td>
                <td>Medium</td>
                <td>Good</td>
              </tr>
              <tr>
                <td>Optimal</td>
                <td>Very High</td>
                <td>Lowest</td>
                <td>Theoretical</td>
              </tr>
              <tr>
                <td>Clock</td>
                <td>Medium</td>
                <td>Medium</td>
                <td>Very Good</td>
              </tr>
            </tbody>
          </table>
        </section>
      )}
  </div>
    </div>
  );
};

export default Learn;
