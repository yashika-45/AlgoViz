import { calculateTotalSeekTime, calculateAverageSeekTime } from './common';

/**
 * SCAN (Elevator) disk scheduling algorithm
 * @param {Array} requests - Array of request positions
 * @param {Number} initialHeadPosition - Initial position of disk head
 * @param {String} direction - Initial direction of head movement ('left' or 'right')
 * @returns {Object} Result object with seek time, average seek time, and sequence
 */
const scan = (requests, initialHeadPosition, direction = 'right') => {
  const allPositions = [...requests];
  const diskSize = 200;
  const minCylinder = 0;
  const maxCylinder = diskSize - 1;
  allPositions.sort((a, b) => a - b);
  const sequence = [initialHeadPosition];
  const greaterThan = allPositions.filter(pos => pos > initialHeadPosition);
  const lessThan = allPositions.filter(pos => pos < initialHeadPosition);
  if (direction === 'right') {
    sequence.push(...greaterThan);
    sequence.push(maxCylinder);
    sequence.push(...lessThan.reverse());
  } else {
    sequence.push(...lessThan.reverse());
    sequence.push(minCylinder);
    sequence.push(...greaterThan);
  }
  const seekTime = calculateTotalSeekTime(sequence);
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