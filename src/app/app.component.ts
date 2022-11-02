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

  formGroup = new FormGroup({
    owner: new FormControl('', [Validators.required, Validators.minLength(3)]),
    repo: new FormControl('', [Validators.required, Validators.minLength(3)])
  })

  searchFormGroup = new FormGroup({
    search: new FormControl('', [Validators.required]),
})

  constructor(private appService: AppService) {}

  get ownerFormControl() {
    return this.formGroup.get('owner');
  }

  get repoFormControl() {
    return this.formGroup.get('repo');
  }

  get searchFormControl() {
    return this.searchFormGroup.get('search');
  }

  ngOnInit() {
    this.searchForUser();
    this.searchFormControl?.valueChanges.subscribe(
      value => this.onChange(value)
    )
  }

  async searchForUser(){
    this.isLoading = true;
    const results = await this.appService.getGithubCommits(
      this.ownerFormControl?.value != '' ? this.ownerFormControl?.value : 'octocat',
      this.repoFormControl?.value != '' ? this.repoFormControl?.value : 'Spoon-Knife',
      this.currentPage
    )
    this.commitsArray = this.commitsArray.concat(results)
    this.isLoading = false;

    if (results.length == 20) {
      this.currentPage = this.currentPage+1;
      this.canViewMore = true;
    } else {
      this.canViewMore = false;
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
    } else if (index == 0 && this.commitsArray.length == 0) {
      await this.searchForUser();
    }

    index == 1 ? this.isViewingReadLaterCommits = true : this.isViewingReadLaterCommits = false
  }

  async saveToReadLater(commit: Commit) {

    if (commit.readLater) {
      commit.readLater = !commit.readLater;
      this.readLaterArray = this.readLaterArray.filter(commitFilter => commit.id != commitFilter.id)

      this.commitsArray.forEach(commitFilter => {
        if (commitFilter.id == commit.id) {
          commit.readLater = false;
        }
      })

      this.appService.deleteCommit(commit.id);
    } else {
      commit.readLater = !commit.readLater;
      if (this.readLaterArray.filter(commitFilter => commit.id == commitFilter.id).length == 0) this.readLaterArray.push(commit)

      this.appService.addCommit(commit);
    }

  }

  onChange(value: string) {
    if (value == "") {
      this.isSearching = false;
    } else {
      this.isSearching = true;
      if (this.isViewingReadLaterCommits) {
        this.searchArray = this.readLaterArray.filter(commit =>
          commit.message.toLowerCase().includes(this.searchFormControl?.value.toLowerCase())
        )
      } else {
        this.searchArray = this.commitsArray.filter(commit =>
          commit.message.toLowerCase().includes(this.searchFormControl?.value.toLowerCase())
        )
      }
    }
  }
}
