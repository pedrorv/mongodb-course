const assert = require('assert')
const mongoose = require('mongoose')

const User = require('../src/user')
const BlogPost = require('../src/blogPost')
const Comment = require('../src/comment')

describe('Associations', () => {
  let joe, blogPost, comment

  beforeEach((done) => {
    joe = new User({ name: 'Joe' })
    blogPost = new BlogPost({ title: 'Post Title', content: 'Post Content' })
    comment = new Comment({ content: 'Comment Content' })

    joe.blogPosts.push(blogPost)
    blogPost.comments.push(comment)
    comment.user = joe

    Promise.all([joe.save(), blogPost.save(), comment.save()])
           .then(() => done())
           .catch(() => done())
  })

  it('saves a relation between a user and a blogpost', (done) => {
    User.findOne({ name: 'Joe' })
        .populate('blogPosts')
        .then((user) => {
          assert(user.blogPosts[0].title === 'Post Title')
          done()
        })
  })

  it('saves a full relation tree', (done) => {
    User.findOne({ name: 'Joe' })
        .populate({
          path: 'blogPosts',
          populate: {
            path: 'comments',
            model: 'comment',
            populate: {
              path: 'user',
              model: 'user'
            }
          }
        })
        .then((user) => {
          assert(user.name === 'Joe')
          assert(user.blogPosts[0].title === 'Post Title')
          assert(user.blogPosts[0].comments[0].content === 'Comment Content')
          assert(user.blogPosts[0].comments[0].user.name === 'Joe')
          done()
        })
  })

})