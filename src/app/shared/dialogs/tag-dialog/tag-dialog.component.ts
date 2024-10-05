import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, ElementRef, inject, Inject, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { distinctUntilChanged, filter, forkJoin, Observable, of, switchMap } from 'rxjs';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipInput, MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggle, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NoteService } from '../../services/note.service';
import { TagService } from '../../services/tag.service';
import { StorageService } from '../../services/storage.service';
import { Note } from '../../models/note';
import { Tag } from '../../models/tag';


@Component({
  selector: 'app-tag-dialog',
  standalone: true,
  imports: [NgIf,
            NgFor,
            NgClass,
            CommonModule,
            FormsModule,
            ReactiveFormsModule,
            MatMenuModule, 
            MatIconModule, 
            MatFormFieldModule, 
            MatButtonModule, 
            MatInputModule, 
            MatCheckboxModule, 
            MatSlideToggleModule,
            MatDialogActions,
            MatDialogContent,
            MatLabel,
            MatAutocompleteModule,
            MatChipInput,
            MatChipsModule,
            MatSlideToggle,
            MatSelectModule],
  templateUrl: './tag-dialog.component.html',
  styleUrl: './tag-dialog.component.scss'
})
export class TagDialogComponent {

  readonly tagService     = inject(TagService);
  readonly noteService    = inject(NoteService);
  readonly storageService = inject(StorageService);

  //@ViewChild('tagInput') tagInput!: ElementRef<HTMLInputElement>;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger!: MatAutocompleteTrigger;

  tagControl = new FormControl('');  
  
  filteredTagOptions : Observable<Tag[]> = of([]);
  tagChips           : string[]          = []; // List of tag chips displayed in the input
  noteTags           : Tag[]             = []; // List of tags associated to selected note 
  tagList            : Tag[]             = []; // List of all tags in db
  tagToAdd           : Tag[]             = [];
  tagToCreate        : string[]          = [];
  noteSelected       : Note | null       = null;
  isDevMode          : boolean           = false;
  isToolTips         : boolean           = false;


  constructor(public dialogRef: MatDialogRef<TagDialogComponent>, 
              @Inject(MAT_DIALOG_DATA) public data: {title: string, txt1: string, txt2: string, txt3: string}) {}


  public ngOnInit() {
    console.log("tag-dialog.component")
    
    this.noteSelected = this.storageService.getSelectedNote();

    this.isDevMode = this.storageService.getIsDevMode();

    this.isToolTips = this.storageService.getIsToolTips();
    

    if(this.noteSelected?.tags) {
      this.noteTags = this.noteSelected?.tags;
      console.log("onInit - noteTags: ",this.noteTags);
    }

    this.getWholeListOfTags();
    
    this.getTagsFiltered("name");
  }            


  public onAdd() {
    console.log("tagToCreate : ", this.tagToCreate)
    console.log("tagToAdd    : ", this.tagToAdd)
    console.log("tagChips    : ", this.tagChips)
    if (this.tagToCreate.length > 0) {
      this.tagToCreate.forEach(tagName => {
        // Set new tag
        let tag = {
          'name' : tagName
        }
        // Add tag to create to tagToAdd list
        this.tagToAdd.push(tag);
      });  
    }
    if(this.tagToAdd.length > 0) {
      // If no tags to create, proceed directly with updating the note
      this.tagToAdd.forEach((tag) => {
        this.noteSelected?.tags?.push(tag);
      });

      // Update note
      this.noteService.updateNote(this.noteSelected as Note);
      this.tagToAdd    = [];
      this.tagToCreate = [];
      console.log("noteSelected : ", this.noteSelected)
    }
    this.tagChips    = [];
    this.tagControl.setValue('');
  }

  /*public onAdd() {
    console.log("tagToCreate : ", this.tagToCreate)
    console.log("tagToAdd    : ", this.tagToAdd)
    console.log("tagChips    : ", this.tagChips)
    if (this.tagToCreate.length > 0) {
      const createTagObservables = this.tagToCreate.map(tagName =>
          this.tagService.create(tagName));

      forkJoin(createTagObservables).subscribe({
        next: (createdTags) => {
          // Add created tags to tagToAdd list
          this.tagToAdd.push(...createdTags);

          // Add tags to noteSelected
          this.tagToAdd.forEach((tag) => {
            this.noteSelected?.tags?.push(tag);
          });

          // Update note
          this.noteService.updateNote(this.noteSelected as Note);
          this.tagToAdd    = [];
          this.tagToCreate = [];
          console.log("noteSelected : ", this.noteSelected)
        },
        error: (error) => {
          console.log("Error - create tags", error);
        }
      });
    }
    else if(this.tagToAdd.length > 0) {
      // If no tags to create, proceed directly with updating the note
      this.tagToAdd.forEach((tag) => {
        this.noteSelected?.tags?.push(tag);
      });

      // Update note
      this.noteService.updateNote(this.noteSelected as Note);
      this.tagToAdd    = [];
      this.tagToCreate = [];
      console.log("noteSelected : ", this.noteSelected)
    }
    this.tagChips    = [];
    this.tagControl.setValue('');
  }*/


