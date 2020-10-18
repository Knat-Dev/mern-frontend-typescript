import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Query = {
  __typename?: 'Query';
  hello: Scalars['String'];
  posts: PaginatedPosts;
  post?: Maybe<Post>;
  me?: Maybe<User>;
};

export type QueryPostsArgs = {
  input: PaginationInput;
};

export type QueryPostArgs = {
  id: Scalars['String'];
};

export type PaginatedPosts = {
  __typename?: 'PaginatedPosts';
  posts: Array<Post>;
  hasMore: Scalars['Boolean'];
};

export type Post = {
  __typename?: 'Post';
  id: Scalars['ID'];
  createdAt: Scalars['Float'];
  updatedAt: Scalars['Float'];
  title: Scalars['String'];
  text: Scalars['String'];
  points: Scalars['Float'];
  voteStatus?: Maybe<Scalars['Int']>;
  creator: User;
  comments: PaginatedComments;
  commentCount: Scalars['Float'];
  textSnippet: Scalars['String'];
};

export type PostCommentsArgs = {
  input: PaginationInput;
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  username: Scalars['String'];
  email?: Maybe<Scalars['String']>;
  createdAt: Scalars['Float'];
  posts: Array<Post>;
  updatedAt: Scalars['Float'];
};

export type PaginatedComments = {
  __typename?: 'PaginatedComments';
  comments: Array<Comment>;
  hasMore: Scalars['Boolean'];
};

export type Comment = {
  __typename?: 'Comment';
  id: Scalars['ID'];
  createdAt: Scalars['Float'];
  updatedAt: Scalars['Float'];
  text: Scalars['String'];
  points: Scalars['Float'];
  voteStatus?: Maybe<Scalars['Int']>;
  creator: User;
  post: Post;
};

export type PaginationInput = {
  limit: Scalars['Float'];
  cursor?: Maybe<Scalars['Float']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createPost?: Maybe<PostResponse>;
  updatePost: PostResponse;
  deletePost: Scalars['Boolean'];
  vote: Scalars['Boolean'];
  register: UserResponse;
  login: UserResponse;
  logout: Scalars['Boolean'];
  forgotPassword: Scalars['Boolean'];
  changePassword: UserResponse;
  createComment: CommentResponse;
  voteComment: Scalars['Boolean'];
};

export type MutationCreatePostArgs = {
  input: PostInput;
};

export type MutationUpdatePostArgs = {
  text: Scalars['String'];
  title: Scalars['String'];
  id: Scalars['String'];
};

export type MutationDeletePostArgs = {
  id: Scalars['String'];
};

export type MutationVoteArgs = {
  value: Scalars['Int'];
  postId: Scalars['String'];
};

export type MutationRegisterArgs = {
  input: RegisterInput;
};

export type MutationLoginArgs = {
  input: LoginInput;
};

export type MutationForgotPasswordArgs = {
  email: Scalars['String'];
};

export type MutationChangePasswordArgs = {
  input: ChangePasswordInput;
};

export type MutationCreateCommentArgs = {
  cursor?: Maybe<Scalars['Float']>;
  postId: Scalars['String'];
  text: Scalars['String'];
};

export type MutationVoteCommentArgs = {
  value: Scalars['Int'];
  commentId: Scalars['String'];
};

