// look.js - LOOK disk scheduling algorithm
import { calculateTotalSeekTime, calculateAverageSeekTime } from './common';

/**
 * LOOK disk scheduling algorithm
 * @param {Array} requests - Array of request positions
 * @param {Number} initialHeadPosition - Initial position of disk head
 * @param {String} direction - Initial direction of head movement ('left' or 'right')
 * @returns {Object} Result object with seek time, average seek time, and sequence
 */
const look = (requests, initialHeadPosition, direction = 'right') => {
  // Create a copy of the requests
  const allPositions = [...requests];
  
  // Sort all positions in ascending order
  allPositions.sort((a, b) => a - b);
  
  // Initialize the sequence with the initial head position
  const sequence = [initialHeadPosition];
  
  // Find requests greater than and less than the initial head position
  const greaterThan = allPositions.filter(pos => pos > initialHeadPosition);
  const lessThan = allPositions.filter(pos => pos < initialHeadPosition);
  
  // Build the sequence based on the direction
  if (direction === 'right') {
    // First go right to the highest request
    sequence.push(...greaterThan);
    
    // Then reverse direction and go left
    sequence.push(...lessThan.reverse());
  } else {
    // First go left to the lowest request
    sequence.push(...lessThan.reverse());
    
    // Then reverse direction and go right
    sequence.push(...greaterThan);
  }
  
  // Calculate total seek time
  const seekTime = calculateTotalSeekTime(sequence);
  
  // Calculate average seek time
  const averageSeekTime = calculateAverageSeekTime(seekTime, requests.length);
  
  return {
    name: 'LOOK',
    sequence,
    seekTime,
    averageSeekTime,
    direction
  };
};

export default look; 