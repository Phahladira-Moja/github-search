import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import  { Octokit } from 'octokit'
import {Commit} from "../model/commit";

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private octokit = new Octokit({
    auth: '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'
  });

  constructor(private httpClient: HttpClient) { }
  // repo = "Spoon-Knife",
  // owner = "octocat",

  async getGithubCommits(owner: string, repo: string, pageNumber: number): Promise<Commit[]> {
    const result = await this.octokit.request(`GET /repos/{owner}/{repo}/commits?page=${pageNumber}&per_page=20`, {
      owner: owner,
      repo: repo,
    });

    const commitsArray: Commit[] = [];

    result.data.forEach((commit: any) => {

      if (!this.isCommitObjectValid(commit)) return;

      if (!this.isAuthorObjectValid(commit)) return;

      if (!this.isCommitterObjectValid(commit)) return;

      commitsArray.push({
        id: commit.sha,
        message: commit.commit.message,
        readLater: false,
        commentCount: commit.commit.comment_count,
        author: {
          id: commit.author.id,
          name: commit.author.name,
          avatarUrl: commit.author.avatar_url,
        },
        committer: {
          id: commit.committer.id,
          name: commit.committer.name,
          avatarUrl: commit.committer.avatar_url,
        }
      })

    })


    return commitsArray;
  }

  async getReadLaterCommits() {
    const results: any = await this.httpClient.get('https://3spx1ttq9k.execute-api.af-south-1.amazonaws.com/commits').toPromise();

    console.log()
    const commitsArray: Commit[] = [];

    results.Message.Items.forEach((commit: any) => {

      commitsArray.push({
        id: commit.id,
        message: commit.message,
        readLater: commit.readLater,
        commentCount: commit.commentCount,
        author: {
          id: commit.author.id,
          name: commit.author.name,
          avatarUrl: commit.author.avatarUrl,
        },
        committer: {
          id: commit.committer.id,
          name: commit.committer.name,
          avatarUrl: commit.committer.avatarUrl,
        }
      })

    })

    return commitsArray;
  }

  async addCommit(commit: Commit) {
    const results: any = await this.httpClient.post('https://3spx1ttq9k.execute-api.af-south-1.amazonaws.com/commits', commit, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, *'
      }
    }).toPromise();

    console.log(results)
  }

  async deleteCommit(id: string) {
    const results: any = await this.httpClient.delete(`https://3spx1ttq9k.execute-api.af-south-1.amazonaws.com/commits`, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, *'
      },
      body: {
        id: id
      }
    }).toPromise();
  }

  isCommitObjectValid(commit: any) {
    if (commit === undefined || commit === null || commit === '') return false;

    if (commit.sha === undefined || commit.sha === null || commit.sha === '') return false;

    if (commit.commit.message === undefined || commit.commit.message === null || commit.commit.message === '') return false;

    return true;
  }

  isAuthorObjectValid(commit: any) {
    if (commit.author === undefined || commit.author === null || commit.author === '') return;

    if (commit.author.id === undefined || commit.author.id === null || commit.author.id === '') return;

    if (commit.author.login === undefined || commit.author.login === null || commit.author.login === '') return;

    return true;

  }

  isCommitterObjectValid(commit: any) {
    if (commit.committer === undefined || commit.committer === null || commit.committer === '') return;

    if (commit.committer.id === undefined || commit.committer.id === null || commit.committer.id === '') return;

    if (commit.committer.login === undefined || commit.committer.login === null || commit.committer.login === '') return;

    return true;

  }
}


// repo = "Spoon-Knife",
// owner = "octocat",

// async getGithubCommits(owner: string, repo: string, pageNumber: number): Promise<Commit[]> {
//
//   // dev-mastery
//   // comments-api
//   const results: any = await this.httpClient.get(`http://localhost:3000?pageNumber=${pageNumber}&commitsPerPage=20&repo=${repo}&owner=${owner}`).toPromise();
//
// return results;
// }