export type PostResponse = {
  __typename?: 'PostResponse';
  errors?: Maybe<Array<FieldError>>;
  post?: Maybe<Post>;
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type PostInput = {
  title: Scalars['String'];
  text: Scalars['String'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type RegisterInput = {
  username: Scalars['String'];
  password: Scalars['String'];
  email: Scalars['String'];
};

export type LoginInput = {
  usernameOrEmail: Scalars['String'];
  password: Scalars['String'];
};

export type ChangePasswordInput = {
  token: Scalars['String'];
  newPassword: Scalars['String'];
};

export type CommentResponse = {
  __typename?: 'CommentResponse';
  errors?: Maybe<Array<FieldError>>;
  comment?: Maybe<Comment>;
};

export type RegularCommentFragment = { __typename?: 'Comment' } & Pick<
  Comment,
  'id' | 'text' | 'createdAt' | 'voteStatus' | 'points'
> & { creator: { __typename?: 'User' } & Pick<User, 'id' | 'username'> };

export type RegularErrorFragment = { __typename?: 'FieldError' } & Pick<
  FieldError,
  'field' | 'message'
>;

export type RegularPostFragment = { __typename?: 'Post' } & Pick<
  Post,
  'id' | 'title' | 'text' | 'points' | 'createdAt' | 'updatedAt'
>;

export type RegularResponseFragment = { __typename?: 'UserResponse' } & {
  errors?: Maybe<Array<{ __typename?: 'FieldError' } & RegularErrorFragment>>;
  user?: Maybe<{ __typename?: 'User' } & RegularUserFragment>;
};

export type RegularUserFragment = { __typename?: 'User' } & Pick<
  User,
  'id' | 'email' | 'username' | 'createdAt' | 'updatedAt'
>;

export type ChangePasswordMutationVariables = Exact<{
  input: ChangePasswordInput;
}>;

export type ChangePasswordMutation = { __typename?: 'Mutation' } & {
  changePassword: { __typename?: 'UserResponse' } & RegularResponseFragment;
};

export type CreateCommentMutationVariables = Exact<{
  postId: Scalars['String'];
  text: Scalars['String'];
  cursor?: Maybe<Scalars['Float']>;
}>;

export type CreateCommentMutation = { __typename?: 'Mutation' } & {
  createComment: { __typename?: 'CommentResponse' } & {
    errors?: Maybe<
      Array<
        { __typename?: 'FieldError' } & Pick<FieldError, 'field' | 'message'>
      >
    >;
    comment?: Maybe<{ __typename?: 'Comment' } & Pick<Comment, 'id' | 'text'>>;
  };
};

export type CreatePostMutationVariables = Exact<{
  input: PostInput;
}>;

export type CreatePostMutation = { __typename?: 'Mutation' } & {
  createPost?: Maybe<
    { __typename?: 'PostResponse' } & {
      errors?: Maybe<
        Array<{ __typename?: 'FieldError' } & RegularErrorFragment>
      >;
      post?: Maybe<{ __typename?: 'Post' } & RegularPostFragment>;
    }
  >;
};

export type DeletePostMutationVariables = Exact<{
  id: Scalars['String'];
}>;

export type DeletePostMutation = { __typename?: 'Mutation' } & Pick<
  Mutation,
  'deletePost'
>;

export type ForgotPasswordMutationVariables = Exact<{
  email: Scalars['String'];
}>;

export type ForgotPasswordMutation = { __typename?: 'Mutation' } & Pick<
  Mutation,
  'forgotPassword'
>;

export type LoginMutationVariables = Exact<{
  input: LoginInput;
}>;

export type LoginMutation = { __typename?: 'Mutation' } & {
  login: { __typename?: 'UserResponse' } & RegularResponseFragment;
};

export type LogoutMutationVariables = Exact<{ [key: string]: never }>;

export type LogoutMutation = { __typename?: 'Mutation' } & Pick<
  Mutation,
  'logout'
>;

export type RegisterMutationVariables = Exact<{
  input: RegisterInput;
}>;

export type RegisterMutation = { __typename?: 'Mutation' } & {
  register: { __typename?: 'UserResponse' } & RegularResponseFragment;
};

export type UpdatePostMutationVariables = Exact<{
  id: Scalars['String'];
  title: Scalars['String'];
  text: Scalars['String'];
}>;

export type UpdatePostMutation = { __typename?: 'Mutation' } & {
  updatePost: { __typename?: 'PostResponse' } & {
    errors?: Maybe<Array<{ __typename?: 'FieldError' } & RegularErrorFragment>>;
    post?: Maybe<{ __typename?: 'Post' } & RegularPostFragment>;
  };
};

export type VoteMutationVariables = Exact<{
  postId: Scalars['String'];
  value: Scalars['Int'];
}>;

export type VoteMutation = { __typename?: 'Mutation' } & Pick<Mutation, 'vote'>;

export type VoteCommentMutationVariables = Exact<{
  commentId: Scalars['String'];
  value: Scalars['Int'];
}>;

export type VoteCommentMutation = { __typename?: 'Mutation' } & Pick<
  Mutation,
  'voteComment'
>;

export type MeQueryVariables = Exact<{ [key: string]: never }>;

export type MeQuery = { __typename?: 'Query' } & {
  me?: Maybe<{ __typename?: 'User' } & RegularUserFragment>;
};

export type PostQueryVariables = Exact<{
  id: Scalars['String'];
  input: PaginationInput;
}>;

export type PostQuery = { __typename?: 'Query' } & {
  post?: Maybe<
    { __typename?: 'Post' } & Pick<
      Post,
      | 'id'
      | 'title'
      | 'text'
      | 'textSnippet'
      | 'commentCount'
      | 'voteStatus'
      | 'points'
      | 'createdAt'
      | 'updatedAt'
    > & {
        comments: { __typename?: 'PaginatedComments' } & Pick<
          PaginatedComments,
          'hasMore'
        > & {
            comments: Array<
              { __typename?: 'Comment' } & RegularCommentFragment
            >;
          };
        creator: { __typename?: 'User' } & Pick<User, 'id' | 'username'>;
      }
  >;
};

export type PostsQueryVariables = Exact<{
  input: PaginationInput;
}>;

export type PostsQuery = { __typename?: 'Query' } & {
  posts: { __typename?: 'PaginatedPosts' } & Pick<PaginatedPosts, 'hasMore'> & {
      posts: Array<
        { __typename?: 'Post' } & Pick<
          Post,
          | 'id'
          | 'title'
          | 'textSnippet'
          | 'text'
          | 'voteStatus'
          | 'points'
          | 'createdAt'
          | 'updatedAt'
          | 'commentCount'
        > & { creator: { __typename?: 'User' } & Pick<User, 'id' | 'username'> }
      >;
    };
};

export const RegularCommentFragmentDoc = gql`
  fragment RegularComment on Comment {
    id
    text
    createdAt
    voteStatus
    points
    creator {
      id
      username
    }
  }
`;
export const RegularPostFragmentDoc = gql`
  fragment RegularPost on Post {
    id
    title
    text
    points
    createdAt
    updatedAt
  }
`;
export const RegularErrorFragmentDoc = gql`
  fragment RegularError on FieldError {
    field
    message
  }
`;
export const RegularUserFragmentDoc = gql`
  fragment RegularUser on User {
    id
    email
    username
    createdAt
    updatedAt
  }
`;
export const RegularResponseFragmentDoc = gql`
  fragment RegularResponse on UserResponse {
    errors {
      ...RegularError
    }
    user {
      ...RegularUser
    }
  }
  ${RegularErrorFragmentDoc}
  ${RegularUserFragmentDoc}
`;
export const ChangePasswordDocument = gql`
  mutation ChangePassword($input: ChangePasswordInput!) {
    changePassword(input: $input) {
      ...RegularResponse
    }
  }
  ${RegularResponseFragmentDoc}
`;
export type ChangePasswordMutationFn = Apollo.MutationFunction<
  ChangePasswordMutation,
  ChangePasswordMutationVariables
>;

/**
 * __useChangePasswordMutation__
 *
 * To run a mutation, you first call `useChangePasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangePasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changePasswordMutation, { data, loading, error }] = useChangePasswordMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useChangePasswordMutation(
  baseOptions?: Apollo.MutationHookOptions<
    ChangePasswordMutation,
    ChangePasswordMutationVariables
  >
) {
  return Apollo.useMutation<
    ChangePasswordMutation,
    ChangePasswordMutationVariables
  >(ChangePasswordDocument, baseOptions);
}
export type ChangePasswordMutationHookResult = ReturnType<
  typeof useChangePasswordMutation
>;
export type ChangePasswordMutationResult = Apollo.MutationResult<
  ChangePasswordMutation
>;
export type ChangePasswordMutationOptions = Apollo.BaseMutationOptions<
  ChangePasswordMutation,
  ChangePasswordMutationVariables
>;
export const CreateCommentDocument = gql`
  mutation CreateComment($postId: String!, $text: String!, $cursor: Float) {
    createComment(postId: $postId, text: $text, cursor: $cursor) {
      errors {
        field
        message
      }
      comment {
        id
        text
      }
    }
  }
`;
export type CreateCommentMutationFn = Apollo.MutationFunction<
  CreateCommentMutation,
  CreateCommentMutationVariables
>;

/**
 * __useCreateCommentMutation__
 *
 * To run a mutation, you first call `useCreateCommentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCommentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCommentMutation, { data, loading, error }] = useCreateCommentMutation({
 *   variables: {
 *      postId: // value for 'postId'
 *      text: // value for 'text'
 *      cursor: // value for 'cursor'
 *   },
 * });
 */
export function useCreateCommentMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateCommentMutation,
    CreateCommentMutationVariables
  >
) {
  return Apollo.useMutation<
    CreateCommentMutation,
    CreateCommentMutationVariables
  >(CreateCommentDocument, baseOptions);
}
export type CreateCommentMutationHookResult = ReturnType<
  typeof useCreateCommentMutation
>;
export type CreateCommentMutationResult = Apollo.MutationResult<
  CreateCommentMutation
>;
export type CreateCommentMutationOptions = Apollo.BaseMutationOptions<
  CreateCommentMutation,
  CreateCommentMutationVariables
>;
export const CreatePostDocument = gql`
  mutation CreatePost($input: PostInput!) {
    createPost(input: $input) {
      errors {
        ...RegularError
      }
      post {
        ...RegularPost
      }
    }
  }
  ${RegularErrorFragmentDoc}
  ${RegularPostFragmentDoc}
`;
export type CreatePostMutationFn = Apollo.MutationFunction<
  CreatePostMutation,
  CreatePostMutationVariables
>;

/**
 * __useCreatePostMutation__
 *
 * To run a mutation, you first call `useCreatePostMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePostMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPostMutation, { data, loading, error }] = useCreatePostMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreatePostMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreatePostMutation,
    CreatePostMutationVariables
  >
) {
  return Apollo.useMutation<CreatePostMutation, CreatePostMutationVariables>(
    CreatePostDocument,
    baseOptions
  );
}
export type CreatePostMutationHookResult = ReturnType<
  typeof useCreatePostMutation
>;
export type CreatePostMutationResult = Apollo.MutationResult<
  CreatePostMutation
>;
export type CreatePostMutationOptions = Apollo.BaseMutationOptions<
  CreatePostMutation,
  CreatePostMutationVariables
>;
export const DeletePostDocument = gql`
  mutation DeletePost($id: String!) {
    deletePost(id: $id)
  }
`;
export type DeletePostMutationFn = Apollo.MutationFunction<
  DeletePostMutation,
  DeletePostMutationVariables
>;

/**
 * __useDeletePostMutation__
 *
 * To run a mutation, you first call `useDeletePostMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeletePostMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deletePostMutation, { data, loading, error }] = useDeletePostMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeletePostMutation(
  baseOptions?: Apollo.MutationHookOptions<
    DeletePostMutation,
    DeletePostMutationVariables
  >
) {
  return Apollo.useMutation<DeletePostMutation, DeletePostMutationVariables>(
    DeletePostDocument,
    baseOptions
  );
}
export type DeletePostMutationHookResult = ReturnType<
  typeof useDeletePostMutation
>;
export type DeletePostMutationResult = Apollo.MutationResult<
  DeletePostMutation
>;
export type DeletePostMutationOptions = Apollo.BaseMutationOptions<
  DeletePostMutation,
  DeletePostMutationVariables
>;
export const ForgotPasswordDocument = gql`
  mutation ForgotPassword($email: String!) {
    forgotPassword(email: $email)
  }
`;
export type ForgotPasswordMutationFn = Apollo.MutationFunction<
  ForgotPasswordMutation,
  ForgotPasswordMutationVariables
>;

/**
 * __useForgotPasswordMutation__
 *
 * To run a mutation, you first call `useForgotPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useForgotPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [forgotPasswordMutation, { data, loading, error }] = useForgotPasswordMutation({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useForgotPasswordMutation(
  baseOptions?: Apollo.MutationHookOptions<
    ForgotPasswordMutation,
    ForgotPasswordMutationVariables
  >
) {
  return Apollo.useMutation<
    ForgotPasswordMutation,
    ForgotPasswordMutationVariables
  >(ForgotPasswordDocument, baseOptions);
}
export type ForgotPasswordMutationHookResult = ReturnType<
  typeof useForgotPasswordMutation
>;
export type ForgotPasswordMutationResult = Apollo.MutationResult<
  ForgotPasswordMutation
>;
export type ForgotPasswordMutationOptions = Apollo.BaseMutationOptions<
  ForgotPasswordMutation,
  ForgotPasswordMutationVariables
>;
export const LoginDocument = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      ...RegularResponse
    }
  }
  ${RegularResponseFragmentDoc}
`;
export type LoginMutationFn = Apollo.MutationFunction<
  LoginMutation,
  LoginMutationVariables
>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useLoginMutation(
  baseOptions?: Apollo.MutationHookOptions<
    LoginMutation,
    LoginMutationVariables
  >
) {
  return Apollo.useMutation<LoginMutation, LoginMutationVariables>(
    LoginDocument,
    baseOptions
  );
}
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<
  LoginMutation,
  LoginMutationVariables
>;
export const LogoutDocument = gql`
  mutation Logout {
    logout
  }
`;
export type LogoutMutationFn = Apollo.MutationFunction<
  LogoutMutation,
  LogoutMutationVariables
>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(
  baseOptions?: Apollo.MutationHookOptions<
    LogoutMutation,
    LogoutMutationVariables
  >
) {
  return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(
    LogoutDocument,
    baseOptions
  );
}
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = Apollo.BaseMutationOptions<
  LogoutMutation,
  LogoutMutationVariables
>;
export const RegisterDocument = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      ...RegularResponse
    }
  }
  ${RegularResponseFragmentDoc}
`;
export type RegisterMutationFn = Apollo.MutationFunction<
  RegisterMutation,
  RegisterMutationVariables
>;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRegisterMutation(
  baseOptions?: Apollo.MutationHookOptions<
    RegisterMutation,
    RegisterMutationVariables
  >
) {
  return Apollo.useMutation<RegisterMutation, RegisterMutationVariables>(
    RegisterDocument,
    baseOptions
  );
}
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = Apollo.BaseMutationOptions<
  RegisterMutation,
  RegisterMutationVariables
>;
export const UpdatePostDocument = gql`
  mutation UpdatePost($id: String!, $title: String!, $text: String!) {
    updatePost(id: $id, title: $title, text: $text) {
      errors {
        ...RegularError
      }
      post {
        ...RegularPost
      }
    }
  }
  ${RegularErrorFragmentDoc}
  ${RegularPostFragmentDoc}
`;
export type UpdatePostMutationFn = Apollo.MutationFunction<
  UpdatePostMutation,
  UpdatePostMutationVariables
>;

/**
 * __useUpdatePostMutation__
 *
 * To run a mutation, you first call `useUpdatePostMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePostMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePostMutation, { data, loading, error }] = useUpdatePostMutation({
 *   variables: {
 *      id: // value for 'id'
 *      title: // value for 'title'
 *      text: // value for 'text'
 *   },
 * });
 */
export function useUpdatePostMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdatePostMutation,
    UpdatePostMutationVariables
  >
) {
  return Apollo.useMutation<UpdatePostMutation, UpdatePostMutationVariables>(
    UpdatePostDocument,
    baseOptions
  );
}
export type UpdatePostMutationHookResult = ReturnType<
  typeof useUpdatePostMutation
>;
export type UpdatePostMutationResult = Apollo.MutationResult<
  UpdatePostMutation
>;
export type UpdatePostMutationOptions = Apollo.BaseMutationOptions<
  UpdatePostMutation,
  UpdatePostMutationVariables
>;
export const VoteDocument = gql`
  mutation Vote($postId: String!, $value: Int!) {
    vote(postId: $postId, value: $value)
  }
`;
export type VoteMutationFn = Apollo.MutationFunction<
  VoteMutation,
  VoteMutationVariables
>;

/**
 * __useVoteMutation__
 *
 * To run a mutation, you first call `useVoteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useVoteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [voteMutation, { data, loading, error }] = useVoteMutation({
 *   variables: {
 *      postId: // value for 'postId'
 *      value: // value for 'value'
 *   },
 * });
 */
export function useVoteMutation(
  baseOptions?: Apollo.MutationHookOptions<VoteMutation, VoteMutationVariables>
) {
  return Apollo.useMutation<VoteMutation, VoteMutationVariables>(
    VoteDocument,
    baseOptions
  );
}
export type VoteMutationHookResult = ReturnType<typeof useVoteMutation>;
export type VoteMutationResult = Apollo.MutationResult<VoteMutation>;
export type VoteMutationOptions = Apollo.BaseMutationOptions<
  VoteMutation,
  VoteMutationVariables
>;
export const VoteCommentDocument = gql`
  mutation VoteComment($commentId: String!, $value: Int!) {
    voteComment(commentId: $commentId, value: $value)
  }
`;
export type VoteCommentMutationFn = Apollo.MutationFunction<
  VoteCommentMutation,
  VoteCommentMutationVariables
>;

/**
 * __useVoteCommentMutation__
 *
 * To run a mutation, you first call `useVoteCommentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useVoteCommentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [voteCommentMutation, { data, loading, error }] = useVoteCommentMutation({
 *   variables: {
 *      commentId: // value for 'commentId'
 *      value: // value for 'value'
 *   },
 * });
 */
export function useVoteCommentMutation(
  baseOptions?: Apollo.MutationHookOptions<
    VoteCommentMutation,
    VoteCommentMutationVariables
  >
) {
  return Apollo.useMutation<VoteCommentMutation, VoteCommentMutationVariables>(
    VoteCommentDocument,
    baseOptions
  );
}
export type VoteCommentMutationHookResult = ReturnType<
  typeof useVoteCommentMutation
>;
export type VoteCommentMutationResult = Apollo.MutationResult<
  VoteCommentMutation
>;
export type VoteCommentMutationOptions = Apollo.BaseMutationOptions<
  VoteCommentMutation,
  VoteCommentMutationVariables
>;
export const MeDocument = gql`
  query Me {
    me {
      ...RegularUser
    }
  }
  ${RegularUserFragmentDoc}
`;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(
  baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>
) {
  return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, baseOptions);
}
export function useMeLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>
) {
  return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(
    MeDocument,
    baseOptions
  );
}
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;
export const PostDocument = gql`
  query Post($id: String!, $input: PaginationInput!) {
    post(id: $id) {
      id
      title
      text
      textSnippet
      commentCount
      voteStatus
      points
      createdAt
      updatedAt
      comments(input: $input) {
        comments {
          ...RegularComment
        }
        hasMore
      }
      creator {
        id
        username
      }
    }
  }
  ${RegularCommentFragmentDoc}
`;

