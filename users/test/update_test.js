const assert = require('assert')
const User = require('../src/user')

describe('Updating records', () => {
  let joe

  beforeEach((done) => {
    joe = new User({ name: 'Joe', likes: 0 })

    joe
			.save()
      .then(() => done())
  })

  function assertName(operation, done) {
    operation
			.then(() => User.find({}))
			.then((users) => {
				assert(users.length === 1)
				assert(users[0].name === 'Alex')
				done()
			})
  }

  it('model instance using set and save', (done) => {
    joe.set('name', 'Alex')

    assertName(joe.save(), done)
  })

  it('model instance update', (done) => {
    assertName(joe.update({ name: 'Alex' }), done)
  })

	it('model class update', (done) => {
		assertName(
			User.update({ name: 'Joe' }, { name: 'Alex' }), 
			done
		)
	})

	it('model class findOneAndUpdate', (done) => {
		assertName(
			User.findOneAndUpdate({ name: 'Joe' }, { name: 'Alex' }),
			done
		)
	})

	it('model class findByIdAndUpdate', (done) => {
		assertName(
			User.findByIdAndUpdate(joe._id, { name: 'Alex' }),
			done
		)
	})

	it('increment likes by one', (done) => {
		User.update({ name: 'Joe' }, { $inc: { likes: 1 } })
				.then(() => User.findOne({ name: 'Joe' }))
				.then((user) => {
					assert(user.likes === 1)
					done()
				})
	})

})