const uuid = require('uuid');

// this module provides volatile storage, using a `ShoppingList`
// and `Recipes` model. We haven't learned about databases yet,
// so for now we're using in-memory storage. This means each time
// the app stops, our storage gets erased.

// don't worry to much about how `ShoppingList` and `Recipes`
// are implemented. Our concern in this example is with how
// the API layer is implemented, and getting it to use an
// existing model.


function StorageException(message) {
   this.message = message;
   this.name = "StorageException";
}

/************* BLOG **************/

const BlogPosts = {
  create: function(title, content, author, publishDate) {
    const post = {
      id: uuid.v4(),
      title: title,
      content: content,
      author: author,
      publishDate: publishDate || Date.now()
    };
    this.posts.push(post);
    return post;
  },
  get: function(id=null) {
    // if id passed in, retrieve single post,
    // otherwise send all posts.
    if (id !== null) {
      return this.posts.find(post => post.id === id);
    }
    // return posts sorted (descending) by
    // publish date
    return this.posts.sort(function(a, b) {
      return b.publishDate - a.publishDate
    });
  },
  delete: function(id) {
    const postIndex = this.posts.findIndex(
      post => post.id === id);
    if (postIndex > -1) {
      this.posts.splice(postIndex, 1);
    }
  },
  update: function(updatedPost) {
    const {id} = updatedPost;
    const postIndex = this.posts.findIndex(
      post => post.id === updatedPost.id);
    if (postIndex === -1) {
      throw StorageException(
        `Can't update item \`${id}\` because doesn't exist.`)
    }
    this.posts[postIndex] = Object.assign(
      this.posts[postIndex], updatedPost);
    return this.posts[postIndex];
  }
};

function createBlogPostsModel() {
  const storage = Object.create(BlogPosts);
  storage.posts = [];
  return storage;
}


/******** SHOPPING *********/

const ShoppingList = {
  create: function(name, budget) {
    console.log('Creating new shopping list item');
    const item = {
      name: name,
      id: uuid.v4(),
      budget: budget
    };
    this.items[item.id] = item;
    return item;
  },
  get: function() {
    console.log('Retrieving shopping list items');
    return Object.keys(this.items).map(key => this.items[key]);
  },
  delete: function(id) {
    console.log(`Deleting shopping list item \`${id}\``);
    delete this.items[id];
  },
  update: function(updatedItem) {
    console.log(`Deleting shopping list item \`${updatedItem.id}\``);
    const {id} = updatedItem;
    if (!(id in this.items)) {
      throw StorageException(
        `Can't update item \`${id}\` because doesn't exist.`)
    }
    this.items[updatedItem.id] = updatedItem;
    return updatedItem;
  }
};

function createShoppingList() {
  const storage = Object.create(ShoppingList);
  storage.items = {};
  return storage;
}

/********* RECEIPES ************/

const Recipes = {
  create: function(name, ingredients) {
    console.log('Creating a new recipe');
    const item = {
      name: name,
      id: uuid.v4(),
      ingredients: ingredients
    };
    this.items[item.id] = item;
    return item;
  },
  get: function() {
    console.log('Retreiving recipes');
    return Object.keys(this.items).map(key => this.items[key]);
  },
  delete: function(itemId) {
    console.log(`Deleting recipe with id \`${itemId}\``);
    delete this.items[itemId];
  },
  update: function(updatedItem) {
    console.log(`Updating recipe with id \`${updatedItem.id}\``);
    const {id} = updatedItem;
    if (!(id in this.items)) {
      throw StorageException(
        `Can't update item \`${id}\` because doesn't exist.`)
    }
    this.items[updatedItem.id] = updatedItem;
    return updatedItem;
  }
};


function createRecipes() {
  const storage = Object.create(Recipes);
  storage.items = {};
  return storage;
}

/*************   EXPORT ***************/

module.exports = {
  BlogPosts: createBlogPostsModel(),
  ShoppingList: createShoppingList(),
  Recipes: createRecipes()
}