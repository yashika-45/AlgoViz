import { calculateTotalSeekTime, calculateAverageSeekTime } from './common';

/**
 * First-Come, First-Served (FCFS) disk scheduling algorithm
 * @param {Array} requests - Array of request positions
 * @param {Number} initialHeadPosition - Initial position of disk head
 * @returns {Object} Result object with seek time, average seek time, and sequence
 */
const fcfs = (requests, initialHeadPosition) => {
  const sequence = [initialHeadPosition, ...requests];
  const seekTime = calculateTotalSeekTime(sequence);
  const averageSeekTime = calculateAverageSeekTime(seekTime, requests.length);
  return {
    name: 'FCFS',
    sequence,
    seekTime,
    averageSeekTime
  };
};
export default fcfs; 