  public onClose() {
    this.dialogRef.close(false);
  }


  public displayTagOption(tag: Tag): string {
    return tag ? tag.name : '';
  }


  public onOptionSelectionChange(event: MatAutocompleteSelectedEvent) {
    let tagSelected = event.option.viewValue;
    // Check if tag selected is not already selected
    if(this.tagChips.find(tagChip => tagChip.toLowerCase() === tagSelected.toLowerCase())) { return };
    // Check if Tag is already associated with selected note
    if(this.noteTags.find(tag => tag.name.toLowerCase() === tagSelected.toLowerCase())) { return };
    // Get tag by tag name
    let tag = this.tagList.find(tag => tag.name.toLowerCase() === tagSelected.toLowerCase());
    if(tag) { // If tag exist in list of all tags already saved in db
      this.tagChips.push(tagSelected); // Add to list of tag chips displayed in the input
      this.tagToAdd.push(tag); // Add to list of tag to associate to Note
    }
    this.tagControl.setValue('');
    this.closeAutocompletePanel();
  }


  public addChip(event: MatChipInputEvent) {
    const tagNameTyped = (event.value).trim();
    if(tagNameTyped === '') { return };
    // Check if tag typed in input is not already selected
    if(this.tagChips.find(tagChip => tagChip.toLowerCase() === tagNameTyped.toLowerCase())) { return };
    // Check if Tag exist in list of tags already saved in db
    let tag = this.tagList.find(tag => tag.name.toLowerCase() === tagNameTyped.toLowerCase());
    if(tag) {
      // Check if Tag is already associated with note selected
      if(this.noteTags.find(tag => tag.name.toLowerCase() === tagNameTyped.toLowerCase())) return;
      this.tagToAdd.push(tag); // Add to list of tag to associate to Note
    } else {
      this.tagToCreate.push(tagNameTyped.toLowerCase()); // Add to list of tag to create before associating to Note
    }
    this.tagChips.push(tagNameTyped); // Add to list of tag chips displayed in the input
    event.chipInput.clear();
    this.tagControl.setValue('');
    this.closeAutocompletePanel();
  }
  

  public removeChip(tagName: string) {
    if(tagName) {
      // Find index of tagChips array where tagChips[index] equal tagName
      const tagChipsIndex = this.tagChips.indexOf(tagName);
      if (tagChipsIndex >= 0) {
        this.tagChips.splice(tagChipsIndex, 1);
      }
      // Find index of tagToCreate array where tagToCreate[index] equal tagName
      const tagToCreateIndex = this.tagToCreate.indexOf(tagName);
      if (tagToCreateIndex >= 0) {
        this.tagToCreate.splice(tagToCreateIndex, 1);
      }
      // Find index of tagToAdd array where tagToAdd[index].name equal tagName
      const tagToAddIndex = this.tagToAdd.findIndex(tag => tag.name === tagName);
      if (tagToAddIndex >= 0) {
        this.tagToAdd.splice(tagToAddIndex, 1);
      }
    }
    setTimeout(() => this.closeAutocompletePanel(), 5);
  }


  /**
   * Open panel with list of all tags by default when input get focus
   */
  public onInputFocus() {
    this.tagControl.updateValueAndValidity();
  }


  public onDeleteTag(tagToDelete: Tag) {
    // Find index of noteSelected.tags array where noteSelected.tags[index] equal tag
    const index: number = this.noteSelected?.tags?.findIndex(tag => tag.name.toLowerCase() === tagToDelete.name.toLowerCase()) ?? -1;
    console.log("onDelete tagToDelete : ", index)
    if(index > -1) {
      this.noteSelected?.tags?.splice(index, 1);
      console.log("this.noteSelected?.tags : ", this.noteSelected?.tags)
      this.noteService.updateNote(this.noteSelected as Note);
    }
  }


  private getWholeListOfTags() {
    this.tagService.getTagsByFilter("", "name").subscribe({
      next: (tags) => { this.tagList = tags; console.log("tagList: ",this.tagList) },
      error: (error) => { console.log("Error - Tagservice getTagsByFilter() : ", error) }
    })
  }


  private getTagsFiltered(filterType: string) {
    this.filteredTagOptions = this.tagControl.valueChanges.pipe(
      distinctUntilChanged(),
      filter(searchValue => searchValue != null && typeof searchValue === 'string'),
      switchMap(value => this.tagService.getTagsByFilter(value as string, filterType)),
    )  
  }


  private closeAutocompletePanel() {
    if (this.autocompleteTrigger) {
      this.autocompleteTrigger.closePanel();
    }
  }

  
}
