import { calculateTotalSeekTime, calculateAverageSeekTime } from './common';

/**
 * LOOK disk scheduling algorithm
 * @param {Array} requests - Array of request positions
 * @param {Number} initialHeadPosition - Initial position of disk head
 * @param {String} direction - Initial direction of head movement ('left' or 'right')
 * @returns {Object} Result object with seek time, average seek time, and sequence
 */
const look = (requests, initialHeadPosition, direction = 'right') => {
  const allPositions = [...requests];
  allPositions.sort((a, b) => a - b);
  const sequence = [initialHeadPosition];
  const greaterThan = allPositions.filter(pos => pos > initialHeadPosition);
  const lessThan = allPositions.filter(pos => pos < initialHeadPosition);
  if (direction === 'right') {
    sequence.push(...greaterThan);
    sequence.push(...lessThan.reverse());
  } else {
    sequence.push(...lessThan.reverse());
    sequence.push(...greaterThan);
  }
  const seekTime = calculateTotalSeekTime(sequence);
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