import { Component, OnInit  } from '@angular/core';
import {AppService} from "./services/app.service";
import {Commit} from "./model/commit";
import {FormControl, FormGroup, Validators} from '@angular/forms'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  public commitsArray : Commit[] = []
  public readLaterArray : Commit[] = []
  private currentPage = 1;
  public canViewMore = false;

  public tabIndex = 0;
  private isViewingReadLaterCommits = false;

  public searchArray: Commit[] = []
  public isSearching = false;
  public isLoading = false;
  public areCommitsPresent:boolean = false;

  private currentOwner = '';
  private currentRepo = '';

  constructor(private appService: AppService) {}

  ngOnInit() {}

  async searchForUser(searchArray: string[]){
    try {
      let resultLength = 0
      this.isLoading = true;
      if (searchArray[0].trim() !=this.currentOwner ||  searchArray[1].trim() != this.currentRepo) {
        this.commitsArray =  await this.appService.getGithubCommits(
          searchArray[0].trim(),
          searchArray[1].trim(),
          1
        )

        this.currentPage = 1;
        resultLength = this.commitsArray.length;
        this.currentOwner = searchArray[0].trim();
        this.currentRepo = searchArray[1].trim();
      } else {
        const results = await this.appService.getGithubCommits(
          searchArray[0].trim(),
          searchArray[1].trim(),
          this.currentPage
        )
        resultLength = results.length;
        this.commitsArray = this.commitsArray.concat(results)
      }


      this.isLoading = false;



      if (resultLength == 20) {
        this.currentPage = this.currentPage+1;
        this.canViewMore = true;
      } else {
        this.canViewMore = false;
      }
    } catch (error) {
        alert("An error occurred with your search. Please make sure that the input provided is valid.")
        this.isLoading = false;
    }
  }

  async getReadLaterCommits() {
    this.isLoading = true;
    this.readLaterArray = await this.appService.getReadLaterCommits();
    this.isLoading = false;
  }

  async onTabChanged(index: number) {
    this.tabIndex = index;
    if ( index == 1 && this.readLaterArray.length == 0) {
      await this.getReadLaterCommits();
    }

    index == 1 ? this.isViewingReadLaterCommits = true : this.isViewingReadLaterCommits = false
  }

  async saveToReadLater(commit: Commit) {

    if (commit.readLater) {
      try {
        commit.readLater = !commit.readLater;
        this.readLaterArray = this.readLaterArray.filter(commitFilter => commit.id != commitFilter.id)

        this.commitsArray.forEach(commitFilter => {
          if (commitFilter.id == commit.id) {
            commit.readLater = false;
          }
        })

        const result: any = this.appService.deleteCommit(commit.id);

        if (result.Result == "FAILED") {
          alert(result.Message)
        }
      } catch (error) {
        alert("An unexpected error occurred while removing the commit from the database. Please try again later.")
      }
    } else {
      try {
        commit.readLater = !commit.readLater;
        if (this.readLaterArray.filter(commitFilter => commit.id == commitFilter.id).length == 0) this.readLaterArray.push(commit)

        const result: any = this.appService.addCommit(commit);

        if (result.Result == "FAILED") {
          alert(result.Message)
        }
      } catch (error) {
        alert("An unexpected error occurred while adding the commit from the database. Please try again later.")
      }
    }

  }

  onChange(value: string) {
    if (value == "") {
      this.isSearching = false;
    } else {
      this.isSearching = true;
      if (this.isViewingReadLaterCommits) {
        this.searchArray = this.readLaterArray.filter(commit =>
          commit.message.toLowerCase().includes(value.toLowerCase())
        )
      } else {
        this.searchArray = this.commitsArray.filter(commit =>
          commit.message.toLowerCase().includes(value.toLowerCase())
        )
      }
    }
  }
}
