import { calculateTotalSeekTime, calculateAverageSeekTime } from './common';

/**
 * Shortest Seek Time First (SSTF) disk scheduling algorithm
 * @param {Array} requests - Array of request positions
 * @param {Number} initialHeadPosition - Initial position of disk head
 * @returns {Object} Result object with seek time, average seek time, and sequence
 */
const sstf = (requests, initialHeadPosition) => {
  let remainingRequests = [...requests];
  const sequence = [initialHeadPosition];
  let currentPosition = initialHeadPosition;
  while (remainingRequests.length > 0) {
    let shortestSeekTime = Infinity;
    let nearestRequestIndex = -1;
    for (let i = 0; i < remainingRequests.length; i++) {
      const seekTime = Math.abs(remainingRequests[i] - currentPosition);
      if (seekTime < shortestSeekTime) {
        shortestSeekTime = seekTime;
        nearestRequestIndex = i;
      }
    }
    const nearestRequest = remainingRequests[nearestRequestIndex];
    sequence.push(nearestRequest);
    currentPosition = nearestRequest;
    remainingRequests.splice(nearestRequestIndex, 1);
  }
  const seekTime = calculateTotalSeekTime(sequence);
  const averageSeekTime = calculateAverageSeekTime(seekTime, requests.length);
  return {
    name: 'SSTF',
    sequence,
    seekTime,
    averageSeekTime
  };
};

export default sstf; 