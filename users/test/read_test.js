const assert = require('assert')
const User = require('../src/user')

describe('Reading records', () => {
  let joe, jack, john, jamie

  beforeEach((done) => {
    joe = new User({ name: 'Joe' })
    jack = new User({ name: 'Jack' })
    john = new User({ name: 'John' })
    jamie = new User({ name: 'Jamie' })

    Promise.all([joe.save(), jack.save(), john.save(), jamie.save()])
           .then(() => done())    
  })

  it('finds all users named joe', (done) => {
    User.find({ name: 'Joe' })
        .then((users) => {
          assert(users[0]._id.toString() === joe._id.toString())
          done()
        })
  })

  it('find user with specific id', (done) => {
    User.findOne({ _id: joe._id })
        .then((user) => {
          assert(user.name === 'Joe')
          done()
        })
  })

  it('can skip and limit the result set', (done) => {
    User.find({})
        .sort({ name: 1 })
        .skip(1)
        .limit(2)
        .then((users) => {
          assert(users.length === 2)
          assert(users[0].name === 'Jamie')
          assert(users[1].name === 'Joe')
          done()
        })
  })

})