// cscan.js - C-SCAN (Circular SCAN) disk scheduling algorithm
import { calculateTotalSeekTime, calculateAverageSeekTime } from './common';

/**
 * C-SCAN (Circular SCAN) disk scheduling algorithm
 * @param {Array} requests - Array of request positions
 * @param {Number} initialHeadPosition - Initial position of disk head
 * @returns {Object} Result object with seek time, average seek time, and sequence
 */
const cscan = (requests, initialHeadPosition) => {
  // Create a copy of the requests
  const allPositions = [...requests];
  
  // Define disk boundaries
  const diskSize = 200;
  const minCylinder = 0;
  const maxCylinder = diskSize - 1;
  
  // Sort all positions in ascending order
  allPositions.sort((a, b) => a - b);
  
  // Initialize the sequence with the initial head position
  const sequence = [initialHeadPosition];
  
  // Find requests greater than and less than the initial head position
  const greaterThan = allPositions.filter(pos => pos > initialHeadPosition);
  const lessThan = allPositions.filter(pos => pos < initialHeadPosition);
  
  // C-SCAN goes in one direction (right) to the end of the disk,
  // then jumps to the beginning and continues in the same direction
  
  // First, handle all requests to the right of the initial position
  sequence.push(...greaterThan);
  
  // If we reached the end, add the max cylinder
  if (greaterThan.length > 0) {
    sequence.push(maxCylinder);
  }
  
  // Then jump to the beginning (add the min cylinder)
  sequence.push(minCylinder);
  
  // Continue from the beginning and handle all requests to the left of the initial position
  sequence.push(...lessThan);
  
  // Calculate total seek time (accounting for the jump from max to min)
  let seekTime = calculateTotalSeekTime(sequence);
  // Subtract the seek time from the jump (max to min) as it's instantaneous
  seekTime -= (maxCylinder - minCylinder);
  
  // Calculate average seek time
  const averageSeekTime = calculateAverageSeekTime(seekTime, requests.length);
  
  return {
    name: 'C-SCAN',
    sequence,
    seekTime,
    averageSeekTime
  };
};

export default cscan; 