export interface Commit {
  id: string,
  message: string,
  readLater: boolean,
  commentCount: number,
  author: {
    id: number,
    name: string,
    avatarUrl: string,
  },
  committer: {
    id: number,
    name: string,
    avatarUrl: string,
  }
}
