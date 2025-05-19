// sstf.js - Shortest Seek Time First disk scheduling algorithm
import { calculateTotalSeekTime, calculateAverageSeekTime } from './common';

/**
 * Shortest Seek Time First (SSTF) disk scheduling algorithm
 * @param {Array} requests - Array of request positions
 * @param {Number} initialHeadPosition - Initial position of disk head
 * @returns {Object} Result object with seek time, average seek time, and sequence
 */
const sstf = (requests, initialHeadPosition) => {
  // Create a copy of the requests to avoid modifying the original array
  let remainingRequests = [...requests];
  
  // Initialize the sequence with the initial head position
  const sequence = [initialHeadPosition];
  
  // Current head position, updated as we move through the requests
  let currentPosition = initialHeadPosition;
  
  // Process all requests
  while (remainingRequests.length > 0) {
    // Find the request with the shortest seek time from current position
    let shortestSeekTime = Infinity;
    let nearestRequestIndex = -1;
    
    for (let i = 0; i < remainingRequests.length; i++) {
      const seekTime = Math.abs(remainingRequests[i] - currentPosition);
      if (seekTime < shortestSeekTime) {
        shortestSeekTime = seekTime;
        nearestRequestIndex = i;
      }
    }
    
    // Add the nearest request to the sequence
    const nearestRequest = remainingRequests[nearestRequestIndex];
    sequence.push(nearestRequest);
    
    // Update the current position
    currentPosition = nearestRequest;
    
    // Remove the processed request
    remainingRequests.splice(nearestRequestIndex, 1);
  }
  
  // Calculate total seek time
  const seekTime = calculateTotalSeekTime(sequence);
  
  // Calculate average seek time
  const averageSeekTime = calculateAverageSeekTime(seekTime, requests.length);
  
  return {
    name: 'SSTF',
    sequence,
    seekTime,
    averageSeekTime
  };
};

export default sstf; 