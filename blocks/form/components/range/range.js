/**
 * Format number to Indian currency format (with K for thousands, L for lakhs)
 * @param {number} value - The number to format
 * @returns {string} - Formatted string (e.g., "15L", "50K")
 */
function formatIndianCurrency(value) {
  if (value >= 100000) {
    // Convert to lakhs
    const lakhs = value / 100000;
    return lakhs % 1 === 0 ? `${lakhs}L` : `${lakhs.toFixed(1)}L`;
  } else if (value >= 1000) {
    // Convert to thousands
    const thousands = value / 1000;
    return thousands % 1 === 0 ? `${thousands}K` : `${thousands.toFixed(1)}K`;
  }
  return value.toString();
}

/**
 * Format number to Indian rupee format with comma separators
 * @param {number} value - The number to format
 * @returns {string} - Formatted string (e.g., "₹15,00,000")
 */
function formatINR(value) {
  const numStr = value.toString();
  const lastThree = numStr.substring(numStr.length - 3);
  const otherNumbers = numStr.substring(0, numStr.length - 3);
  const formatted = otherNumbers !== '' 
    ? otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree
    : lastThree;
  return `₹${formatted}`;
}

/**
 * Generate scale markers for the range slider
 * @param {HTMLElement} container - The container element to add markers to
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @param {number} steps - Number of scale markers to display
 */
function createScaleMarkers(container, min, max, steps = 7) {
  const scaleContainer = document.createElement('div');
  scaleContainer.className = 'range-scale';
  
  // Generate evenly distributed scale values
  const interval = (max - min) / (steps - 1);
  
  for (let i = 0; i < steps; i++) {
    const scaleValue = min + (interval * i);
    const marker = document.createElement('span');
    marker.className = 'range-scale-marker';
    marker.innerText = formatIndianCurrency(scaleValue);
    marker.style.left = `${(i / (steps - 1)) * 100}%`;
    scaleContainer.appendChild(marker);
  }
  
  container.appendChild(scaleContainer);
}

function updateBubble(input, element) {
  const step = input.step || 1;
  const max = input.max || 0;
  const min = input.min || 1;
  const value = input.value || 1;
  const current = Math.ceil((value - min) / step);
  const total = Math.ceil((max - min) / step);
  const bubble = element.querySelector('.range-bubble');
  // during initial render the width is 0. Hence using a default here.
  const bubbleWidth = bubble.getBoundingClientRect().width || 31;
  const left = `${(current / total) * 100}% - ${(current / total) * bubbleWidth}px`;
  
  // Format the bubble value in INR format
  bubble.innerText = formatINR(parseInt(value));
  
  const steps = {
    '--total-steps': Math.ceil((max - min) / step),
    '--current-steps': Math.ceil((value - min) / step),
  };
  const style = Object.entries(steps).map(([varName, varValue]) => `${varName}:${varValue}`).join(';');
  bubble.style.left = `calc(${left})`;
  element.setAttribute('style', style);
}
export default async function decorate(fieldDiv, fieldJson) {
  const input = fieldDiv.querySelector('input');
  // modify the type in case it is not range.
  input.type = 'range';
  input.min = input.min || 1;
  input.max = input.max || 100;
  input.step = fieldJson?.properties?.stepValue || 1;
  // create a wrapper div to provide the min/max and current value
  const div = document.createElement('div');
  div.className = 'range-widget-wrapper decorated';
  input.after(div);
  const hover = document.createElement('span');
  hover.className = 'range-bubble';
  const rangeMinEl = document.createElement('span');
  rangeMinEl.className = 'range-min';
  const rangeMaxEl = document.createElement('span');
  rangeMaxEl.className = 'range-max';
  rangeMinEl.innerText = `${input.min || 1}`;
  rangeMaxEl.innerText = `${input.max}`;
  div.appendChild(hover);
  // move the input element within the wrapper div
  div.appendChild(input);
  div.appendChild(rangeMinEl);
  div.appendChild(rangeMaxEl);
  
  // Create scale markers
  createScaleMarkers(div, parseInt(input.min), parseInt(input.max));
  
  input.addEventListener('input', (e) => {
    updateBubble(e.target, div);
  });
  updateBubble(input, div);
  return fieldDiv;
}
