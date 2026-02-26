import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  // 1. Check if the user brought their ID badge (Token)
  // In HTTP requests, it is standard practice to send the token in the "Authorization" header
  // format: "Bearer <token_string>"
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 2. Extract the token (Remove the word "Bearer " to get just the token string)
      token = req.headers.authorization.split(' ')[1];

      // 3. Verify the signature on the badge using our secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4. Find the user in our database using the ID stamped on the badge
      // We use .select('-password') so we DON'T attach their hashed password to the request
      req.user = await User.findById(decoded.id).select('-password');

      // 5. The badge is valid! Let them pass through to the trip controller
      next();
      
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // 6. If they never brought a badge at all, reject them immediately
  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};