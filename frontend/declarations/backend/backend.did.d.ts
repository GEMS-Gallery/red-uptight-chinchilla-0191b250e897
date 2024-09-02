import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Comment {
  'id' : bigint,
  'content' : string,
  'createdAt' : Time,
  'website' : [] | [string],
  'author' : string,
  'postId' : bigint,
}
export interface Post {
  'id' : bigint,
  'title' : string,
  'content' : string,
  'createdAt' : Time,
  'author' : string,
  'image' : [] | [string],
}
export type Result = { 'ok' : Post } |
  { 'err' : string };
export type Result_1 = { 'ok' : bigint } |
  { 'err' : string };
export type Time = bigint;
export interface _SERVICE {
  'addComment' : ActorMethod<[bigint, string, string, [] | [string]], Result_1>,
  'addPost' : ActorMethod<[string, string, string, [] | [string]], bigint>,
  'getComments' : ActorMethod<[bigint], Array<Comment>>,
  'getPost' : ActorMethod<[bigint], Result>,
  'getPosts' : ActorMethod<[], Array<Post>>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
