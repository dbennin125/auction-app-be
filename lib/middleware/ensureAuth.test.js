const { parsedHeader } = require('./ensureAuth');
// const bcrypt = require('bcryptjs');
describe('ensureAuth parsedHeader works', () => {
  it('get\'s user name and password', () => {
    const authorization = 'Basic cnlhbjpwYXNzd29yZA==';
    expect(parsedHeader(authorization)).toEqual({
      username: 'ryan',
      password: 'password'
      //I don't remember how to use postman for find this
    });
  });
});
// const password = 'password';
// const hashedPassword = bcrypt.hashSync(password, +process.env.SALT || 10);
// console.log(hashedPassword);
