import BasicApp from './basicQuery/BasicApp.svelte';
import GraphQLBasicApp from './basicQueryGraphQL/BasicApp.svelte';

export default {
  title: 'Examples',
  component: BasicApp,
};

export const Basic = () => ({
  Component: BasicApp
});

export const GraphQLBasic = () => ({
  Component: GraphQLBasicApp
});