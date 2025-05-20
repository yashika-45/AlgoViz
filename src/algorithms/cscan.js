import { calculateTotalSeekTime, calculateAverageSeekTime } from './common';

/**
 * C-SCAN (Circular SCAN) disk scheduling algorithm
 * @param {Array} requests - Array of request positions
 * @param {Number} initialHeadPosition - Initial position of disk head
 * @returns {Object} Result object with seek time, average seek time, and sequence
 */
const cscan = (requests, initialHeadPosition) => {
  const allPositions = [...requests];
  const diskSize = 200;
  const minCylinder = 0;
  const maxCylinder = diskSize - 1;
  allPositions.sort((a, b) => a - b);
  const sequence = [initialHeadPosition];
  const greaterThan = allPositions.filter(pos => pos > initialHeadPosition);
  const lessThan = allPositions.filter(pos => pos < initialHeadPosition);
  sequence.push(...greaterThan);
  if (greaterThan.length > 0) {
    sequence.push(maxCylinder);
  }
  sequence.push(minCylinder);
  sequence.push(...lessThan);
  let seekTime = calculateTotalSeekTime(sequence);
  seekTime -= (maxCylinder - minCylinder);
  const averageSeekTime = calculateAverageSeekTime(seekTime, requests.length);
  return {
    name: 'C-SCAN',
    sequence,
    seekTime,
    averageSeekTime
  };
};

export default cscan; 