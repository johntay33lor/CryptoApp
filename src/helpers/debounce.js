// This function creates a debounced version of the given function.
// Debouncing is a technique used to delay the execution of a function until
// a certain amount of time has passed without the function being called again.
export default function debounce(func, wait, immediate) {
	var timeout;
  
	// The returned function is the debounced version of the input function.
	return function() {
	  var context = this,
		  args = arguments;
  
	  // This function will be executed after the specified `wait` time has passed.
	  var later = function() {
		timeout = null;
		
		// If `immediate` is false, execute the original function with the provided arguments.
		if (!immediate) func.apply(context, args);
	  };
	  
	  // Determine whether to execute the function immediately.
	  var callNow = immediate && !timeout;
	  
	  // Clear any existing timeout and set a new one for the specified `wait` time.
	  clearTimeout(timeout);
	  timeout = setTimeout(later, wait);
	  
	  // If `immediate` is true and no timeout is currently set, execute the function immediately.
	  if (callNow) func.apply(context, args);
	};
  };
  