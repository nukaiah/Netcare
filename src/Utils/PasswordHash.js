
import bcrypt from 'bcrypt';


async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

async function comparePassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

export { hashPassword, comparePassword };