/**
 * __usePostQuery__
 *
 * To run a query within a React component, call `usePostQuery` and pass it any options that fit your needs.
 * When your component renders, `usePostQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePostQuery({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function usePostQuery(
  baseOptions?: Apollo.QueryHookOptions<PostQuery, PostQueryVariables>
) {
  return Apollo.useQuery<PostQuery, PostQueryVariables>(
    PostDocument,
    baseOptions
  );
}
export function usePostLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<PostQuery, PostQueryVariables>
) {
  return Apollo.useLazyQuery<PostQuery, PostQueryVariables>(
    PostDocument,
    baseOptions
  );
}
export type PostQueryHookResult = ReturnType<typeof usePostQuery>;
export type PostLazyQueryHookResult = ReturnType<typeof usePostLazyQuery>;
export type PostQueryResult = Apollo.QueryResult<PostQuery, PostQueryVariables>;
export const PostsDocument = gql`
  query Posts($input: PaginationInput!) {
    posts(input: $input) {
      posts {
        id
        title
        textSnippet
        text
        voteStatus
        points
        createdAt
        updatedAt
        creator {
          id
          username
        }
        commentCount
      }
      hasMore
    }
  }
`;

/**
 * __usePostsQuery__
 *
 * To run a query within a React component, call `usePostsQuery` and pass it any options that fit your needs.
 * When your component renders, `usePostsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePostsQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function usePostsQuery(
  baseOptions?: Apollo.QueryHookOptions<PostsQuery, PostsQueryVariables>
) {
  return Apollo.useQuery<PostsQuery, PostsQueryVariables>(
    PostsDocument,
    baseOptions
  );
}
export function usePostsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<PostsQuery, PostsQueryVariables>
) {
  return Apollo.useLazyQuery<PostsQuery, PostsQueryVariables>(
    PostsDocument,
    baseOptions
  );
}
export type PostsQueryHookResult = ReturnType<typeof usePostsQuery>;
export type PostsLazyQueryHookResult = ReturnType<typeof usePostsLazyQuery>;
export type PostsQueryResult = Apollo.QueryResult<
  PostsQuery,
  PostsQueryVariables
>;
