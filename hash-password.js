import bcrypt from 'bcrypt';

const password = 'admin123';

const hashPassword = async () => {
  const hash = await bcrypt.hash(password, 10);
  console.log('Hashed password:', hash);
};

hashPassword();
