import Hash "mo:base/Hash";

import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Option "mo:base/Option";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Time "mo:base/Time";

actor {
  type Post = {
    id: Nat;
    title: Text;
    content: Text;
    author: Text;
    createdAt: Time.Time;
    image: ?Text;
  };

  type Comment = {
    id: Nat;
    postId: Nat;
    author: Text;
    content: Text;
    createdAt: Time.Time;
    website: ?Text;
  };

  stable var nextPostId: Nat = 0;
  stable var nextCommentId: Nat = 0;
  stable var posts: [Post] = [];
  stable var comments: [(Nat, [Comment])] = [];

  let commentMap = HashMap.fromIter<Nat, [Comment]>(comments.vals(), 0, Nat.equal, Nat.hash);

  public query func getPosts() : async [Post] {
    posts
  };

  public query func getPost(id: Nat) : async Result.Result<Post, Text> {
    switch (Array.find<Post>(posts, func(p) { p.id == id })) {
      case (?post) { #ok(post) };
      case (null) { #err("Post not found") };
    }
  };

  public func addPost(title: Text, content: Text, author: Text, image: ?Text) : async Nat {
    let id = nextPostId;
    let post: Post = {
      id;
      title;
      content;
      author;
      createdAt = Time.now();
      image;
    };
    posts := Array.append(posts, [post]);
    nextPostId += 1;
    id
  };

  public func addComment(postId: Nat, author: Text, content: Text, website: ?Text) : async Result.Result<Nat, Text> {
    switch (Array.find<Post>(posts, func(p) { p.id == postId })) {
      case (?_) {
        let id = nextCommentId;
        let comment: Comment = {
          id;
          postId;
          author;
          content;
          createdAt = Time.now();
          website;
        };
        let existingComments = Option.get(commentMap.get(postId), []);
        commentMap.put(postId, Array.append(existingComments, [comment]));
        nextCommentId += 1;
        #ok(id)
      };
      case (null) { #err("Post not found") };
    }
  };

  public query func getComments(postId: Nat) : async [Comment] {
    Option.get(commentMap.get(postId), [])
  };

  system func preupgrade() {
    comments := Iter.toArray(commentMap.entries());
  };

  system func postupgrade() {
    comments := [];
  };
}
