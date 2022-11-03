import {Component, Output, Input, EventEmitter, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-form-container',
  templateUrl: './form-container.component.html',
  styleUrls: ['./form-container.component.scss']
})
export class FormContainerComponent implements OnInit {

  @Input() canViewMore: boolean = false
  @Output() commitSearchParams = new EventEmitter<string[]>();
  @Output() enteredSearchString = new EventEmitter<string>();

  formGroup = new FormGroup({
    owner: new FormControl('', [Validators.required, Validators.minLength(3)]),
    repo: new FormControl('', [Validators.required, Validators.minLength(3)])
  })

  searchFormGroup = new FormGroup({
    search: new FormControl('', [Validators.required]),
  })

  constructor() { }

  ngOnInit(): void {
    this.searchFormControl?.valueChanges.subscribe(
      value => this.localSearch(value)
    )
  }

  get ownerFormControl() {
    return this.formGroup.get('owner');
  }

  get repoFormControl() {
    return this.formGroup.get('repo');
  }

  get searchFormControl() {
    return this.searchFormGroup.get('search');
  }

  searchForGitCommitHistory() {
    this.commitSearchParams.emit([this.ownerFormControl?.value.toString(),this.repoFormControl?.value.toString()])
  }

  localSearch(value: string) {
    this.enteredSearchString.emit(value)
  }

}
