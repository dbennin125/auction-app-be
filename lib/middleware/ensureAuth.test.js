const { parsedHeader } = require('./ensureAuth');
const bcrypt = require('bcryptjs');
describe('ensureAuth parsedHeader works', () => {
  it('get\'s user name and password', () => {
    const authorization = 'Basic cnlhbjpwYXNzd29yZA==';
    expect(parsedHeader(authorization)).toEqual({
      username: 'ryan',
      password: 'password'
    });
  });
});
const password = 'password';
const hashedPassword = bcrypt.hashSync(password, +process.env.SALT || 10);
console.log(hashedPassword);
