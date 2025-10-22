import { User } from '../models/user.model.js';
import { registerUserService, loginUserService } from '../services/authService.js';
import jwt from 'jsonwebtoken'
import { sendEmail } from '../utils/sendEmail.js';

export const registerUser = async (req, res) => {
  try {
    const userData = await registerUserService(req.body);
    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: userData
    });
  } catch (error) {
    console.error('Error in registerUser:', error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const result = await loginUserService({ email, password });

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      user: result.user,
    });
  } catch (error) {
    console.error('Error in loginUser:', error);
    const status = error.statusCode || 400;
    return res.status(status).json({ success: false, message: error.message || 'Login failed' });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
   
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found"
      })
    }

    const resetToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h'
      }
    );


    user.refreshToken = resetToken;
    await user.save();

    const resetUrl = `http://localhost:5000/api/auth/resetPassword/${resetToken}`

    const html = `
    <p>Hello ${user.fullname},</p>
    <p>You requested a password reset. Click below to reset your password:</p>
     <a href="${resetUrl}" target="_blank">${resetUrl}</a>
      <p>This link will expire in <b>1 hour</b>.</p>

    `

    await sendEmail(user.email,html);

    console.log(resetUrl);
    return res.status(200).json({
      success: true,
      message: 'Password reset link sent'
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: 'server error'
    })

  }
}


export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Password is required'
      })
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch (error) {
     
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired token'
      })
    }

 

    const user = await User.findById(decoded.id);
    console.log(user)
    if (!user || user.refreshToken !== token) {
      return res.status(400).json({ success: false, message: 'Invalid or expired token' });
    }
    user.password = password;


    user.refreshToken = undefined;
    await user.save();
    return res.status(200).json({ success: true, message: 'Password reset successful' });
  } catch (error) {

    return res.status(500).json({ success: false, message: 'Server error' });

  }
}
