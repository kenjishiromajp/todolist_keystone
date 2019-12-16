const { Keystone } = require('@keystonejs/keystone');
const { NextApp } = require('@keystonejs/app-next');
const { PasswordAuthStrategy } = require('@keystonejs/auth-password');
const { Text: FieldText, Checkbox, Password, Relationship } = require('@keystonejs/fields');
const { GraphQLApp } = require('@keystonejs/app-graphql');
const { AdminUIApp } = require('@keystonejs/app-admin-ui');
const initialiseData = require('./initial-data.ts');

const { KnexAdapter: Adapter } = require('@keystonejs/adapter-knex');

const PROJECT_NAME = "TodoList";


const keystone = new Keystone({
  name: PROJECT_NAME,
  adapter: new Adapter({
    client: 'postgres',
    connection: 'postgres://localhost/todolist',
    // dropDatabase: true,
  }),
  onConnect: initialiseData,
});

// Access control functions
const userIsAdmin = ({ authentication: { item: user } }) => Boolean(user && user.isAdmin);
const userOwnsItem = ({ authentication: { item: user } }) => {
  if (!user) {
    return false;
  }
  return { id: user.id };
};
const userIsAdminOrOwner = auth => {
  const isAdmin = access.userIsAdmin(auth);
  const isOwner = access.userOwnsItem(auth);
  return isAdmin ? isAdmin : isOwner;
};
const access = { userIsAdmin, userOwnsItem, userIsAdminOrOwner };

keystone.createList('User', {
  labelField: 'email',
  fields: {
    name: { type: FieldText },
    email: {
      type: FieldText,
      isUnique: true,
    },
    isAdmin: { type: Checkbox },
    todoLists: { type: Relationship, ref: 'TodoList', many: true },
    password: {
      type: Password,
    },
  },
  access: {
    read: access.userIsAdminOrOwner,
    update: access.userIsAdminOrOwner,
    create: access.userIsAdmin,
    delete: access.userIsAdmin,
    auth: true,
  },
});

keystone.createList('Todo', {
  labelField: 'title',
  fields: {
    title: { type: FieldText },
    todoList: { type: Relationship, ref: 'TodoList' },
  },
  access: {
    read: access.userIsAdminOrOwner,
    update: access.userIsAdminOrOwner,
    delete: access.userIsAdminOrOwner,
    auth: true,
  },
});

keystone.createList('TodoList', {
  labelField: 'title',
  fields: {
    title: { type: FieldText },
    user: { type: Relationship, ref: 'User.id' },
    todos: { type: Relationship, ref: 'Todo', many: true },
  },
  access: {
    read: access.userIsAdminOrOwner,
    update: access.userIsAdminOrOwner,
    create: true,
    delete: access.userIsAdminOrOwner,
    auth: true,
  },
});

const authStrategy = keystone.createAuthStrategy({
  type: PasswordAuthStrategy,
  list: 'User',
});

module.exports = {
  keystone,
  apps: [
    new GraphQLApp(),
    new AdminUIApp({
      enableDefaultRoute: true,
      authStrategy,
    }),
    new NextApp({ dir: 'app' }),
  ],
};
