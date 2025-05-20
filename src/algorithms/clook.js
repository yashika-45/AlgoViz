import { calculateTotalSeekTime, calculateAverageSeekTime } from './common';

/**
 * C-LOOK disk scheduling algorithm
 * @param {Array} requests - Array of request positions
 * @param {Number} initialHeadPosition - Initial position of disk head
 * @returns {Object} Result object with seek time, average seek time, and sequence
 */
const clook = (requests, initialHeadPosition) => {
  const allPositions = [...requests];
  allPositions.sort((a, b) => a - b);
  const sequence = [initialHeadPosition];
  const greaterThan = allPositions.filter(pos => pos > initialHeadPosition);
  const lessThan = allPositions.filter(pos => pos < initialHeadPosition);
  sequence.push(...greaterThan);
  if (lessThan.length > 0) {
    sequence.push(...lessThan);
  }
  let seekTime = calculateTotalSeekTime(sequence);
  if (greaterThan.length > 0 && lessThan.length > 0) {
    seekTime -= Math.abs(Math.max(...greaterThan) - Math.min(...lessThan));
  }
  const averageSeekTime = calculateAverageSeekTime(seekTime, requests.length);
  return {
    name: 'C-LOOK',
    sequence,
    seekTime,
    averageSeekTime
  };
};

export default clook; 