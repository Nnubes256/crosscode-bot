
module.exports = function() {
  let helpInstruction = 'prefix .cc setting:general\n' +
'Command     Parameters          Result                    example\n' +
'hi                              receive a greeting        .cc -g hi\n' +
'bye                             receive a farewell        .cc -g bye\n' +
'BUG                             scare Emilie              .cc -g BUG\n' +
'art                             view a random stream art  .cc -g art\n' +
'thinking                        get thunked reacted       .cc -g thinking\n' +
'CHEATER     @user               Apollo gets the cheater   .cc -g CHEATER CrossCodeBot\n'
  return helpInstruction
}
