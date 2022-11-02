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

  // jbuget
  // nodejs-clean-architecture-app

  // dev-mastery
  // comments-api

  async getGithubCommits(owner: string, repo: string, pageNumber: number): Promise<Commit[]> {
    
    const result: any = await this.httpClient.get(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=20&page=${pageNumber}`).toPromise();

    const commitsArray: Commit[] = [];


    result.forEach((commit: any) => {

      if (!this.isCommitObjectValid(commit)) return;

      const author = this.isAuthorObjectValid(commit)

      const committer = this.isCommitterObjectValid(commit)

  

      commitsArray.push({
        id: commit.sha,
        message: commit.commit.message,
        readLater: false,
        commentCount: commit.commit.comment_count,
        author: author,
        committer: committer,
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

    return results;
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

    return results;
  }

  isCommitObjectValid(commit: any) {
    if (commit == undefined || commit == null || commit == '') return false;

    if (commit.sha == undefined || commit.sha == null || commit.sha == '') return false;

    if (commit.commit.message == undefined || commit.commit.message == null || commit.commit.message == '') return false;

    return true;
  }

  isAuthorObjectValid(commit: any) {
    if (commit.author == undefined || commit.author == null || commit.author == '') {
      let newAuth:any = JSON.stringify(commit.commit.author)
      newAuth = JSON.parse(newAuth);
      return {
        id: newAuth.name,
        name:  newAuth.email,
        avatarUrl: '../assets/github-logo.png'
      }
      
    };

    return {
      id: commit.author.id,
      name: commit.author.name,
      avatarUrl: commit.author.avatar_url,
    };

  }

  isCommitterObjectValid(commit: any) {
    if (commit.committer == undefined || commit.committer == null || commit.committer == '') {
      let newAuth:any = JSON.stringify(commit.commit.committer)
      newAuth = JSON.parse(newAuth);
      return {
        id: newAuth.name,
        name:  newAuth.email,
        avatarUrl: '../assets/github-logo.png'
      }
    }

    return {
      id: commit.committer.id,
      name: commit.committer.name,
      avatarUrl: commit.committer.avatar_url,
    };

  }
}


