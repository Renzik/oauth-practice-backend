export interface IMongoDBUser {
  _id: string;
  googleId?: string;
  twitterId?: string;
  githubId?: string;
  username: string;
  email: string;
  password?: any;
  __v: number;
}
