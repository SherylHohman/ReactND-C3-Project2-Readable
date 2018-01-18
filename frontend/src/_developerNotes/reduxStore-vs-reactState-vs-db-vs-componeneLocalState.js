After mapStoreToProps:

posts = [ post1object, post2object, post3object ]
where:
  postObject = {
        id: '8xf0y6ziyjabvozdd253nd',
        timestamp: 1467166872634,
        title: 'Udacity is the best place to learn React',
        body: 'Everyone says so after all.',
        author: 'thingtwo',
        category: 'react',
        voteScore: 6,
        deleted: false,
        commentCount: 2
}

comments = [comment1, comment2, ..]
where:
  comment = {
    ...
  }

now, in state for component, im only interested in comments that are attached to
- the visible post
- WHEN: a single post is selected/shown/ on post route.

- so I'm only interested in a subset of comments (or none)
  at any point in time.

STORE will hold an object of All comment Objects.
State for visible components will hold a SUBSET of allComments (including none)

...
OK. So then, that tells me that I'm only ever dealing with the "plurals" of objects in STORE. ie, posts, comments, categories in STORE.
  Never: post, comment, category.

Wait.. maybe that's not true.
if a component needs access to a CURRENTLY SELECTED "category", or "post", or "comment", then part of the Benefit of Redux, is that I DONT Need to Pass that information down multiple chains.. so having a reference to a currently visible/selected item, *may* be of value? Or a current subset of posts?  Or comments ?  Hmm.. not sure.
Perhaps I should just start writing some front end, then see how it goes from there?


