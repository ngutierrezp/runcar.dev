/**
 * Validate the request body if is a CURL request
 * @param {Object} req - The request object
 * @return {boolean} - Returns true if the request is valid, otherwise false
 */
export function isACurlRequest(req) {
	if (!req || !req.headers || !req.headers['user-agent'] || !req.headers['user-agent'].includes('curl')) {
		return false;
	}
  return true;
}