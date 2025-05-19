// clook.js - C-LOOK disk scheduling algorithm
import { calculateTotalSeekTime, calculateAverageSeekTime } from './common';

/**
 * C-LOOK disk scheduling algorithm
 * @param {Array} requests - Array of request positions
 * @param {Number} initialHeadPosition - Initial position of disk head
 * @returns {Object} Result object with seek time, average seek time, and sequence
 */
const clook = (requests, initialHeadPosition) => {
  // Create a copy of the requests
  const allPositions = [...requests];
  
  // Sort all positions in ascending order
  allPositions.sort((a, b) => a - b);
  
  // Initialize the sequence with the initial head position
  const sequence = [initialHeadPosition];
  
  // Find requests greater than and less than the initial head position
  const greaterThan = allPositions.filter(pos => pos > initialHeadPosition);
  const lessThan = allPositions.filter(pos => pos < initialHeadPosition);
  
  // C-LOOK goes in one direction to the last request,
  // then jumps to the beginning and continues in the same direction
  
  // First, handle all requests to the right of the initial position
  sequence.push(...greaterThan);
  
  // If there are requests to the left, jump to the lowest and handle them
  if (lessThan.length > 0) {
    // Add all requests to the left of the initial position, starting from the lowest
    sequence.push(...lessThan);
  }
  
  // Calculate total seek time
  let seekTime = calculateTotalSeekTime(sequence);
  
  // If we had to jump, subtract the seek time from the jump
  if (greaterThan.length > 0 && lessThan.length > 0) {
    seekTime -= Math.abs(Math.max(...greaterThan) - Math.min(...lessThan));
  }
  
  // Calculate average seek time
  const averageSeekTime = calculateAverageSeekTime(seekTime, requests.length);
  
  return {
    name: 'C-LOOK',
    sequence,
    seekTime,
    averageSeekTime
  };
};

export default clook; 