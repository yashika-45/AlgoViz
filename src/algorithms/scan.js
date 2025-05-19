// scan.js - SCAN (Elevator) disk scheduling algorithm
import { calculateTotalSeekTime, calculateAverageSeekTime } from './common';

/**
 * SCAN (Elevator) disk scheduling algorithm
 * @param {Array} requests - Array of request positions
 * @param {Number} initialHeadPosition - Initial position of disk head
 * @param {String} direction - Initial direction of head movement ('left' or 'right')
 * @returns {Object} Result object with seek time, average seek time, and sequence
 */
const scan = (requests, initialHeadPosition, direction = 'right') => {
  // Create a copy of the requests and add the initial head position
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
  
  // Build the sequence based on the direction
  if (direction === 'right') {
    // Go right to the end of the disk
    sequence.push(...greaterThan);
    sequence.push(maxCylinder);
    
    // Then reverse direction and go left
    sequence.push(...lessThan.reverse());
  } else {
    // Go left to the start of the disk
    sequence.push(...lessThan.reverse());
    sequence.push(minCylinder);
    
    // Then reverse direction and go right
    sequence.push(...greaterThan);
  }
  
  // Calculate total seek time
  const seekTime = calculateTotalSeekTime(sequence);
  
  // Calculate average seek time
  const averageSeekTime = calculateAverageSeekTime(seekTime, requests.length);
  
  return {
    name: 'SCAN',
    sequence,
    seekTime,
    averageSeekTime,
    direction
  };
};

export default scan; 