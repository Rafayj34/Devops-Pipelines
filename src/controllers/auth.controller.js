import logger from '#config/logger.js';
import { createUser } from '#services/auth.service.js';
import { formatValidationError } from '#utils/format.js';
import { signUpSchema } from '#validations/auth.validations.js';
import { jwttoken } from '#utils/jwt.js';
import { cookies } from '#utils/cookies.js';
export const signUp = async (req, res, next) => {
  try {
    const validationResult = signUpSchema.safeParse(req.body);
    // console.log('Validation Result:', validationResult);
    console.log('Request Body:', req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(validationResult.error),
      });
    }
    const { name, email, role, password } = validationResult.data;
    // Auth service sign-up logic here
    const user = await createUser({
      name,
      email,
      password,
      role,
    });
    const token = jwttoken.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    cookies.set(res, 'token', token);

    logger.info(`User signed up: ${email}`);
    res.status(201).json({
      message: 'User signed up successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (e) {
    logger.error('Sign-up error:', e);
    if (e.message === 'User already exists') {
      return res.status(409).json({ error: e.message });
    }
    next(e);
  }
};
