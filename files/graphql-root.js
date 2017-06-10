// @flow
const {
  GraphQLString,
  GraphQLObjectType,
  GraphQLSchema,
} = require('graphql');

const { GraphQLLoggedObjectType, wrappedMutation } = require('../logger');

module.exports = new GraphQLSchema({
  query: new GraphQLLoggedObjectType({
    name: 'RootQueryType',
    fields: {
      hello: {
        type: GraphQLString,
        resolve: () => 'world',
      },
    },
  }),
  mutation: new GraphQLObjectType({
    name: 'RootMutationType',
    fields: {
      doIt: wrappedMutation({
        name: 'DoIt',
        inputFields: {
          foo: { type: GraphQLString },
        },
        outputFields: {
          bar: { type: GraphQLString },
          nested: {
            type: new GraphQLLoggedObjectType({
              name: 'DoItNested',
              fields: {
                a: {
                  type: GraphQLString,
                  resolve: () => 'a',
                },
              },
            }),
            resolve: () => ({}),
          },
        },
        mutateAndGetPayload: input => ({ bar: input.foo }),
      }),
    },
  }),
});
