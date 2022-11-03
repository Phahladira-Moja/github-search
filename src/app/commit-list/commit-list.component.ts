import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Commit} from "../model/commit";

@Component({
  selector: 'app-commit-list',
  templateUrl: './commit-list.component.html',
  styleUrls: ['./commit-list.component.scss']
})
export class CommitListComponent implements OnInit {


  @Input() commitsArray : Commit[] = []
  @Output() selectedCommit = new EventEmitter<Commit>();

  constructor() { }

  ngOnInit(): void {}

  selectCommit(commit: Commit) {
    this.selectedCommit.emit(commit)
  }

}
