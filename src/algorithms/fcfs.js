// fcfs.js - First-Come, First-Served disk scheduling algorithm
import { calculateTotalSeekTime, calculateAverageSeekTime } from './common';

/**
 * First-Come, First-Served (FCFS) disk scheduling algorithm
 * @param {Array} requests - Array of request positions
 * @param {Number} initialHeadPosition - Initial position of disk head
 * @returns {Object} Result object with seek time, average seek time, and sequence
 */
const fcfs = (requests, initialHeadPosition) => {
  // Create the sequence starting with the initial head position
  const sequence = [initialHeadPosition, ...requests];
  
  // Calculate total seek time
  const seekTime = calculateTotalSeekTime(sequence);
  
  // Calculate average seek time (divide by number of requests, not sequence length)
  const averageSeekTime = calculateAverageSeekTime(seekTime, requests.length);
  
  return {
    name: 'FCFS',
    sequence,
    seekTime,
    averageSeekTime
  };
};

export default fcfs; 